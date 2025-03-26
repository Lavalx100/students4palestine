import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase, Category, Thread, Comment, Vote, getSessionId } from '@/lib/supabase';

// Categories
export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*, threads(count)');

      if (error) throw error;

      return data.map((category: any) => ({
        ...category,
        threads_count: category.threads?.[0]?.count || 0
      })) as Category[];
    }
  });
};

// Threads
export const useThreadsByCategory = (categoryId: string) => {
  return useQuery({
    queryKey: ['threads', categoryId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          categories!inner(name, color)
        `)
        .eq('category_id', categoryId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      return data.map(thread => ({
        ...thread,
        category_name: thread.categories.name,
        category_color: thread.categories.color
      })) as Thread[];
    },
    enabled: !!categoryId
  });
};

export const usePopularThreads = (limit = 3) => {
  return useQuery({
    queryKey: ['popularThreads', limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          categories!inner(name, color)
        `)
        .order('votes', { ascending: false })
        .limit(limit);

      if (error) throw error;

      return data.map(thread => ({
        ...thread,
        category_name: thread.categories.name,
        category_color: thread.categories.color
      })) as Thread[];
    }
  });
};

export const useThread = (threadId: string) => {
  return useQuery({
    queryKey: ['thread', threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('threads')
        .select(`
          *,
          categories!inner(name, color)
        `)
        .eq('id', threadId)
        .single();

      if (error) throw error;

      return {
        ...data,
        category_name: data.categories.name,
        category_color: data.categories.color
      } as Thread;
    },
    enabled: !!threadId
  });
};

// Comments
export const useComments = (threadId: string) => {
  return useQuery({
    queryKey: ['comments', threadId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      return data as Comment[];
    },
    enabled: !!threadId
  });
};

// Votes
export const useCheckVote = (threadId?: string, commentId?: string) => {
  const sessionId = getSessionId();

  return useQuery({
    queryKey: ['vote', threadId, commentId, sessionId],
    queryFn: async () => {
      const query = supabase
        .from('votes')
        .select('*')
        .eq('session_id', sessionId);

      if (threadId) {
        query.eq('thread_id', threadId);
      }

      if (commentId) {
        query.eq('comment_id', commentId);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.length > 0;
    },
    enabled: !!(threadId || commentId)
  });
};

// Mutations
export const useCreateThread = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newThread: Omit<Thread, 'id' | 'created_at' | 'category_name' | 'category_color' | 'votes' | 'comments_count'>) => {
      const { data, error } = await supabase
        .from('threads')
        .insert([{
          ...newThread,
          votes: 0,
          session_id: getSessionId()
        }])
        .select();

      if (error) throw error;

      return data[0] as Thread;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['threads', variables.category_id] });
      queryClient.invalidateQueries({ queryKey: ['popularThreads'] });
    }
  });
};

export const useCreateComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newComment: Omit<Comment, 'id' | 'created_at' | 'votes'>) => {
      const { data, error } = await supabase
        .from('comments')
        .insert([{
          ...newComment,
          votes: 0,
          session_id: getSessionId()
        }])
        .select();

      if (error) throw error;

      await supabase.rpc('increment_comments_count', {
        thread_id_param: newComment.thread_id
      });

      return data[0] as Comment;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.thread_id] });
      queryClient.invalidateQueries({ queryKey: ['thread', variables.thread_id] });
    }
  });
};

export const useVoteThread = () => {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async ({ threadId, value }: { threadId: string; value: number }) => {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('thread_id', threadId)
        .eq('session_id', sessionId);

      if (existingVote && existingVote.length > 0) {
        return null;
      }

      const { error: voteError } = await supabase
        .from('votes')
        .insert([{
          thread_id: threadId,
          session_id: sessionId,
        }]);

      if (voteError) throw voteError;

      const { error: updateError } = await supabase.rpc('increment_thread_votes', {
        thread_id_param: threadId,
        vote_value: value
      });

      if (updateError) throw updateError;

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['thread', variables.threadId] });
      queryClient.invalidateQueries({ queryKey: ['popularThreads'] });
      queryClient.invalidateQueries({ queryKey: ['threads'] });
      queryClient.invalidateQueries({ queryKey: ['vote', variables.threadId] });
    }
  });
};

export const useVoteComment = () => {
  const queryClient = useQueryClient();
  const sessionId = getSessionId();

  return useMutation({
    mutationFn: async ({ commentId, threadId, value }: { commentId: string; threadId: string; value: number }) => {
      const { data: existingVote } = await supabase
        .from('votes')
        .select('*')
        .eq('comment_id', commentId)
        .eq('session_id', sessionId);

      if (existingVote && existingVote.length > 0) {
        return null;
      }

      const { error: voteError } = await supabase
        .from('votes')
        .insert([{
          comment_id: commentId,
          session_id: sessionId,
        }]);

      if (voteError) throw voteError;

      const { error: updateError } = await supabase.rpc('increment_comment_votes', {
        comment_id_param: commentId,
        vote_value: value
      });

      if (updateError) throw updateError;

      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.threadId] });
      queryClient.invalidateQueries({ queryKey: ['vote', undefined, variables.commentId] });
    }
  });
};
