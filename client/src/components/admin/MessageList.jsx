import { useState, useEffect, Fragment } from 'react';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { getMessages, markMessageRead, deleteMessage } from '../../services/api';
import LoadingSpinner from '../shared/LoadingSpinner';

export default function MessageList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const fetchMessages = () => {
    setLoading(true);
    getMessages()
      .then((res) => setMessages(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchMessages(); }, []);

  const handleRowClick = async (msg) => {
    setExpanded(expanded === msg._id ? null : msg._id);
    if (!msg.read) {
      try {
        await markMessageRead(msg._id);
        setMessages((prev) =>
          prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m))
        );
      } catch {
        toast.error('Failed to mark as read');
      }
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    try {
      await deleteMessage(id);
      toast.success('Message deleted');
      fetchMessages();
    } catch {
      toast.error('Failed to delete');
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <>
      <h2 className="font-heading text-xl font-bold mb-6">Messages</h2>

      {messages.length === 0 ? (
        <p className="text-muted text-center py-12">No messages yet</p>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="text-left p-4">Name</th>
                <th className="text-left p-4 hidden sm:table-cell">Email</th>
                <th className="text-left p-4 hidden md:table-cell">Subject</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <Fragment key={msg._id}>
                  <tr
                    onClick={() => handleRowClick(msg)}
                    className={`border-b border-border/50 cursor-pointer hover:bg-dark/50 ${
                      !msg.read ? 'border-l-4 border-l-accent' : ''
                    }`}
                  >
                    <td className="p-4">{msg.name}</td>
                    <td className="p-4 hidden sm:table-cell text-muted">{msg.email}</td>
                    <td className="p-4 hidden md:table-cell text-muted">{msg.subject || '—'}</td>
                    <td className="p-4 text-muted">{new Date(msg.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <span className={`text-xs px-2 py-0.5 rounded-full ${msg.read ? 'bg-dark text-muted' : 'bg-accent/20 text-accent'}`}>
                        {msg.read ? 'Read' : 'Unread'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={(e) => handleDelete(msg._id, e)} className="p-1.5 text-muted hover:text-red-400">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                  {expanded === msg._id && (
                    <tr className="bg-dark/30">
                      <td colSpan={6} className="p-4 text-gray-300">{msg.message}</td>
                    </tr>
                  )}
                </Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
