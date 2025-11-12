<script lang="ts">
  import { onDestroy, onMount } from 'svelte';
  import { get } from 'svelte/store';
  import Globe, { type GlobeInstance } from 'globe.gl';
  import * as THREE from 'three';
  import { theme } from '../stores/theme';

  type ThemeKey = 'light' | 'dark';

  interface City {
    id: string;
    name: string;
    lat: number;
    lng: number;
    altitude: number;
    intensity: number;
    region: string;
    pulse?: boolean;
    radius: number;
    ringRadius: number;
    label: string;
  }

  interface ArcConnection {
    startLat: number;
    startLng: number;
    endLat: number;
    endLng: number;
    altitude: number;
    intensity: number;
    stroke: number;
    dashTime: number;
  }

  type BaseCity = Omit<City, 'radius' | 'ringRadius' | 'label'>;

  // Well-distributed global network of tech and business hubs
  const baseCities: BaseCity[] = [
    // North America (better spread - removed Seattle, Chicago, Toronto)
    { id: 'san-francisco', name: 'San Francisco', lat: 37.7749, lng: -122.4194, altitude: 0.08, intensity: 1, region: 'USA · Silicon Valley' },
    { id: 'new-york', name: 'New York', lat: 40.7128, lng: -74.006, altitude: 0.07, intensity: 0.95, region: 'USA · Finance Capital' },
    { id: 'miami', name: 'Miami', lat: 25.7617, lng: -80.1918, altitude: 0.05, intensity: 0.66, region: 'USA · Gateway Americas' },
    { id: 'mexico-city', name: 'Mexico City', lat: 19.4326, lng: -99.1332, altitude: 0.052, intensity: 0.68, region: 'Mexico · LatAm Bridge' },
    
    // South America (better spread)
    { id: 'sao-paulo', name: 'São Paulo', lat: -23.5505, lng: -46.6333, altitude: 0.055, intensity: 0.72, region: 'Brazil · Business Capital' },
    { id: 'buenos-aires', name: 'Buenos Aires', lat: -34.6037, lng: -58.3816, altitude: 0.05, intensity: 0.64, region: 'Argentina · South Cone' },
    
    // Europe (better spread - removed Paris, kept major hubs)
    { id: 'london', name: 'London', lat: 51.5074, lng: -0.1278, altitude: 0.07, intensity: 0.93, region: 'UK · Global Finance' },
    { id: 'frankfurt', name: 'Frankfurt', lat: 50.1109, lng: 8.6821, altitude: 0.058, intensity: 0.78, region: 'Germany · Data Center' },
    { id: 'stockholm', name: 'Stockholm', lat: 59.3293, lng: 18.0686, altitude: 0.052, intensity: 0.70, region: 'Sweden · Nordic Tech' },
    { id: 'madrid', name: 'Madrid', lat: 40.4168, lng: -3.7038, altitude: 0.05, intensity: 0.66, region: 'Spain · Iberian Hub' },
    { id: 'moscow', name: 'Moscow', lat: 55.7558, lng: 37.6173, altitude: 0.054, intensity: 0.73, region: 'Russia · Eastern Hub' },
    
    // Middle East & Africa (well spread - removed Tel Aviv)
    { id: 'dubai', name: 'Dubai', lat: 25.2048, lng: 55.2708, altitude: 0.065, intensity: 0.84, region: 'UAE · Gateway East' },
    { id: 'lagos', name: 'Lagos', lat: 6.5244, lng: 3.3792, altitude: 0.05, intensity: 0.65, region: 'Nigeria · African Power' },
    { id: 'cape-town', name: 'Cape Town', lat: -33.9249, lng: 18.4241, altitude: 0.048, intensity: 0.61, region: 'South Africa · Tech Capital' },
    
    // Asia-Pacific (better distributed - removed Hong Kong, Seoul, Shanghai)
    { id: 'singapore', name: 'Singapore', lat: 1.3521, lng: 103.8198, altitude: 0.07, intensity: 0.90, region: 'Singapore · Asia Nexus' },
    { id: 'tokyo', name: 'Tokyo', lat: 35.6762, lng: 139.6503, altitude: 0.068, intensity: 0.89, region: 'Japan · Tech Capital' },
    { id: 'bangalore', name: 'Bengaluru', lat: 12.9716, lng: 77.5946, altitude: 0.06, intensity: 0.81, region: 'India · AI Capital' },
    { id: 'sydney', name: 'Sydney', lat: -33.8688, lng: 151.2093, altitude: 0.058, intensity: 0.78, region: 'Australia · Pacific' },
    { id: 'bangkok', name: 'Bangkok', lat: 13.7563, lng: 100.5018, altitude: 0.05, intensity: 0.67, region: 'Thailand · Southeast Hub' },
    { id: 'auckland', name: 'Auckland', lat: -36.8485, lng: 174.7633, altitude: 0.048, intensity: 0.63, region: 'New Zealand · Pacific' }
  ];

  const cities: City[] = baseCities.map((city) => ({
    ...city,
    radius: 0.11 + city.intensity * 0.02,
    ringRadius: 2 + city.intensity * 3,
    label: `<div class="globe-tooltip"><strong>${city.name}</strong><span>${city.region}</span></div>`
  }));

  // Comprehensive global network - realistic flight routes and data corridors
  const connectionPairs: Array<[string, string, number]> = [
    // Trans-Pacific (major routes)
    ['san-francisco', 'tokyo', 1],
    ['san-francisco', 'singapore', 0.88],
    ['san-francisco', 'sydney', 0.82],
    ['tokyo', 'sydney', 0.8],
    ['tokyo', 'singapore', 0.87],
    
    // Trans-Atlantic (major routes)
    ['new-york', 'london', 0.95],
    ['san-francisco', 'london', 0.92],
    ['new-york', 'frankfurt', 0.86],
    ['miami', 'madrid', 0.75],
    ['miami', 'london', 0.82],
    
    // Europe ↔ Asia
    ['london', 'singapore', 0.90],
    ['london', 'tokyo', 0.85],
    ['london', 'dubai', 0.87],
    ['frankfurt', 'singapore', 0.84],
    ['frankfurt', 'tokyo', 0.83],
    ['frankfurt', 'dubai', 0.86],
    ['madrid', 'dubai', 0.76],
    
    // European network
    ['london', 'frankfurt', 0.83],
    ['london', 'stockholm', 0.75],
    ['london', 'madrid', 0.78],
    ['london', 'moscow', 0.77],
    ['frankfurt', 'stockholm', 0.72],
    ['frankfurt', 'moscow', 0.74],
    ['stockholm', 'moscow', 0.71],
    ['madrid', 'frankfurt', 0.74],
    
    // North America network
    ['san-francisco', 'new-york', 0.92],
    ['san-francisco', 'miami', 0.84],
    ['san-francisco', 'mexico-city', 0.78],
    ['new-york', 'miami', 0.80],
    ['new-york', 'mexico-city', 0.77],
    ['miami', 'mexico-city', 0.73],
    
    // Asia-Pacific network
    ['singapore', 'sydney', 0.82],
    ['singapore', 'tokyo', 0.87],
    ['singapore', 'bangkok', 0.76],
    ['tokyo', 'sydney', 0.81],
    ['tokyo', 'bangkok', 0.79],
    ['sydney', 'auckland', 0.74],
    ['bangkok', 'sydney', 0.73],
    
    // India connections
    ['bangalore', 'singapore', 0.85],
    ['bangalore', 'dubai', 0.82],
    ['bangalore', 'london', 0.86],
    ['bangalore', 'tokyo', 0.84],
    ['bangalore', 'bangkok', 0.77],
    
    // Middle East hub
    ['dubai', 'singapore', 0.89],
    ['dubai', 'tokyo', 0.85],
    ['dubai', 'frankfurt', 0.86],
    ['dubai', 'london', 0.87],
    ['dubai', 'moscow', 0.79],
    
    // South America
    ['sao-paulo', 'new-york', 0.83],
    ['sao-paulo', 'london', 0.81],
    ['sao-paulo', 'miami', 0.76],
    ['sao-paulo', 'buenos-aires', 0.72],
    ['sao-paulo', 'madrid', 0.78],
    ['buenos-aires', 'miami', 0.74],
    ['buenos-aires', 'madrid', 0.75],
    ['mexico-city', 'miami', 0.73],
    ['mexico-city', 'new-york', 0.77],
    ['mexico-city', 'sao-paulo', 0.76],
    
    // Africa connections
    ['lagos', 'london', 0.78],
    ['lagos', 'dubai', 0.74],
    ['lagos', 'sao-paulo', 0.72],
    ['cape-town', 'london', 0.76],
    ['cape-town', 'dubai', 0.75],
    ['cape-town', 'singapore', 0.77],
    
    // Cross-region long routes
    ['san-francisco', 'bangalore', 0.88],
    ['new-york', 'singapore', 0.87],
    ['london', 'sydney', 0.84],
    ['tokyo', 'new-york', 0.89]
  ];

  const cityIndex = new Map(cities.map((city) => [city.id, city]));

  const arcs: ArcConnection[] = connectionPairs
    .map(([sourceId, targetId, strength]) => {
      const source = cityIndex.get(sourceId);
      const target = cityIndex.get(targetId);
      if (!source || !target) return null;
      return {
        startLat: source.lat,
        startLng: source.lng,
        endLat: target.lat,
        endLng: target.lng,
        altitude: 0.12 + strength * 0.18, // Flatter, lower arcs
        intensity: strength,
        stroke: 0.5 + strength * 0.6, // Thicker arcs
        dashTime: 3200 - strength * 600 // Slower animation
      };
    })
    .filter(Boolean) as ArcConnection[];

  interface TexturePalette {
    gradient: Array<{ stop: number; color: string }>;
    highlight: {
      color: string;
      center: [number, number];
      innerRadius: number;
      outerRadius: number;
      opacity: number;
    };
    grid: { color: string; opacity: number };
    vignette: { start: number; end: number; color: string };
  }

  const texturePalettes: Record<ThemeKey, TexturePalette> = {
    light: {
      gradient: [
        { stop: 0, color: '#f6f7ff' },
        { stop: 0.55, color: '#e7ebff' },
        { stop: 1, color: '#d5dbff' }
      ],
      highlight: {
        color: 'rgba(255, 255, 255, 0.7)',
        center: [0.38, 0.32],
        innerRadius: 0.06,
        outerRadius: 0.34,
        opacity: 0.35
      },
      grid: { color: '#c3ccff', opacity: 0.22 },
      vignette: { start: 0.68, end: 1, color: 'rgba(91, 108, 255, 0.22)' }
    },
    dark: {
      gradient: [
        { stop: 0, color: '#0a1224' },
        { stop: 0.5, color: '#0b1530' },
        { stop: 1, color: '#081224' }
      ],
      highlight: {
        color: 'rgba(118, 151, 255, 0.5)',
        center: [0.42, 0.36],
        innerRadius: 0.05,
        outerRadius: 0.32,
        opacity: 0.32
      },
      grid: { color: '#1c2b4d', opacity: 0.35 },
      vignette: { start: 0.62, end: 1, color: 'rgba(44, 58, 112, 0.32)' }
    }
  };

  const flatTextureCache: Partial<Record<ThemeKey, string>> = {};

  function createFlatTexture(themeKey: ThemeKey): string {
    const palette = texturePalettes[themeKey];
    const canvas = document.createElement('canvas');
    // Ultra-low res since we blur it anyway - 512x256 is plenty
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d', { 
      alpha: false,  // No alpha channel needed for globe texture
      willReadFrequently: false 
    });
    if (!ctx) return '';

    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    palette.gradient.forEach(({ stop, color }) => gradient.addColorStop(stop, color));
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // highlight
    ctx.save();
    ctx.globalAlpha = palette.highlight.opacity;
    const [cx, cy] = palette.highlight.center;
    const highlight = ctx.createRadialGradient(
      canvas.width * cx, canvas.height * cy, canvas.height * palette.highlight.innerRadius,
      canvas.width * cx, canvas.height * cy, canvas.height * palette.highlight.outerRadius
    );
    highlight.addColorStop(0, palette.highlight.color);
    highlight.addColorStop(0.9, 'rgba(255,255,255,0)');
    highlight.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = highlight;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // grid - simplified to reduce draw calls
    ctx.save();
    ctx.globalAlpha = palette.grid.opacity;
    ctx.strokeStyle = palette.grid.color;
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let lat = -60; lat <= 60; lat += 30) {
      const y = ((90 - lat) / 180) * canvas.height;
      ctx.moveTo(0, y); 
      ctx.lineTo(canvas.width, y);
    }
    for (let lng = -150; lng <= 150; lng += 30) {
      const x = ((lng + 180) / 360) * canvas.width;
      ctx.moveTo(x, 0); 
      ctx.lineTo(x, canvas.height);
    }
    ctx.stroke(); // Single stroke call for all lines
    ctx.restore();

    // vignette
    const vignette = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, canvas.height * palette.vignette.start,
      canvas.width / 2, canvas.height / 2, canvas.height * palette.vignette.end
    );
    vignette.addColorStop(0, 'rgba(0,0,0,0)');
    vignette.addColorStop(1, palette.vignette.color);
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Use JPEG for better compression and faster loading
    return canvas.toDataURL('image/jpeg', 0.85);
  }

  function getFlatTexture(themeKey: ThemeKey): string {
    if (!flatTextureCache[themeKey]) flatTextureCache[themeKey] = createFlatTexture(themeKey);
    return flatTextureCache[themeKey]!;
  }

  // Clean theme configuration - pure, cold colors only
  const themeStyles = {
    light: {
      background: '#f5f7ff',
      gradient: 'linear-gradient(158deg, rgba(255,255,255,0.96) 0%, rgba(220,227,255,0.75) 48%, rgba(180,194,255,0.58) 100%)',
      overlay: 'radial-gradient(circle at 46% 34%, rgba(180,190,255,0.12) 0%, rgba(120,140,255,0.08) 32%, rgba(255,255,255,0) 64%)',
      baseColor: '#e8edff',
      emissive: '#c5d1ff',
      emissiveIntensity: 0.12,
      shininess: 22,
      cityColor: '#3d51ff',
      arcColor: ['#667eea', '#764ba2'] as [string, string],
      ringColor: 'rgba(68, 86, 255, 0.5)',
      autoRotateSpeed: 0.2,
      exposure: 1.1,
      lights: {
        ambient: { color: '#ffffff', intensity: 0.75 },
        key: { color: '#ffffff', intensity: 1.6, position: [180, 240, 200] as [number, number, number] },
        fill: { color: '#c8d5ff', intensity: 0.35, position: [-120, 100, -240] as [number, number, number] },
        rim: { color: '#e8ecf5', intensity: 0.45, position: [-100, 280, 120] as [number, number, number] }
      },
      fog: { near: 420, far: 720 }
    },
    dark: {
      background: '#060810',
      gradient: 'linear-gradient(165deg, rgba(6,8,16,0.95) 0%, rgba(12,16,28,0.92) 52%, rgba(6,8,16,0.95) 100%)',
      overlay: 'radial-gradient(circle at 52% 36%, rgba(102, 126, 234, 0.14) 0%, rgba(6,8,16,0) 62%)',
      baseColor: '#111420',
      emissive: '#090b12',
      emissiveIntensity: 0.20,
      shininess: 10,
      cityColor: '#b8c4ff',
      arcColor: ['#667eea', '#8a7ed4'] as [string, string],
      ringColor: 'rgba(184, 196, 255, 0.45)',
      autoRotateSpeed: 0.2,
      exposure: 1.15,
      lights: {
        ambient: { color: '#dde2ef', intensity: 0.80 },
        key: { color: '#f5f7fc', intensity: 1.15, position: [200, 200, 320] as [number, number, number] },
        fill: { color: '#dde2ef', intensity: 0.52, position: [-140, 80, -240] as [number, number, number] },
        rim: { color: '#dde2ef', intensity: 0.48, position: [-90, 320, 140] as [number, number, number] }
      },
      fog: { near: 420, far: 780 }
    }
  } as const;

  let wrapper: HTMLDivElement;
  let container: HTMLDivElement;
  let globe: GlobeInstance | null = null;
  let themeStop: (() => void) | undefined;
  let currentTheme: ThemeKey = (get(theme) as ThemeKey) ?? 'light';
  
  // Performance optimization flags
  let isVisible = true;
  let rafThrottle: number | null = null;
  let lastScrollTime = 0;
  const SCROLL_THROTTLE = 100; // ms
  
  // Adaptive quality settings based on device capabilities
  function getDeviceQuality(): 'low' | 'medium' | 'high' {
    if (typeof window === 'undefined') return 'medium';
    
    // Check device memory (if available)
    const memory = (navigator as any).deviceMemory;
    if (memory && memory < 4) return 'low';
    
    // Check hardware concurrency
    const cores = navigator.hardwareConcurrency || 4;
    if (cores < 4) return 'low';
    
    // Check for mobile
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    if (isMobile) return 'low';
    
    // Check screen size
    if (window.innerWidth < 768) return 'low';
    if (window.innerWidth < 1200) return 'medium';
    
    return 'high';
  }
  
  const deviceQuality = getDeviceQuality();

  // Camera + layout presets per section (POV + globeOffset in pixels)
  interface CameraPosition { lat: number; lng: number; altitude: number; }
  interface SectionView { pov: CameraPosition; offset: [number, number]; }

  const sectionViews: Record<string, SectionView> = {
    hero:         { pov: { lat: 16,  lng: -26,  altitude: 1.6  }, offset: [-160, 120] },
    'how-it-works': { pov: { lat: 6,   lng: 46,   altitude: 2.15 }, offset: [-40, -20] },
    features:     { pov: { lat: -14, lng: -48,  altitude: 1.85 }, offset: [120, 50] },
    'use-cases':  { pov: { lat: 28,  lng: 94,   altitude: 1.9  }, offset: [-200, 30] },
    testimonials: { pov: { lat: -24, lng: -104, altitude: 2.05 }, offset: [150, -60] },
    cta:          { pov: { lat: 0,   lng: 12,   altitude: 2.4  }, offset: [0, 150] }
  };

  let currentSection = 'hero';
  let isTransitioning = false;
  let transitionTimeout: ReturnType<typeof setTimeout> | null = null;
  let pendingSection: string | null = null;

  // --- Smooth offset tweening state & helpers ---
  let currentOffset: [number, number] = [0, 0];
  let targetOffset: [number, number] = [0, 0];
  let offsetAnim: { raf?: number; start?: number; from?: [number, number]; to?: [number, number]; dur?: number } | null = null;

  const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
  // nice ease for UI motion
  const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

  function getScaledOffset(offset: [number, number]): [number, number] {
    const w = wrapper?.clientWidth ?? window.innerWidth;
    // scale offsets relative to a 1440px design width
    const scale = clamp(w / 1440, 0.75, 1.15);
    return [Math.round(offset[0] * scale), Math.round(offset[1] * scale)];
  }

  function cancelOffsetAnim() {
    if (offsetAnim?.raf) cancelAnimationFrame(offsetAnim.raf);
    offsetAnim = null;
  }

  function animateGlobeOffset(toRaw: [number, number], duration = 1200) {
    if (!globe) return;
    const to = getScaledOffset(toRaw);
    cancelOffsetAnim();

    const from: [number, number] = [...currentOffset];
    targetOffset = [...to];
    
    // If already at target, don't animate
    if (Math.abs(from[0] - to[0]) < 1 && Math.abs(from[1] - to[1]) < 1) {
      currentOffset = [...to];
      globe.globeOffset(to);
      return;
    }

    offsetAnim = { start: performance.now(), from, to, dur: duration };

    const tick = (now: number) => {
      if (!offsetAnim || !globe) return;
      const { start, dur } = offsetAnim;
      const t = clamp((now - (start || 0)) / (dur || 1), 0, 1);
      const k = easeInOut(t);
      const x = Math.round(lerp(from[0], to[0], k));
      const y = Math.round(lerp(from[1], to[1], k));
      
      try {
        globe.globeOffset([x, y]);
        currentOffset = [x, y];
      } catch (e) {
        console.error('Error setting globe offset:', e);
        cancelOffsetAnim();
        return;
      }

      if (t < 1) {
        offsetAnim.raf = requestAnimationFrame(tick);
      } else {
        cancelOffsetAnim();
      }
    };
    offsetAnim.raf = requestAnimationFrame(tick);
  }
  // ---------------------------------------------

  let resizeTimeout: number | null = null;
  
  function handleResize() {
    if (!globe || !wrapper) return;
    
    // Debounce resize to avoid excessive recalculations
    if (resizeTimeout) clearTimeout(resizeTimeout);
    
    resizeTimeout = window.setTimeout(() => {
      if (!globe || !wrapper) return;
      const width = wrapper.clientWidth;
      const height = wrapper.clientHeight;
      globe.width(width);
      globe.height(height);

      // when the viewport changes, rescale and apply the target offset
      const rescaled = getScaledOffset(targetOffset);
      currentOffset = [...rescaled];
      globe.globeOffset(rescaled);
    }, 150);
  }

  function handleScroll() {
    if (!globe || !isVisible) return;
    
    // Throttle scroll events for better performance
    const now = Date.now();
    if (now - lastScrollTime < SCROLL_THROTTLE) {
      if (rafThrottle) return;
      rafThrottle = requestAnimationFrame(() => {
        rafThrottle = null;
        handleScrollInternal();
      });
      return;
    }
    
    lastScrollTime = now;
    handleScrollInternal();
  }
  
  function handleScrollInternal() {
    if (!globe) return;

    const sections = ['hero', 'how-it-works', 'features', 'use-cases', 'testimonials', 'cta'];
    const scrollPosition = window.scrollY + window.innerHeight / 2;

    let activeSection = 'hero';
    for (const sectionId of sections) {
      const el = document.getElementById(sectionId);
      if (!el) continue;
      const rect = el.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      const bottom = top + rect.height;
      if (scrollPosition >= top && scrollPosition <= bottom) {
        activeSection = sectionId;
        break;
      }
    }

    if (activeSection !== currentSection) {
      if (isTransitioning) {
        // Queue the new section instead of starting immediately
        pendingSection = activeSection;
      } else {
        currentSection = activeSection;
        transitionToSection(activeSection);
      }
    }
  }

  function transitionToSection(sectionId: string) {
    if (!globe) return;
    const preset = sectionViews[sectionId];
    if (!preset) return;

    // Clear any pending section and existing timeout
    pendingSection = null;
    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
      transitionTimeout = null;
    }

    // Cancel any ongoing animations
    cancelOffsetAnim();
    
    isTransitioning = true;

    // soften auto-rotate during transition to avoid a "fighting" feel
    const controls = globe.controls();
    const prevRotate = controls.autoRotate;
    const prevSpeed = controls.autoRotateSpeed;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.08;

    const duration = 1200;

    // animate POV (built-in) …
    globe.pointOfView(
      { lat: preset.pov.lat, lng: preset.pov.lng, altitude: preset.pov.altitude },
      duration
    );

    // …and simultaneously tween the offset
    animateGlobeOffset(preset.offset, duration);

    // wrap-up after both are done
    transitionTimeout = setTimeout(() => {
      if (!globe) return;
      const controls = globe.controls();
      controls.autoRotate = prevRotate;
      controls.autoRotateSpeed = prevSpeed;
      isTransitioning = false;
      transitionTimeout = null;

      // If there's a pending section, transition to it now
      if (pendingSection && pendingSection !== currentSection) {
        const nextSection = pendingSection;
        pendingSection = null;
        currentSection = nextSection;
        transitionToSection(nextSection);
      }
    }, duration + 100); // Add small buffer to ensure smooth completion
  }

  // Cache lights to avoid recreation
  let cachedLights: Record<ThemeKey, THREE.Light[]> = {} as any;
  
  function applyTheme(nextTheme: ThemeKey) {
    if (!globe || !wrapper) return;
    const config = themeStyles[nextTheme];
    currentTheme = nextTheme;

    wrapper.style.setProperty('--globe-gradient', config.gradient);
    wrapper.style.setProperty('--globe-overlay', config.overlay);

    globe
      .backgroundColor(config.background)
      .globeImageUrl(getFlatTexture(nextTheme))
      .pointColor(() => config.cityColor)
      .arcColor(() => config.arcColor)
      .ringColor(() => config.ringColor);

    const controls = globe.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = config.autoRotateSpeed;

    const renderer = globe.renderer();
    renderer.setClearColor(config.background, 1);
    renderer.toneMappingExposure = config.exposure;

    const globeMaterial = globe.globeMaterial() as THREE.MeshPhongMaterial;
    globeMaterial.color = new THREE.Color(config.baseColor);
    globeMaterial.emissive = new THREE.Color(config.emissive);
    globeMaterial.emissiveIntensity = config.emissiveIntensity;
    globeMaterial.shininess = config.shininess;
    globeMaterial.specular = new THREE.Color('#ffffff');
    
    // Mark material as needing update
    globeMaterial.needsUpdate = true;

    // Use cached lights or create new ones
    if (!cachedLights[nextTheme]) {
      const ambientLight = new THREE.AmbientLight(config.lights.ambient.color as any, config.lights.ambient.intensity);
      const keyLight = new THREE.DirectionalLight(config.lights.key.color as any, config.lights.key.intensity);
      keyLight.position.set(config.lights.key.position[0], config.lights.key.position[1], config.lights.key.position[2]);
      const fillLight = new THREE.DirectionalLight(config.lights.fill.color as any, config.lights.fill.intensity);
      fillLight.position.set(config.lights.fill.position[0], config.lights.fill.position[1], config.lights.fill.position[2]);
      const globeLights: THREE.Light[] = [ambientLight, keyLight, fillLight];

      if ('rim' in config.lights) {
        const rimLight = new THREE.DirectionalLight(config.lights.rim.color as any, config.lights.rim.intensity);
        rimLight.position.set(config.lights.rim.position[0], config.lights.rim.position[1], config.lights.rim.position[2]);
        globeLights.push(rimLight);
      }
      cachedLights[nextTheme] = globeLights;
    }
    
    globe.lights(cachedLights[nextTheme]);

    const scene = globe.scene();
    scene.fog = new THREE.Fog(config.background, config.fog.near, config.fog.far);
  }

  onMount(() => {
    const initialTheme = currentTheme ?? 'light';
    const initialConfig = themeStyles[initialTheme];

    // Pre-generate initial texture immediately, defer alternate theme
    getFlatTexture(initialTheme);
    
    requestIdleCallback(() => {
      const alternateTheme = initialTheme === 'light' ? 'dark' : 'light';
      getFlatTexture(alternateTheme);
    }, { timeout: 2000 });

    // Use IntersectionObserver to pause animation when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        isVisible = entries[0].isIntersecting;
        if (globe) {
          if (isVisible) {
            globe.resumeAnimation();
          } else {
            globe.pauseAnimation();
          }
        }
      },
      { threshold: 0 }
    );
    
    if (wrapper) observer.observe(wrapper);

    // Initialize Globe with performance-optimized renderer config
    globe = new Globe(container, {
      rendererConfig: {
        antialias: false, // Disable antialiasing - globe is blurred anyway
        alpha: false, // No transparency needed
        powerPreference: 'high-performance', // Prioritize performance
        stencil: false, // Disable stencil buffer
        depth: true, // Keep depth buffer for proper rendering
        logarithmicDepthBuffer: false // Disable for better performance
      },
      waitForGlobeReady: false, // Don't wait, render immediately
      animateIn: false // Skip globe initialization animation
    });
    globe.showAtmosphere(false); // Disable atmosphere glow

    // Aggressive performance optimization - since globe is blurred, quality doesn't matter
    const qualitySettings = {
      low: {
        pointResolution: 4,  // Very low resolution
        arcCount: Math.floor(arcs.length * 0.15), // Show only 15% of arcs
        arcCurveResolution: 16, // Much lower curve detail
        arcCircularResolution: 3 // Minimal tube segments
      },
      medium: {
        pointResolution: 6,
        arcCount: Math.floor(arcs.length * 0.25), // Show 25% of arcs
        arcCurveResolution: 24,
        arcCircularResolution: 4
      },
      high: {
        pointResolution: 8,
        arcCount: Math.floor(arcs.length * 0.4), // Show 40% of arcs max
        arcCurveResolution: 32,
        arcCircularResolution: 4
      }
    };
    
    const quality = qualitySettings[deviceQuality];
    // Select arcs with highest intensity for better visual impact
    const optimizedArcs = arcs
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, quality.arcCount);

    globe
      .globeImageUrl(getFlatTexture(initialTheme))
      .backgroundColor(initialConfig.background)
      .pointLat('lat')
      .pointLng('lng')
      .pointAltitude('altitude')
      .pointRadius('radius')
      .pointLabel('label')
      .pointResolution(quality.pointResolution)
      .arcsData(optimizedArcs)
      .arcAltitude('altitude')
      .arcStroke('stroke')
      .arcDashLength(1) // Solid lines - no dashing
      .arcDashGap(0) // No gaps
      .arcDashInitialGap(0) // No initial gap
      .arcDashAnimateTime(0) // CRITICAL: Disable animation (major performance killer)
      .arcCurveResolution(quality.arcCurveResolution) // Lower curve resolution
      .arcCircularResolution(quality.arcCircularResolution) // Lower tube resolution
      .ringsData([]) // CRITICAL: Disable pulsating rings completely (major performance killer);

    // Initial camera position + offset for hero
    const hero = sectionViews.hero;
    globe.pointOfView({ lat: hero.pov.lat, lng: hero.pov.lng, altitude: hero.pov.altitude }, 0);

    const initialOffset = getScaledOffset(hero.offset);
    currentOffset = [...initialOffset];
    targetOffset = [...initialOffset];
    globe.globeOffset(initialOffset); // set without tween for first render

    const controls = globe.controls();
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = initialConfig.autoRotateSpeed;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    const renderer = globe.renderer();
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    
    // Aggressive pixel ratio reduction - globe is blurred anyway, so low resolution is fine
    const pixelRatioSettings = {
      low: 0.75,  // Very low pixel ratio
      medium: 1,  // Standard resolution
      high: Math.min(window.devicePixelRatio, 1.25) // Cap at 1.25 even for retina
    };
    renderer.setPixelRatio(pixelRatioSettings[deviceQuality]);
    renderer.domElement.style.pointerEvents = 'none';
    renderer.domElement.classList.add('globe-canvas');
    
    // Aggressive performance optimizations
    renderer.shadowMap.enabled = false;
    renderer.sortObjects = false;
    
    // Additional WebGL optimizations
    const gl = renderer.getContext();
    if (gl) {
      // Disable stencil buffer if not needed
      gl.disable(gl.STENCIL_TEST);
      // Use simpler depth testing
      gl.depthFunc(gl.LEQUAL);
      // Disable blending when not needed (improves performance)
      gl.disable(gl.BLEND);
    }

    themeStop = theme.subscribe((value) => applyTheme(value as ThemeKey));

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleResize();
    applyTheme(initialTheme);

    // Initial scroll check
    requestAnimationFrame(() => {
      setTimeout(handleScroll, 100);
    });
    
    return () => observer.disconnect();
  });

  onDestroy(() => {
    window.removeEventListener('resize', handleResize);
    window.removeEventListener('scroll', handleScroll);
    themeStop?.();

    if (transitionTimeout) {
      clearTimeout(transitionTimeout);
      transitionTimeout = null;
    }
    
    if (resizeTimeout) {
      clearTimeout(resizeTimeout);
      resizeTimeout = null;
    }
    
    if (rafThrottle) {
      cancelAnimationFrame(rafThrottle);
      rafThrottle = null;
    }

    if (!globe) return;

    cancelOffsetAnim();
    globe.pauseAnimation();

    const controls = globe.controls(); 
    controls.dispose();
    
    const renderer = globe.renderer();
    
    // Proper WebGL cleanup
    const scene = globe.scene();
    scene.traverse((object: any) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach((material: any) => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
    
    // Dispose of cached lights
    Object.values(cachedLights).forEach(lights => {
      lights.forEach(light => {
        if ((light as any).dispose) {
          (light as any).dispose();
        }
      });
    });
    cachedLights = {} as any;
    
    renderer.dispose();
    renderer.forceContextLoss();

    container?.replaceChildren();
    globe = null;
  });
</script>

<div class="webgl-wrapper" bind:this={wrapper}>
  <div class="design-haze"></div>
  <div class="globe-container" bind:this={container}></div>
</div>

<style>
  .webgl-wrapper {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100vh;
    z-index: 1;
    pointer-events: none;
    overflow: hidden;
    background: var(--globe-gradient, linear-gradient(160deg, rgba(250, 251, 255, 0.98) 0%, rgba(220, 227, 255, 0.45) 60%, rgba(255, 255, 255, 0.95) 100%));
    transition: background 380ms ease-out, opacity 320ms ease;
    
    /* GPU acceleration and rendering optimization */
    will-change: background;
    transform: translateZ(0);
    backface-visibility: hidden;
    perspective: 1000px;
  }
  
  /* Light mode: subtle, elegant glow */
  :global([data-theme="light"]) .webgl-wrapper {
    opacity: 0.95;
  }
  
  /* Dark mode: visible and elegant */
  :global([data-theme="dark"]) .webgl-wrapper {
    opacity: 0.85;
    background: var(--globe-gradient, linear-gradient(165deg, rgba(6,8,16,0.95) 0%, rgba(12,16,28,0.92) 52%, rgba(6,8,16,0.95) 100%));
  }
  
  .webgl-wrapper::after {
    content: '';
    position: absolute;
    inset: 0;
    background: var(--globe-overlay, radial-gradient(circle at 45% 30%, rgba(140, 160, 255, 0.08) 0%, rgba(255, 255, 255, 0) 60%));
    pointer-events: none;
    mix-blend-mode: soft-light;
    opacity: 0.7;
    
    /* GPU layer */
    will-change: background;
    transform: translateZ(0);
    transition: opacity 380ms ease-out;
  }
  
  :global([data-theme="dark"]) .webgl-wrapper::after {
    opacity: 0.4;
    mix-blend-mode: soft-light;
  }
  
  .design-haze {
    position: absolute;
    inset: -12%;
    background: radial-gradient(circle at 48% 22%, rgba(255, 255, 255, 0.35), rgba(248, 249, 255, 0));
    opacity: 0.5;
    filter: blur(42px);
    pointer-events: none;
    
    /* Force GPU layer for blur */
    will-change: transform;
    transform: translateZ(0);
  }
  
  :global([data-theme="dark"]) .design-haze {
    background: radial-gradient(circle at 48% 22%, rgba(102, 126, 234, 0.12), rgba(6, 8, 16, 0));
    opacity: 0.4;
    filter: blur(48px);
  }
  
  .globe-container {
    position: absolute; 
    inset: 0; 
    width: 100%; 
    height: 100%;
    
    /* Contain layout/paint for better performance */
    contain: layout style paint;
  }
  
  .globe-container :global(canvas.globe-canvas) {
    width: 100% !important;
    height: 100% !important;
    pointer-events: none;
    filter: saturate(1.15) contrast(1.06) brightness(1.03) blur(0.5px);
    
    /* GPU acceleration for canvas */
    will-change: transform;
    transform: translateZ(0);
    backface-visibility: hidden;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    transition: filter 380ms ease-out;
  }
  
  /* Dark mode: crisp and visible globe rendering */
  :global([data-theme="dark"]) .globe-container :global(canvas.globe-canvas) {
    filter: saturate(1.1) contrast(1.05) brightness(1.05) blur(0.5px);
    opacity: 1;
  }
  :global(.globe-tooltip) {
    display: flex; 
    flex-direction: column; 
    gap: 2px;
    padding: 8px 12px; 
    border-radius: 12px;
    background: rgba(15, 23, 42, 0.92);
    border: 1px solid rgba(102, 126, 234, 0.24);
    color: #e2e8f0; 
    font-size: 12px; 
    letter-spacing: 0.02em; 
    text-transform: uppercase;
    box-shadow: 0 10px 28px rgba(2, 7, 18, 0.45);
    
    /* Optimize tooltip rendering */
    will-change: transform, opacity;
    backface-visibility: hidden;
  }
  :global(.globe-tooltip strong) { 
    font-weight: 600; 
    letter-spacing: 0.04em; 
  }
  :global(.globe-tooltip span) { 
    opacity: 0.75; 
  }

  @media (max-width: 900px) {
    .webgl-wrapper { 
      opacity: 0.5; 
    }
    
    /* Reduce visual complexity on mobile */
    .design-haze {
      display: none;
    }
    
    .globe-container :global(canvas.globe-canvas) {
      /* Simpler filters for mobile */
      filter: saturate(1.1) contrast(1.04);
    }
  }
  
  @media (prefers-reduced-motion: reduce) {
    .webgl-wrapper,
    .webgl-wrapper::after,
    .design-haze {
      transition: none;
      animation: none;
    }
  }
</style>
