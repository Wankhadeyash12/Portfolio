import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { FileText, UploadCloud, Image as ImageIcon } from 'lucide-react';
import { getProfile, updateProfile } from '../../services/api';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { applyTheme } from '../../utils/theme';

const DEFAULT_THEME = { primary: '#0F6E56', accent: '#1D9E75' };

const PRESET_THEMES = [
  { name: 'Teal (default)', primary: '#0F6E56', accent: '#1D9E75' },
  { name: 'Indigo', primary: '#3730A3', accent: '#6366F1' },
  { name: 'Crimson', primary: '#9F1239', accent: '#E11D48' },
  { name: 'Amber', primary: '#92400E', accent: '#F59E0B' },
  { name: 'Slate', primary: '#334155', accent: '#64748B' },
];

export default function ProfilePage() {
  const [form, setForm] = useState({
    name: '', tagline: '', bio: '', email: '', phone: '', location: '',
    github: '', linkedin: '', instagram: '', website: '',
  });
  const [theme, setTheme] = useState(DEFAULT_THEME);
  const [savedTheme, setSavedTheme] = useState(DEFAULT_THEME);
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState(null);
  const [resume, setResume] = useState(null);
  const [currentResumeName, setCurrentResumeName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getProfile()
      .then((res) => {
        const p = res.data;
        setForm({
          name: p.name || '',
          tagline: p.tagline || '',
          bio: p.bio || '',
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || '',
          github: p.github || '',
          linkedin: p.linkedin || '',
          instagram: p.instagram || '',
          website: p.website || '',
        });
        const loadedTheme = {
          primary: p.theme?.primary || DEFAULT_THEME.primary,
          accent: p.theme?.accent || DEFAULT_THEME.accent,
        };
        setTheme(loadedTheme);
        setSavedTheme(loadedTheme);
        setPreview(p.photo?.url || null);
        setCurrentResumeName(p.resumeName || '');
      })
      .finally(() => setLoading(false));
  }, []);

  // Live preview: as soon as the admin picks a color, re-color this page
  // (and every admin screen, since the vars live on :root) so they can see
  // the result immediately, before even hitting Save.
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  // If the admin navigates away without saving, put the real saved theme
  // back so the admin panel doesn't stay on an unsaved preview.
  useEffect(() => () => applyTheme(savedTheme), [savedTheme]);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (file) setResume(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    formData.append('themePrimary', theme.primary);
    formData.append('themeAccent', theme.accent);
    if (photo) formData.append('photo', photo);
    if (resume) formData.append('resume', resume);

    try {
      const res = await updateProfile(formData);
      setCurrentResumeName(res.data.resumeName || currentResumeName);
      setResume(null);
      setSavedTheme(theme);
      toast.success('Profile saved! Open the portfolio tab and refresh to see changes.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="font-heading text-xl font-bold mb-6">Profile</h2>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
        <div className="space-y-4">
          {['name', 'tagline', 'email', 'phone', 'location', 'github', 'linkedin', 'instagram', 'website'].map((field) => (
            <div key={field}>
              <label className="block text-sm text-muted mb-1 capitalize">{field}</label>
              <input
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                className="w-full px-4 py-2 bg-card border border-border rounded-lg text-white focus:outline-none focus:border-accent"
              />
            </div>
          ))}
          <div>
            <label className="block text-sm text-muted mb-1">Bio</label>
            <textarea
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              rows={4}
              className="w-full px-4 py-2 bg-card border border-border rounded-lg text-white focus:outline-none focus:border-accent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm text-muted mb-2">Profile Photo</label>
            <div className="flex items-center gap-4">
              {preview ? (
                <img src={preview} alt="Preview" className="w-20 h-20 rounded-full object-cover ring-2 ring-accent shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-card border border-border flex items-center justify-center shrink-0">
                  <ImageIcon size={22} className="text-muted" />
                </div>
              )}
              <label className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted hover:text-accent hover:border-accent/40 cursor-pointer transition-colors">
                <UploadCloud size={16} />
                {preview ? 'Change Profile Photo' : 'Choose Profile Photo'}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-medium mb-1">Resume</h3>
          <p className="text-muted text-xs mb-3">
            Upload a PDF/DOC and it becomes downloadable via the "Download Resume" button on the homepage.
          </p>
          {currentResumeName && !resume && (
            <div className="flex items-center gap-2 text-sm text-accent mb-3">
              <FileText size={16} /> Current: {currentResumeName}
            </div>
          )}
          <label className="inline-flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm text-muted hover:text-accent hover:border-accent/40 cursor-pointer transition-colors">
            <UploadCloud size={16} />
            {resume ? resume.name : currentResumeName ? 'Change resume file' : 'Choose resume file'}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} className="hidden" />
          </label>
        </div>

        <div className="border-t border-border pt-6">
          <h3 className="font-medium mb-1">Site Theme</h3>
          <p className="text-muted text-xs mb-4">
            Pick the two colors that drive every accent, button, and gradient across the public portfolio
            <span className="text-white/70"> and this admin panel</span>.
          </p>

          <div className="flex flex-wrap gap-3 mb-5">
            {PRESET_THEMES.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => setTheme({ primary: preset.primary, accent: preset.accent })}
                className="flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg text-xs text-muted hover:border-accent/40 transition-colors"
              >
                <span className="flex -space-x-1">
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: preset.primary }} />
                  <span className="w-4 h-4 rounded-full border border-white/20" style={{ background: preset.accent }} />
                </span>
                {preset.name}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-6">
            <div>
              <label className="block text-sm text-muted mb-1">Primary color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.primary}
                  onChange={(e) => setTheme({ ...theme, primary: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-border bg-card cursor-pointer"
                />
                <span className="text-sm text-muted font-mono">{theme.primary}</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Accent color</label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={theme.accent}
                  onChange={(e) => setTheme({ ...theme, accent: e.target.value })}
                  className="w-12 h-10 rounded-lg border border-border bg-card cursor-pointer"
                />
                <span className="text-sm text-muted font-mono">{theme.accent}</span>
              </div>
            </div>
          </div>
          {(theme.primary !== savedTheme.primary || theme.accent !== savedTheme.accent) && (
            <p className="text-xs text-amber-400 mt-3">Previewing unsaved colors — click Save Profile to keep them.</p>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}
