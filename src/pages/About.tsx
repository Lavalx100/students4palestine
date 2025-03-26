
import React from 'react';
import Navbar from '../components/Navbar';
import { Shield, Lock, Users, MessageSquare, Fingerprint, History } from 'lucide-react';

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <main className="container max-w-6xl mx-auto px-6 pt-32 pb-20">
        <section className="mb-16">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in">About Students4Palestine</h1>
          <p className="text-lg text-muted-foreground max-w-3xl animate-fade-in animate-delay-1">
            Students4Palestine is a secure, anonymous platform for students worldwide to collaborate, share resources, and organize in solidarity with Palestine.
          </p>
        </section>
        
        {/* Mission Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">Our Mission</h2>
          <div className="bg-card p-8 rounded-2xl border border-border/50 animate-fade-in animate-delay-1">
            <p className="text-lg leading-relaxed">
              Students4Palestine was created to provide a safe, anonymous space for students around the world to engage in meaningful discourse, share educational resources, and organize actions in solidarity with the Palestinian cause.
            </p>
            <p className="text-lg leading-relaxed mt-4">
              We believe in the power of student organizing and the importance of creating platforms that prioritize safety, privacy, and accessibility. Our mission is to foster global student solidarity networks while ensuring that participants can engage without compromising their privacy or safety.
            </p>
          </div>
        </section>
        
        {/* Privacy Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">Privacy & Security Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card p-6 rounded-2xl border border-border/50 animate-fade-in animate-delay-1">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Anonymous Participation</h3>
                  <p className="text-muted-foreground">
                    No real names or identifying information required. Use temporary aliases or persistent pseudonyms.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border/50 animate-fade-in animate-delay-2">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">No Data Collection</h3>
                  <p className="text-muted-foreground">
                    We don't track IP addresses, collect cookies, or store any personally identifiable information.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border/50 animate-fade-in animate-delay-3">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Fingerprint className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">No Fingerprinting</h3>
                  <p className="text-muted-foreground">
                    Our platform is designed to prevent browser fingerprinting and other tracking techniques.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-card p-6 rounded-2xl border border-border/50 animate-fade-in animate-delay-4">
              <div className="flex items-start gap-4">
              <div className="p-3 bg-primary/10 rounded-lg">
  <MessageSquare className="w-6 h-6 text-primary" />
</div>
<div>
  <h3 className="text-xl font-medium mb-2">Censorship Resistance</h3>
  <p className="text-muted-foreground">
  Discussions remain free from institutional interference or takedown pressure.
  </p>
</div>

              </div>
            </div>
          </div>
        </section>
      
        {/* Community Guidelines */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">Community Guidelines</h2>
          <div className="bg-card p-8 rounded-2xl border border-border/50 animate-fade-in animate-delay-1">
            <div className="flex flex-col space-y-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Respectful Discourse</h3>
                  <p className="text-muted-foreground">
                  Engage respectfully with others, even when disagreeing. Focus on ideas and avoid personal attacks.
                  Any form of Islamophobia or antisemitism will be outright deleted and may lead to removal from the forum.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-medium mb-2">Educational Focus</h3>
                  <p className="text-muted-foreground">
                    Prioritize educational content, factual information, and constructive organizing strategies.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Section */}
        <section>
          <h2 className="text-2xl font-bold mb-6 animate-fade-in">Contact</h2>
          <div className="bg-card p-8 rounded-2xl border border-border/50 animate-fade-in animate-delay-1">
            <p className="text-lg leading-relaxed">
              For security reasons, we don't provide traditional contact information. To report issues or provide feedback, please use the anonymous feedback form in the forum.
            </p>
          </div>
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

export default About;
