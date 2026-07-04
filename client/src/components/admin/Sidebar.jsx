import { useState, useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard, FolderKanban, Wrench, Briefcase,
  FileText, MessageSquare, User, LogOut, Menu, X, ExternalLink,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getMessages } from '../../services/api';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/projects', label: 'Projects', icon: FolderKanban },
  { to: '/admin/skills', label: 'Skills', icon: Wrench },
  { to: '/admin/experience', label: 'Experience', icon: Briefcase },
  { to: '/admin/documents', label: 'Documents', icon: FileText },
  { to: '/admin/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    getMessages()
      .then((res) => setUnreadCount(parseInt(res.headers['x-unread-count'] || '0', 10)))
      .catch(() => {});
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const sidebarContent = (
    <>
      <div className="p-6 border-b border-border">
        <span className="font-heading text-lg font-bold text-accent">YW Admin</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-primary/20 text-accent' : 'text-muted hover:text-white hover:bg-card'
              }`
            }
          >
            <Icon size={18} />
            {label}
            {label === 'Messages' && unreadCount > 0 && (
              <span className="ml-auto bg-accent text-dark text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-border space-y-1">
        <Link
          to="/"
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-accent hover:bg-accent/10 transition-colors"
        >
          <ExternalLink size={18} />
          View Portfolio
        </Link>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm text-muted hover:text-red-400 hover:bg-card transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </>
  );

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-border rounded-lg text-muted"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      <aside className="hidden lg:flex lg:flex-col w-64 bg-surface border-r border-border min-h-screen fixed left-0 top-0">
        {sidebarContent}
      </aside>

      {mobileOpen && (
        <aside className="lg:hidden fixed inset-0 z-40 flex flex-col w-64 bg-surface border-r border-border">
          {sidebarContent}
        </aside>
      )}
    </>
  );
}
