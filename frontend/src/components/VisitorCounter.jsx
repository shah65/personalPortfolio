import { useState, useEffect } from 'react';
import api from '../Api/axiosConfig';

const VisitorCounter = () => {
  const [visitorCount, setVisitorCount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        // Check if already counted this session
        const hasVisited = sessionStorage.getItem('hasVisited');

        if (!hasVisited) {
          // Increment counter for new visitor
          await api.post('/visitor/increment');
          sessionStorage.setItem('hasVisited', 'true');
        }

        // Get current count
        const response = await api.get('/visitor/count');
        if (response.data.success) {
          setVisitorCount(response.data.data.count);
        }
      } catch (error) {
        console.error('Failed to get visitor count:', error);
      } finally {
        setLoading(false);
      }
    };

    trackVisitor();
  }, []);

  if (loading) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      right: '20px',
      background: 'rgba(0, 0, 0, 0.7)',
      backdropFilter: 'blur(10px)',
      padding: '8px 16px',
      borderRadius: '20px',
      fontSize: '12px',
      color: '#00d4ff',
      fontFamily: "'Space Grotesk', sans-serif",
      zIndex: 1000,
      border: '1px solid rgba(0, 212, 255, 0.3)',
      cursor: 'pointer',
    }}
      title="Total visitors"
    >
      👥 {visitorCount?.toLocaleString()} visitors
    </div>
  );
};

export default VisitorCounter;