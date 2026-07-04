import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { getProfile } from '../../services/api';
import { applyTheme } from '../../utils/theme';

export default function AdminLayout() {
  useEffect(() => {
    getProfile()
      .then((res) => applyTheme(res.data?.theme))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-dark">
      <Sidebar />
      <main className="lg:ml-64 p-6 pt-16 lg:pt-6">
        <Outlet />
      </main>
    </div>
  );
}
