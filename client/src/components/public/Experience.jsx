import { motion } from 'framer-motion';
import { Briefcase } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import SectionHeader from '../shared/SectionHeader';

const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export default function Experience() {
  const { experience } = usePortfolio();

  return (
    <section id="experience" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader title="Experience" subtitle="My professional journey and internships." />

        {experience.length === 0 ? (
          <p className="text-muted text-center py-12">No experience added yet.</p>
        ) : (
          <div className="relative pl-8 md:pl-10 space-y-8">
            <div className="absolute left-3 md:left-4 top-2 bottom-2 w-0.5 bg-gradient-to-b from-accent via-primary to-transparent" />

            {experience.map((entry, i) => (
              <motion.div
                key={entry._id}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[29px] md:-left-[33px] top-6 w-4 h-4 rounded-full bg-accent border-4 border-dark shadow-lg shadow-accent/30" />
                <div className="glass-card p-6 md:p-8 hover:border-accent/30 transition-colors">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-xl bg-accent/10 text-accent shrink-0">
                        <Briefcase size={20} />
                      </div>
                      <div>
                        <h3 className="font-heading text-lg font-bold text-white">{entry.company}</h3>
                        <span className="text-accent font-medium">{entry.role}</span>
                      </div>
                    </div>
                    {entry.current && (
                      <span className="text-xs px-3 py-1 bg-accent/20 text-accent rounded-full font-semibold border border-accent/30">
                        Present
                      </span>
                    )}
                  </div>
                  <p className="text-muted text-sm mb-3 ml-12 md:ml-14">
                    {formatDate(entry.startDate)} — {entry.current ? 'Present' : formatDate(entry.endDate)}
                    {entry.location && ` · ${entry.location}`}
                  </p>
                  {entry.description && (
                    <p className="text-gray-300 text-sm leading-relaxed ml-12 md:ml-14">{entry.description}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
