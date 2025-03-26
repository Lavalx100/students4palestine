import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { ArrowLeft, ArrowUpCircle, MessageSquare, Send } from 'lucide-react';
import { AvatarGenerator } from '../components/AvatarGenerator';
import { useToast } from '@/hooks/use-toast';
import {
  useThread,
  useComments,
  useVoteThread,
  useVoteComment,
  useCheckVote,
  useCreateComment
} from '@/hooks/use-forum-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// For clickable links within text
import linkifyHtml from 'linkify-html';

/* 
  1) Helper to extract unique URLs from text
*/
function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches)); // ensure uniqueness
}

/*
  2) Our Edge Function endpoint:
  Replace <PROJECT> with your actual Supabase project ID/subdomain
*/
const EDGE_FUNCTION_URL = 'https://vkfycoubfwywrzwgabld.supabase.co/functions/v1/link-preview';

interface PreviewData {
  url: string;
  title?: string | null;
  description?: string | null;
  images?: string[];
}

const LinkPreview = ({ url }: { url: string }) => {
  const [previewData, setPreviewData] = useState<PreviewData | null>(null);

  useEffect(() => {
    const fetchPreview = async () => {
      try {
        const res = await fetch(EDGE_FUNCTION_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url })
        });
        if (!res.ok) {
          console.error('Edge function error:', await res.text());
          return;
        }
        const data = await res.json();
        setPreviewData(data);
      } catch (error) {
        console.error('Failed to fetch link preview', error);
      }
    };

    fetchPreview();
  }, [url]);

  if (!previewData) return null;

  const { title, description, images } = previewData;
  const image = images?.[0];

  return (
    <a
      href={previewData.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-border/50 rounded-lg p-4 hover:bg-muted transition space-y-2"
    >
      {image && (
        <img
          src={image}
          alt="Preview"
          className="w-full h-48 object-cover rounded-md mb-2"
        />
      )}
      <h3 className="text-lg font-semibold">{title || url}</h3>
      {description && (
        <p className="text-muted-foreground text-sm">{description}</p>
      )}
    </a>
  );
};

/*
  3) Single Comment
  (No changes except that it's all in one file now)
*/
const Comment = ({
  id,
  content,
  createdAt,
  votes,
  threadId
}: {
  id: string;
  content: string;
  createdAt: string;
  votes: number;
  threadId: string;
}) => {
  const { toast } = useToast();
  const voteComment = useVoteComment();
  const { data: hasVoted, isLoading: checkingVote } = useCheckVote(
    undefined,
    id
  );

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' at ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const handleUpvote = async () => {
    try {
      const result = await voteComment.mutateAsync({
        commentId: id,
        threadId: threadId,
        value: 1
      });

      if (result === null) {
        toast({
          title: 'Already voted',
          description: "You've already upvoted this comment."
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upvote. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
    }
  };

  return (
    <div className="p-6 border border-border/50 rounded-lg">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center space-y-2">
          <button
            className={cn(
              'transition-colors',
              hasVoted ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            )}
            onClick={handleUpvote}
            disabled={checkingVote || hasVoted}
          >
            <ArrowUpCircle className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">{votes}</span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <AvatarGenerator size={24} />
            <span className="text-sm font-medium">Anonymous</span>
            <span className="text-xs text-muted-foreground">
              • {formatDate(createdAt)}
            </span>
          </div>

          <p className="text-foreground whitespace-pre-line">{content}</p>
        </div>
      </div>
    </div>
  );
};

/*
  4) Main ThreadPage
*/
const ThreadPage = () => {
  const { categoryId, threadId } = useParams<{
    categoryId: string;
    threadId: string;
  }>();
  const [commentText, setCommentText] = useState('');
  const { toast } = useToast();
  const navigate = useNavigate();

  // Query the thread data
  const {
    data: thread,
    isLoading: threadLoading,
    isError: threadError
  } = useThread(threadId || '');

  // Query comments for this thread
  const { data: comments, isLoading: commentsLoading } = useComments(
    threadId || ''
  );

  // Vote / check vote
  const voteThread = useVoteThread();
  const { data: hasVoted, isLoading: checkingVote } = useCheckVote(threadId);

  // Create comment
  const createComment = useCreateComment();

  // Helper to format date strings
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      ' at ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  const handleUpvote = async () => {
    if (!threadId) return;

    try {
      const result = await voteThread.mutateAsync({ threadId, value: 1 });
      if (result === null) {
        toast({
          title: 'Already voted',
          description: "You've already upvoted this thread."
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to upvote. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim() || !threadId) {
      toast({
        title: 'Empty comment',
        description: 'Please enter some text before posting.',
        variant: 'destructive'
      });
      return;
    }

    try {
      await createComment.mutateAsync({
        content: commentText,
        thread_id: threadId
      });

      setCommentText('');
      toast({
        title: 'Comment posted',
        description: 'Your comment has been added to the discussion.'
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        variant: 'destructive'
      });
      console.error(error);
    }
  };

  // Show skeleton if thread is loading
  if (threadLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
          <Link
            to={`/forum/${categoryId}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Category
          </Link>

          <div className="mb-8">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-40 w-full mb-4" />
          </div>

          <section className="mb-8">
            <h2 className="text-xl font-bold mb-6">Comments</h2>
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
          </section>
        </main>
      </div>
    );
  }

  // If thread doesn't exist
  if (threadError || !thread) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Thread not found</h1>
            <p className="text-muted-foreground mb-6">
              The thread you're looking for doesn't exist.
            </p>
            <Link
              to={categoryId ? `/forum/${categoryId}` : '/forum'}
              className="btn-primary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {categoryId ? 'Return to Category' : 'Return to Forum'}
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // Main display
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8">
          <Link
            to={`/forum/${categoryId}`}
            className="inline-flex items-center text-muted-foreground hover:text-foreground gap-2 mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Back to {thread.category_name}
          </Link>

          {/* Thread header */}
          <div className="mb-8 animate-fade-in">
            <div
              className="inline-block category-pill text-xs mb-2"
              style={{
                backgroundColor: `${thread.category_color}20`,
                color: thread.category_color
              }}
            >
              {thread.category_name}
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {thread.title}
            </h1>
            <div className="flex items-center gap-3 mb-4">
              <AvatarGenerator size={28} />
              <span className="text-sm font-medium">Anonymous</span>
              <span className="text-xs text-muted-foreground">
                • {formatDate(thread.created_at)}
              </span>
            </div>

            {/* Thread content (linkify + previews) */}
            <div className="p-6 bg-card/50 rounded-lg border border-border/50 space-y-4">
              <div
                className="whitespace-pre-line"
                dangerouslySetInnerHTML={{
                  __html: linkifyHtml(thread.content, {
                    target: '_blank',
                    rel: 'noopener noreferrer'
                  })
                }}
              />

              {/* Show a preview box for each unique URL */}
              {extractUrls(thread.content).map((url) => (
                <LinkPreview key={url} url={url} />
              ))}
            </div>

            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    'p-0 h-auto',
                    hasVoted
                      ? 'text-primary'
                      : 'text-muted-foreground hover:text-primary'
                  )}
                  onClick={handleUpvote}
                  disabled={checkingVote || hasVoted}
                >
                  <ArrowUpCircle className="w-5 h-5" />
                </Button>
                <span className="text-sm font-medium">{thread.votes}</span>
              </div>

              <div className="flex items-center gap-1 text-muted-foreground">
                <MessageSquare className="w-4 h-4" />
                <span className="text-sm">
                  {comments?.length || 0} replies
                </span>
              </div>
            </div>
          </div>

          {/* Comments section */}
          <section className="mb-8 animate-fade-in animate-delay-1">
            <h2 className="text-xl font-bold mb-6">
              Comments ({comments?.length || 0})
            </h2>

            {commentsLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-32 w-full" />
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <Comment
                    key={comment.id}
                    id={comment.id}
                    content={comment.content}
                    createdAt={comment.created_at}
                    votes={comment.votes || 0}
                    threadId={threadId || ''}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <p>No comments yet. Be the first to join the discussion!</p>
              </div>
            )}
          </section>

          {/* Comment form */}
          <section className="animate-fade-in animate-delay-2">
            <h2 className="text-xl font-bold mb-6">Join the discussion</h2>
            <form onSubmit={handleSubmitComment} className="space-y-4">
              <div>
                <textarea
                  className="w-full p-4 border border-border rounded-lg bg-card min-h-32 focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Share your thoughts..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="inline-flex items-center gap-2"
                  disabled={!commentText.trim() || createComment.isPending}
                >
                  <Send className="w-4 h-4" />
                  {createComment.isPending ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </form>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ThreadPage;
