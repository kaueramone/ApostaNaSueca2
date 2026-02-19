'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getAdminStats() {
    const supabase = await createClient()

    // Users Count
    const { count: usersCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })

    // Total Balance
    const { data: wallets } = await supabase.from('wallets').select('balance')
    const totalBalance = wallets?.reduce((acc, w) => acc + (w.balance || 0), 0) || 0

    // Total Games
    const { count: gamesCount } = await supabase.from('games').select('*', { count: 'exact', head: true })

    return {
        users: usersCount || 0,
        balance: totalBalance,
        games: gamesCount || 0
    }
}

export async function getUsers(page = 1, search = '') {
    const supabase = await createClient()
    const from = (page - 1) * 20
    const to = from + 19

    let query = supabase.from('profiles').select('*', { count: 'exact' }).order('created_at', { ascending: false }).range(from, to)

    if (search) {
        query = query.ilike('username', `%${search}%`)
    }

    const { data, count, error } = await query

    if (error) throw error
    return { users: data, total: count }
}

export async function toggleBanUser(userId: string, currentStatus: boolean) {
    const supabase = await createClient()

    // Check if current user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'Not authenticated' }

    // TODO: Verify if requester is admin (requires fetching their profile)
    // const { data: me } = ... if (me.role !== 'admin') return error

    const { error } = await supabase.from('profiles').update({ is_banned: !currentStatus }).eq('id', userId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

export async function promoteToAdmin(userId: string) {
    const supabase = await createClient()
    const { error } = await supabase.from('profiles').update({ role: 'admin' }).eq('id', userId)

    if (error) return { error: error.message }
    revalidatePath('/admin')
    return { success: true }
}

export async function getTransactions() {
    const supabase = await createClient()
    // Join with profiles to show username? Supabase join syntax:
    const { data, error } = await supabase
        .from('transactions')
        .select(`
            *,
            wallet:wallets(
                user:profiles(username)
            )
        `)
        .order('created_at', { ascending: false })
        .limit(50)

    if (error) throw error
    return data
}
