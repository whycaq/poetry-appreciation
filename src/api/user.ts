import supabase from '../lib/supabase'

export interface User {
  id: string
  email: string
  username: string
  avatar_url?: string
  created_at: string
}

// 用户注册
export async function signUp(email: string, password: string, username: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username
      }
    }
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// 用户登录
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// 用户登出
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    throw new Error(error.message)
  }
}

// 获取当前用户
export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// 更新用户资料
export async function updateUserProfile(userId: string, updates: { username?: string; avatar_url?: string }) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// 获取用户收藏的诗词
export async function getUserFavorites(userId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select(`
      poems (*)
    `)
    .eq('user_id', userId)
  
  if (error) {
    console.error('获取用户收藏失败:', error)
    return []
  }
  
  return data?.map(item => item.poems) || []
}

// 添加收藏
export async function addToFavorites(userId: string, poemId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .insert([{ user_id: userId, poem_id: poemId }])
    .select()
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

// 移除收藏
export async function removeFromFavorites(userId: string, poemId: string) {
  const { error } = await supabase
    .from('user_favorites')
    .delete()
    .eq('user_id', userId)
    .eq('poem_id', poemId)
  
  if (error) {
    throw new Error(error.message)
  }
}

// 检查是否已收藏
export async function isFavorite(userId: string, poemId: string) {
  const { data, error } = await supabase
    .from('user_favorites')
    .select('id')
    .eq('user_id', userId)
    .eq('poem_id', poemId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('检查收藏状态失败:', error)
    return false
  }
  
  return !!data
}