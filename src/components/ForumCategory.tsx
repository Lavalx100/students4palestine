import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageSquare } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

export interface CategoryProps {
  id: string;
  name: string;
  description: string;
  threads: number;
  color: string;
  iconName: string;
}

const ForumCategory: React.FC<CategoryProps> = ({
  id,
  name,
  description,
  threads,
  color,
  iconName
}) => {
  // Normalize iconName (optional: capitalize first letter if needed)
  const formattedIconName =
    iconName.charAt(0).toUpperCase() + iconName.slice(1);

  // Dynamically get the icon component or fallback to MessageSquare
  const IconComponent =
    (LucideIcons as Record<string, React.FC<{ className?: string }>>)[formattedIconName] ||
    MessageSquare;

  return (
    <Link 
      to={`/forum/${id}`}
      className="forum-card flex flex-col md:flex-row items-start md:items-center gap-4 animate-scale-in"
    >
      <div 
        className="p-3 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}20` }}
      >
        <div style={{ color }}>
          <IconComponent className="w-6 h-6" />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-medium">{name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
      </div>
      
      <div className="flex w-full md:w-auto justify-between items-center mt-2 md:mt-0">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium">{threads}</span> threads
        </div>
        <ChevronRight className="w-4 h-4 text-muted-foreground" />
      </div>
    </Link>
  );
};

export default ForumCategory;
