
import React from 'react';
import Navbar from '../components/Navbar';
import ForumCategory from '../components/ForumCategory';
import ThreadCard from '../components/ThreadCard';
import { Search } from 'lucide-react';
import { useCategories, usePopularThreads } from '@/hooks/use-forum-data';
import { Skeleton } from '@/components/ui/skeleton';

const Forum = () => {
  const { data: categories, isLoading: categoriesLoading } = useCategories();
  const { data: popularThreads, isLoading: threadsLoading } = usePopularThreads(3);
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">Student Forum</h1>
          <p className="text-muted-foreground animate-fade-in animate-delay-1">
            Welcome to the anonymous forum for student discussions, resources, and organizing in solidarity with Palestine.
          </p>
          
          <div className="relative mt-6 w-full max-w-lg animate-fade-in animate-delay-2">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search forum..." 
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">Categories</h2>
          
          {categoriesLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-6 rounded-lg border border-border/50">
                  <Skeleton className="h-10 w-1/3 mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories?.map((category, index) => (
                <div key={category.id} style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                  <ForumCategory 
                    id={category.id}
                    name={category.name}
                    description={category.description}
                    threads={(category.threads?.[0]?.count as number) || 0}
                    color={category.color}
                    iconName={category.icon_name}
                  />
                </div>
              ))}
            </div>
          )}
        </section>
        
        {/* Popular Threads */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">Popular Discussions</h2>
          
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
          ) : (
            <div className="space-y-4">
              {popularThreads?.map((thread, index) => (
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
          )}
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-12">
        <div className="container max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <span className="text-xl font-bold">
                <span className="text-palestine-green">Students</span>
                <span className="text-palestine-red">4</span>
                <span>Palestine</span>
              </span>
            </div>
            
            <div className="text-center md:text-right text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Students4Palestine. All rights reserved.</p>
              <p className="mt-1">This platform is completely anonymous and privacy-focused.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Forum;
