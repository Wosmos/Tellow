-- Users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  first_last TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  about TEXT DEFAULT '',
  profile_picture TEXT DEFAULT '',
  sign_up_date TIMESTAMPTZ DEFAULT now()
);

-- Push tokens
CREATE TABLE push_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  token TEXT NOT NULL,
  UNIQUE(user_id, token)
);

-- Chats table
CREATE TABLE chats (
  chat_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  is_group_chat BOOLEAN DEFAULT false,
  chat_name TEXT DEFAULT '',
  chat_image TEXT DEFAULT '',
  created_by UUID REFERENCES users(user_id),
  updated_by UUID REFERENCES users(user_id),
  latest_message_text TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Chat participants (replaces userChats)
CREATE TABLE chat_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(chat_id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  UNIQUE(chat_id, user_id)
);

-- Messages
CREATE TABLE messages (
  message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id UUID REFERENCES chats(chat_id) ON DELETE CASCADE,
  sent_by UUID REFERENCES users(user_id),
  text TEXT NOT NULL DEFAULT '',
  image_url TEXT DEFAULT '',
  reply_to UUID REFERENCES messages(message_id),
  type TEXT DEFAULT 'text',
  sent_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ
);

-- Message seen status
CREATE TABLE message_seen (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID REFERENCES messages(message_id) ON DELETE CASCADE,
  seen_by UUID REFERENCES users(user_id),
  seen_at TIMESTAMPTZ DEFAULT now()
);

-- User statuses (stories)
CREATE TABLE user_statuses (
  status_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Status views
CREATE TABLE status_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  status_id UUID REFERENCES user_statuses(status_id) ON DELETE CASCADE,
  viewer_id UUID REFERENCES users(user_id),
  viewed_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE push_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_seen ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_statuses ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_views ENABLE ROW LEVEL SECURITY;

-- Policies (permissive for now, tighten later)
CREATE POLICY "Allow all for authenticated users" ON users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON push_tokens FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON chats FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON chat_users FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON messages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON message_seen FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON user_statuses FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all for authenticated users" ON status_views FOR ALL USING (true) WITH CHECK (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE chats;
ALTER PUBLICATION supabase_realtime ADD TABLE chat_users;
ALTER PUBLICATION supabase_realtime ADD TABLE messages;
ALTER PUBLICATION supabase_realtime ADD TABLE message_seen;
ALTER PUBLICATION supabase_realtime ADD TABLE user_statuses;
ALTER PUBLICATION supabase_realtime ADD TABLE status_views;

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('images', 'images', true);

-- Storage policy - allow authenticated users to upload
CREATE POLICY "Allow authenticated uploads" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'images');
CREATE POLICY "Allow public reads" ON storage.objects FOR SELECT USING (bucket_id = 'images');
