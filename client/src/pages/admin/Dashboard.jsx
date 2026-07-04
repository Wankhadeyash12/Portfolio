import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FolderKanban, Wrench, MessageSquare, FileText } from 'lucide-react';
import { getProjects, getSkills, getMessages, getDocuments } from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';

export default function Dashboard() {
  const [stats, setStats] = useState({ projects: 0, skills: 0, messages: 0, documents: 0, unread: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getProjects(), getSkills(), getMessages(), getDocuments()])
      .then(([projects, skills, messages, documents]) => {
        setStats({
          projects: projects.data.length,
          skills: skills.data.skills?.length || 0,
          messages: messages.data.length,
          documents: documents.data.length,
          unread: parseInt(messages.headers['x-unread-count'] || '0', 10),
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Projects', value: stats.projects, icon: FolderKanban, to: '/admin/projects' },
    { label: 'Skills', value: stats.skills, icon: Wrench, to: '/admin/skills' },
    { label: 'Unread Messages', value: stats.unread, icon: MessageSquare, to: '/admin/messages' },
    { label: 'Documents', value: stats.documents, icon: FileText, to: '/admin/documents' },
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold mb-2">Welcome back, Yash</h1>
      <p className="text-muted text-sm mb-8">Manage your portfolio content from here.</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(({ label, value, icon: Icon, to }) => (
          <Link
            key={label}
            to={to}
            className="bg-card border border-border rounded-xl p-6 hover:border-accent/30 transition-colors"
          >
            <Icon className="text-accent mb-3" size={24} />
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-muted text-sm">{label}</p>
          </Link>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <h2 className="font-medium mb-4">Quick Links</h2>
        <div className="flex flex-wrap gap-3">
          {cards.map(({ label, to }) => (
            <Link key={label} to={to} className="px-4 py-2 bg-dark border border-border rounded-lg text-sm text-muted hover:text-accent transition-colors">
              {label}
            </Link>
          ))}
          <Link to="/admin/experience" className="px-4 py-2 bg-dark border border-border rounded-lg text-sm text-muted hover:text-accent transition-colors">
            Experience
          </Link>
          <Link to="/admin/profile" className="px-4 py-2 bg-dark border border-border rounded-lg text-sm text-muted hover:text-accent transition-colors">
            Profile
          </Link>
        </div>
      </div>
    </div>
  );
}
