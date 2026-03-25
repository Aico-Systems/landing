import { mount } from 'svelte'
import { initI18n } from './i18n';
import { fetchSiteContent } from './lib/cms/api';

function renderBootError(message: string) {
  const target = document.getElementById('app');
  const skeleton = document.querySelector('.nav-skeleton');
  if (skeleton) {
    skeleton.remove();
  }
  if (!target) return;

  target.innerHTML = `
    <section style="min-height:100vh;display:grid;place-items:center;padding:32px;background:#050b16;color:#e2e8f0;">
      <div style="width:min(680px,100%);padding:28px;border:1px solid rgba(148,163,184,0.18);border-radius:20px;background:rgba(15,23,42,0.84);box-shadow:0 24px 80px rgba(2,8,23,0.4);">
        <div style="display:inline-flex;min-height:30px;align-items:center;padding:0 12px;border-radius:999px;border:1px solid rgba(248,113,113,0.24);background:rgba(248,113,113,0.08);color:#fda4af;font-size:11px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;">CMS Offline</div>
        <h1 style="margin:18px 0 12px;font-size:clamp(32px,6vw,54px);line-height:1.05;letter-spacing:-0.04em;">Landing content is unavailable.</h1>
        <p style="margin:0;color:#94a3b8;font-size:18px;line-height:1.7;">${message}</p>
      </div>
    </section>
  `;
}

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

async function bootstrap() {
  try {
    const siteContent = await fetchSiteContent();
    initI18n(siteContent);

    // Defer CSS loading to not block initial render
    requestIdleCallback(() => {
      import('./app.css');
    }, { timeout: 100 });

    return await initApp();
  } catch (error) {
    renderBootError(
      error instanceof Error ? error.message : 'Failed to load CMS content.',
    );
    return undefined;
  }
}

// Start app initialization
const appPromise = bootstrap();

export default appPromise;
