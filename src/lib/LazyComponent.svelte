<script lang="ts">
  import { onMount } from 'svelte';
  import { lazyLoad } from './utils/lazyLoad';
  
  // Props
  export let component: any = null;
  export let fallback: any = null;
  export let rootMargin: string = '100px';
  export let threshold: number = 0;
  
  let LoadedComponent: any = null;
  let isLoading = false;
  let hasError = false;
  let containerElement: HTMLDivElement;
  
  async function loadComponent() {
    if (isLoading || LoadedComponent) return;
    
    isLoading = true;
    try {
      const module = await component();
      LoadedComponent = module.default || module;
    } catch (error) {
      console.error('Failed to load component:', error);
      hasError = true;
    } finally {
      isLoading = false;
    }
  }
  
  function handleVisible(event: Event) {
    loadComponent();
  }
  
  onMount(() => {
    if (containerElement) {
      containerElement.addEventListener('visible', handleVisible);
      return () => {
        containerElement.removeEventListener('visible', handleVisible);
      };
    }
  });
</script>

<div bind:this={containerElement} use:lazyLoad={{ rootMargin, threshold, once: true }}>
  {#if LoadedComponent}
    <svelte:component this={LoadedComponent} {...$$restProps} />
  {:else if hasError}
    <div class="lazy-error">
      Failed to load component
    </div>
  {:else if fallback}
    <svelte:component this={fallback} />
  {:else}
    <div class="lazy-placeholder" aria-label="Loading content">
      <!-- Placeholder for lazy content -->
    </div>
  {/if}
</div>

<style>
  .lazy-placeholder {
    min-height: 200px;
    background: transparent;
  }
  
  .lazy-error {
    padding: 20px;
    color: #ef4444;
    text-align: center;
  }
</style>
