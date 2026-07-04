import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { login as loginApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await loginApi(data);
      login(res.data.token);
      toast.success('Login successful');
      navigate('/admin/dashboard');
    } catch {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-dark flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-card border border-border rounded-xl p-8">
        <h1 className="font-heading text-2xl font-bold text-center mb-2">Admin Login</h1>
        <p className="text-muted text-sm text-center mb-8">Sign in to manage your portfolio</p>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Email</label>
            <input
              {...register('email', { required: true })}
              type="email"
              className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
          <div>
            <label className="block text-sm text-muted mb-1">Password</label>
            <input
              {...register('password', { required: true })}
              type="password"
              className="w-full px-4 py-2.5 bg-dark border border-border rounded-lg text-white focus:outline-none focus:border-accent"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-primary hover:bg-accent text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
