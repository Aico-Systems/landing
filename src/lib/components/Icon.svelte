<script lang="ts">
  import * as LucideIcons from 'lucide-svelte';

  let {
    name,
    size = 24,
    strokeWidth = 2,
    class: className = '',
    color
  }: {
    name: string;
    size?: number;
    strokeWidth?: number;
    class?: string;
    color?: string;
  } = $props();

  // Convert kebab-case to PascalCase for Lucide component names
  function toPascalCase(str: string): string {
    return str
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join('');
  }

  const IconComponent = $derived(() => {
    const pascalName = toPascalCase(name);
    return (LucideIcons as any)[pascalName] || LucideIcons.File;
  });
</script>

{#if IconComponent()}
  {@const Component = IconComponent()}
  <Component {size} {strokeWidth} {color} class="icon {className}" />
{/if}

<style>
  :global(.icon) {
    display: inline-block;
    vertical-align: middle;
    flex-shrink: 0;
  }
</style>
