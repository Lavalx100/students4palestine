
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  color TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create threads table
CREATE TABLE IF NOT EXISTS threads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  preview TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  category_id TEXT NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content TEXT NOT NULL,
  votes INTEGER DEFAULT 0,
  thread_id UUID NOT NULL REFERENCES threads(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table to track anonymous votes
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  thread_id UUID REFERENCES threads(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  -- Ensure a vote is either for a thread or a comment, not both
  CHECK ((thread_id IS NULL) != (comment_id IS NULL)),
  -- Ensure a user can only vote once for each thread or comment
  UNIQUE (thread_id, session_id),
  UNIQUE (comment_id, session_id)
);

-- Create function to increment votes count for threads
CREATE OR REPLACE FUNCTION increment_thread_votes(thread_id_param UUID, vote_value INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE threads
  SET votes = votes + vote_value
  WHERE id = thread_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment votes count for comments
CREATE OR REPLACE FUNCTION increment_comment_votes(comment_id_param UUID, vote_value INTEGER)
RETURNS VOID AS $$
BEGIN
  UPDATE comments
  SET votes = votes + vote_value
  WHERE id = comment_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to increment comments count for threads
CREATE OR REPLACE FUNCTION increment_comments_count(thread_id_param UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE threads
  SET comments_count = comments_count + 1
  WHERE id = thread_id_param;
END;
$$ LANGUAGE plpgsql;

-- Insert initial category data
INSERT INTO categories (id, name, description, color, icon_name)
VALUES
  ('news', 'News & Updates', 'Latest news, articles, and updates about Palestine and related events', '#3B82F6', 'Newspaper'),
  ('organizing', 'Organizing & Action', 'Coordinate actions, protests, and solidarity events on your campus', '#10B981', 'UsersRound'),
  ('resources', 'Educational Resources', 'Share books, articles, videos, and other educational materials', '#6366F1', 'BookOpen'),
  ('support', 'Mental Health & Support', 'Discussion space for emotional support and mental health resources', '#EC4899', 'HeartHandshake'),
  ('events', 'Events Calendar', 'Upcoming events, webinars, talks, and important dates', '#F59E0B', 'Calendar'),
  ('general', 'General Discussion', 'Open forum for general topics related to Palestine solidarity', '#8B5CF6', 'MessageSquare')
ON CONFLICT (id) DO NOTHING;

-- Create Public Policies for Anonymous Access

-- Allow public read access to categories
CREATE POLICY "Public can view categories" ON categories
  FOR SELECT USING (true);

-- Allow public read access to threads
CREATE POLICY "Public can view threads" ON threads
  FOR SELECT USING (true);

-- Allow public read access to comments
CREATE POLICY "Public can view comments" ON comments
  FOR SELECT USING (true);

-- Allow public to create threads
CREATE POLICY "Public can create threads" ON threads
  FOR INSERT WITH CHECK (true);

-- Allow public to create comments
CREATE POLICY "Public can create comments" ON comments
  FOR INSERT WITH CHECK (true);

-- Allow public to create votes
CREATE POLICY "Public can create votes" ON votes
  FOR INSERT WITH CHECK (true);
  
-- Allow public to view votes for checking
CREATE POLICY "Public can view votes" ON votes
  FOR SELECT USING (true);

-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
