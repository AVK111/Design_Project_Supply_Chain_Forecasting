import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Apple, Wheat, Carrot, Droplet, Flower } from 'lucide-react';
import productsImage from '@/assets/products-showcase.jpg';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import fruitImage from '@/assets/fresh-fruit-bg.jpg'
import vegetableImage from '@/assets/fresh-vegetables-bg.webp'
import grainsImage from '@/assets/grains-and-cereals-bg.webp'
import seedsImage from '@/assets/oil-seeds-bg.jpg'
import spicesImage from '@/assets/spices-herbs-bg.jpg'
import { downloadCatalog, recordInquiry } from '@/services/agriApi';
import { toast } from '@/hooks/use-toast';

const Products = () => {
  useScrollAnimation();

  const handleCatalogRequest = async () => {
    try {
      await recordInquiry({
        inquiry_type: 'catalog_request',
        source: 'products_section',
        message: 'Visitor requested the product catalog.',
      });
      await downloadCatalog();
      toast({ title: 'Catalog downloaded', description: 'The product catalog is ready.' });
    } catch (error) {
      toast({
        title: 'Catalog request failed',
        description: error instanceof Error ? error.message : 'Please start the backend and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleQuoteRequest = async (product?: string) => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });

    try {
      const message = await recordInquiry({
        inquiry_type: 'quote_request',
        source: 'products_section',
        product,
        message: product ? `Visitor requested a quote for ${product}.` : 'Visitor requested a custom quote.',
      });
      toast({ title: 'Quote request started', description: message });
    } catch (error) {
      toast({
        title: 'Quote request failed',
        description: error instanceof Error ? error.message : 'Please start the backend and try again.',
        variant: 'destructive',
      });
    }
  };
  
  const categories = [
    { 
      name: 'Fresh Fruits',
      icon: Apple,
      image: fruitImage,
      items: ['Mangoes', 'Bananas', 'Grapes', 'Pomegranates', 'Oranges'],
      color: 'bg-red-100 text-red-700',
      description: 'Premium fresh fruits sourced directly from Indian orchards'
    },
    {
      name: 'Vegetables',
      icon: Carrot,
      image: vegetableImage,
      items: ['Onions', 'Potatoes', 'Tomatoes', 'Peppers', 'Okra'],
      color: 'bg-green-100 text-green-700',
      description: 'Farm-fresh vegetables with extended shelf life'
    },
    {
      name: 'Grains & Cereals',
      icon: Wheat,
      image: grainsImage,
      items: ['Basmati Rice', 'Wheat', 'Millets', 'Pulses', 'Lentils'],
      color: 'bg-amber-100 text-amber-700',
      description: 'High-quality grains meeting international standards'
    },
    {
      name: 'Oil Seeds',
      icon: Droplet,
      image: seedsImage,
      items: ['Sesame', 'Mustard', 'Sunflower', 'Groundnut', 'Castor'],
      color: 'bg-yellow-100 text-yellow-700',
      description: 'Premium oil seeds with high oil content'
    },
    {
      name: 'Spices & Herbs',
      icon: Flower,
      image: spicesImage,
      items: ['Turmeric', 'Cumin', 'Coriander', 'Cardamom', 'Black Pepper'],
      color: 'bg-orange-100 text-orange-700',
      description: 'Aromatic spices and herbs with authentic flavors'
    }
  ];

  return (
    <section id="products" className="py-20 lg:py-32 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6 animate-on-scroll hover-scale">
              Premium Product Range
            </div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6 animate-on-scroll">
              Our <span className="text-gradient animate-pulse-glow">Product Portfolio</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto animate-on-scroll">
              We export a diverse range of premium Indian agricultural products, 
              carefully selected and processed to meet international quality standards.
            </p>
          </div>
          {/* Featured Image */}
          <div className="mb-16">
            <div className="relative rounded-3xl overflow-hidden shadow-soft">
              <img
                src={productsImage}
                alt="Premium Indian Agricultural Products"
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-2xl font-display font-bold text-white mb-2">
                  Premium Quality Guarantee
                </h3>
                <p className="text-white/90">
                  Every product undergoes rigorous quality checks and meets international export standards
                </p>
              </div>
            </div>
          </div>

          {/* Product Categories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Card
                  key={index}
                  className={`group hover-lift cursor-pointer border-0 shadow-soft animate-on-scroll stagger-delay-${index + 1}`}
                  onClick={() => handleQuoteRequest(category.name)}
                >
                  <CardContent className="p-6">
                  {/* Category Image */}
                  <img
                    src={category.image}      // <-- your imported image
                    alt={category.name}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />

                  {/* Category Icon + Name */}
                  <div className="flex items-center mb-4">
                    <div className={`p-3 rounded-2xl ${category.color} mr-4 hover-scale`}>
                      <IconComponent className="w-6 h-6 animate-bounce-gentle" />
                    </div>
                    <h3 className="text-lg font-semibold">{category.name}</h3>
                  </div>

                  {/* Description */}
                  <p className="text-muted-foreground text-sm mb-4">{category.description}</p>

                  {/* Items */}
                  <div className="flex flex-wrap gap-2">
                    {category.items.map((item, itemIndex) => (
                      <Badge key={itemIndex} variant="secondary" className="text-xs">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </CardContent>

                </Card>
              );
            })}
          </div>

          {/* CTA Section */}
          <div className="text-center bg-gradient-to-r from-primary/5 to-accent/5 rounded-3xl p-8 lg:p-12 animate-on-scroll hover-lift">
            <h3 className="text-2xl lg:text-3xl font-display font-bold mb-4">
              Ready to Import Premium Indian Products?
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Get in touch with our export team to discuss your requirements, 
              pricing, and delivery schedules for any of our product categories.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary-light hover-lift animate-pulse-glow"
                onClick={handleCatalogRequest}
              >
                Request Product Catalog
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-primary text-primary hover-lift"
                onClick={() => handleQuoteRequest()}
              >
                Get Custom Quote
              </Button>
            </div>
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Products;
