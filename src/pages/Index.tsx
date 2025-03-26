
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, ShieldCheck, UserCircle2, BookOpen } from 'lucide-react';
import Navbar from '../components/Navbar';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 md:pt-40 md:pb-32 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="flex flex-col items-center text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in">
              A Safe Space for Student <span className="text-palestine-green">Solidarity</span> with <span className="text-palestine-red">Palestine</span>
            </h1>
            
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl animate-fade-in animate-delay-1">
              Students4Palestine is a secure, anonymous platform for global students to discuss, collaborate, and share educational resources in solidarity with the Palestinian cause.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-fade-in animate-delay-2">
              <Link to="/forum" className="btn-primary">
                Join the Discussion
              </Link>
              <Link to="/about" className="btn-secondary">
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 animate-fade-in">
            Our Core Principles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Privacy Feature */}
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm animate-fade-in animate-delay-1">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <ShieldCheck className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Privacy & Anonymity</h3>
              <p className="text-muted-foreground">
                No personal information required. Participate anonymously with temporary or persistent aliases.
              </p>
            </div>
            
            {/* Discussion Feature */}
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm animate-fade-in animate-delay-2">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <MessageSquare className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Open Discussion</h3>
              <p className="text-muted-foreground">
                Engage in meaningful conversations about news, organizing, resources, and events.
              </p>
            </div>
            
            {/* Community Feature */}
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm animate-fade-in animate-delay-3">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <UserCircle2 className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Student Community</h3>
              <p className="text-muted-foreground">
                Connect with students globally to share experiences and build solidarity networks.
              </p>
            </div>
            
            {/* Education Feature */}
            <div className="flex flex-col items-center text-center p-6 bg-card rounded-2xl shadow-sm animate-fade-in animate-delay-4">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <BookOpen className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-xl font-medium mb-2">Educational Resources</h3>
              <p className="text-muted-foreground">
                Access and share academic papers, guides, flyers and educational content.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="container max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-palestine-green/10 to-palestine-red/10 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in">
              Join the conversation today
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-in animate-delay-1">
              Contribute to meaningful discussions and connect with other students supporting Palestine.
            </p>
            <Link to="/forum" className="btn-primary inline-block animate-fade-in animate-delay-2">
              Enter the Forum
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-secondary/50 py-12 mt-auto">
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

export default Index;
