'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card } from '@/components/ui/card' // Assuming we have this or I'll use div
import { Users, DollarSign, Activity, AlertCircle, TrendingUp, Shield } from 'lucide-react'
import Link from 'next/link'

// Quick UI components if missing
const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
        <div>
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={`p-3 rounded-xl bg-${color}-100 text-${color}-600`}>
            <Icon className="h-6 w-6" />
        </div>
    </div>
)

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalBalance: 0,
        totalGames: 0,
        activeTickets: 0
    })
    const supabase = createClient()

    useEffect(() => {
        const fetchStats = async () => {
            // Mocking some stats for now or fetching real if tables exist
            const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
            const { data: wallets } = await supabase.from('wallets').select('balance')
            // const { count: gamesCount } = await supabase.from('games').select('*', { count: 'exact', head: true })

            const totalBal = wallets?.reduce((acc, w) => acc + (w.balance || 0), 0) || 0

            setStats({
                totalUsers: usersCount || 0,
                totalBalance: totalBal,
                totalGames: 124, // Mock
                activeTickets: 3 // Mock
            })
        }
        fetchStats()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                            <Shield className="h-8 w-8 text-ios-blue" />
                            Painel Administrativo
                        </h1>
                        <p className="text-gray-500">Visão geral do sistema e métricas.</p>
                    </div>
                    <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900">
                        Voltar ao Jogo
                    </Link>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Utilizadores Totais" value={stats.totalUsers} icon={Users} color="blue" />
                    <StatCard title="Saldo em Circulação" value={`€${stats.totalBalance.toFixed(2)}`} icon={DollarSign} color="green" />
                    <StatCard title="Jogos Realizados" value={stats.totalGames} icon={Activity} color="purple" />
                    <StatCard title="Tickets Abertos" value={stats.activeTickets} icon={AlertCircle} color="red" />
                </div>

                {/* Recent Activity / Controls */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Atividade Recente</h2>
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex items-center justify-between border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                            <Users className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">Novo registo de utilizador</p>
                                            <p className="text-xs text-gray-500">Há {i * 15} minutos</p>
                                        </div>
                                    </div>
                                    <span className="text-sm text-green-600 font-medium">+1 User</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Ações Rápidas</h2>
                        <div className="space-y-3">
                            <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-700 flex items-center justify-between">
                                Gerir Utilizadores
                                <ArrowRightIcon />
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-700 flex items-center justify-between">
                                Ver Transações
                                <ArrowRightIcon />
                            </button>
                            <button className="w-full text-left px-4 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition font-medium text-gray-700 flex items-center justify-between">
                                Configurações do Jogo
                                <ArrowRightIcon />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

function ArrowRightIcon() {
    return (
        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
    )
}
