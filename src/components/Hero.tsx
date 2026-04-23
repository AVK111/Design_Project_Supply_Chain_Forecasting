import { Button } from '@/components/ui/button';
import { ArrowRight, Globe, Leaf, Award } from 'lucide-react';
import heroImage from '@/assets/hero-bg.jpg';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { downloadCatalog, recordInquiry } from '@/services/agriApi';
import { toast } from '@/hooks/use-toast';

const Hero = () => {
  useScrollAnimation();

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCatalogDownload = async () => {
    try {
      await recordInquiry({
        inquiry_type: 'catalog_download',
        source: 'hero',
        message: 'Visitor downloaded the product catalog from the hero section.',
      });
      await downloadCatalog();
      toast({ title: 'Catalog downloaded', description: 'The product catalog is ready.' });
    } catch (error) {
      toast({
        title: 'Download failed',
        description: error instanceof Error ? error.message : 'Please start the backend and try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center bg-animated">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Premium Indian Agricultural Products"
          className="w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/10" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm animate-fade-in-left hover-scale">
                  <Leaf className="w-4 h-4 mr-2 animate-bounce-gentle" />
                  Premium Quality • Global Reach
                </div>
                
                <h1 className="text-4xl lg:text-6xl font-display font-bold leading-tight animate-fade-in">
                  Connecting{' '}
                  <span className="text-gradient animate-pulse-glow">Indian Farms</span>
                  {' '}to Global Markets
                </h1>
                
                <p className="text-lg lg:text-xl color:black leading-relaxed animate-fade-in-right">
                  PARTHAJ ORCHARD Pvt. Ltd. - Your trusted partner for premium Indian agricultural exports. 
                  We bring the finest fruits, vegetables, grains, oil seeds, and spices from local farms 
                  to international markets with unwavering commitment to quality and sustainability.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 animate-scale-in">
                <Button 
                  size="lg" 
                  className="bg-gradient-to-r from-primary to-primary-light hover:shadow-hover transition-smooth group hover-lift animate-pulse-glow"
                  onClick={() => scrollToSection('products')}
                >
                  Explore Products
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-primary text-primary hover:bg-primary/5 hover-lift"
                  onClick={handleCatalogDownload}
                >
                  Download Catalog
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-border/50 animate-slide-up">
                <div className="text-center animate-on-scroll stagger-delay-1">
                  <div className="text-2xl lg:text-3xl font-bold text-primary animate-pulse-glow">50+</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div className="text-center animate-on-scroll stagger-delay-2">
                  <div className="text-2xl lg:text-3xl font-bold text-primary animate-pulse-glow">15+</div>
                  <div className="text-sm text-muted-foreground">Countries</div>
                </div>
                <div className="text-center animate-on-scroll stagger-delay-3">
                  <div className="text-2xl lg:text-3xl font-bold text-primary animate-pulse-glow">100%</div>
                  <div className="text-sm text-muted-foreground">Quality</div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-soft hover-lift animate-on-scroll stagger-delay-1">
                <Globe className="w-12 h-12 text-primary mb-4 animate-float" />
                <h3 className="text-lg font-semibold mb-2">Global Export</h3>
                <p className="text-muted-foreground text-sm">
                  Connecting premium Indian agricultural products to markets worldwide with reliable logistics.
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-soft hover-lift animate-on-scroll stagger-delay-2">
                <Award className="w-12 h-12 text-primary mb-4 animate-bounce-gentle" />
                <h3 className="text-lg font-semibold mb-2">Certified Quality</h3>
                <p className="text-muted-foreground text-sm">
                  All products meet international quality standards with proper certifications and documentation.
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-soft hover-lift animate-on-scroll stagger-delay-3">
                <Leaf className="w-12 h-12 text-primary mb-4 animate-spin-slow" />
                <h3 className="text-lg font-semibold mb-2">Sustainable Farming</h3>
                <p className="text-muted-foreground text-sm">
                  Supporting local farmers with sustainable practices that protect our environment.
                </p>
              </div>
              
              <div className="bg-card/50 backdrop-blur-sm p-6 rounded-2xl shadow-soft hover-lift animate-on-scroll stagger-delay-4">
                <ArrowRight className="w-12 h-12 text-primary mb-4 animate-float" />
                <h3 className="text-lg font-semibold mb-2">Direct Supply</h3>
                <p className="text-muted-foreground text-sm">
                  Farm-to-export supply chain ensuring freshness and competitive pricing for global buyers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
