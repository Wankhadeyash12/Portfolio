import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import SectionHeader from '../shared/SectionHeader';

export default function About() {
  const { profile, projects, experience, skills } = usePortfolio();

  const stats = [
    { label: 'Internships', value: experience.length || '2' },
    { label: 'Projects', value: `${projects.length}+` },
    { label: 'Skills', value: skills.length || '16' },
  ];

  return (
    <section id="about" className="py-20 sm:py-28 section-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader title="About Me" subtitle="Get to know more about my journey and passion for development." />

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center md:text-left"
          >
            <div className="relative inline-block group">
              {profile?.photo?.url ? (
                <img
                  src={profile.photo.url}
                  alt={profile.name}
                  className="w-72 h-72 rounded-2xl object-cover mx-auto md:mx-0 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                />
              ) : (
                <div className="w-72 h-72 rounded-2xl glass-card mx-auto md:mx-0 flex items-center justify-center">
                  <span className="text-6xl font-heading text-accent">YW</span>
                </div>
              )}
              <div className="absolute -inset-3 border-2 border-accent/40 rounded-2xl -z-10 group-hover:border-accent/60 transition-colors" />
            </div>
            <h3 className="font-heading text-2xl font-bold mt-8">{profile?.name}</h3>
            <span className="inline-block mt-3 px-5 py-1.5 bg-accent/10 text-accent text-sm rounded-full border border-accent/30 font-medium">
              {profile?.tagline}
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-gray-300 leading-relaxed mb-8 text-lg">{profile?.bio}</p>
            <div className="grid grid-cols-3 gap-4">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card p-5 text-center hover:border-accent/30 transition-colors"
                >
                  <p className="text-2xl font-bold gradient-heading">{stat.value}</p>
                  <p className="text-muted text-xs mt-1 uppercase tracking-wider">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
