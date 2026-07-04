import { Globe } from 'lucide-react';
import { GitHubIcon, LinkedInIcon, InstagramIcon } from '../shared/SocialIcons';
import { usePortfolio } from '../../context/PortfolioContext';

export default function Footer() {
  const { profile } = usePortfolio();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 py-16 bg-surface/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <h3 className="font-heading text-xl font-bold text-white mb-1">
              {profile?.name || 'Yash Wankhade'}
            </h3>
            <p className="text-muted text-sm">{profile?.tagline || 'Full Stack Web & Android Developer'}</p>
          </div>
          <div className="flex items-center gap-4">
            {profile?.github && (
              <a href={profile.github} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-all">
                <GitHubIcon size={20} />
              </a>
            )}
            {profile?.linkedin && (
              <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-all">
                <LinkedInIcon size={20} />
              </a>
            )}
            {profile?.instagram && (
              <a href={profile.instagram} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-all">
                <InstagramIcon size={20} />
              </a>
            )}
            {profile?.website && (
              <a href={profile.website} target="_blank" rel="noopener noreferrer" className="p-2.5 rounded-xl text-muted hover:text-accent hover:bg-accent/10 transition-all">
                <Globe size={20} />
              </a>
            )}
          </div>
        </div>
        <p className="text-muted text-xs text-center mt-10 pt-8 border-t border-border/30">
          &copy; {year} {profile?.name || 'Yash Wankhade'}. Built with MERN Stack.
        </p>
      </div>
    </footer>
  );
}
