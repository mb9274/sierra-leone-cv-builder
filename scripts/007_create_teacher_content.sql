-- Create table for teacher-uploaded course content
CREATE TABLE IF NOT EXISTS teacher_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  teacher_name TEXT NOT NULL,
  teacher_email TEXT NOT NULL,
  course_title TEXT NOT NULL,
  course_description TEXT NOT NULL,
  category TEXT NOT NULL,
  level TEXT NOT NULL DEFAULT 'Beginner',
  duration TEXT NOT NULL,
  thumbnail_url TEXT,
  lessons JSONB NOT NULL DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, rejected
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  approved_by UUID REFERENCES auth.users(id),
  approved_at TIMESTAMPTZ
);

-- Create table for individual lesson videos
CREATE TABLE IF NOT EXISTS teacher_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES teacher_content(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  video_url TEXT NOT NULL,
  video_title TEXT,
  duration TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  resources JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE teacher_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE teacher_lessons ENABLE ROW LEVEL SECURITY;

-- Teachers can insert their own content
CREATE POLICY "Teachers can create content" ON teacher_content
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = teacher_id);

-- Teachers can view their own content
CREATE POLICY "Teachers can view own content" ON teacher_content
  FOR SELECT TO authenticated
  USING (auth.uid() = teacher_id);

-- Teachers can update their own pending content
CREATE POLICY "Teachers can update own pending content" ON teacher_content
  FOR UPDATE TO authenticated
  USING (auth.uid() = teacher_id AND status = 'pending');

-- Admins can view all content (you'll need to add is_admin column to profiles)
CREATE POLICY "Admins can view all content" ON teacher_content
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Admins can update any content
CREATE POLICY "Admins can update content" ON teacher_content
  FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  ));

-- Everyone can view approved content
CREATE POLICY "Anyone can view approved content" ON teacher_content
  FOR SELECT TO public
  USING (status = 'approved');

-- Lesson policies
CREATE POLICY "Anyone can view lessons of approved courses" ON teacher_lessons
  FOR SELECT TO public
  USING (EXISTS (
    SELECT 1 FROM teacher_content
    WHERE teacher_content.id = teacher_lessons.course_id
    AND teacher_content.status = 'approved'
  ));

CREATE POLICY "Teachers can manage own lessons" ON teacher_lessons
  FOR ALL TO authenticated
  USING (EXISTS (
    SELECT 1 FROM teacher_content
    WHERE teacher_content.id = teacher_lessons.course_id
    AND teacher_content.teacher_id = auth.uid()
  ));

-- Create indexes for performance
CREATE INDEX idx_teacher_content_teacher_id ON teacher_content(teacher_id);
CREATE INDEX idx_teacher_content_status ON teacher_content(status);
CREATE INDEX idx_teacher_content_category ON teacher_content(category);
CREATE INDEX idx_teacher_lessons_course_id ON teacher_lessons(course_id);
CREATE INDEX idx_teacher_lessons_order ON teacher_lessons(course_id, order_index);

-- Add role column to profiles if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user';
