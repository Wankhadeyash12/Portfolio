import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  getProfile,
  getProjects,
  getSkills,
  getExperience,
} from '../services/api';
import { applyTheme } from '../utils/theme';

const PortfolioContext = createContext(null);

export function PortfolioProvider({ children }) {
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);
  const [groupedSkills, setGroupedSkills] = useState({});
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setError(null);
      const [profileRes, projectsRes, skillsRes, expRes] = await Promise.all([
        getProfile(),
        getProjects(),
        getSkills(),
        getExperience(),
      ]);

      setProfile(profileRes.data);
      applyTheme(profileRes.data?.theme);
      const sortedProjects = [...projectsRes.data].sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return a.order - b.order;
      });
      setProjects(sortedProjects);
      setSkills(skillsRes.data.skills || []);
      setGroupedSkills(skillsRes.data.grouped || {});
      setExperience(expRes.data);
    } catch {
      setError('Could not load portfolio data. Please check the backend connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    const onFocus = () => fetchAll();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, [fetchAll]);

  return (
    <PortfolioContext.Provider
      value={{
        profile,
        projects,
        skills,
        groupedSkills,
        experience,
        loading,
        error,
        refresh: fetchAll,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export const usePortfolio = () => {
  const ctx = useContext(PortfolioContext);
  if (!ctx) throw new Error('usePortfolio must be used within PortfolioProvider');
  return ctx;
};
