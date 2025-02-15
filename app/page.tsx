import Header from '@/components/Home/Headers';
import Hero from '@/components/Home/Hero';
import Features from '@/components/Home/Features';
import Testimonials from '@/components/Home/Testomonials';
import Footer from '@/components/Home/Footer';
import QuickAccess from '@/components/Home/QuickAccesses';

export default function HomePage() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900">
      <Header />
      <Hero />
      <Features />
      <Testimonials />
      <QuickAccess />
      <Footer />
  
    </div>)
}
