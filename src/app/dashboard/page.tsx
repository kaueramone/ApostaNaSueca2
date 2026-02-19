import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Wallet, Joystick, ArrowUpRight, ArrowDownLeft } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    const { data: wallet } = await supabase
        .from("wallets")
        .select("*")
        .eq("user_id", user.id)
        .single();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">
                    Olá, {profile?.username ? profile.username.split(" ")[0] : "Jogador"}!
                </h1>
                <div className="h-10 w-10 overflow-hidden rounded-full bg-ios-gray4">
                    {profile?.avatar_url && <img src={profile.avatar_url} alt="Profile" className="h-full w-full object-cover" />}
                </div>
            </div>

            {/* Wallet Card */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ios-blue to-ios-indigo p-6 text-white shadow-xl shadow-ios-blue/20">
                <div className="relative z-10">
                    <p className="text-sm font-medium opacity-80">Saldo Disponível</p>
                    <p className="mt-2 text-4xl font-bold tracking-tight">
                        €{wallet?.balance || "0.00"}
                    </p>
                </div>
                <div className="mt-8 flex gap-3">
                    <Link
                        href="/dashboard/wallet/deposit"
                        className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/30"
                    >
                        <ArrowDownLeft className="h-4 w-4" />
                        Depositar
                    </Link>
                    <Link
                        href="/dashboard/wallet/withdraw"
                        className="flex items-center gap-2 rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-md transition-colors hover:bg-white/30"
                    >
                        <ArrowUpRight className="h-4 w-4" />
                        Levantar
                    </Link>
                </div>

                {/* Decorative circles */}
                <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-white/10 blur-xl" />
            </div>

            {/* Main Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Link href="/dashboard/play" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                            <Joystick className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Jogar Sueca</h3>
                            <p className="text-sm text-gray-500">Encontrar mesa ou criar</p>
                        </div>
                    </div>
                </Link>

                <Link href="/dashboard/history" className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm transition-all hover:shadow-md hover:scale-[1.01] border border-gray-100">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                            <Wallet className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Histórico</h3>
                            <p className="text-sm text-gray-500">Jogos e transações</p>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Recent Activity (Placeholder) */}
            <div className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
                <h3 className="font-bold text-gray-900">Atividade Recente</h3>
                <div className="mt-4 flex flex-col items-center justify-center py-8 text-center text-gray-500">
                    <p>Sem atividade recente.</p>
                </div>
            </div>
        </div>
    );
}
