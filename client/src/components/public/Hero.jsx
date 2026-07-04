import { motion } from 'framer-motion';
import { Download, MapPin, Sparkles } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import useTypingEffect from '../../hooks/useTypingEffect';

export default function Hero() {
  const { profile, projects } = usePortfolio();
  const roles = profile?.tagline
    ? [profile.tagline, 'Full Stack Developer', 'Android Developer']
    : ['Full Stack Developer', 'Android Developer', 'MERN Stack Dev'];
  const typedRole = useTypingEffect(roles);

  const resumeUrl = `${import.meta.env.VITE_API_URL || ''}/profile/resume`;

  const handleDownloadResume = async () => {
    try {
      const response = await fetch(resumeUrl);
      if (!response.ok) {
        throw new Error('Unable to download resume.');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'Yash-Wankhade-Resume.pdf';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center overflow-hidden pt-20 pb-16">
      <div className="hero-glow top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      <div className="hero-glow bottom-0 right-0 translate-x-1/3" style={{ opacity: 0.5 }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
              <Sparkles className="text-accent" size={16} />
              <span className="text-sm text-accent font-medium">Available for opportunities</span>
            </div>

            <p className="text-accent text-lg mb-2 font-medium">Hi, I&apos;m</p>
            <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight">
              {profile?.name || 'Yash Wankhade'}
            </h1>

            <p className="text-xl sm:text-2xl text-accent font-medium h-9 mb-4">
              {typedRole}
              <span className="animate-pulse text-white/60">|</span>
            </p>

            {profile?.location && (
              <p className="flex items-center gap-2 text-muted mb-6">
                <MapPin size={16} className="text-accent shrink-0" />
                {profile.location}
              </p>
            )}

            <p className="text-gray-300 text-base sm:text-lg max-w-xl mb-8 leading-relaxed">
              {profile?.bio?.slice(0, 120)}
              {profile?.bio?.length > 120 ? '...' : ''}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#projects" className="btn-primary text-center">View My Work</a>
              <button
                type="button"
                onClick={handleDownloadResume}
                className="btn-outline flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Download Resume
              </button>
            </div>

            <div className="flex gap-8 mt-10 pt-8 border-t border-border/50">
              <div>
                <p className="text-2xl font-bold text-white">{projects.length}+</p>
                <p className="text-muted text-xs">Projects</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">MERN</p>
                <p className="text-muted text-xs">Stack</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-white">2026</p>
                <p className="text-muted text-xs">Graduate</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative">
              <div className="absolute -inset-4 bg-linear-to-br from-accent/30 to-primary/20 rounded-full blur-2xl" />
              {profile?.photo?.url ? (
                <img
                  src={profile.photo.url}
                  alt={profile.name}
                  className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full object-cover ring-4 ring-accent/40 ring-offset-4 ring-offset-dark shadow-2xl"
                />
              ) : (
                <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-full glass-card flex items-center justify-center ring-4 ring-accent/30">
                  <span className="font-heading text-7xl text-accent">YW</span>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
