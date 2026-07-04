import { useState } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import SectionHeader from '../shared/SectionHeader';

const categories = ['Frontend', 'Backend', 'Android', 'Tools'];

function SkillBar({ skill, index }) {
  const [width, setWidth] = useState(0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="glass-card p-5 hover:border-accent/30 transition-colors"
      onViewportEnter={() => setWidth(skill.level || 0)}
    >
      <div className="flex justify-between items-center mb-3">
        <span className="text-white font-semibold">{skill.name}</span>
        <span className="text-accent text-sm font-bold">{skill.level}%</span>
      </div>
      <div className="h-2.5 bg-dark rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-primary via-accent to-emerald-400 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${width}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

export default function Skills() {
  const { groupedSkills } = usePortfolio();
  const [activeTab, setActiveTab] = useState('Frontend');
  const activeSkills = groupedSkills[activeTab] || [];

  return (
    <section id="skills" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader title="Skills" subtitle="Technologies and tools I work with across web and mobile development." />

        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === cat
                  ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-accent/20'
                  : 'glass-card text-muted hover:text-white hover:border-accent/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {activeSkills.length === 0 ? (
          <p className="text-muted text-center py-12">No skills in this category yet. Add them from the admin panel.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            {activeSkills.map((skill, i) => (
              <SkillBar key={skill._id} skill={skill} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
