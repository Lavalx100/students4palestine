
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ArrowUpCircle } from 'lucide-react';
import { AvatarGenerator } from './AvatarGenerator';
import { useVoteThread, useCheckVote } from '@/hooks/use-forum-data';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

export interface ThreadProps {
  id: string;
  title: string;
  preview: string;
  votes: number;
  replies: number;
  createdAt: string;
  categoryId: string;
  categoryName: string;
  categoryColor: string;
}

const ThreadCard: React.FC<ThreadProps> = ({
  id,
  title,
  preview,
  votes,
  replies,
  createdAt,
  categoryId,
  categoryName,
  categoryColor
}) => {
  const { toast } = useToast();
  const voteThread = useVoteThread();
  const { data: hasVoted, isLoading: checkingVote } = useCheckVote(id);
  
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Return time if today
      return `Today, ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    try {
      const result = await voteThread.mutateAsync({ threadId: id, value: 1 });
      
      if (result === null) {
        toast({
          title: "Already voted",
          description: "You've already upvoted this thread.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upvote. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  };
  
  return (
    <Link 
      to={`/forum/${categoryId}/${id}`}
      className="forum-card hover:bg-card/60 animate-scale-in"
    >
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center space-y-2">
          <button 
            className={cn(
              "transition-colors",
              hasVoted 
                ? "text-primary" 
                : "text-muted-foreground hover:text-primary"
            )}
            onClick={handleUpvote}
            aria-label="Upvote thread"
            disabled={checkingVote || hasVoted}
          >
            <ArrowUpCircle className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium">{votes}</span>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <div 
              className="category-pill text-xs"
              style={{ 
                backgroundColor: `${categoryColor}20`,
                color: categoryColor
              }}
            >
              {categoryName}
            </div>
            <span className="text-xs text-muted-foreground">
              {formatDate(createdAt)}
            </span>
          </div>
          
          <h3 className="text-lg font-medium line-clamp-2">{title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {preview}
          </p>
          
          <div className="flex items-center gap-4 mt-4">
            <div className="flex items-center gap-2">
              <AvatarGenerator size={24} />
              <span className="text-xs text-muted-foreground">Anonymous</span>
            </div>
            
            <div className="flex items-center gap-1 text-muted-foreground">
              <MessageSquare className="w-4 h-4" />
              <span className="text-xs">{replies}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ThreadCard;
