import { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

export const triggerComingSoon = (e?: React.MouseEvent) => {
  if (e) e.preventDefault();
  window.dispatchEvent(new CustomEvent('show-coming-soon'));
};

export const ComingSoonToast = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    
    const handleShow = () => {
      setIsVisible(false);
      // Small delay to allow the animation to reset if clicked multiple times rapidly
      setTimeout(() => {
        setIsVisible(true);
        clearTimeout(timeout);
        timeout = setTimeout(() => setIsVisible(false), 3000);
      }, 50);
    };

    window.addEventListener('show-coming-soon', handleShow as EventListener);
    return () => window.removeEventListener('show-coming-soon', handleShow as EventListener);
  }, []);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
      background: 'rgba(20, 20, 20, 0.8)', backdropFilter: 'blur(12px)',
      border: '1px solid var(--orange)', borderRadius: '100px',
      padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.8rem',
      boxShadow: '0 10px 40px rgba(255, 69, 0, 0.2)', zIndex: 9999,
      animation: 'toastFadeIn 0.3s forwards, toastFadeOut 0.3s 2.7s forwards'
    }}>
      <Sparkles size={18} color="var(--orange)" />
      <span style={{ fontWeight: 600, color: 'var(--white)', fontSize: '0.95rem' }}>
        Coming Soon! We're putting the final touches on this.
      </span>
    </div>
  );
};
