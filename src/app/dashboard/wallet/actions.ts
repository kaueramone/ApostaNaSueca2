'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function deposit(formData: FormData) {
    const supabase = await createClient()
    const amount = parseFloat(formData.get('amount') as string)

    if (isNaN(amount) || amount <= 0) {
        return { error: 'Valor inválido' }
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Utilizador não autenticado' }
    }

    // Get user wallet
    const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .single()

    if (!wallet) {
        return { error: 'Carteira não encontrada' }
    }

    // Insert transaction
    const { error: txError } = await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: amount,
        type: 'deposit',
        description: 'Depósito via MB Way (Simulado)',
    })

    if (txError) {
        return { error: 'Erro ao criar transação' }
    }

    // Update wallet balance
    const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance + amount })
        .eq('id', wallet.id)

    if (walletError) {
        return { error: 'Erro ao atualizar saldo' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

export async function requestWithdrawal(formData: FormData) {
    const supabase = await createClient()
    const amount = parseFloat(formData.get('amount') as string)
    const pixKey = formData.get('pixKey') as string // Using 'pixKey' as generic term/field for IBAN/Phone

    if (isNaN(amount) || amount < 10) {
        return { error: 'O valor mínimo de levantamento é 10€' }
    }

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Utilizador não autenticado' }
    }

    const { data: wallet } = await supabase
        .from('wallets')
        .select('id, balance')
        .eq('user_id', user.id)
        .single()

    if (!wallet || wallet.balance < amount + 1) { // 1 euro fee
        return { error: 'Saldo insuficiente (incluindo taxa de 1€)' }
    }

    // Deduct balance immediately? Usually yes, or hold it.
    // For simplicity: Deduct and create 'withdrawal' transaction + 'withdrawal_fee' transaction? 
    // Or just 1 transaction.
    // Let's deduct from wallet and create a withdrawal record.

    // 1. Create Withdrawal Request
    const { error: widthdrawError } = await supabase.from('withdrawals').insert({
        user_id: user.id,
        amount: amount,
        status: 'pending',
        pix_key: pixKey,
        admin_note: 'Taxa de 1€ será aplicada na aprovação ou deduzida agora.', // Let's deduct now to prevent double spend
    })

    if (widthdrawError) {
        return { error: 'Erro ao solicitar levantamento' }
    }

    // 2. Deduct Bundle (Amount + 1 fee)
    const totalDeduction = amount + 1
    const { error: walletError } = await supabase
        .from('wallets')
        .update({ balance: wallet.balance - totalDeduction })
        .eq('id', wallet.id)

    if (walletError) {
        return { error: 'Erro ao cativar saldo' }
        // Ideally rollback withdrawal here
    }

    // 3. Create Transaction Record
    await supabase.from('transactions').insert({
        wallet_id: wallet.id,
        amount: -totalDeduction,
        type: 'withdrawal',
        description: `Levantamento de ${amount}€ + 1€ taxa`,
    })

    revalidatePath('/', 'layout')
    return { success: true }
}
