<script lang="ts">
  import { onMount } from "svelte";
  import { theme } from "../../stores/theme";
  import {
    prefersReducedMotion,
    getConnectionQuality,
    rafScheduler,
  } from "../utils/performance";

  let canvas: HTMLCanvasElement;
  let mouseX = 0;
  let mouseY = 0;
  let animationFrameId: number;
  let currentTheme: "light" | "dark" = "light";

  // Adapt quality based on device capabilities
  const connectionQuality = getConnectionQuality();
  const reducedMotion = prefersReducedMotion();
  const barCount = connectionQuality === "slow" ? 40 : reducedMotion ? 45 : 60;

  // Phone input state
  let phoneNumber = "";
  let isSubmitting = false;
  let callStatus: "idle" | "success" | "error" = "idle";
  let statusMessage = "";
  let inputFocused = false;

  theme.subscribe((value) => {
    currentTheme = value;
  });

  async function initiateCall() {
    if (!phoneNumber.trim() || isSubmitting) return;

    isSubmitting = true;
    callStatus = "idle";
    statusMessage = "";

    try {
      // Use relative path which will be proxied by Caddy to the backend
      const apiUrl =
        window.location.hostname === "landing.aicoflow.xyz"
          ? "https://api.aicoflow.xyz"
          : "http://localhost:8000";

      const response = await fetch(`${apiUrl}/api/demo/call`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phoneNumber: phoneNumber.trim() }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        callStatus = "success";
        statusMessage = data.message || "Call initiated! Check your phone.";
        phoneNumber = "";
      } else {
        callStatus = "error";
        statusMessage = data.error || "Failed to initiate call";
      }
    } catch (error) {
      callStatus = "error";
      statusMessage = "Network error. Please try again.";
    } finally {
      isSubmitting = false;

      // Clear status after 5 seconds
      setTimeout(() => {
        callStatus = "idle";
        statusMessage = "";
      }, 5000);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === "Enter") {
      initiateCall();
    }
  }

  onMount(() => {
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
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
        const dpr = Math.min(window.devicePixelRatio, 2); // Cap at 2x for performance
        canvas.width = canvas.offsetWidth * dpr;
        canvas.height = canvas.offsetHeight * dpr;
        ctx.scale(dpr, dpr);
      }, 100);
    };
    resize();
    window.addEventListener("resize", resize);

    // Optimized mouse move with throttling
    let mouseMoveTimeout: number;
    const handleMouseMove = (e: MouseEvent) => {
      if (mouseMoveTimeout) return;
      mouseMoveTimeout = window.setTimeout(() => {
        const rect = canvas.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
        mouseMoveTimeout = 0;
      }, 16); // ~60fps
    };
    canvas.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
      },
      { threshold: 0.1 },
    );
    observer.observe(canvas);

    // Memoize gradient colors
    const gradientCache = new Map<string, CanvasGradient>();

    // Animation with FPS throttling and visibility check
    let time = 0;
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

      time += 0.01;

      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;

      // Pre-calculate mouse effect once
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const mouseDistance = Math.sqrt(dx * dx + dy * dy);
      const mouseEffect = reducedMotion
        ? 0
        : Math.max(0, 1 - mouseDistance / 200);

      for (let i = 0; i < barCount; i++) {
        const angle = (i / barCount) * Math.PI * 2;
        const distance = 80 + Math.sin(time + i * 0.1) * 20;

        const height =
          40 + Math.sin(time * 2 + i * 0.2) * 20 + mouseEffect * 30;
        const x = centerX + Math.cos(angle) * distance;
        const y = centerY + Math.sin(angle) * distance;
        const endX = centerX + Math.cos(angle) * (distance + height);
        const endY = centerY + Math.sin(angle) * (distance + height);

        // Use cached gradient or create new one
        const gradientKey = `${x},${y},${endX},${endY}`;
        let gradient = gradientCache.get(gradientKey);
        if (!gradient) {
          gradient = ctx.createLinearGradient(x, y, endX, endY);
          const alpha1 = 0.3 + mouseEffect * 0.5;
          const alpha2 = 0.6 + mouseEffect * 0.4;

          if (currentTheme === "dark") {
            gradient.addColorStop(0, `rgba(102, 126, 234, ${alpha1})`);
            gradient.addColorStop(1, `rgba(118, 75, 162, ${alpha2})`);
          } else {
            gradient.addColorStop(0, `rgba(102, 126, 234, ${alpha1})`);
            gradient.addColorStop(1, `rgba(118, 75, 162, ${alpha2})`);
          }

          // Limit cache size
          if (gradientCache.size > 100) {
            gradientCache.clear();
          }
          gradientCache.set(gradientKey, gradient);
        }

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 3;
        ctx.lineCap = "round";
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation with requestIdleCallback
    if ("requestIdleCallback" in window) {
      requestIdleCallback(() => animate(performance.now()), { timeout: 500 });
    } else {
      animate(performance.now());
    }

    return () => {
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousemove", handleMouseMove);
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
      clearTimeout(mouseMoveTimeout);
      gradientCache.clear();
    };
  });
</script>

<div class="waveform-wrapper">
  <canvas bind:this={canvas} class="waveform-canvas"></canvas>

  <div class="phone-input-overlay" class:focused={inputFocused}>
    <div class="input-panel">
      <div class="input-row">
        <div class="input-wrapper">
          <input
            type="tel"
            bind:value={phoneNumber}
            on:keydown={handleKeydown}
            on:focus={() => (inputFocused = true)}
            on:blur={() => (inputFocused = false)}
            placeholder="+49 170 123 4567"
            disabled={isSubmitting}
            class="phone-input"
          />
          <div class="input-glow"></div>
        </div>
        <button
          class="call-button"
          on:click={initiateCall}
          disabled={isSubmitting || !phoneNumber.trim()}
          aria-label="Anruf starten"
        >
          {#if isSubmitting}
            <svg
              class="spinner"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="3"
                fill="none"
                stroke-dasharray="31.4 31.4"
                stroke-linecap="round"
              >
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 12 12"
                  to="360 12 12"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
          {:else}
            <svg
              class="phone-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          {/if}
        </button>
      </div>

      <div class="consent-text" class:visible={inputFocused}>
        Mit dem Anruf bestätigst du unsere Kontaktaufnahme und unsere
        Datenschutzhinweise gelesen zu haben
      </div>
    </div>

    <div class="demo-badge" class:hidden={inputFocused}>
      <svg
        class="sparkle-icon"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 3L13.5 8.5L19 10L13.5 11.5L12 17L10.5 11.5L5 10L10.5 8.5L12 3Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M19 3L19.5 5L21.5 5.5L19.5 6L19 8L18.5 6L16.5 5.5L18.5 5L19 3Z"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
      </svg>
      Teste unseren KI-Agenten • Kostenloser Demo-Anruf
    </div>

    {#if statusMessage}
      <div
        class="status-message"
        class:success={callStatus === "success"}
        class:error={callStatus === "error"}
      >
        {statusMessage}
      </div>
    {/if}
  </div>
</div>

<style>
  .waveform-wrapper {
    position: relative;
    width: 100%;
    height: 420px;
  }

  .waveform-canvas {
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: rgba(var(--bg-secondary-rgb), 0.12);
    border: 1px solid rgba(102, 126, 234, 0.2);
    backdrop-filter: blur(22px) saturate(150%);
    box-shadow: 0 30px 80px rgba(15, 23, 42, 0.22);
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;
  }

  .waveform-canvas:hover {
    border-color: rgba(102, 126, 234, 0.45);
    box-shadow: 0 40px 110px rgba(15, 23, 42, 0.28);
  }

  .phone-input-overlay {
    position: absolute;
    top: 50%;
    left: 50%;
    /* Anchor to the visual center of the input row (approx 35px from top) */
    transform: translate(-50%, -35px);
    width: 82%;
    max-width: 360px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 10;
    pointer-events: none;
    transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .phone-input-overlay.focused {
    /* No vertical shift needed, content grows downwards */
    transform: translate(-50%, -35px);
  }

  .input-panel {
    width: 100%;
    border-radius: 16px;
    padding: 8px;
    backdrop-filter: blur(40px) saturate(200%);
    border: 1px solid rgba(102, 126, 234, 0.25);
    background: rgba(14, 19, 34, 0.6);
    box-shadow:
      0 20px 60px rgba(0, 0, 0, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    display: flex;
    flex-direction: column;
    gap: 0;
    pointer-events: auto;
    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
    overflow: hidden;
  }

  :global([data-theme="light"]) .input-panel {
    background: rgba(255, 255, 255, 0.75);
    border-color: rgba(102, 126, 234, 0.3);
    box-shadow:
      0 20px 60px rgba(102, 126, 234, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
  }

  .phone-input-overlay.focused .input-panel {
    background: rgba(14, 19, 34, 0.8);
    border-color: rgba(102, 126, 234, 0.5);
    box-shadow:
      0 30px 80px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.1),
      0 0 0 1px rgba(102, 126, 234, 0.2);
  }

  :global([data-theme="light"]) .phone-input-overlay.focused .input-panel {
    background: rgba(255, 255, 255, 0.95);
  }

  .input-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px;
    position: relative;
    z-index: 2;
  }

  .input-wrapper {
    position: relative;
    flex: 1;
    display: flex;
    align-items: center;
  }

  .phone-input {
    width: 100%;
    padding: 12px 16px;
    border: 1px solid transparent;
    background: transparent;
    border-radius: 10px;
    font-size: 16px;
    font-weight: 500;
    color: #f8fafc;
    outline: none;
    font-family: inherit;
    transition: all 0.3s ease;
  }

  :global([data-theme="light"]) .phone-input {
    color: #0f172a;
  }

  .phone-input::placeholder {
    color: rgba(248, 250, 252, 0.4);
    transition: color 0.3s ease;
  }

  :global([data-theme="light"]) .phone-input::placeholder {
    color: rgba(15, 23, 42, 0.4);
  }

  .phone-input:focus::placeholder {
    color: rgba(248, 250, 252, 0.2);
  }

  .call-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 44px;
    height: 44px;
    border: none;
    border-radius: 10px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
    flex-shrink: 0;
  }

  .call-button:hover:not(:disabled) {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(102, 126, 234, 0.5);
  }

  .call-button:active:not(:disabled) {
    transform: scale(0.95);
  }

  .call-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background: #334155;
    box-shadow: none;
  }

  :global([data-theme="light"]) .call-button:disabled {
    background: #cbd5e1;
  }

  .phone-icon {
    width: 20px;
    height: 20px;
  }

  .spinner {
    width: 20px;
    height: 20px;
  }

  .consent-text {
    font-size: 11px;
    line-height: 1.4;
    color: rgba(248, 250, 252, 0.5);
    text-align: center;
    padding: 0 12px;
    border-top: 1px solid rgba(102, 126, 234, 0.1);
    margin-top: 0;
    max-height: 0;
    opacity: 0;
    overflow: hidden;
    transition:
      max-height 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.4s ease 0.1s,
      margin-top 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      padding-bottom 0.5s cubic-bezier(0.16, 1, 0.3, 1),
      padding-top 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .consent-text.visible {
    max-height: 60px;
    opacity: 1;
    margin-top: 4px;
    padding-bottom: 8px;
    padding-top: 12px;
  }

  :global([data-theme="light"]) .consent-text {
    color: rgba(15, 23, 42, 0.6);
    border-top-color: rgba(102, 126, 234, 0.15);
  }

  .demo-badge {
    padding: 8px 16px;
    border-radius: 999px;
    background: rgba(102, 126, 234, 0.15);
    border: 1px solid rgba(102, 126, 234, 0.3);
    color: #e0e7ff;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.02em;
    backdrop-filter: blur(12px);
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    pointer-events: auto;
    transition:
      opacity 0.3s ease,
      transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    transform-origin: center top;
  }

  .demo-badge.hidden {
    opacity: 0;
    transform: translateY(10px) scale(0.95);
    pointer-events: none;
  }

  :global([data-theme="light"]) .demo-badge {
    color: #4c5fe3;
    background: rgba(255, 255, 255, 0.6);
    border-color: rgba(102, 126, 234, 0.25);
  }

  .sparkle-icon {
    width: 14px;
    height: 14px;
    color: #818cf8;
  }

  .status-message {
    position: absolute;
    bottom: -60px;
    left: 50%;
    transform: translateX(-50%);
    padding: 12px 24px;
    border-radius: 14px;
    font-size: 14px;
    font-weight: 600;
    text-align: center;
    backdrop-filter: blur(20px) saturate(180%);
    white-space: nowrap;
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.3);
    pointer-events: auto;
    z-index: 20;
    animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .status-message.success {
    background: rgba(16, 185, 129, 0.2);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.4);
  }

  .status-message.error {
    background: rgba(239, 68, 68, 0.2);
    color: #f87171;
    border: 1px solid rgba(239, 68, 68, 0.4);
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateX(-50%) translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }

  @keyframes pulse {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.85;
    }
  }

  @media (max-width: 768px) {
    .waveform-wrapper {
      height: 340px;
    }

    .phone-input-overlay {
      width: 90%;
    }

    .input-panel {
      padding: 6px;
    }

    .phone-input {
      font-size: 15px;
      padding: 10px 12px;
    }

    .call-button {
      width: 40px;
      height: 40px;
    }

    .phone-icon {
      width: 18px;
      height: 18px;
    }

    .demo-badge {
      font-size: 10px;
      padding: 6px 14px;
      margin-top: 8px;
    }

    .sparkle-icon {
      width: 12px;
      height: 12px;
    }

    .status-message {
      bottom: -48px;
      padding: 9px 18px;
      font-size: 12px;
      max-width: 88%;
      white-space: normal;
    }

    .consent-text {
      font-size: 9px;
    }
  }
</style>
