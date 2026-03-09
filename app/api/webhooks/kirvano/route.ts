import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    // 1. Validate Kirvano Token
    const allHeaders = Object.fromEntries(req.headers.entries());
    
    let authHeader = req.headers.get('Authorization') || 
                     req.headers.get('x-kirvano-token') || 
                     req.headers.get('token') ||
                     req.headers.get('x-api-key') ||
                     req.headers.get('security-token');

    // Se a Kirvano enviar como "Bearer Matheus.W.843002", nós removemos a palavra "Bearer "
    if (authHeader && authHeader.startsWith('Bearer ')) {
      authHeader = authHeader.replace('Bearer ', '').trim();
    }

    const expectedToken = process.env.KIRVANO_WEBHOOK_TOKEN || 'Matheus.W.843002';

    if (!expectedToken || authHeader !== expectedToken) {
      console.error(`[Kirvano Webhook] Token Inválido. Recebido: ${authHeader}`);
      return NextResponse.json({ 
        error: 'Unauthorized', 
        message: 'O token enviado pela Kirvano não bate com o token do sistema.',
        received: authHeader,
        headers_debug: allHeaders // Retorna os headers para descobrirmos onde a Kirvano está mandando o token
      }, { status: 401 });
    }

    // 2. Process Event & Extract Email (Handling different Kirvano payload structures)
    const rawEvent = body.event || body.type || '';
    const event = rawEvent.toUpperCase();
    const data = body.data || body;
    
    // Kirvano might send the email inside customer, buyer, or directly in data
    const customerEmail = (data?.customer?.email || data?.buyer?.email || data?.email || body?.email)?.toLowerCase().trim();

    console.log(`[Kirvano Webhook] Processando evento: ${event} para o email: ${customerEmail || 'NÃO ENCONTRADO'}`);

    if (!customerEmail) {
      console.error('[Kirvano Webhook] Email não encontrado no payload:', JSON.stringify(body));
      return NextResponse.json({ 
        error: 'No customer email provided',
        payload_received: body 
      }, { status: 400 });
    }

    // Initialize Supabase client inside the request to ensure env vars are read fresh
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('[Kirvano Webhook] Variáveis de ambiente do Supabase ausentes!');
      return NextResponse.json({ error: 'Supabase credentials missing in environment' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Define event types (Added more variations just in case)
    const grantAccessEvents = [
      'PAYMENT_APPROVED', 'SALE_APPROVED', 'SUBSCRIPTION_ACTIVE', 
      'WAITING_PAYMENT', 'PIX_GENERATED', 'BANK_SLIP_PRINTED',
      'ORDER_APPROVED', 'SUBSCRIPTION_CREATED'
    ];
    const revokeAccessEvents = [
      'REFUNDED', 'CHARGEBACK', 'SUBSCRIPTION_CANCELED', 
      'SUBSCRIPTION_EXPIRED', 'SUBSCRIPTION_SUSPENDED', 'LATE_PAYMENT'
    ];

    // Handle Grant Access
    if (grantAccessEvents.includes(event)) {
      console.log(`[Kirvano Webhook] Evento ${event} recebido. Liberando acesso para: ${customerEmail}`);
      
      const { error } = await supabase
        .from('whitelist')
        .upsert(
          { 
            email: customerEmail, 
            paid: true, 
            updated_at: new Date().toISOString() 
          },
          { onConflict: 'email' }
        );

      if (error) {
        console.error('[Supabase Error] Falha ao liberar acesso:', error);
        return NextResponse.json({ error: 'Database update failed', details: error }, { status: 500 });
      }
      
      console.log(`[Kirvano Webhook] Acesso LIBERADO com sucesso para: ${customerEmail}`);
      return NextResponse.json({ success: true, action: 'access_granted', email: customerEmail, event }, { status: 200 });
    }
    
    // Handle Revoke Access
    else if (revokeAccessEvents.includes(event)) {
      console.log(`[Kirvano Webhook] Evento ${event} recebido. Bloqueando acesso para: ${customerEmail}`);
      
      const { error } = await supabase
        .from('whitelist')
        .upsert(
          { 
            email: customerEmail, 
            paid: false, 
            updated_at: new Date().toISOString() 
          },
          { onConflict: 'email' }
        );

      if (error) {
        console.error('[Supabase Error] Falha ao bloquear acesso:', error);
        return NextResponse.json({ error: 'Database update failed', details: error }, { status: 500 });
      }
      
      console.log(`[Kirvano Webhook] Acesso BLOQUEADO com sucesso para: ${customerEmail}`);
      return NextResponse.json({ success: true, action: 'access_revoked', email: customerEmail, event }, { status: 200 });
    }

    // Event ignored
    console.log(`[Kirvano Webhook] Evento ignorado: ${event}`);
    return NextResponse.json({ received: true, ignored: true, event }, { status: 200 });

  } catch (error) {
    console.error('[Kirvano Webhook Error]', error);
    return NextResponse.json({ error: 'Webhook handler failed', details: String(error) }, { status: 500 });
  }
}
