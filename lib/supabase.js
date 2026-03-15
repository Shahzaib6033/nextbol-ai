import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase keys missing — running in demo mode')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper: Get current user profile
export async function getUserProfile(userId) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) console.error('Profile fetch error:', error)
  return data
}

// Helper: Update user profile
export async function updateUserProfile(userId, updates) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) console.error('Profile update error:', error)
  return data
}

// Helper: Save generation to history
export async function saveGeneration(userId, generation) {
  if (!supabase) return null
  const { data, error } = await supabase
    .from('generations')
    .insert({
      user_id: userId,
      tool: generation.tool,
      topic: generation.topic,
      tone: generation.tone,
      language: generation.language,
      output: generation.output,
      tokens_used: generation.tokens || 0,
    })
    .select()
    .single()
  if (error) console.error('Save generation error:', error)
  return data
}

// Helper: Get user's generation history
export async function getGenerations(userId, limit = 50) {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('generations')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) console.error('Fetch generations error:', error)
  return data || []
}

// Helper: Increment daily usage
export async function incrementUsage(userId) {
  if (!supabase) return null
  const { data, error } = await supabase.rpc('increment_usage', { uid: userId })
  if (error) {
    // Fallback: manual increment
    const profile = await getUserProfile(userId)
    if (profile) {
      return await updateUserProfile(userId, {
        daily_usage: (profile.daily_usage || 0) + 1
      })
    }
  }
  return data
}

// ADMIN: Get all users
export async function getAllUsers() {
  if (!supabase) return []
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) console.error('Fetch users error:', error)
  return data || []
}

// ADMIN: Get platform stats
export async function getPlatformStats() {
  if (!supabase) return null
  const { data: profiles } = await supabase.from('profiles').select('plan')
  const { count: totalGenerations } = await supabase
    .from('generations')
    .select('*', { count: 'exact', head: true })

  const total = profiles?.length || 0
  const paid = profiles?.filter(p => p.plan !== 'free').length || 0
  const creators = profiles?.filter(p => p.plan === 'creator').length || 0
  const agencies = profiles?.filter(p => p.plan === 'agency').length || 0

  return {
    totalUsers: total,
    paidUsers: paid,
    freeUsers: total - paid,
    creators,
    agencies,
    totalGenerations: totalGenerations || 0,
    mrr: (creators * 7) + (agencies * 19),
  }
}
