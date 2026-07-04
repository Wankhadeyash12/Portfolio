import { Helmet } from 'react-helmet-async';
import { PortfolioProvider, usePortfolio } from '../../context/PortfolioContext';
import Navbar from '../../components/public/Navbar';
import Hero from '../../components/public/Hero';
import About from '../../components/public/About';
import Skills from '../../components/public/Skills';
import Projects from '../../components/public/Projects';
import Experience from '../../components/public/Experience';
import Contact from '../../components/public/Contact';
import Footer from '../../components/public/Footer';
import ScrollProgress from '../../components/shared/ScrollProgress';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

function HomeContent() {
  const { profile, loading, error } = usePortfolio();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="glass-card p-8 max-w-md text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <p className="text-muted text-sm">Run: cd server && npm run dev</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{profile?.name ? `${profile.name} | Portfolio` : 'Yash Wankhade | Portfolio'}</title>
        <meta name="description" content={profile?.bio || 'Full Stack Developer Portfolio'} />
        <meta property="og:title" content={`${profile?.name || 'Yash Wankhade'} | Portfolio`} />
        <meta property="og:description" content={profile?.tagline || 'Full Stack Web & Android Developer'} />
      </Helmet>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Experience />
      <Contact />
      <Footer />
    </>
  );
}

export default function Home() {
  return (
    <PortfolioProvider>
      <HomeContent />
    </PortfolioProvider>
  );
}
