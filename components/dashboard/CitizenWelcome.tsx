'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CitizenWelcome() {
  const [name, setName] = useState('Citizen')

  useEffect(() => {
    async function getProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name')
        .eq('id', user.id)
        .single()

      if (profile?.full_name) {
        setName(profile.full_name)
      }
    }

    getProfile()
  }, [])

  return <>Welcome back, {name}</>
}