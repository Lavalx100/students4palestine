
import React, { useState, useEffect } from 'react';

interface AvatarGeneratorProps {
  size?: number;
  className?: string;
}

// Shape type for the avatar
type Shape = 'circle' | 'square' | 'triangle' | 'diamond';

// Function to generate a deterministic hash from a string
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate a deterministic color from a hash
const generateColor = (hash: number, isBackground = false): string => {
  const hue = hash % 360;
  // For backgrounds, use more muted colors
  const saturation = isBackground ? 40 + (hash % 20) : 70 + (hash % 30);
  const lightness = isBackground ? 90 + (hash % 10) : 50 + (hash % 20);
  
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

// Generate a random shape
const getShape = (hash: number): Shape => {
  const shapes: Shape[] = ['circle', 'square', 'triangle', 'diamond'];
  return shapes[hash % shapes.length];
};

export const AvatarGenerator: React.FC<AvatarGeneratorProps> = ({ 
  size = 40, 
  className = '' 
}) => {
  const [sessionId, setSessionId] = useState<string>('');
  
  useEffect(() => {
    // Check if we already have a session ID in localStorage
    let id = localStorage.getItem('anonymous_session_id');
    
    // If not, create a new random ID
    if (!id) {
      id = Math.random().toString(36).substring(2, 15);
      localStorage.setItem('anonymous_session_id', id);
    }
    
    setSessionId(id);
  }, []);
  
  // Generate avatar characteristics based on the session ID
  const hash = hashString(sessionId);
  const backgroundColor = generateColor(hash, true);
  const shapeColor = generateColor(hash + 1);
  const shape = getShape(hash);
  
  // Render the appropriate shape SVG
  const renderShape = () => {
    const halfSize = size / 2;
    
    switch (shape) {
      case 'circle':
        return (
          <circle 
            cx={halfSize} 
            cy={halfSize} 
            r={halfSize * 0.6} 
            fill={shapeColor} 
          />
        );
      case 'square':
        const squareSize = size * 0.7;
        const offset = (size - squareSize) / 2;
        return (
          <rect 
            x={offset} 
            y={offset} 
            width={squareSize} 
            height={squareSize} 
            fill={shapeColor} 
          />
        );
      case 'triangle':
        return (
          <polygon 
            points={`${halfSize},${size * 0.2} ${size * 0.2},${size * 0.8} ${size * 0.8},${size * 0.8}`} 
            fill={shapeColor} 
          />
        );
      case 'diamond':
        return (
          <polygon 
            points={`${halfSize},${size * 0.2} ${size * 0.8},${halfSize} ${halfSize},${size * 0.8} ${size * 0.2},${halfSize}`}
            fill={shapeColor} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div 
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ width: size, height: size }}
    >
      <svg 
        width={size} 
        height={size} 
        viewBox={`0 0 ${size} ${size}`} 
        style={{ backgroundColor }}
      >
        {renderShape()}
      </svg>
    </div>
  );
};
