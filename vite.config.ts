import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  plugins: [svelte()],
  
  build: {
    // Disable minification for rolldown-vite (it has its own minification)
    minify: false,
    
    // Optimize chunk splitting for better caching and faster initial load
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Aggressive vendor splitting - defer heavy libraries
          if (id.includes('node_modules')) {
            // Heavy libraries that should load last
            if (id.includes('three')) {
              return 'three-vendor';
            }
            if (id.includes('globe.gl')) {
              return 'globe-vendor';
            }
            if (id.includes('gsap')) {
              return 'animation-vendor';
            }
            // Split lucide icons more granularly to reduce initial bundle
            if (id.includes('lucide-svelte')) {
              // Split by icon groups if possible
              return 'icons-vendor';
            }
            // Core svelte should be separate for caching
            if (id.includes('svelte')) {
              return 'svelte-vendor';
            }
            return 'vendor'; // All other node_modules
          }
          
          // Split components by route/section for better lazy loading
          if (id.includes('src/lib/')) {
            if (id.includes('WebGL') || id.includes('Globe') || id.includes('Canvas')) {
              return 'graphics';
            }
            if (id.includes('Navigation') || id.includes('Hero')) {
              return 'critical';
            }
          }
        },
        
        // Optimize chunk file names
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    
    // Increase chunk size warning limit (500kb)
    chunkSizeWarningLimit: 500,
    
    // Disable sourcemaps for smaller bundle size
    sourcemap: false,
    
    // Target modern browsers for smaller bundles
    target: 'es2020',
    
    // Enable CSS code splitting for better caching
    cssCodeSplit: true,
    
    // Optimize asset inlining threshold (4kb)
    assetsInlineLimit: 4096,
    
    // Enable module preloading hints
    modulePreload: {
      polyfill: false // Assume modern browsers
    }
  },
  
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: ['three', 'globe.gl', 'gsap', 'lucide-svelte']
  },
  
  // Performance hints - warm up critical files during dev
  server: {
    warmup: {
      clientFiles: [
        './src/App.svelte',
        './src/lib/Hero.svelte',
        './src/lib/Navigation.svelte'
      ]
    }
  }
})
