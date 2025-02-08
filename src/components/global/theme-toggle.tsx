'use client';

import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';

const MotionSun = motion.create(Sun);
const MotionMoon = motion.create(Moon);


export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const handleToggle = () => {
    if (setTheme) {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9 relative"
      onClick={handleToggle}
    >
      <MotionSun
        className="h-4 w-4 absolute"
        animate={{
          scale: theme === 'dark' ? 0 : 1,
          rotate: theme === 'dark' ? -90 : 0,
          opacity: theme === 'dark' ? 0 : 1
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      <MotionMoon
        className="h-4 w-4 absolute"
        animate={{
          scale: theme === 'dark' ? 1 : 0,
          rotate: theme === 'dark' ? 0 : 90,
          opacity: theme === 'dark' ? 1 : 0
        }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
      />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}

export default ThemeToggle;