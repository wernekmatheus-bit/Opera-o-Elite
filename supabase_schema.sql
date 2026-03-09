-- ============================================================================
-- PMPR.PRO - SCHEMA DO BANCO DE DADOS (SUPABASE / POSTGRESQL)
-- ============================================================================

-- Extensões úteis
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- 1. USUÁRIOS E ASSINATURA
-- ============================================================================

-- Tabela: users_profiles
-- Vinculada à auth.users do Supabase
CREATE TABLE users_profiles (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    username VARCHAR(50) UNIQUE,
    xp_points INTEGER DEFAULT 0,
    rank_level VARCHAR(50) DEFAULT 'Recruta',
    subscription_status VARCHAR(20) DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'canceled')),
    stripe_customer_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: onboarding_data
CREATE TABLE onboarding_data (
    user_id UUID PRIMARY KEY REFERENCES users_profiles(user_id) ON DELETE CASCADE,
    tempo_estudo_diario INTEGER NOT NULL, -- em minutos
    nivel_fisico VARCHAR(20) NOT NULL CHECK (nivel_fisico IN ('sedentario', 'iniciante', 'avancado')),
    concurso_foco VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 2. ACADEMIA E ESTANDE DE TIRO (Text-Only)
-- ============================================================================

-- Tabela: modules
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: lessons
CREATE TABLE lessons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    module_id UUID NOT NULL REFERENCES modules(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    content_text TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: questions
CREATE TABLE questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL, -- Opcional, pode ser uma questão geral
    banca VARCHAR(100) NOT NULL,
    disciplina VARCHAR(100) NOT NULL,
    enunciado TEXT NOT NULL,
    alternativa_a TEXT NOT NULL,
    alternativa_b TEXT NOT NULL,
    alternativa_c TEXT NOT NULL,
    alternativa_d TEXT NOT NULL,
    alternativa_e TEXT NOT NULL,
    resposta_correta CHAR(1) NOT NULL CHECK (resposta_correta IN ('A', 'B', 'C', 'D', 'E')),
    justificativa_texto TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- 3. OPERAÇÃO (Jornada Gamificada)
-- ============================================================================

-- Tabela: journey_nodes
CREATE TABLE journey_nodes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_number INTEGER NOT NULL UNIQUE CHECK (day_number BETWEEN 1 AND 365),
    biome_type VARCHAR(50) NOT NULL CHECK (biome_type IN ('urbano', 'selva', 'caatinga', 'pantanal', 'cerrado', 'pampa')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: user_journey_progress
CREATE TABLE user_journey_progress (
    user_id UUID NOT NULL REFERENCES users_profiles(user_id) ON DELETE CASCADE,
    node_id UUID NOT NULL REFERENCES journey_nodes(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'locked' CHECK (status IN ('locked', 'available', 'completed')),
    unlocked_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, node_id)
);

-- Tabela: daily_tasks
CREATE TABLE daily_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    node_id UUID NOT NULL REFERENCES journey_nodes(id) ON DELETE CASCADE,
    task_type VARCHAR(20) NOT NULL CHECK (task_type IN ('in-app', 'out-app')),
    description TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: user_daily_tasks (Tabela de junção para rastrear a conclusão da tarefa por usuário)
CREATE TABLE user_daily_tasks (
    user_id UUID NOT NULL REFERENCES users_profiles(user_id) ON DELETE CASCADE,
    task_id UUID NOT NULL REFERENCES daily_tasks(id) ON DELETE CASCADE,
    is_completed BOOLEAN DEFAULT false,
    completed_at TIMESTAMP WITH TIME ZONE,
    PRIMARY KEY (user_id, task_id)
);

-- ============================================================================
-- 4. COMUNIDADE (Interação Humana)
-- ============================================================================

-- Tabela: community_posts
CREATE TABLE community_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users_profiles(user_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    body_text TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    upvotes INTEGER DEFAULT 0,
    flag_reports INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Tabela: community_comments
CREATE TABLE community_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users_profiles(user_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_anonymous BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE journey_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_journey_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE community_comments ENABLE ROW LEVEL SECURITY;

-- Políticas para users_profiles
CREATE POLICY "Usuários podem ver seus próprios perfis" 
    ON users_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios perfis" 
    ON users_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para onboarding_data
CREATE POLICY "Usuários podem ver seus próprios dados de onboarding" 
    ON onboarding_data FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seus próprios dados de onboarding" 
    ON onboarding_data FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios dados de onboarding" 
    ON onboarding_data FOR UPDATE USING (auth.uid() = user_id);

-- Políticas para Academia e Estande (Leitura pública para usuários autenticados)
CREATE POLICY "Qualquer usuário autenticado pode ver módulos" 
    ON modules FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer usuário autenticado pode ver lições" 
    ON lessons FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer usuário autenticado pode ver questões" 
    ON questions FOR SELECT USING (auth.role() = 'authenticated');

-- Políticas para Operação (Jornada)
CREATE POLICY "Qualquer usuário autenticado pode ver os nós da jornada" 
    ON journey_nodes FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Qualquer usuário autenticado pode ver as tarefas diárias" 
    ON daily_tasks FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem ver seu próprio progresso na jornada" 
    ON user_journey_progress FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seu próprio progresso na jornada" 
    ON user_journey_progress FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir seu próprio progresso na jornada" 
    ON user_journey_progress FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem ver o status de suas próprias tarefas" 
    ON user_daily_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar o status de suas próprias tarefas" 
    ON user_daily_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem inserir o status de suas próprias tarefas" 
    ON user_daily_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Políticas para Comunidade
CREATE POLICY "Qualquer usuário autenticado pode ver posts" 
    ON community_posts FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários podem criar posts" 
    ON community_posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios posts" 
    ON community_posts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus próprios posts" 
    ON community_posts FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Qualquer usuário autenticado pode ver comentários" 
    ON community_comments FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Usuários podem criar comentários" 
    ON community_comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Usuários podem atualizar seus próprios comentários" 
    ON community_comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Usuários podem deletar seus próprios comentários" 
    ON community_comments FOR DELETE USING (auth.uid() = user_id);

-- ============================================================================
-- TRIGGERS E FUNÇÕES ÚTEIS (Opcional, mas recomendado)
-- ============================================================================

-- Função para atualizar a coluna updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger nas tabelas relevantes
CREATE TRIGGER update_users_profiles_updated_at BEFORE UPDATE ON users_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_onboarding_data_updated_at BEFORE UPDATE ON onboarding_data FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_community_posts_updated_at BEFORE UPDATE ON community_posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_community_comments_updated_at BEFORE UPDATE ON community_comments FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
