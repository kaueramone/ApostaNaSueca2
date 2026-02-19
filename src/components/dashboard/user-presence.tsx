'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function UserPresence({ userId, email }: { userId: string, email: string }) {
    const supabase = createClient()

    useEffect(() => {
        if (!userId) return

        const channel = supabase.channel('online-users', {
            config: {
                presence: {
                    key: userId,
                },
            },
        })

        channel
            .on('presence', { event: 'sync' }, () => {
                // console.log('Presence sync', channel.presenceState())
            })
            .on('presence', { event: 'join' }, ({ key, newPresences }) => {
                console.log('join', key, newPresences)
            })
            .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
                console.log('leave', key, leftPresences)
            })
            .subscribe(async (status) => {
                if (status === 'SUBSCRIBED') {
                    await channel.track({
                        user_id: userId,
                        email: email,
                        online_at: new Date().toISOString(),
                    })
                }
            })

        return () => {
            supabase.removeChannel(channel)
        }
    }, [userId, email, supabase])

    return null // Invisible component
}
