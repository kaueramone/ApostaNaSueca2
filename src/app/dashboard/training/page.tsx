'use client'

import { useRouter } from 'next/navigation'
import { GameTable } from '@/features/game/game-table'
import { ArrowLeft } from 'lucide-react'

export default function TrainingPage() {
    const router = useRouter()

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)]">
            <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="p-2 hover:bg-gray-200 rounded-full transition"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Modo de Treino</h1>
                        <p className="text-sm text-gray-500">Jogue contra bots para praticar. Sem apostas.</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 relative overflow-hidden rounded-xl border border-gray-200 shadow-sm bg-gray-50">
                <GameTable
                    isTraining={true}
                    // Pass dummy props to satisfy Typescript if needed, though we made them optional
                    currentUser={{ id: 'human', user_metadata: { full_name: 'Você' } }}
                />
            </div>
        </div>
    )
}
