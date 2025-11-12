import { writable } from 'svelte/store';

// Check for saved theme preference or default to 'light'
const getInitialTheme = (): 'light' | 'dark' => {
  if (typeof window === 'undefined') return 'light';
  
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') return saved;
  
  // Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }
  
  return 'light';
};

export const theme = writable<'light' | 'dark'>(getInitialTheme());

// Subscribe to theme changes and update localStorage and document
theme.subscribe(value => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('theme', value);
  document.documentElement.setAttribute('data-theme', value);
});

export const toggleTheme = () => {
  theme.update(current => current === 'light' ? 'dark' : 'light');
};
