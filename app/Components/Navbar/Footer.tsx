'use client';

import Link from 'next/link';
import { useState, FormEvent } from 'react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '/features', description: 'Powerful automation tools' },
    { label: 'Pricing', href: '/pricing', description: 'Simple, transparent pricing' },
    { label: 'Changelog', href: '/changelog', description: 'Latest updates' },
    { label: 'Roadmap', href: '/roadmap', description: "What's coming next" },
  ],
  Resources: [
    { label: 'Documentation', href: '/docs', description: 'Guides & tutorials' },
    { label: 'API Reference', href: '/api', description: 'Developer docs' },
    { label: 'Blog', href: '/blog', description: 'News & insights' },
    { label: 'Support', href: '/support', description: 'Get help 24/7' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy', description: 'How we protect your data' },
    { label: 'Terms of Service', href: '/terms', description: 'Terms & conditions' },
    { label: 'Cookie Policy', href: '/cookies', description: 'Cookie information' },
  ],
};

const SOCIALS = [
  { label: 'Twitter / X', href: 'https://x.com', emoji: '𝕏', color: 'hover:bg-black/10' },
  { label: 'GitHub', href: 'https://github.com', emoji: '⌥', color: 'hover:bg-gray-700/10' },
  { label: 'Discord', href: 'https://discord.com', emoji: '💬', color: 'hover:bg-indigo-500/10' },
  { label: 'LinkedIn', href: 'https://linkedin.com', emoji: '🔗', color: 'hover:bg-blue-600/10' },
];

export default function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState<string>('');

  const handleSubscribe = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle newsletter subscription
    alert(`Subscribed with: ${email}`);
    setEmail('');
  };

  return (
    <footer className="relative w-full bg-background border-t border-border mt-auto">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent pointer-events-none"></div>
      
      <div className="relative">
        {/* Newsletter Section */}
        <div className="border-b border-border">
          <div className="container max-w-6xl mx-auto px-6 py-12">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                <span>📧</span>
                <span>Stay Updated</span>
              </div>
              <h3 className="text-2xl font-bold gradient-text mb-2">
                Get the latest updates
              </h3>
              <p className="text-muted mb-6">
                Join our newsletter for product updates, tips, and exclusive offers.
              </p>
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input
                  type="email"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl bg-card-bg border border-border focus:border-primary transition-all"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container max-w-6xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
            
            {/* Brand Section */}
            <div className="lg:col-span-2 space-y-4">
              <Link href="/" className="inline-flex items-center gap-2 group">
                <div className="relative">
                  <span className="text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 inline-block">
                    🎬
                  </span>
                </div>
                <div>
                  <span className="text-xl font-bold gradient-text">Automato</span>
                  <p className="text-xs text-muted mt-0.5">AI-Powered Automation</p>
                </div>
              </Link>
              <p className="text-muted text-sm leading-relaxed max-w-md">
                Upload once. Auto publish everywhere. Reach every audience with zero extra effort. 
                The future of content distribution is here.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-2 pt-2">
                {SOCIALS.map(({ label, href, emoji, color }) => (
                  <a
                    key={href}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className={`w-10 h-10 rounded-xl bg-card-bg border border-border flex items-center justify-center text-lg transition-all duration-300 ${color} hover:border-primary hover:text-primary hover:scale-110 hover:-translate-y-1`}
                  >
                    {emoji}
                  </a>
                ))}
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-3 pt-4">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-accent/30 border-2 border-background flex items-center justify-center text-xs">
                      👤
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted">
                  Trusted by <span className="text-primary font-semibold">10,000+</span> creators
                </p>
              </div>
            </div>

            {/* Link Columns */}
            {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
              <div key={heading}>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-primary rounded-full"></span>
                  {heading}
                </h3>
                <ul className="space-y-3">
                  {links.map(({ label, href, description }) => (
                    <li key={href}>
                      <Link
                        href={href}
                        className="group block transition-all"
                      >
                        <span className="text-sm text-muted group-hover:text-primary transition-colors">
                          {label}
                        </span>
                        <p className="text-xs text-muted/60 group-hover:text-muted/80 transition-colors">
                          {description}
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-muted text-center md:text-left">
                © {year} Automato, Inc. All rights reserved. Built with <span className="text-red-500">❤️</span> for creators.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 justify-center">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                  </span>
                  <span className="text-xs text-muted">All systems operational</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>🌍</span>
                  <span>99.9% uptime</span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-muted">
                  <span>⚡</span>
                  <span>Powered by AI</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}