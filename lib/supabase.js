import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

export const supabase = (url && key) ? createClient(url, key) : null

export async function getUserProfile(userId) {
  if (!supabase) return null
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
}

export async function updateUserProfile(userId, updates) {
  if (!supabase) return null
  const { data } = await supabase.from('profiles').update(updates).eq('id', userId).select().single()
  return data
}

export async function saveGeneration(userId, gen) {
  if (!supabase) return null
  const { data } = await supabase.from('generations').insert({
    user_id: userId, tool: gen.tool, topic: gen.topic,
    tone: gen.tone, language: gen.language, output: gen.output, tokens_used: gen.tokens || 0,
  }).select().single()
  return data
}

export async function getGenerations(userId, limit = 50) {
  if (!supabase) return []
  const { data } = await supabase.from('generations').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(limit)
  return data || []
}

export async function getAllUsers() {
  if (!supabase) return []
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false })
  return data || []
}

export async function getPlatformStats() {
  if (!supabase) return null
  const { data: profiles } = await supabase.from('profiles').select('plan')
  const { count } = await supabase.from('generations').select('*', { count: 'exact', head: true })
  const total = profiles?.length || 0
  const creators = profiles?.filter(p => p.plan === 'creator').length || 0
  const agencies = profiles?.filter(p => p.plan === 'agency').length || 0
  return {
    totalUsers: total, paidUsers: creators + agencies,
    freeUsers: total - creators - agencies, creators, agencies,
    totalGenerations: count || 0, mrr: (creators * 7) + (agencies * 19),
  }
}
