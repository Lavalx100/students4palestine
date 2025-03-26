import React, { useEffect, useState } from 'react';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

// Use an environment variable (VITE_ADMIN_KEY) to hide your key.
// Note: This value will still be exposed in the client bundle.
const SECRET_ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || '';

const Admin = () => {
  const [hasAccess, setHasAccess] = useState(false);
  const [enteredKey, setEnteredKey] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Admin panel data
  const [threads, setThreads] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);

  // On mount, check localStorage to see if the user is already authenticated
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAccess');
    if (isAuthenticated === 'true') {
      setHasAccess(true);
      fetchData();
    }
  }, []);

  // Fetch threads and comments from Supabase
  const fetchData = async () => {
    try {
      const { data: threadsData, error: threadError } = await supabaseAdmin
        .from('threads')
        .select('*')
        .order('created_at', { ascending: false });

      const { data: commentsData, error: commentError } = await supabaseAdmin
        .from('comments')
        .select('*')
        .order('created_at', { ascending: false });

      if (threadError || commentError) {
        const errMsg = (threadError || commentError)?.message ?? 'Error fetching data.';
        setError(errMsg);
        console.error(errMsg);
      } else {
        setThreads(threadsData || []);
        setComments(commentsData || []);
      }
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : 'Unknown error';
      setError(errMsg);
      console.error(errMsg);
    }
  };

  // Handle key submission
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredKey === SECRET_ADMIN_KEY) {
      // Store a flag in localStorage so the user stays logged in on refresh
      localStorage.setItem('adminAccess', 'true');
      setHasAccess(true);
      fetchData();
    } else {
      setError('Invalid key. Please try again.');
    }
  };

  // Delete thread (and cascade delete comments)
  const deleteThread = async (id: string) => {
    const { error } = await supabaseAdmin.rpc('delete_thread_cascade', {
      _thread_id: id,
    });
    if (error) {
      console.error('Failed to delete thread:', error);
      setError('Failed to delete thread.');
    } else {
      fetchData();
    }
  };

  // Update thread's comments_count field
  const updateThreadCount = async (threadId: string) => {
    const { data: threadData, error: fetchError } = await supabaseAdmin
      .from('threads')
      .select('comments_count')
      .eq('id', threadId)
      .single();

    if (fetchError || !threadData) {
      console.error('Failed to fetch thread:', fetchError);
      return;
    }

    const currentCount = threadData.comments_count || 0;
    const newCount = currentCount - 1;

    const { error: updateError } = await supabaseAdmin
      .from('threads')
      .update({ comments_count: newCount })
      .eq('id', threadId);

    if (updateError) {
      console.error('Failed to update thread comments count:', updateError);
    }
  };

  // Delete comment and update the parent thread's comments_count
  const deleteComment = async (id: string, threadId: string) => {
    const { error } = await supabaseAdmin.rpc('delete_comment_cascade', {
      _comment_id: id,
    });
    if (error) {
      console.error('Failed to delete comment:', error);
      setError('Failed to delete comment.');
    } else {
      await updateThreadCount(threadId);
      fetchData();
    }
  };

  // If user doesn't have access, show the key prompt
  if (!hasAccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-8">
        <form onSubmit={handleLogin} className="max-w-md w-full bg-white p-8 rounded shadow">
          <h1 className="text-3xl font-bold mb-6 text-center">Enter Admin Key</h1>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          <div className="mb-4">
            <label htmlFor="admin-key" className="block font-semibold mb-1">
              Admin Key
            </label>
            <input
              id="admin-key"
              type="password"
              className="border border-gray-300 rounded w-full px-3 py-2"
              value={enteredKey}
              onChange={(e) => setEnteredKey(e.target.value)}
              placeholder="Enter your secret key"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full mt-4 px-4 py-2 font-semibold rounded bg-black text-white hover:bg-opacity-80"
          >
            Submit
          </button>
        </form>
      </div>
    );
  }

  // If user has access, show the admin panel
  return (
    <div className="min-h-screen px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Latest Threads</h2>
        {threads.length > 0 ? (
          threads.map((thread) => (
            <div key={thread.id} className="border p-4 rounded mb-2">
              <h3 className="font-bold text-lg">{thread.title}</h3>
              <p className="text-sm text-muted-foreground">{thread.preview}</p>
              <p className="text-xs text-muted-foreground">{thread.created_at}</p>
              <p className="text-xs text-muted-foreground">
                Comments Count: {thread.comments_count}
              </p>
              <button
                onClick={() => deleteThread(thread.id)}
                className="mt-2 text-red-500 underline text-sm"
              >
                Delete Thread
              </button>
            </div>
          ))
        ) : (
          <p>No threads found.</p>
        )}
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Latest Comments</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className="border p-4 rounded mb-2">
              <p>{comment.content}</p>
              <p className="text-xs text-muted-foreground">{comment.created_at}</p>
              <button
                onClick={() => deleteComment(comment.id, comment.thread_id)}
                className="mt-2 text-red-500 underline text-sm"
              >
                Delete Comment
              </button>
            </div>
          ))
        ) : (
          <p>No comments found.</p>
        )}
      </section>
    </div>
  );
};

export default Admin;
