
import { createClient } from '@supabase/supabase-js';

// Using the provided Supabase URL and key
const supabaseUrl = 'https://vkfycoubfwywrzwgabld.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrZnljb3ViZnd5d3J6d2dhYmxkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI4Mzg5MjAsImV4cCI6MjA1ODQxNDkyMH0.auqnoy6g9mmSmS-JOlTaDtCSTw9opHmdXr_lAv_P87k';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
  icon_name: string;
  threads_count?: number;
  created_at?: string;
}

export interface Thread {
  id: string;
  title: string;
  content: string;
  preview: string;
  votes?: number;
  comments_count?: number;
  category_id: string;
  category_name?: string;
  category_color?: string;
  created_at: string;
}

export interface Comment {
  id: string;
  content: string;
  thread_id: string;
  votes?: number;
  created_at: string;
}

export interface Vote {
  id?: string;
  thread_id?: string;
  comment_id?: string;
  session_id: string;
  created_at?: string;
}

// Helper function to generate a session ID for anonymous users
import { v4 as uuidv4 } from 'uuid';

export const getSessionId = () => {
  let sessionId = localStorage.getItem('session_id');
  if (!sessionId) {
    sessionId = uuidv4(); // ✅ fallback for older devices
    localStorage.setItem('session_id', sessionId);
  }
  return sessionId;
};

