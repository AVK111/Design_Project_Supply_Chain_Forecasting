import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe, Users, CheckCircle } from 'lucide-react';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';
import { downloadCatalog, recordInquiry } from '@/services/agriApi';
import { toast } from '@/hooks/use-toast';

const About = () => {
  useScrollAnimation();

  const emailAddress = 'parthajorchardpvtltd@gmail.com';
  const phoneNumber = '+919921320091';

  const recordAction = async (inquiry_type: string, message: string) => {
    try {
      const response = await recordInquiry({
        inquiry_type,
        source: 'contact_section',
        message,
      });
      toast({ title: 'Request received', description: response });
    } catch (error) {
      toast({
        title: 'Backend not reachable',
        description: error instanceof Error ? error.message : 'Start the backend and try again.',
        variant: 'destructive',
      });
    }
  };

  const handleCatalogRequest = async () => {
    try {
      await recordInquiry({
        inquiry_type: 'catalog_request',
        source: 'contact_section',
        message: 'Visitor requested the product catalog from the contact section.',
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

  const handleScheduleCall = async () => {
    await recordAction('schedule_call', 'Visitor clicked Schedule a Call.');
    window.location.href = `tel:${phoneNumber}`;
  };

  const handleEmailInquiry = async () => {
    await recordAction('email_inquiry', 'Visitor clicked Send Email Inquiry.');
    window.location.href = `mailto:${emailAddress}?subject=Export%20Inquiry%20-%20Parthaj%20Orchard`;
  };
  
  const features = [
    {
      icon: Globe,
      title: 'Global Reach',
      description: 'Exporting to 15+ countries across Asia, Europe, and the Middle East'
    },
    {
      icon: Users,
      title: 'Expert Team',
      description: 'Experienced professionals in agricultural export and quality control'
    },
    {
      icon: CheckCircle,
      title: 'Quality Assurance',
      description: 'Rigorous testing and certification processes for all products'
    }
  ];

  const certifications = [
    'ISO 22000:2018 - Food Safety Management',
    'HACCP Certification',
    'FSSAI License',
    'Export License from DGFT',
    'Organic Certification (Selected Products)',
    'Global GAP Certification'
  ];

  return (
    <>
      {/* About Section */}
      <section id="about" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Content */}
              <div className="space-y-8">
                <div>
                  <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                    About Our Company
                  </div>
                  <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
                    Leading <span className="text-gradient">Agricultural Exporter</span>
                  </h2>
                  <p className="text-lg text-muted-foreground">
                    PARTHAJ ORCHARD Pvt. Ltd. is an emerging leader in the export of premium Indian 
                    agricultural products. Founded with a vision to connect local farms to global markets, 
                    we have built strong relationships with farmers across India and international buyers worldwide.
                  </p>
                </div>

                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground ">
                    Our commitment to quality and sustainability drives everything we do. We work closely 
                    with farmers to ensure sustainable farming practices while maintaining the highest 
                    standards of product quality and food safety.
                  </p>
                  <p className="text-lg text-muted-foreground">
                    With our state-of-the-art processing facilities and cold chain management, we ensure 
                    that our products retain their freshness and nutritional value throughout the supply chain.
                  </p>
                </div>

                <Button
                  className="bg-gradient-to-r from-primary to-primary-light"
                  onClick={() => document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Learn More About Us
                </Button>
              </div>

              {/* Features */}
                  <div className="space-y-6">
                {features.map((feature, index) => {
                  const IconComponent = feature.icon;
                  return (
                    <Card key={index} className={`border-0 shadow-soft hover-lift animate-on-scroll stagger-delay-${index + 1}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center hover-scale">
                              <IconComponent className="w-6 h-6 text-primary animate-bounce-gentle" />
                            </div>
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                            <p className="text-muted-foreground">{feature.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certificates Section */}
      <section id="certificates" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
              Quality Certifications
            </div>
            <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
              Trusted <span className="text-gradient">Quality Standards</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              Our commitment to quality is validated by internationally recognized certifications 
              and compliance with global food safety standards.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert, index) => (
                <div
                  key={index}
                  className={`flex items-center space-x-3 p-4 bg-card rounded-2xl shadow-soft hover-lift animate-on-scroll stagger-delay-${(index % 3) + 1}`}
                >
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 animate-bounce-gentle" />
                  <span className="text-sm font-medium text-left">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-6">
                Get In Touch
              </div>
              <h2 className="text-3xl lg:text-5xl font-display font-bold mb-6">
                Ready to <span className="text-gradient">Start Trading?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Contact our expert team to discuss your import requirements, get product samples, 
                or learn more about our export capabilities.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6">Contact Information</h3>
                  <div className="space-y-4">
                    <div className="flex items-start space-x-4">
                      <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Head Office</p>
                        <p className="text-muted-foreground text-sm">
                          Kasliwal Classic Phase-1, Flat 11<br />
                          Tapdiyanagar, Aurangabad, MH 431001, India
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Phone</p>
                        <p className="text-muted-foreground text-sm">+91 99213 20091</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-muted-foreground text-sm">parthajorchardpvtltd@gmail.com</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <Globe className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="font-medium">Website</p>
                        <p className="text-muted-foreground text-sm">www.parthajorchardpvtltd.com</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Card */}
              <Card className="border-0 shadow-soft hover-lift animate-on-scroll">
                <CardContent className="p-8">
                  <h3 className="text-xl font-semibold mb-4">Ready to Import?</h3>
                  <p className="text-muted-foreground mb-6">
                    Get in touch with our export team to discuss your specific requirements, 
                    pricing, and delivery schedules.
                  </p>
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-gradient-to-r from-primary to-primary-light hover-lift animate-pulse-glow"
                      onClick={handleCatalogRequest}
                    >
                      Request Product Catalog
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-primary text-primary hover-lift"
                      onClick={handleScheduleCall}
                    >
                      Schedule a Call
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-primary hover-scale"
                      onClick={handleEmailInquiry}
                    >
                      Send Email Inquiry
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
