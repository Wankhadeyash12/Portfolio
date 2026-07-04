import { motion } from 'framer-motion';
import { usePortfolio } from '../../context/PortfolioContext';
import SectionHeader from '../shared/SectionHeader';

export default function Projects() {
  const { projects } = usePortfolio();

  return (
    <section id="projects" className="py-20 sm:py-28 section-alt">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader title="Projects" subtitle="Featured work and applications I've built." />

        {projects.length === 0 ? (
          <p className="text-muted text-center py-12">No projects yet. Add them from the admin panel.</p>
        ) : (
          <div className="grid sm:grid-cols-2 gap-8">
            {projects.map((project, i) => (
              <motion.article
                key={project._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card overflow-hidden group"
              >
                <div className="relative h-52 overflow-hidden">
                  {project.image?.url ? (
                    <img
                      src={project.image.url}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/40 via-accent/20 to-dark flex items-center justify-center">
                      <span className="font-heading text-4xl text-accent/50">{project.title.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark via-dark/20 to-transparent" />
                  {project.featured && (
                    <span className="absolute top-4 right-4 px-3 py-1 bg-accent/90 text-dark text-xs font-bold rounded-full">
                      Featured
                    </span>
                  )}
                </div>

                <div className="p-6">
                  <h3 className="font-heading text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-muted text-sm mb-4 line-clamp-3 leading-relaxed">{project.description}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.techStack?.map((tech) => (
                      <span key={tech} className="text-xs px-3 py-1 bg-dark/80 border border-border rounded-lg text-accent/90">
                        {tech}
                      </span>
                    ))}
                  </div>

                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
