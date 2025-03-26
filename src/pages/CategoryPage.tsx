
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ThreadCard from '../components/ThreadCard';
import { ArrowLeft, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useCategories, useThreadsByCategory, useCreateThread } from '@/hooks/use-forum-data';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const CategoryPage = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: threads, isLoading: threadsLoading } = useThreadsByCategory(categoryId || '');
  const createThreadMutation = useCreateThread();
  
  // Find the current category
  const currentCategory = categories?.find(cat => cat.id === categoryId);
  
  const handleCreateThread = () => {
    setIsDialogOpen(true);
  };
  
  const handleSubmitThread = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim() || !categoryId) {
      toast({
        title: "Missing information",
        description: "Please provide both a title and content for your thread.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      await createThreadMutation.mutateAsync({
        title,
        content,
        preview: content.substring(0, 150) + (content.length > 150 ? '...' : ''),
        category_id: categoryId,
      });
      
      setTitle('');
      setContent('');
      setIsDialogOpen(false);
      
      toast({
        title: "Thread created",
        description: "Your thread has been successfully posted.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create thread. Please try again.",
        variant: "destructive"
      });
      console.error(error);
    }
  };

  // If category doesn't exist and we're not still loading
  if (!currentCategory && !categoriesLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Category not found</h1>
            <p className="text-muted-foreground mb-6">
              The category you're looking for doesn't exist.
            </p>
            <Link to="/forum" className="btn-primary inline-flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" /> Return to Forum
            </Link>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-8">
          <Link to="/forum" className="inline-flex items-center text-muted-foreground hover:text-foreground gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Back to Forum
          </Link>
          
          {categoriesLoading ? (
            <div className="mb-6">
              <Skeleton className="h-10 w-1/3 mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ) : (
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2 animate-fade-in">
                  {currentCategory?.name}
                </h1>
                <p className="text-muted-foreground animate-fade-in animate-delay-1">
                  {currentCategory?.description}
                </p>
              </div>
              
              <Button 
                onClick={handleCreateThread}
                className="inline-flex items-center gap-2 animate-fade-in animate-delay-2"
              >
                <Plus className="w-4 h-4" /> New Thread
              </Button>
            </div>
          )}
        </div>
        
        {/* Threads List */}
        <section className="mb-16">
          {threadsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-6 rounded-lg border border-border/50">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
            </div>
          ) : threads && threads.length > 0 ? (
            <div className="space-y-4">
              {threads.map((thread, index) => (
                <div key={thread.id} style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                  <ThreadCard
                    id={thread.id}
                    title={thread.title}
                    preview={thread.preview}
                    votes={thread.votes || 0}
                    replies={thread.comments_count || 0}
                    createdAt={thread.created_at}
                    categoryId={thread.category_id}
                    categoryName={thread.category_name || ''}
                    categoryColor={thread.category_color || ''}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">No threads have been created in this category yet.</p>
              <Button onClick={handleCreateThread}>Start the first conversation</Button>
            </div>
          )}
        </section>
      </main>
      
      {/* New Thread Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Create a new thread</DialogTitle>
            <DialogDescription>
              Share your thoughts, questions, or resources with the community.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmitThread} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts, questions, or resources..."
                className="min-h-[150px]"
                required
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createThreadMutation.isPending || !title.trim() || !content.trim()}
              >
                {createThreadMutation.isPending ? 'Creating...' : 'Post Thread'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CategoryPage;
