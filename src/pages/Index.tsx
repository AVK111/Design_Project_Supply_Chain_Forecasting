import Header from '@/components/Header';
import Hero from '@/components/Hero';
import Products from '@/components/Products';
import Model from '@/components/Model';
import About from '@/components/About';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <Hero />
      <Products />
      <Model />
      <About />
      <Footer />
    </div>
  );
};

export default Index;