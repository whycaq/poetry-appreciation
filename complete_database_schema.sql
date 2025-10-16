-- 诗词鉴赏网站完整数据库结构
-- 包含用户管理、诗词库、收藏、评论、标签、诗人信息等模块

-- 1. 用户表 (已存在)
-- CREATE TABLE users (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     email VARCHAR UNIQUE NOT NULL,
--     username VARCHAR UNIQUE NOT NULL,
--     avatar_url TEXT,
--     bio TEXT,
--     level INTEGER DEFAULT 1,
--     experience INTEGER DEFAULT 0,
--     created_at TIMESTAMPTZ DEFAULT now(),
--     updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- 2. 诗词表 (已存在，需要扩展)
-- ALTER TABLE poems ADD COLUMN IF NOT EXISTS description TEXT;
-- ALTER TABLE poems ADD COLUMN IF NOT EXISTS tags TEXT[];
-- ALTER TABLE poems ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 1;
-- ALTER TABLE poems ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- 3. 诗人信息表
CREATE TABLE IF NOT EXISTS poets (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL,
    dynasty VARCHAR NOT NULL,
    birth_year VARCHAR,
    death_year VARCHAR,
    birth_place VARCHAR,
    biography TEXT,
    image_url TEXT,
    works_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 4. 诗词分类表
CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    description TEXT,
    icon_url TEXT,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 5. 标签表
CREATE TABLE IF NOT EXISTS tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR NOT NULL UNIQUE,
    color VARCHAR DEFAULT '#6B7280',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 6. 诗词标签关联表
CREATE TABLE IF NOT EXISTS poem_tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(poem_id, tag_id)
);

-- 7. 用户收藏表 (已存在)
-- CREATE TABLE user_favorites (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--     poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
--     created_at TIMESTAMPTZ DEFAULT now(),
--     UNIQUE(user_id, poem_id)
-- );

-- 8. 用户创作表 (已存在)
-- CREATE TABLE user_creations (
--     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
--     user_id UUID REFERENCES users(id) ON DELETE CASCADE,
--     title VARCHAR NOT NULL,
--     content TEXT NOT NULL,
--     category VARCHAR,
--     is_public BOOLEAN DEFAULT true,
--     likes INTEGER DEFAULT 0,
--     created_at TIMESTAMPTZ DEFAULT now(),
--     updated_at TIMESTAMPTZ DEFAULT now()
-- );

-- 9. 评论表
CREATE TABLE IF NOT EXISTS comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    is_approved BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 10. 点赞表
CREATE TABLE IF NOT EXISTS likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, poem_id, comment_id)
);

-- 11. 浏览历史表
CREATE TABLE IF NOT EXISTS view_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, poem_id)
);

-- 12. 学习进度表
CREATE TABLE IF NOT EXISTS learning_progress (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    progress_percent INTEGER DEFAULT 0,
    last_studied_at TIMESTAMPTZ DEFAULT now(),
    study_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, poem_id)
);

-- 13. 测验表
CREATE TABLE IF NOT EXISTS quizzes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer INTEGER NOT NULL,
    explanation TEXT,
    difficulty_level INTEGER DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 14. 用户测验记录表
CREATE TABLE IF NOT EXISTS quiz_results (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE,
    selected_answer INTEGER,
    is_correct BOOLEAN,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 15. 通知表
CREATE TABLE IF NOT EXISTS notifications (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR NOT NULL, -- 'like', 'comment', 'system'
    title VARCHAR NOT NULL,
    content TEXT,
    related_id UUID, -- 关联的诗词ID、评论ID等
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- 16. 系统配置表
CREATE TABLE IF NOT EXISTS system_config (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config_key VARCHAR UNIQUE NOT NULL,
    config_value TEXT,
    description TEXT,
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_author ON poems(author);
CREATE INDEX IF NOT EXISTS idx_poems_dynasty ON poems(dynasty);
CREATE INDEX IF NOT EXISTS idx_poems_category ON poems(category);
CREATE INDEX IF NOT EXISTS idx_poems_created_at ON poems(created_at);
CREATE INDEX IF NOT EXISTS idx_comments_poem_id ON comments(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at);
CREATE INDEX IF NOT EXISTS idx_user_favorites_user_id ON user_favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_view_history_user_id ON view_history(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_progress_user_id ON learning_progress(user_id);

-- 启用行级安全策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_creations ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE view_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 创建策略（示例）
CREATE POLICY "用户可查看所有诗词" ON poems FOR SELECT USING (true);
CREATE POLICY "用户可查看所有评论" ON comments FOR SELECT USING (true);
CREATE POLICY "用户只能管理自己的数据" ON user_favorites FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "用户只能管理自己的创作" ON user_creations FOR ALL USING (auth.uid() = user_id);

-- 插入初始分类数据
INSERT INTO categories (name, description, icon_url, sort_order) VALUES
('唐诗', '唐代诗歌，中国古典诗歌的黄金时代', '📜', 1),
('宋词', '宋代词作，婉约与豪放并存', '🌸', 2),
('元曲', '元代散曲，通俗易懂的艺术形式', '🎭', 3),
('诗经', '中国古代最早的诗歌总集', '📖', 4),
('楚辞', '战国时期楚国诗歌', '⚔️', 5),
('乐府', '汉代民间诗歌', '🎵', 6),
('近现代诗', '近现代诗歌作品', '✒️', 7)
ON CONFLICT (name) DO NOTHING;

-- 插入常用标签
INSERT INTO tags (name, color) VALUES
('爱情', '#EF4444'),
('山水', '#10B981'),
('思乡', '#F59E0B'),
('战争', '#DC2626'),
('田园', '#84CC16'),
('边塞', '#6366F1'),
('咏史', '#8B5CF6'),
('抒怀', '#EC4899'),
('离别', '#06B6D4'),
('哲理', '#64748B')
ON CONFLICT (name) DO NOTHING;

-- 插入系统配置
INSERT INTO system_config (config_key, config_value, description) VALUES
('site_name', '诗韵雅集', '网站名称'),
('site_description', '古典诗词鉴赏与学习平台', '网站描述'),
('max_upload_size', '10485760', '最大上传文件大小(字节)'),
('daily_poem_limit', '10', '每日推荐诗词数量'),
('featured_poems_count', '6', '首页推荐诗词数量')
ON CONFLICT (config_key) DO NOTHING;