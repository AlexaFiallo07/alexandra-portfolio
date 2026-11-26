import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import StackSection from '@/components/sections/StackSection';
import ProjectsGrid from '@/components/sections/ProjectsGrid';
import EducationSection from '@/components/sections/EducationSection';
import ContactSection from '@/components/sections/ContactSection';
import Pterodactyls from '@/components/dino/Pterodactyls';

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="contenido" className="relative overflow-x-clip">
        {/* Pterodáctilos volando suavemente entre secciones en parallax */}
        <Pterodactyls />
        <HeroSection />
        <AboutSection />
        <StackSection />
        <ProjectsGrid />
        <EducationSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
