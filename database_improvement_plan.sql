-- ========================================
-- 诗词鉴赏网站数据库优化方案
-- ========================================
-- 此脚本包含所有数据库结构改进和优化

-- ========================================
-- 第一部分：扩展现有表结构
-- ========================================

-- 1. 扩展poems表 - 添加缺失的重要字段
ALTER TABLE poems 
  ADD COLUMN IF NOT EXISTS translation TEXT,
  ADD COLUMN IF NOT EXISTS appreciation TEXT,
  ADD COLUMN IF NOT EXISTS poet_id UUID REFERENCES poets(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS difficulty_level INTEGER DEFAULT 1 CHECK (difficulty_level BETWEEN 1 AND 5),
  ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS background_music_url TEXT,
  ADD COLUMN IF NOT EXISTS audio_url TEXT;

COMMENT ON COLUMN poems.translation IS '诗词现代汉语翻译';
COMMENT ON COLUMN poems.appreciation IS '诗词赏析内容';
COMMENT ON COLUMN poems.poet_id IS '关联的诗人ID，与poets表关联';
COMMENT ON COLUMN poems.difficulty_level IS '难度等级 1-5，1最简单';
COMMENT ON COLUMN poems.is_featured IS '是否为精选推荐诗词';
COMMENT ON COLUMN poems.background_music_url IS '背景音乐URL';
COMMENT ON COLUMN poems.audio_url IS '诗词朗诵音频URL';

-- 2. 扩展users表 - 添加用户成长系统字段
ALTER TABLE users 
  ADD COLUMN IF NOT EXISTS bio TEXT,
  ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1 CHECK (level >= 1),
  ADD COLUMN IF NOT EXISTS experience INTEGER DEFAULT 0 CHECK (experience >= 0),
  ADD COLUMN IF NOT EXISTS coins INTEGER DEFAULT 0 CHECK (coins >= 0),
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

COMMENT ON COLUMN users.bio IS '用户个人简介';
COMMENT ON COLUMN users.level IS '用户等级';
COMMENT ON COLUMN users.experience IS '用户经验值';
COMMENT ON COLUMN users.coins IS '用户虚拟货币';
COMMENT ON COLUMN users.last_login_at IS '最后登录时间';

-- 3. 修复view_history表 - 移除UNIQUE约束，改为记录每次浏览
ALTER TABLE view_history DROP CONSTRAINT IF EXISTS view_history_user_id_poem_id_key;

-- 添加索引替代唯一约束，用于快速查询
CREATE INDEX IF NOT EXISTS idx_view_history_user_poem 
  ON view_history(user_id, poem_id, viewed_at DESC);

-- 4. 优化likes表 - 分离诗词点赞和评论点赞，添加约束
ALTER TABLE likes DROP CONSTRAINT IF EXISTS likes_user_id_poem_id_comment_id_key;

-- 添加检查约束：确保只能点赞诗词或评论之一，不能同时为空
ALTER TABLE likes 
  ADD CONSTRAINT check_like_target 
  CHECK (
    (poem_id IS NOT NULL AND comment_id IS NULL) OR
    (poem_id IS NULL AND comment_id IS NOT NULL)
  );

-- 添加唯一约束：用户对同一诗词或评论只能点赞一次
CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_poem 
  ON likes(user_id, poem_id) 
  WHERE poem_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS idx_likes_user_comment 
  ON likes(user_id, comment_id) 
  WHERE comment_id IS NOT NULL;

-- ========================================
-- 第二部分：创建新表
-- ========================================

-- 5. 创建诗词版本历史表（支持诗词内容修订）
CREATE TABLE IF NOT EXISTS poem_revisions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    title VARCHAR NOT NULL,
    content TEXT NOT NULL,
    translation TEXT,
    appreciation TEXT,
    revised_by UUID REFERENCES users(id) ON DELETE SET NULL,
    revision_note TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

COMMENT ON TABLE poem_revisions IS '诗词修订历史记录';

-- 6. 创建用户成就表
CREATE TABLE IF NOT EXISTS user_achievements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_type VARCHAR NOT NULL,
    achievement_name VARCHAR NOT NULL,
    description TEXT,
    icon_url TEXT,
    earned_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, achievement_type)
);

COMMENT ON TABLE user_achievements IS '用户获得的成就记录';

-- 7. 创建每日推荐表
CREATE TABLE IF NOT EXISTS daily_recommendations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    poem_id UUID NOT NULL REFERENCES poems(id) ON DELETE CASCADE,
    recommendation_date DATE NOT NULL DEFAULT CURRENT_DATE,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(recommendation_date, poem_id)
);

COMMENT ON TABLE daily_recommendations IS '每日诗词推荐';

-- 8. 创建用户学习打卡记录表
CREATE TABLE IF NOT EXISTS study_check_ins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    check_in_date DATE NOT NULL DEFAULT CURRENT_DATE,
    poems_studied INTEGER DEFAULT 0,
    time_spent INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, check_in_date)
);

COMMENT ON TABLE study_check_ins IS '用户每日学习打卡记录';

-- ========================================
-- 第三部分：创建性能优化索引
-- ========================================

-- poems表索引优化
CREATE INDEX IF NOT EXISTS idx_poems_likes_desc ON poems(likes DESC);
CREATE INDEX IF NOT EXISTS idx_poems_views_desc ON poems(views DESC);
CREATE INDEX IF NOT EXISTS idx_poems_created_at_desc ON poems(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_poems_is_featured ON poems(is_featured) WHERE is_featured = true;
CREATE INDEX IF NOT EXISTS idx_poems_difficulty ON poems(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_poems_poet_id ON poems(poet_id);

-- 为全文搜索创建 GIN 索引（使用 tsvector）
-- 创建全文搜索列
ALTER TABLE poems ADD COLUMN IF NOT EXISTS search_vector tsvector 
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(author, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(content, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_poems_search ON poems USING GIN(search_vector);

-- poets表索引
CREATE INDEX IF NOT EXISTS idx_poets_dynasty ON poets(dynasty);
CREATE INDEX IF NOT EXISTS idx_poets_name ON poets(name);

-- comments表索引
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id) WHERE parent_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_comments_likes_desc ON comments(likes DESC);

-- tags表索引
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- user_favorites表索引
CREATE INDEX IF NOT EXISTS idx_user_favorites_poem_id ON user_favorites(poem_id);

-- notifications表索引
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread ON notifications(user_id, is_read, created_at DESC);

-- ========================================
-- 第四部分：创建触发器和函数
-- ========================================

-- 1. 自动更新 updated_at 字段的函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 为所有需要的表添加触发器
DROP TRIGGER IF EXISTS update_poems_updated_at ON poems;
CREATE TRIGGER update_poems_updated_at
    BEFORE UPDATE ON poems
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_poets_updated_at ON poets;
CREATE TRIGGER update_poets_updated_at
    BEFORE UPDATE ON poets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_comments_updated_at ON comments;
CREATE TRIGGER update_comments_updated_at
    BEFORE UPDATE ON comments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 2. 自动同步诗人作品数量的函数和触发器
CREATE OR REPLACE FUNCTION sync_poet_works_count()
RETURNS TRIGGER AS $$
BEGIN
    -- 当诗词的poet_id改变时，更新新旧诗人的作品数
    IF TG_OP = 'INSERT' OR (TG_OP = 'UPDATE' AND NEW.poet_id IS DISTINCT FROM OLD.poet_id) THEN
        -- 更新新诗人的作品数
        IF NEW.poet_id IS NOT NULL THEN
            UPDATE poets 
            SET works_count = (
                SELECT COUNT(*) FROM poems WHERE poet_id = NEW.poet_id
            )
            WHERE id = NEW.poet_id;
        END IF;
        
        -- 如果是更新操作，也要更新旧诗人的作品数
        IF TG_OP = 'UPDATE' AND OLD.poet_id IS NOT NULL THEN
            UPDATE poets 
            SET works_count = (
                SELECT COUNT(*) FROM poems WHERE poet_id = OLD.poet_id
            )
            WHERE id = OLD.poet_id;
        END IF;
    END IF;
    
    -- 当诗词被删除时，减少诗人的作品数
    IF TG_OP = 'DELETE' AND OLD.poet_id IS NOT NULL THEN
        UPDATE poets 
        SET works_count = (
            SELECT COUNT(*) FROM poems WHERE poet_id = OLD.poet_id
        )
        WHERE id = OLD.poet_id;
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS sync_poet_works_count_trigger ON poems;
CREATE TRIGGER sync_poet_works_count_trigger
    AFTER INSERT OR UPDATE OR DELETE ON poems
    FOR EACH ROW
    EXECUTE FUNCTION sync_poet_works_count();

-- 3. 自动增加用户经验值的函数
CREATE OR REPLACE FUNCTION add_user_experience(
    p_user_id UUID,
    p_experience INTEGER,
    p_action VARCHAR DEFAULT 'unknown'
)
RETURNS void AS $$
DECLARE
    v_new_experience INTEGER;
    v_new_level INTEGER;
BEGIN
    -- 更新经验值
    UPDATE users 
    SET experience = experience + p_experience,
        updated_at = now()
    WHERE id = p_user_id
    RETURNING experience INTO v_new_experience;
    
    -- 计算新等级（每100经验升1级）
    v_new_level := (v_new_experience / 100) + 1;
    
    -- 更新等级
    UPDATE users 
    SET level = v_new_level 
    WHERE id = p_user_id AND level < v_new_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. 记录浏览历史的改进函数（支持重复浏览）
CREATE OR REPLACE FUNCTION record_poem_view(p_poem_id UUID, p_user_id UUID DEFAULT NULL)
RETURNS void AS $$
BEGIN
    -- 增加浏览量
    UPDATE poems SET views = views + 1 WHERE id = p_poem_id;
    
    -- 如果用户已登录，记录浏览历史
    IF p_user_id IS NOT NULL THEN
        INSERT INTO view_history (user_id, poem_id, viewed_at)
        VALUES (p_user_id, p_poem_id, now());
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. 智能点赞函数（防止重复点赞）
CREATE OR REPLACE FUNCTION toggle_like(
    p_user_id UUID,
    p_poem_id UUID DEFAULT NULL,
    p_comment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_existing_id UUID;
    v_is_liked BOOLEAN;
BEGIN
    -- 检查参数
    IF (p_poem_id IS NULL AND p_comment_id IS NULL) OR 
       (p_poem_id IS NOT NULL AND p_comment_id IS NOT NULL) THEN
        RAISE EXCEPTION '必须且只能指定poem_id或comment_id之一';
    END IF;
    
    -- 检查是否已点赞
    IF p_poem_id IS NOT NULL THEN
        SELECT id INTO v_existing_id 
        FROM likes 
        WHERE user_id = p_user_id AND poem_id = p_poem_id;
    ELSE
        SELECT id INTO v_existing_id 
        FROM likes 
        WHERE user_id = p_user_id AND comment_id = p_comment_id;
    END IF;
    
    -- 如果已点赞，则取消点赞
    IF v_existing_id IS NOT NULL THEN
        DELETE FROM likes WHERE id = v_existing_id;
        
        -- 减少点赞数
        IF p_poem_id IS NOT NULL THEN
            UPDATE poems SET likes = GREATEST(likes - 1, 0) WHERE id = p_poem_id;
        ELSE
            UPDATE comments SET likes = GREATEST(likes - 1, 0) WHERE id = p_comment_id;
        END IF;
        
        v_is_liked := false;
    ELSE
        -- 如果未点赞，则添加点赞
        INSERT INTO likes (user_id, poem_id, comment_id)
        VALUES (p_user_id, p_poem_id, p_comment_id);
        
        -- 增加点赞数
        IF p_poem_id IS NOT NULL THEN
            UPDATE poems SET likes = likes + 1 WHERE id = p_poem_id;
        ELSE
            UPDATE comments SET likes = likes + 1 WHERE id = p_comment_id;
        END IF;
        
        v_is_liked := true;
    END IF;
    
    RETURN v_is_liked;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ========================================
-- 第五部分：优化RLS策略
-- ========================================

-- users表策略
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "用户可查看所有公开资料" ON users;
CREATE POLICY "用户可查看所有公开资料" ON users
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "用户只能更新自己的资料" ON users;
CREATE POLICY "用户只能更新自己的资料" ON users
    FOR UPDATE USING (auth.uid() = id);

-- user_creations表策略优化
DROP POLICY IF EXISTS "所有人可查看公开创作" ON user_creations;
CREATE POLICY "所有人可查看公开创作" ON user_creations
    FOR SELECT USING (is_public = true OR auth.uid() = user_id);

DROP POLICY IF EXISTS "用户可创建自己的创作" ON user_creations;
CREATE POLICY "用户可创建自己的创作" ON user_creations
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ========================================
-- 第六部分：创建实用视图
-- ========================================

-- 1. 热门诗词视图（带诗人信息）
CREATE OR REPLACE VIEW v_popular_poems AS
SELECT 
    p.*,
    pt.name as poet_name,
    pt.dynasty as poet_dynasty,
    pt.biography as poet_biography,
    (SELECT COUNT(*) FROM comments WHERE poem_id = p.id) as comment_count,
    (SELECT COUNT(*) FROM user_favorites WHERE poem_id = p.id) as favorite_count
FROM poems p
LEFT JOIN poets pt ON p.poet_id = pt.id
ORDER BY p.likes DESC, p.views DESC;

-- 2. 用户统计视图
CREATE OR REPLACE VIEW v_user_stats AS
SELECT 
    u.id,
    u.username,
    u.level,
    u.experience,
    (SELECT COUNT(*) FROM user_favorites WHERE user_id = u.id) as favorite_count,
    (SELECT COUNT(*) FROM user_creations WHERE user_id = u.id) as creation_count,
    (SELECT COUNT(*) FROM comments WHERE user_id = u.id) as comment_count,
    (SELECT COUNT(DISTINCT check_in_date) FROM study_check_ins WHERE user_id = u.id) as study_days
FROM users u;

-- 3. 诗人统计视图
CREATE OR REPLACE VIEW v_poet_stats AS
SELECT 
    pt.*,
    COALESCE(SUM(p.likes), 0) as total_likes,
    COALESCE(SUM(p.views), 0) as total_views,
    (SELECT COUNT(*) FROM poems WHERE poet_id = pt.id) as actual_works_count
FROM poets pt
LEFT JOIN poems p ON p.poet_id = pt.id
GROUP BY pt.id;

-- ========================================
-- 第七部分：数据迁移辅助
-- ========================================

-- 根据现有的author字段，尝试关联poet_id
UPDATE poems p
SET poet_id = pt.id
FROM poets pt
WHERE p.author = pt.name 
  AND p.poet_id IS NULL;

COMMENT ON TABLE poems IS '诗词主表，存储所有诗词作品';
COMMENT ON TABLE poets IS '诗人信息表';
COMMENT ON TABLE users IS '用户表，包含用户基本信息和成长系统';

-- ========================================
-- 完成
-- ========================================

