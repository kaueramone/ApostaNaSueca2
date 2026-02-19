import Link from "next/link";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-ios-gray6 p-4">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-xl">
                <div className="mb-8 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Criar Conta</h1>
                    <p className="text-ios-gray">Junte-se ao ApostaNaSueca</p>
                </div>

                <RegisterForm />

                <p className="mt-8 text-center text-sm text-gray-500">
                    Já tem conta?{" "}
                    <Link
                        href="/login"
                        className="font-semibold text-ios-blue hover:text-ios-blue/80"
                    >
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}
