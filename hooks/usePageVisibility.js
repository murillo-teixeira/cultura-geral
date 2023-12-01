// hooks/usePageVisibility.js
import { useEffect } from 'react';

const usePageVisibility = (setWasPageOnBackground) => {
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        console.log('Page is now in the background');
        setWasPageOnBackground('y');
        console.log("changed state")
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [setWasPageOnBackground]);
};

export default usePageVisibility;
