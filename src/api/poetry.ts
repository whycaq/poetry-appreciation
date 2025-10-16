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
export async function getPopularPoems(limit = 10, offset = 0): Promise<{ data: Poem[], count: number }> {
  const { data, error, count } = await supabase
    .from('poems')
    .select('*', { count: 'exact' })
    .order('likes', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('获取热门诗词失败:', error)
    return { data: [], count: 0 }
  }
  
  return { data: data || [], count: count || 0 }
}

// 根据分类获取诗词
export async function getPoemsByCategory(category: string, limit = 20, offset = 0): Promise<{ data: Poem[], count: number }> {
  const { data, error, count } = await supabase
    .from('poems')
    .select('*', { count: 'exact' })
    .eq('category', category)
    .order('likes', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('获取分类诗词失败:', error)
    return { data: [], count: 0 }
  }
  
  return { data: data || [], count: count || 0 }
}

// 根据朝代获取诗词
export async function getPoemsByDynasty(dynasty: string, limit = 20, offset = 0): Promise<{ data: Poem[], count: number }> {
  const { data, error, count } = await supabase
    .from('poems')
    .select('*', { count: 'exact' })
    .eq('dynasty', dynasty)
    .order('likes', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('获取朝代诗词失败:', error)
    return { data: [], count: 0 }
  }
  
  return { data: data || [], count: count || 0 }
}

// 搜索诗词
export async function searchPoems(query: string, limit = 20, offset = 0): Promise<{ data: Poem[], count: number }> {
  const { data, error, count } = await supabase
    .from('poems')
    .select('*', { count: 'exact' })
    .or(`title.ilike.%${query}%,author.ilike.%${query}%,content.ilike.%${query}%`)
    .order('likes', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('搜索诗词失败:', error)
    return { data: [], count: 0 }
  }
  
  return { data: data || [], count: count || 0 }
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

// 增加诗词浏览量（旧版本，保留向后兼容）
export async function incrementPoemViews(id: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_views', { poem_id: id })
  
  if (error) {
    console.error('增加浏览量失败:', error)
  }
}

// 记录诗词浏览（新版本 - 支持登录用户浏览历史）
export async function recordPoemView(poemId: string, userId?: string): Promise<void> {
  const { error } = await supabase.rpc('record_poem_view', {
    p_poem_id: poemId,
    p_user_id: userId || null
  })
  
  if (error) {
    console.error('记录浏览失败:', error)
  }
}

// 点赞诗词（旧版本，保留向后兼容）
export async function likePoem(id: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_likes', { poem_id: id })
  
  if (error) {
    console.error('点赞诗词失败:', error)
  }
}

// 智能点赞/取消点赞（新版本 - 支持切换点赞状态）
export async function toggleLike(
  userId: string, 
  poemId?: string, 
  commentId?: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc('toggle_like', {
    p_user_id: userId,
    p_poem_id: poemId || null,
    p_comment_id: commentId || null
  })
  
  if (error) {
    console.error('点赞操作失败:', error)
    throw error
  }
  
  return data // 返回true表示已点赞，false表示已取消
}

// 检查用户是否已点赞诗词
export async function checkUserLike(userId: string, poemId: string): Promise<boolean> {
  const { data, error } = await supabase
    .from('likes')
    .select('id')
    .eq('user_id', userId)
    .eq('poem_id', poemId)
    .single()
  
  if (error && error.code !== 'PGRST116') {
    console.error('检查点赞状态失败:', error)
    return false
  }
  
  return !!data
}

// 获取所有分类
export async function getCategories(): Promise<any[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true })
  
  if (error) {
    console.error('获取分类失败:', error)
    return []
  }
  
  return data || []
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

// 诗人接口定义
export interface Poet {
  id: string
  name: string
  dynasty: string
  birth_year: string
  death_year: string
  birth_place: string
  biography: string
  image_url: string
  works_count: number
  created_at: string
  updated_at: string
}

// 获取所有诗人
export async function getPoets(): Promise<Poet[]> {
  const { data, error } = await supabase
    .from('poets')
    .select('*')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('获取诗人列表失败:', error)
    return []
  }
  
  return data || []
}

// 根据朝代获取诗人
export async function getPoetsByDynasty(dynasty: string): Promise<Poet[]> {
  const { data, error } = await supabase
    .from('poets')
    .select('*')
    .eq('dynasty', dynasty)
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('获取诗人列表失败:', error)
    return []
  }
  
  return data || []
}

// 获取诗人详情
export async function getPoetById(id: string): Promise<Poet | null> {
  const { data, error } = await supabase
    .from('poets')
    .select('*')
    .eq('id', id)
    .single()
  
  if (error) {
    console.error('获取诗人详情失败:', error)
    return null
  }
  
  return data
}

// 获取诗人的所有作品
export async function getPoemsByPoetId(poetId: string, limit = 20, offset = 0): Promise<{ data: Poem[], count: number }> {
  const { data, error, count } = await supabase
    .from('poems')
    .select('*', { count: 'exact' })
    .eq('poet_id', poetId)
    .order('likes', { ascending: false })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('获取诗人作品失败:', error)
    return { data: [], count: 0 }
  }
  
  return { data: data || [], count: count || 0 }
}

// 全文搜索诗词（使用新的search_vector）
export async function fullTextSearch(query: string, limit = 20, offset = 0): Promise<{ data: Poem[], count: number }> {
  const { data, error, count } = await supabase
    .from('poems')
    .select('*', { count: 'exact' })
    .textSearch('search_vector', query, {
      type: 'plain',
      config: 'simple'
    })
    .range(offset, offset + limit - 1)
  
  if (error) {
    console.error('全文搜索失败:', error)
    return { data: [], count: 0 }
  }
  
  return { data: data || [], count: count || 0 }
}

// 获取精选诗词
export async function getFeaturedPoems(limit = 10): Promise<Poem[]> {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('is_featured', true)
    .order('likes', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('获取精选诗词失败:', error)
    return []
  }
  
  return data || []
}

// 按难度等级获取诗词
export async function getPoemsByDifficulty(level: number, limit = 20): Promise<Poem[]> {
  const { data, error } = await supabase
    .from('poems')
    .select('*')
    .eq('difficulty_level', level)
    .order('likes', { ascending: false })
    .limit(limit)
  
  if (error) {
    console.error('获取诗词失败:', error)
    return []
  }
  
  return data || []
}