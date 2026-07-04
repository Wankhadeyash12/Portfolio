import { useState, useEffect } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getSkills, createSkill, updateSkill, deleteSkill } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const categories = ['Frontend', 'Backend', 'Android', 'Tools', 'Other'];
const emptyForm = { name: '', category: 'Frontend', level: 50, order: 0 };

export default function SkillForm() {
  const [grouped, setGrouped] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const fetchSkills = () => {
    setLoading(true);
    getSkills()
      .then((res) => setGrouped(res.data.grouped || {}))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSkills(); }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (skill) => {
    setEditing(skill);
    setForm({ name: skill.name, category: skill.category, level: skill.level, order: skill.order });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await updateSkill(editing._id, form);
        toast.success('Skill updated');
      } else {
        await createSkill(form);
        toast.success('Skill created');
      }
      setModalOpen(false);
      fetchSkills();
    } catch {
      toast.error('Failed to save skill');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteSkill(deleteId);
      toast.success('Skill deleted');
      setDeleteId(null);
      fetchSkills();
    } catch {
      toast.error('Failed to delete skill');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading text-xl font-bold">Skills</h2>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg text-sm">
          <Plus size={16} /> Add Skill
        </button>
      </div>

      {Object.entries(grouped).map(([category, skills]) => (
        <div key={category} className="mb-6">
          <h3 className="text-accent font-medium mb-3">{category}</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {skills.map((skill) => (
              <div key={skill._id} className="bg-card border border-border rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{skill.name}</p>
                  <p className="text-muted text-xs">{skill.level}%</p>
                </div>
                <div>
                  <button onClick={() => openEdit(skill)} className="p-1.5 text-muted hover:text-accent"><Pencil size={14} /></button>
                  <button onClick={() => setDeleteId(skill._id)} className="p-1.5 text-muted hover:text-red-400"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-card border border-border rounded-xl p-6 w-full max-w-md">
            <DialogTitle className="font-heading text-lg font-bold mb-4">{editing ? 'Edit Skill' : 'Add Skill'}</DialogTitle>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white" />
              <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 bg-dark border border-border rounded-lg text-white">
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <div>
                <label className="text-sm text-muted">Level: {form.level}%</label>
                <input type="range" min="0" max="100" value={form.level} onChange={(e) => setForm({ ...form, level: parseInt(e.target.value, 10) })} className="w-full accent-accent" />
              </div>
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
            <p className="mb-4">Delete this skill?</p>
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
