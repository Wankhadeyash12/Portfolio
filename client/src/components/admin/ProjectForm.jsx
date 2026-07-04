import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const emptyForm = {
  title: '', description: '', techStack: '', liveUrl: '', githubUrl: '', featured: false, order: 0,
};

export default function ProjectForm() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const fetchProjects = () => {
    setLoading(true);
    getProjects()
      .then((res) => setProjects(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchProjects(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setImage(null);
    setPreview(null);
    setModalOpen(true);
  };

  const openEdit = (project) => {
    setEditing(project);
    setForm({
      title: project.title,
      description: project.description,
      techStack: project.techStack?.join(', ') || '',
      liveUrl: project.liveUrl || '',
      githubUrl: project.githubUrl || '',
      featured: project.featured,
      order: project.order,
    });
    setPreview(project.image?.url || null);
    setImage(null);
    setModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, val]) => formData.append(key, val));
    if (image) formData.append('image', image);

    try {
      if (editing) {
        await updateProject(editing._id, formData);
        toast.success('Project updated');
      } else {
        await createProject(formData);
        toast.success('Project created');
      }
      setModalOpen(false);
      fetchProjects();
    } catch {
      toast.error('Failed to save project');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(deleteId);
      toast.success('Project deleted');
      setDeleteId(null);
      fetchProjects();
    } catch {
      toast.error('Failed to delete project');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-bold">Projects</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add Project
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border text-muted">
            <tr>
              <th className="text-left p-4">Title</th>
              <th className="text-left p-4 hidden sm:table-cell">Tech Stack</th>
              <th className="text-left p-4">Featured</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p) => (
              <tr key={p._id} className="border-b border-border/50">
                <td className="p-4">{p.title}</td>
                <td className="p-4 hidden sm:table-cell text-muted">{p.techStack?.join(', ')}</td>
                <td className="p-4">{p.featured ? 'Yes' : 'No'}</td>
                <td className="p-4 text-right">
                  <button onClick={() => openEdit(p)} className="p-1.5 text-muted hover:text-accent mr-2"><Pencil size={16} /></button>
                  <button onClick={() => setDeleteId(p._id)} className="p-1.5 text-muted hover:text-red-400"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogTitle className="font-heading text-lg font-bold mb-4">{editing ? 'Edit Project' : 'Add Project'}</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required rows={3} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white resize-none" />
              <input placeholder="Tech stack (comma separated)" value={form.techStack} onChange={(e) => setForm({ ...form, techStack: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <input placeholder="Live URL" value={form.liveUrl} onChange={(e) => setForm({ ...form, liveUrl: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <input placeholder="GitHub URL" value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} />
                  Featured
                </label>
                <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) })} className="w-24 px-3 py-2 bg-dark border border-border rounded-lg text-white" />
              </div>
              <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-muted" />
              {preview && <img src={preview} alt="Preview" className="w-full h-32 object-cover rounded-lg" />}
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-primary hover:bg-accent text-white rounded-lg">Save</button>
                <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-2 border border-border text-muted rounded-lg">Cancel</button>
              </div>
            </form>
          </DialogPanel>
        </div>
      </Dialog>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-card border border-border rounded-xl p-6 w-full max-w-sm">
            <p className="mb-4">Delete this project?</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} className="flex-1 py-2 bg-red-600 text-white rounded-lg">Delete</button>
              <button onClick={() => setDeleteId(null)} className="flex-1 py-2 border border-border text-muted rounded-lg">Cancel</button>
            </div>
          </DialogPanel>
        </div>
      </Dialog>
    </>
  );
}
