import { useState } from 'react';
import type React from 'react';
import { Button } from '@/components/ui/button';
import { Menu, X, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import logo from '@/assets/logo.png';
import { recordInquiry } from '@/services/agriApi';
import { toast } from '@/hooks/use-toast';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Products', href: '#products' },
    { name: 'About Us', href: '#about' },
    { name: 'Certificates', href: '#certificates' },
    { name: 'Contact', href: '#contact' },
    { name: 'Model', href: '#model' }
  ];

  const handleQuoteClick = async (source: string) => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);

    try {
      const message = await recordInquiry({
        inquiry_type: 'quote_request',
        source,
        message: 'Visitor clicked Get Quote.',
      });
      toast({ title: 'Quote request started', description: message });
    } catch (error) {
      toast({
        title: 'Backend not reachable',
        description: error instanceof Error ? error.message : 'Start the backend and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSearch = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== 'Enter') return;

    const query = event.currentTarget.value.trim();
    if (!query) return;

    document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    toast({
      title: 'Search ready',
      description: `Showing product categories for "${query}".`,
    });
  };

  return (
    <>
      {/* Fixed Logo - Always visible at top left */}
      <div className="fixed top-4 left-4 z-50 bg-background/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Parthaj Orchard" className="h-8 w-auto" />
          <div className="hidden sm:block">
            <h1 className="text-sm font-display font-semibold text-gradient">
              PARTHAJ ORCHARD
            </h1>
            <p className="text-xs text-muted-foreground">Premium Exports</p>
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-sm border-b shadow-soft animate-fade-in">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Spacer for fixed logo */}
            <div className="w-48 lg:w-64"></div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-smooth font-medium"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Search and CTA */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search products..."
                  className="pl-10 w-48 bg-muted/50 border-0"
                  onKeyDown={handleSearch}
                />
              </div>
              <Button
                className="bg-gradient-to-r from-primary to-primary-light hover:shadow-hover transition-smooth animate-pulse-glow"
                onClick={() => handleQuoteClick('desktop_header')}
              >
                Get Quote
              </Button>
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden py-4 border-t bg-background/95 backdrop-blur-sm">
              <nav className="flex flex-col space-y-3">
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="px-2 py-2 text-foreground hover:text-primary transition-smooth font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </a>
                ))}
                <div className="pt-3 border-t">
                  <Button
                    className="w-full bg-gradient-to-r from-primary to-primary-light"
                    onClick={() => handleQuoteClick('mobile_header')}
                  >
                    Get Quote
                  </Button>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
