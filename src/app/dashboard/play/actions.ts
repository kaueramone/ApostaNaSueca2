'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createGame(prevState: any, formData: FormData) {
    const supabase = await createClient()
    const stake = parseFloat(formData.get('stake') as string)

    if (isNaN(stake) || stake <= 0) {
        return { error: 'Valor de aposta inválido' }
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autenticado' }

    // Check balance
    const { data: wallet } = await supabase
        .from('wallets')
        .select('balance')
        .eq('user_id', user.id)
        .single()

    if (!wallet || wallet.balance < stake) {
        return { error: 'Saldo insuficiente para cobrir a aposta.' }
    }

    // Create Game
    const { data: game, error: gameError } = await supabase
        .from('games')
        .insert({
            host_id: user.id,
            stake: stake,
            status: 'waiting',
        })
        .select()
        .single()

    if (gameError || !game) {
        return { error: 'Erro ao criar mesa.' }
    }

    // Add Host as Player (Position 0, Team A)
    const { error: playerError } = await supabase.from('game_players').insert({
        game_id: game.id,
        user_id: user.id,
        position: 0,
        team: 'A',
    })

    if (playerError) {
        // Rollback game creation ideally, or let it stick empty
        return { error: 'Erro ao entrar na mesa.' }
    }

    // Deduct Balance (Escrow)
    // We deduct now or when game starts? 
    // Safety: Deduct now. Refund if cancelled.
    await supabase.from('wallets').update({
        balance: wallet.balance - stake
    }).eq('user_id', user.id)

    await supabase.from('transactions').insert({
        wallet_id: (await supabase.from('wallets').select('id').eq('user_id', user.id).single()).data!.id,
        amount: -stake,
        type: 'bet',
        description: `Entrada na mesa ${game.id.slice(0, 8)}`,
        reference_id: game.id
    })

    revalidatePath('/dashboard/play')
    redirect(`/dashboard/play/${game.id}`)
}

export async function joinGame(gameId: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Não autenticado" }

    // Fetch Game
    const { data: game } = await supabase.from('games').select('*').eq('id', gameId).single()
    if (!game) return { error: "Jogo não encontrado" }

    if (game.status !== 'waiting') return { error: "Jogo já começou ou terminou" }

    // Check if already in game
    const { data: existingPlayer } = await supabase.from('game_players').select('*').eq('game_id', gameId).eq('user_id', user.id).single()
    if (existingPlayer) {
        redirect(`/dashboard/play/${gameId}`)
    }

    // Check Balance
    const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', user.id).single()
    if (!wallet || wallet.balance < game.stake) {
        return { error: "Saldo insuficiente" }
    }

    // Find empty seat
    const { data: players } = await supabase.from('game_players').select('position').eq('game_id', gameId)
    const takenPositions = players?.map(p => p.position) || []

    let seat = -1
    // Positions: 0, 1, 2, 3
    // Teams: A (0, 2), B (1, 3)
    // We strictly fill 0, 1, 2, 3? Or let user pick? For simplicity, auto-fill.
    for (let i = 0; i < 4; i++) {
        if (!takenPositions.includes(i)) {
            seat = i
            break
        }
    }

    if (seat === -1) return { error: "Mesa cheia" }

    const team = (seat === 0 || seat === 2) ? 'A' : 'B'

    // Insert Player
    const { error: joinError } = await supabase.from('game_players').insert({
        game_id: gameId,
        user_id: user.id,
        position: seat,
        team: team
    })

    if (joinError) return { error: "Erro ao entrar" }

    // Deduct Stake
    await supabase.from('wallets').update({ balance: wallet.balance - game.stake }).eq('id', wallet.id)
    await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: -game.stake,
        type: 'bet',
        description: `Entrada na mesa ${game.id.slice(0, 8)}`,
        reference_id: game.id
    })

    // If table full (4 players), start game?
    if (takenPositions.length + 1 === 4) {
        // Trigger game start logic (server-side function or just update status)
        await supabase.from('games').update({ status: 'playing' }).eq('id', gameId)
        // Deal cards? Need a robust dealer function.
        // We can call an edge function or API route here.
    }

    revalidatePath(`/dashboard/play/${gameId}`)
    redirect(`/dashboard/play/${gameId}`)
}
