import supabase from '../lib/supabase'

export interface Poem {
  id: string
  title: string
  author: string
  dynasty: string
  content: string
  excerpt: string
  category: string
  image_url: string
  likes: number
  views: number
  created_at: string
}

export interface CreatePoemData {
  title: string
  author: string
  dynasty: string
  content: string
  excerpt?: string
  category: string
  image_url?: string
}

// 获取热门诗词
export async function getPopularPoems(limit = 10): Promise<Poem[]> {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .order('likes', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('获取热门诗词失败:', error)
    return []
  }
  
  return data || []
}

// 根据分类获取诗词
export async function getPoemsByCategory(category: string, limit = 20): Promise<Poem[]> {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('category', category)
    .order('likes', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('获取分类诗词失败:', error)
    return []
  }
  
  return data || []
}

// 搜索诗词
export async function searchPoems(query: string, limit = 20): Promise<Poem[]> {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,content.ilike.%${query}%`)
    .order('likes', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('搜索诗词失败:', error)
    return []
  }
  
  return data || []
}

// 获取单个诗词详情
export async function getPoemById(id: string): Promise<Poem | null> {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('获取诗词详情失败:', error)
    return null
  }
  
  return data
}

// 增加诗词浏览量
export async function incrementPoemViews(id: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_views', { poem_id: id })
  
  if (error) {
    console.error('增加浏览量失败:', error)
  }
}

// 点赞诗词
export async function likePoem(id: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_likes', { poem_id: id })
  
  if (error) {
    console.error('点赞诗词失败:', error)
  }
}

// 创建新诗词（需要认证）
export async function createPoem(poemData: CreatePoemData): Promise<Poem | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    throw new Error('需要登录才能创建诗词')
  }
  
  const { data, error } = await supabase
    .from('poems')
    .insert([poemData])
    .select()
    .single()
  
  if (error) {
    console.error('创建诗词失败:', error)
    return null
  }
  
  return data
}