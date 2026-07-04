import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { Mail, Phone, MapPin } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import { submitContact } from '../../services/api';
import SectionHeader from '../shared/SectionHeader';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  subject: yup.string(),
  message: yup.string().min(10, 'Message must be at least 10 characters').required('Message is required'),
});

export default function Contact() {
  const { profile } = usePortfolio();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  const onSubmit = async (data) => {
    try {
      await submitContact(data);
      toast.success("Message sent! I'll get back to you soon.");
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionHeader title="Contact" subtitle="Have a project in mind? Let's talk." />

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading text-2xl font-bold mb-6">Get in Touch</h3>
            <div className="space-y-5">
              {profile?.email && (
                <div className="flex items-center gap-4 glass-card p-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent"><Mail size={20} /></div>
                  <span className="text-gray-300">{profile.email}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-4 glass-card p-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent"><Phone size={20} /></div>
                  <span className="text-gray-300">{profile.phone}</span>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-4 glass-card p-4">
                  <div className="p-2.5 rounded-xl bg-accent/10 text-accent"><MapPin size={20} /></div>
                  <span className="text-gray-300">{profile.location}</span>
                </div>
              )}
            </div>
            {(profile?.github || profile?.linkedin || profile?.instagram) && (
              <p className="text-sm text-muted mt-8">Social links are managed locally from the admin profile.</p>
            )}
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            onSubmit={handleSubmit(onSubmit)}
            className="glass-card p-8 space-y-5"
          >
            {['name', 'email', 'subject'].map((field) => (
              <div key={field}>
                <label className="block text-sm text-muted mb-2 capitalize font-medium">{field}</label>
                <input
                  {...register(field)}
                  type={field === 'email' ? 'email' : 'text'}
                  className="w-full px-4 py-3 bg-dark/80 border border-border rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition-all"
                />
                {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field].message}</p>}
              </div>
            ))}
            <div>
              <label className="block text-sm text-muted mb-2 font-medium">Message</label>
              <textarea
                {...register('message')}
                rows={5}
                className="w-full px-4 py-3 bg-dark/80 border border-border rounded-xl text-white focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 resize-none transition-all"
              />
              {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full disabled:opacity-50">
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
