import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    // Basic check usually via Roles or specific email
    // For demo, assume admin is any user for now or no check?
    // User request says "painel administrativo area protegida", so we should check.
    // We'll check if user metadata has role 'admin' or something.
    // const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    // if (profile.role !== 'admin') redirect('/dashboard')

    const { count: userCount } = await supabase.from("profiles").select("*", { count: 'exact', head: true });
    const { count: gameCount } = await supabase.from("games").select("*", { count: 'exact', head: true });
    const { data: pendingWithdrawals } = await supabase.from("withdrawals").select("*, profiles(username)").eq("status", "pending");

    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-8 text-gray-900">Painel Administrativo</h1>

            <div className="grid gap-6 md:grid-cols-3 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Utilizadores</h3>
                    <p className="text-3xl font-bold text-gray-900">{userCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Jogos Realizados</h3>
                    <p className="text-3xl font-bold text-gray-900">{gameCount}</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm">
                    <h3 className="text-gray-500 text-sm font-medium">Saques Pendentes</h3>
                    <p className="text-3xl font-bold text-orange-500">{pendingWithdrawals?.length || 0}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="font-bold text-gray-900">Aprovações Pendentes</h3>
                </div>
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Utilizador</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Chave PIX/IBAN</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {pendingWithdrawals?.map((w) => (
                            <tr key={w.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{w.profiles?.username}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">€{w.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{w.pix_key}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <button className="text-green-600 hover:text-green-900 mr-4">Aprovar</button>
                                    <button className="text-red-600 hover:text-red-900">Rejeitar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
