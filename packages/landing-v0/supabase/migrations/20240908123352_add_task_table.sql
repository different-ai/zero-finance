-- Create enum type for attention power
CREATE TYPE attention_power AS ENUM ('Squirrel', 'Caffeinated', 'Hyperfocus', 'Time Lord');

-- Create tasks table
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id),
  name VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  due_date DATE,
  attention_power attention_power NOT NULL,
  time_estimate INTEGER NOT NULL CHECK (time_estimate BETWEEN 1 AND 480),
  points INTEGER NOT NULL CHECK (points BETWEEN 10 AND 1000),
  group_name VARCHAR(255) NOT NULL,
  parent_task_id UUID REFERENCES tasks(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create links table for task links
CREATE TABLE task_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  url VARCHAR(2048) NOT NULL,
  title VARCHAR(255) NOT NULL
);

-- Add indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_group_name ON tasks(group_name);
CREATE INDEX idx_tasks_parent_task_id ON tasks(parent_task_id);
CREATE INDEX idx_task_links_task_id ON task_links(task_id);

-- Add trigger to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_links ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own tasks" ON tasks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tasks" ON tasks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" ON tasks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" ON tasks
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own task links" ON task_links
  FOR SELECT USING (auth.uid() = (SELECT user_id FROM tasks WHERE id = task_id));

CREATE POLICY "Users can insert their own task links" ON task_links
  FOR INSERT WITH CHECK (auth.uid() = (SELECT user_id FROM tasks WHERE id = task_id));

CREATE POLICY "Users can update their own task links" ON task_links
  FOR UPDATE USING (auth.uid() = (SELECT user_id FROM tasks WHERE id = task_id));

CREATE POLICY "Users can delete their own task links" ON task_links
  FOR DELETE USING (auth.uid() = (SELECT user_id FROM tasks WHERE id = task_id));