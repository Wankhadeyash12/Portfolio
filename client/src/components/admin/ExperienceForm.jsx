import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getExperience, createExperience, updateExperience, deleteExperience } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const types = ['Internship', 'Full-time', 'Part-time', 'Freelance'];
const emptyForm = {
  company: '', role: '', type: 'Internship', startDate: '', endDate: '',
  current: false, description: '', location: '', order: 0,
};

export default function ExperienceForm() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchEntries = () => {
    setLoading(true);
    getExperience()
      .then((res) => setEntries(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchEntries(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (entry) => {
    setEditing(entry);
    setForm({
      company: entry.company,
      role: entry.role,
      type: entry.type || 'Internship',
      startDate: entry.startDate?.split('T')[0] || '',
      endDate: entry.endDate?.split('T')[0] || '',
      current: entry.current,
      description: entry.description || '',
      location: entry.location || '',
      order: entry.order,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateExperience(editing._id, form);
        toast.success('Experience updated');
      } else {
        await createExperience(form);
        toast.success('Experience created');
      }
      setModalOpen(false);
      fetchEntries();
    } catch {
      toast.error('Failed to save experience');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteExperience(deleteId);
      toast.success('Experience deleted');
      setDeleteId(null);
      fetchEntries();
    } catch {
      toast.error('Failed to delete experience');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-bold">Experience</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg text-sm">
          <Plus size={16} /> Add Experience
        </button>
      </div>

      <div className="space-y-4">
        {entries.map((entry) => (
          <div key={entry._id} className="bg-card border border-border rounded-xl p-5 flex items-start justify-between">
            <div>
              <h3 className="font-medium">{entry.company}</h3>
              <p className="text-accent text-sm">{entry.role}</p>
              <p className="text-muted text-xs mt-1">{entry.location}</p>
            </div>
            <div>
              <button onClick={() => openEdit(entry)} className="p-1.5 text-muted hover:text-accent"><Pencil size={16} /></button>
              <button onClick={() => setDeleteId(entry._id)} className="p-1.5 text-muted hover:text-red-400"><Trash2 size={16} /></button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-card border border-border rounded-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogTitle className="font-heading text-lg font-bold mb-4">{editing ? 'Edit Experience' : 'Add Experience'}</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Company" value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} required className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <input placeholder="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} required className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white">
                {types.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required className="px-4 py-2 bg-dark border border-border rounded-lg text-white" />
                <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} disabled={form.current} className="px-4 py-2 bg-dark border border-border rounded-lg text-white disabled:opacity-50" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={form.current} onChange={(e) => setForm({ ...form, current: e.target.checked })} />
                Current role
              </label>
              <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <textarea placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white resize-none" />
              <input type="number" placeholder="Order" value={form.order} onChange={(e) => setForm({ ...form, order: parseInt(e.target.value, 10) })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <div className="flex gap-3">
                <button type="submit" className="flex-1 py-2 bg-primary text-white rounded-lg">Save</button>
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
            <p className="mb-4">Delete this entry?</p>
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
