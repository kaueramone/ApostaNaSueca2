import { createClient } from "@/lib/supabase/server";
import { SubmitButton } from "@/components/submit-button"; // Reuse
// import { createTicket } from "./actions"; // Need actions

export const dynamic = 'force-dynamic';

export default async function SupportPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: tickets } = await supabase
        .from("support_tickets")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Suporte</h1>
                {/* Create Ticket Button/Modal would go here */}
            </div>

            <div className="rounded-2xl bg-white shadow-sm border border-gray-100 overflow-hidden">
                <div className="border-b bg-gray-50 px-6 py-4">
                    <h2 className="font-semibold text-gray-700">Os seus Tickets</h2>
                </div>
                <div className="divide-y">
                    {tickets?.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">
                            Nenhum ticket de suporte aberto.
                        </div>
                    ) : (
                        tickets?.map((ticket) => (
                            <div key={ticket.id} className="flex items-center justify-between px-6 py-4 hover:bg-gray-50">
                                <div>
                                    <p className="font-medium text-gray-900">{ticket.subject}</p>
                                    <p className="text-sm text-gray-500">Status: <span className="capitalize">{ticket.status}</span></p>
                                </div>
                                <span className="text-gray-400 text-sm">{new Date(ticket.created_at).toLocaleDateString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
