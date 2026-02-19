import Link from "next/link";

export default function Home() {
    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-[#35654d] text-white">
            <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex flex-col gap-8">
                <h1 className="text-4xl font-bold mb-8 text-center drop-shadow-md">
                    ApostaNaSueca
                </h1>

                <div className="flex flex-col gap-4 w-full max-w-xs">
                    <Link
                        href="/login"
                        className="w-full bg-white text-[#35654d] font-bold py-3 px-6 rounded-lg text-center hover:bg-gray-100 transition-colors shadow-lg"
                    >
                        Entrar
                    </Link>

                    <Link
                        href="/register"
                        className="w-full bg-transparent border-2 border-white text-white font-bold py-3 px-6 rounded-lg text-center hover:bg-white/10 transition-colors"
                    >
                        Registar
                    </Link>

                    <Link
                        href="/dashboard"
                        className="text-center text-sm opacity-70 hover:opacity-100 underline mt-4"
                    >
                        Ir para Dashboard (se já logado)
                    </Link>
                </div>

                <div className="mt-12 text-center opacity-60 text-xs">
                    <p>Jogue Sueca Online e Aposte!</p>
                </div>
            </div>
        </main>
    );
}
