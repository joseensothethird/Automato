'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { label: 'Dashboard', href: '/', icon: '📊' },
  { label: 'Uploads', href: '/uploads', icon: '⬆️' },
  { label: 'Analytics', href: '/analytics', icon: '📈' },
  { label: 'Settings', href: '/settings', icon: '⚙️' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled 
          ? 'bg-background/95 backdrop-blur-xl border-b border-border shadow-lg' 
          : 'bg-background/80 backdrop-blur-md border-b border-border'
      }`}>
        <div className="container max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2 group relative"
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 to-accent/20 rounded-full blur-lg group-hover:blur-xl transition-all opacity-0 group-hover:opacity-100"></div>
              <div className="relative text-3xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-12">
                🎬
              </div>
              <div className="relative">
                <span className="text-xl lg:text-2xl font-bold gradient-text">
                  Automato
                </span>
                <span className="absolute -top-1 -right-6 text-[10px] font-mono bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">
                  Beta
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 lg:gap-2">
              {NAV_LINKS.map(({ label, href, icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    className={`relative px-4 lg:px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      isActive 
                        ? 'text-foreground bg-primary/10' 
                        : 'text-muted hover:text-foreground hover:bg-card-bg'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <span className="text-base">{icon}</span>
                      <span>{label}</span>
                    </span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Desktop Right Actions */}
            <div className="hidden md:flex items-center gap-3">
              {/* Search */}
              <button className="relative w-9 h-9 rounded-xl text-muted hover:text-foreground hover:bg-card-bg transition-all group">
                🔍
                <span className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/10 transition-all"></span>
              </button>

              {/* Notifications */}
              <button className="relative w-9 h-9 rounded-xl text-muted hover:text-foreground hover:bg-card-bg transition-all group">
                🔔
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-red-500 ring-2 ring-background animate-pulse" />
                <span className="absolute inset-0 rounded-xl bg-primary/0 group-hover:bg-primary/10 transition-all"></span>
              </button>

              {/* Profile Dropdown */}
              <div className="relative group">
                <button className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-card-bg transition-all">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-accent text-white font-bold text-sm flex items-center justify-center shadow-lg">
                    AP
                  </div>
                  <span className="text-sm font-medium hidden lg:inline">Alex Parker</span>
                  <svg className="w-4 h-4 text-muted transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-56 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform -translate-y-2 group-hover:translate-y-0">
                  <div className="bg-card-bg border border-border rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-3 border-b border-border">
                      <p className="text-sm font-semibold">Alex Parker</p>
                      <p className="text-xs text-muted">alex@automato.ai</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/10 transition-colors">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/10 transition-colors">
                        Billing
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/10 transition-colors text-red-500">
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden relative w-10 h-10 rounded-xl hover:bg-card-bg transition-all"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Menu"
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-5 h-5 flex flex-col justify-between">
                  <span className={`w-full h-0.5 bg-foreground rounded-full transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`w-full h-0.5 bg-foreground rounded-full transition-all duration-300 ${mobileOpen ? 'opacity-0' : ''}`} />
                  <span className={`w-full h-0.5 bg-foreground rounded-full transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`md:hidden fixed inset-0 z-40 bg-background/95 backdrop-blur-xl transition-all duration-300 ${
          mobileOpen ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`} style={{ top: '64px' }}>
          <div className="container px-4 py-6">
            <nav className="space-y-1 mb-6">
              {NAV_LINKS.map(({ label, href, icon }) => {
                const isActive = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all ${
                      isActive 
                        ? 'bg-primary/10 text-foreground' 
                        : 'text-muted hover:bg-card-bg hover:text-foreground'
                    }`}
                  >
                    <span className="text-xl">{icon}</span>
                    <span>{label}</span>
                    {isActive && (
                      <span className="ml-auto w-1.5 h-6 bg-primary rounded-full"></span>
                    )}
                  </Link>
                );
              })}
            </nav>

            <div className="pt-6 border-t border-border space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent text-white font-bold text-base flex items-center justify-center shadow-lg">
                  AP
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">Alex Parker</p>
                  <p className="text-xs text-muted">alex@automato.ai</p>
                </div>
                <button className="px-3 py-1.5 text-xs rounded-lg bg-primary/10 text-primary">
                  Upgrade
                </button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-card-bg border border-border text-sm hover:border-primary transition-all">
                  🔔 Notifications
                </button>
                <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-card-bg border border-border text-sm hover:border-primary transition-all">
                  ⚙️ Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}