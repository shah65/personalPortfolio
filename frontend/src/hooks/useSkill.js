import { useState, useEffect, useCallback } from 'react';
import * as skillApi from '../Api/skill_Api/akill.api';

export const useSkills = () => {
  const [skills, setSkills] = useState([]);
  const [groupedSkills, setGroupedSkills] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSkills = useCallback(async (category = null) => {
    setLoading(true);
    setError(null);
    try {
      const response = await skillApi.getAllSkills(category);
      if (response?.success) {
        setSkills(response.data || []);
        setGroupedSkills(response.groupedByCategory || {});
      } else {
        setSkills([]);
      }
    } catch (err) {
      if (err.status === 404) {
        setSkills([]);
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchSkills(); }, [fetchSkills]);

  return { skills, groupedSkills, loading, error, fetchSkills };
};