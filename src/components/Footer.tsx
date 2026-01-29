import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Globe } from 'lucide-react';
import logo from '@/assets/logo.png';
const Footer = () => {
  const currentYear = new Date().getFullYear();
  const quickLinks = [{
    name: 'Home',
    href: '#home'
  }, {
    name: 'Products',
    href: '#products'
  }, {
    name: 'About Us',
    href: '#about'
  }, {
    name: 'Certificates',
    href: '#certificates'
  }, {
    name: 'Contact',
    href: '#contact'
  },{
    name: 'Model',
    href: '#model'
  }];
  const productCategories = [{
    name: 'Fruits',
    href: '#products'
  }, {
    name: 'Vegetables',
    href: '#products'
  }, {
    name: 'Grains',
    href: '#products'
  }, {
    name: 'Oil Seeds',
    href: '#products'
  }, {
    name: 'Spices',
    href: '#products'
  }];
  return <footer className="bg-primary-dark text-primary-foreground">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div className="flex items-center space-x-3">
                <img src={logo} alt="Parthaj Orchard" className="h-12 w-auto" />
                <div>
                  <h3 className="text-xl font-display font-bold">PARTHAJ ORCHARD</h3>
                  <p className="text-primary-foreground/70 text-sm">Pvt. Ltd.</p>
                </div>
              </div>
              <p className="text-primary-foreground/80 text-sm leading-relaxed">
                An emerging exporter of premium Indian agricultural products, connecting local farms 
                to global markets with a commitment to quality and sustainability.
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-start space-x-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-primary-foreground/70" />
                  <p className="text-primary-foreground/80">
                    Kasliwal Classic Phase-1, Flat 11, Tapdiyanagar, Aurangabad, MH 431001, India
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 flex-shrink-0 text-primary-foreground/70" />
                  <p className="text-primary-foreground/80">+91 99213 20091</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 flex-shrink-0 text-primary-foreground/70" />
                  <p className="text-primary-foreground/80">parthajorchardpvtltd@gmail.com</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 flex-shrink-0 text-primary-foreground/70" />
                  <p className="text-primary-foreground/80">www.parthajorchardpvtltd.com</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Quick Links</h4>
              <ul className="space-y-3">
                {quickLinks.map(link => <li key={link.name}>
                    <a href={link.href} className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth text-sm">
                      {link.name}
                    </a>
                  </li>)}
              </ul>
            </div>

            {/* Product Categories */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Product Categories</h4>
              <ul className="space-y-3">
                {productCategories.map(category => <li key={category.name}>
                    <a href={category.href} className="text-primary-foreground/80 hover:text-primary-foreground transition-smooth text-sm">
                      {category.name}
                    </a>
                  </li>)}
              </ul>
            </div>

            {/* Contact CTA */}
            <div className="space-y-6">
              <h4 className="text-lg font-semibold">Start Trading</h4>
              <p className="text-primary-foreground/80 text-sm">
                Ready to import premium Indian agricultural products? Get in touch with our export team.
              </p>
              <div className="space-y-3">
                <Button variant="secondary" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Get Quote
                </Button>
                <Button variant="outline" className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90">
                  Download Catalog
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-primary-foreground/20 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-primary-foreground/70 text-sm">
              © {currentYear} PARTHAJ ORCHARD Pvt. Ltd. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#privacy" className="text-primary-foreground/70 hover:text-primary-foreground transition-smooth text-sm">
                Privacy Policy
              </a>
              <a href="#terms" className="text-primary-foreground/70 hover:text-primary-foreground transition-smooth text-sm">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>;
};
export default Footer;