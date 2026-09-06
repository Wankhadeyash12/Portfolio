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

                  {(project.liveUrl || project.githubUrl) && (
                    <div className="flex gap-4 pt-4 border-t border-border">
                      {project.liveUrl && (
                        
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-accent hover:text-white transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                            <polyline points="15 3 21 3 21 9" />
                            <line x1="10" y1="14" x2="21" y2="3" />
                          </svg>
                          Live Demo
                        </a>
                      )}
                      {project.githubUrl && (
                        
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-sm font-medium text-muted hover:text-white transition-colors"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1-.02-1.96-3.2.7-3.88-1.54-3.88-1.54-.52-1.34-1.28-1.69-1.28-1.69-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.7 1.25 3.36.96.1-.75.4-1.25.73-1.53-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.29 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.18 1.83 1.18 3.09 0 4.41-2.69 5.38-5.26 5.67.42.36.78 1.08.78 2.18 0 1.57-.01 2.84-.01 3.23 0 .3.2.66.79.55A11.5 11.5 0 0 0 23.5 12c0-6.35-5.15-11.5-11.5-11.5Z" />
                          </svg>
                          Code
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
