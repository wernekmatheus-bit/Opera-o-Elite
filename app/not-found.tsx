import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center text-white px-4">
      <div className="text-center">
        <h1 className="text-9xl font-black text-[#39FF14] mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-6">Página não encontrada</h2>
        <p className="text-gray-400 mb-8 max-w-md mx-auto">
          A página que você está procurando não existe ou foi movida.
        </p>
        <Link 
          href="/"
          className="inline-flex items-center justify-center px-6 py-3 bg-[#39FF14] text-black font-bold rounded-lg hover:bg-[#32e612] transition-colors"
        >
          Voltar para o Início
        </Link>
      </div>
    </div>
  );
}
