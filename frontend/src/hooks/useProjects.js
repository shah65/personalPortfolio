import { useState, useEffect, useCallback } from 'react';
import * as projectApi from '../Api/project_Api/project.api';

export const useProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await projectApi.getAllProjects();
      if (response.success) {
        setProjects(response.data || []);
      } else {
        setError(response.message || 'Failed to fetch projects');
      }
    } catch (err) {
      setError(err.message || 'Network error');
      console.error('Fetch projects error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return { projects, loading, error, fetchProjects };
};