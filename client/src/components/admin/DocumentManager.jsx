import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogPanel } from '@headlessui/react';
import { FileText, Upload, Eye, Download, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getDocuments, uploadDocument, deleteDocument, fetchDocumentBlob } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

const categories = ['All', 'Resume', 'Offer Letter', 'Certificate', 'Other'];

export default function DocumentManager() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [filter, setFilter] = useState('All');
  const [deleteId, setDeleteId] = useState(null);
  const fileRef = useRef(null);

  const fetchDocuments = () => {
    setLoading(true);
    getDocuments()
      .then((res) => setDocuments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchDocuments(); }, []);

  const filtered = filter === 'All' ? documents : documents.filter((d) => d.category === filter);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', file.name);
    formData.append('category', 'Other');

    setUploading(true);
    try {
      await uploadDocument(formData);
      toast.success('Document uploaded');
      fetchDocuments();
    } catch {
      toast.error('Upload failed');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleDelete = async () => {
    try {
      await deleteDocument(deleteId);
      toast.success('Document deleted');
      setDeleteId(null);
      fetchDocuments();
    } catch {
      toast.error('Delete failed');
    }
  };

  const handleView = async (doc) => {
    try {
      const res = await fetchDocumentBlob(doc._id);
      const blobUrl = window.URL.createObjectURL(res.data);
      window.open(blobUrl, '_blank');
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 60000);
    } catch {
      toast.error('Could not open document');
    }
  };

  const handleDownload = async (doc) => {
    try {
      const res = await fetchDocumentBlob(doc._id);
      const blobUrl = window.URL.createObjectURL(res.data);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = doc.name || 'document';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch {
      toast.error('Could not download document');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div>
          <h2 className="font-heading text-xl font-bold">Documents</h2>
          <p className="text-muted text-sm">{documents.length} files total</p>
        </div>
        <div>
          <input ref={fileRef} type="file" onChange={handleUpload} className="hidden" id="doc-upload" />
          <label htmlFor="doc-upload" className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-accent text-white rounded-lg text-sm cursor-pointer">
            <Upload size={16} /> {uploading ? 'Uploading...' : 'Upload'}
          </label>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === cat ? 'bg-primary text-white' : 'bg-card border border-border text-muted hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-muted text-center py-12">No documents found</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => (
            <div key={doc._id} className="bg-card border border-border rounded-xl p-5">
              <div className="flex items-start gap-3 mb-4">
                <FileText className="text-accent shrink-0" size={24} />
                <div>
                  <h4 className="text-white font-medium text-sm truncate">{doc.name}</h4>
                  <span className="text-xs text-muted">{doc.category}</span>
                  <p className="text-xs text-muted mt-1">
                    {new Date(doc.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleView(doc)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-primary/20 text-accent rounded-lg hover:bg-primary/30">
                  <Eye size={14} /> View
                </button>
                <button onClick={() => handleDownload(doc)} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs bg-card border border-border text-muted rounded-lg hover:text-white">
                  <Download size={14} /> Download
                </button>
                <button onClick={() => setDeleteId(doc._id)} className="px-3 py-2 text-xs border border-border text-muted rounded-lg hover:text-red-400">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)} className="relative z-50">
        <div className="fixed inset-0 bg-black/60" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <DialogPanel className="bg-card border border-border rounded-xl p-6 w-full max-w-sm">
            <p className="mb-4">Delete this document?</p>
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
