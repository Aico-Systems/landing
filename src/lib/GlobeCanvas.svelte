<script lang="ts">
  import { onMount } from 'svelte';

  let canvas: HTMLCanvasElement;
  let animationFrameId: number;

  interface Arc {
    start: { x: number; y: number };
    end: { x: number; y: number };
    progress: number;
    speed: number;
  }

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });
    if (!ctx) return;

    let isVisible = true;
    let lastFrameTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    // Optimized resize with debouncing
    let resizeTimeout: number;
    const resize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = window.setTimeout(() => {
        const dpr = Math.min(window.devicePixelRatio, 2);
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
      }, 100);
    };
    resize();
    window.addEventListener('resize', resize);

    // Pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 }
    );
    observer.observe(canvas);

    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) - 40;

    // Reduce arc count for better performance
    const arcs: Arc[] = [];
    for (let i = 0; i < 15; i++) {
      const startAngle = Math.random() * Math.PI * 2;
      const endAngle = Math.random() * Math.PI * 2;
      
      arcs.push({
        start: {
          x: centerX + Math.cos(startAngle) * radius,
          y: centerY + Math.sin(startAngle) * radius
        },
        end: {
          x: centerX + Math.cos(endAngle) * radius,
          y: centerY + Math.sin(endAngle) * radius
        },
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003
      });
    }

    let rotation = 0;

    const animate = (currentTime: number) => {
      if (!isVisible) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }

      // Throttle to target FPS
      const elapsed = currentTime - lastFrameTime;
      if (elapsed < frameInterval) {
        animationFrameId = requestAnimationFrame(animate);
        return;
      }
      lastFrameTime = currentTime - (elapsed % frameInterval);

      rotation += 0.002;
      
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      // Draw globe outline
      ctx.strokeStyle = 'rgba(102, 126, 234, 0.3)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();

      // Draw rotating meridians
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI + rotation;
        
        ctx.strokeStyle = 'rgba(102, 126, 234, 0.15)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        
        for (let t = 0; t <= 1; t += 0.01) {
          const y = centerY + (t - 0.5) * radius * 2;
          const offsetX = Math.sin(t * Math.PI) * Math.cos(angle) * radius * 0.8;
          const x = centerX + offsetX;
          
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      // Draw connection arcs
      arcs.forEach(arc => {
        arc.progress += arc.speed;
        if (arc.progress > 1) arc.progress = 0;

        const controlX = centerX;
        const controlY = centerY - radius * 0.5;

        ctx.strokeStyle = `rgba(102, 126, 234, ${0.5 * (1 - arc.progress)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();

        for (let t = 0; t <= arc.progress; t += 0.02) {
          const t2 = 1 - t;
          const x = t2 * t2 * arc.start.x + 2 * t2 * t * controlX + t * t * arc.end.x;
          const y = t2 * t2 * arc.start.y + 2 * t2 * t * controlY + t * t * arc.end.y;
          
          if (t === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();

        // Draw endpoint glow
        if (arc.progress < 0.95) {
          const t = arc.progress;
          const t2 = 1 - t;
          const x = t2 * t2 * arc.start.x + 2 * t2 * t * controlX + t * t * arc.end.x;
          const y = t2 * t2 * arc.start.y + 2 * t2 * t * controlY + t * t * arc.end.y;

          const gradient = ctx.createRadialGradient(x, y, 0, x, y, 8);
          gradient.addColorStop(0, 'rgba(102, 126, 234, 0.8)');
          gradient.addColorStop(1, 'rgba(102, 126, 234, 0)');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(x, y, 8, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation with requestIdleCallback
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => animate(performance.now()), { timeout: 500 });
    } else {
      animate(performance.now());
    }

    return () => {
      window.removeEventListener('resize', resize);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  });
</script>

<canvas bind:this={canvas} class="globe-canvas"></canvas>

<style>
  .globe-canvas {
    width: 100%;
    height: 500px;
    border-radius: 16px;
  }

  @media (max-width: 768px) {
    .globe-canvas {
      height: 400px;
    }
  }
</style>
