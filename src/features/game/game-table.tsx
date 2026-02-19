'use client'

import { useEffect, useState, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { playCard } from './actions'
import { cn } from '@/lib/utils'
import { getCardAssetPath } from './utils'
import Image from 'next/image'

export function GameTable({ game, currentUser }: { game: any, currentUser: any }) {
    const [gameState, setGameState] = useState(game)
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    // Audio refs
    const audioPlaceRef = useRef<HTMLAudioElement | null>(null)
    const audioShuffleRef = useRef<HTMLAudioElement | null>(null)

    // Initialize audio
    useEffect(() => {
        audioPlaceRef.current = new Audio('/audio/card-place-1.ogg')
        audioShuffleRef.current = new Audio('/audio/card-shuffle.ogg')
    }, [])

    const playSound = (type: 'place' | 'shuffle') => {
        if (type === 'place' && audioPlaceRef.current) {
            audioPlaceRef.current.currentTime = 0
            audioPlaceRef.current.play().catch(e => console.log('Audio play failed', e))
        } else if (type === 'shuffle' && audioShuffleRef.current) {
            audioShuffleRef.current.currentTime = 0
            audioShuffleRef.current.play().catch(e => console.log('Audio play failed', e))
        }
    }

    // Realtime Subscription
    useEffect(() => {
        const channel = supabase
            .channel(`game-${game.id}`)
            .on('postgres_changes', { event: '*', schema: 'public', table: 'games', filter: `id=eq.${game.id}` }, (payload) => {
                setGameState((prev: any) => {
                    const newState = { ...prev, ...payload.new }
                    // Detect if a new card was played (simple check: turn changed or trick updated)
                    if (newState.current_trick_cards?.length > prev.current_trick_cards?.length) {
                        playSound('place')
                    }
                    return newState
                })
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'game_moves', filter: `game_id=eq.${game.id}` }, (payload) => {
                // When a move is inserted, play sound
                if (payload.eventType === 'INSERT') {
                    playSound('place')
                }
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [game.id, supabase])

    const myPlayer = gameState.game_players.find((p: any) => p.user_id === currentUser.id)
    if (!myPlayer) return <div>Access denied</div>

    const handlePlayCard = async (card: string) => {
        if (loading) return
        setLoading(true)
        // Optimistic UI update or Sound immediately?
        playSound('place')
        const res = await playCard(game.id, card)
        if (res?.error) {
            alert(res.error)
        }
        setLoading(false)
    }

    // Helper to render cards
    const renderCard = (card: string, onClick?: () => void, isOpponent = false) => {
        const src = getCardAssetPath(card)
        return (
            <div
                onClick={onClick}
                className={cn(
                    "relative transition-all select-none filter drop-shadow-md",
                    onClick ? "cursor-pointer hover:-translate-y-4 hover:scale-105 active:scale-95 z-0 hover:z-10" : "",
                    isOpponent ? "w-12 h-16 sm:w-16 sm:h-24" : "w-20 h-28 sm:w-24 sm:h-36"
                )}
            >
                <Image
                    src={src}
                    alt={card}
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100px, 150px"
                    priority={!isOpponent}
                />
            </div>
        )
    }

    const renderCardBack = (rotate = false) => {
        return (
            <div className={cn(
                "relative w-12 h-16 sm:w-14 sm:h-20 filter drop-shadow-sm",
                rotate ? "rotate-90" : ""
            )}>
                <Image
                    src="/cards/card_back.png"
                    alt="Back"
                    fill
                    className="object-contain"
                />
            </div>
        )
    }

    return (
        <div className="relative h-full w-full bg-[#35654d] overflow-hidden flex flex-col items-center justify-center p-2 sm:p-4 select-none">
            {/* Background Texture/Gradient */}
            <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay pointer-events-none" />

            {/* Top Player (Partner) */}
            <div className="absolute top-4 sm:top-8 flex flex-col items-center z-10">
                <div className="h-12 w-12 rounded-full border-2 border-white/50 bg-black/20 overflow-hidden mb-[-10px] z-20 shadow-lg relative">
                    {/* <Image src={...} /> */}
                    <div className="w-full h-full bg-gray-400" />
                </div>
                <div className="flex -space-x-8 sm:-space-x-10">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="transform scale-75 origin-top">{renderCardBack()}</div>
                    ))}
                </div>
            </div>

            {/* Left Player (Opponent) */}
            <div className="absolute left-2 sm:left-8 top-1/2 -translate-y-1/2 flex flex-row items-center z-10">
                <div className="flex flex-col -space-y-12 sm:-space-y-14">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="transform -rotate-90 scale-75">{renderCardBack()}</div>
                    ))}
                </div>
            </div>

            {/* Right Player (Opponent) */}
            <div className="absolute right-2 sm:right-8 top-1/2 -translate-y-1/2 flex flex-row items-center z-10">
                <div className="flex flex-col -space-y-12 sm:-space-y-14">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="transform rotate-90 scale-75">{renderCardBack()}</div>
                    ))}
                </div>
            </div>

            {/* Center (Table) */}
            <div className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-full border-4 border-white/10 bg-white/5 backdrop-blur-sm flex items-center justify-center">
                {/* Placeholder for played cards */}
                <span className="text-white/20 font-bold tracking-widest uppercase text-xs">Mesa</span>
            </div>

            {/* Bottom Player (Me) */}
            <div className="absolute bottom-4 sm:bottom-8 w-full flex flex-col items-center z-20">
                {/* My Hand */}
                <div className="flex -space-x-8 sm:-space-x-12 mb-6 px-4 py-2 hover:-space-x-6 sm:hover:-space-x-8 transition-all duration-300 ease-out perspective-1000">
                    {myPlayer.hand?.map((card: string, index: number) => {
                        // Fan effect calculation
                        const total = myPlayer.hand.length
                        const mid = (total - 1) / 2
                        const rotate = (index - mid) * 5 // degrees
                        const translateY = Math.abs(index - mid) * 5

                        return (
                            <div
                                key={card}
                                style={{
                                    transform: `rotate(${rotate}deg) translateY(${translateY}px)`,
                                    zIndex: index
                                }}
                                className="transform-gpu transition-transform hover:!rotate-0 hover:!translate-y-[-20px] hover:!z-50"
                            >
                                {renderCard(card, () => handlePlayCard(card))}
                            </div>
                        )
                    })}
                </div>

                <div className="flex items-center gap-3 bg-black/40 px-6 py-2 rounded-full backdrop-blur-md border border-white/10 shadow-xl">
                    <div className="h-10 w-10 rounded-full bg-gray-200 border-2 border-white overflow-hidden">
                        {myPlayer.profiles?.avatar_url && <Image src={myPlayer.profiles.avatar_url} alt="Me" width={40} height={40} className="object-cover" />}
                    </div>
                    <span className="text-white font-bold text-shadow-sm">{myPlayer.profiles?.username || 'Eu'}</span>
                    <div className="h-full w-px bg-white/20 mx-2" />
                    <span className="text-emerald-400 font-mono font-bold">€{gameState.stake || '0.00'}</span>
                </div>
            </div>

            {/* Loading Overlay */}
            {loading && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 cursor-wait">
                </div>
            )}

            {/* Status Overlay */}
            {gameState.status === 'waiting' && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-sm mx-4 transform transition-all scale-100">
                        <div className="animate-spin mb-4 mx-auto w-8 h-8 border-4 border-ios-blue border-t-transparent rounded-full" />
                        <h2 className="text-2xl font-bold mb-2 text-gray-900">A processar...</h2>
                        <p className="text-gray-500">A aguardar jogadores ou início do jogo.</p>
                        <div className="mt-4 flex justify-center gap-2">
                            {/* Avatars of connected players */}
                            {gameState.game_players.map((p: any) => (
                                <div key={p.user_id} className="w-8 h-8 rounded-full bg-gray-200 border border-white shadow-sm" title={p.profiles?.username} />
                            ))}
                            {Array.from({ length: 4 - (gameState.game_players?.length || 0) }).map((_, i) => (
                                <div key={i} className="w-8 h-8 rounded-full border-2 border-dashed border-gray-300" />
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
