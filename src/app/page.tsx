import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import StackSection from '@/components/sections/StackSection';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import ContactSection from '@/components/sections/ContactSection';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido" className="relative overflow-x-clip">
        <HeroSection />
        <AboutSection />
        <StackSection />
        <ProjectsGrid />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
