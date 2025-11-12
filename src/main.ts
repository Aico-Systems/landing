import { mount } from 'svelte'

// Defer CSS loading to not block initial render
requestIdleCallback(() => {
  import('./app.css');
}, { timeout: 100 });

// Dynamic import App to split bundle
async function initApp() {
  const { default: App } = await import('./App.svelte');
  
  const target = document.getElementById('app');
  if (!target) return;
  
  // Remove skeleton
  const skeleton = document.querySelector('.nav-skeleton');
  if (skeleton) {
    skeleton.remove();
  }
  
  const app = mount(App, { target });
  return app;
}

// Start app initialization
const appPromise = initApp();

export default appPromise;
