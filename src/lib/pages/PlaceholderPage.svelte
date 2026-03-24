<script lang="ts">
  import LegalLayout from "./LegalLayout.svelte";
  import type { AppPath } from "../utils/appNavigation";

  export let activePath: AppPath;
  export let eyebrow = "Coming Soon";
  export let title = "";
  export let description = "";
  export let lede = "";
  export let bullets: string[] = [];
</script>

<LegalLayout {activePath} {eyebrow} {title} {description} {lede}>
  <div class="card">
    <p>{description}</p>
    {#if bullets.length}
      <ul>
        {#each bullets as bullet}
          <li>{bullet}</li>
        {/each}
      </ul>
    {/if}
  </div>
</LegalLayout>

<style>
  .card {
    border-radius: 18px;
    border: 1px solid rgba(86, 141, 171, 0.2);
    background: rgba(15, 23, 42, 0.82);
    box-shadow: 0 28px 90px rgba(2, 8, 23, 0.32);
    padding: 24px;
    margin: 0 0 28px;
  }

  p {
    margin: 0 0 14px;
    color: var(--text-secondary);
  }

  ul {
    margin: 0;
    padding-left: 22px;
    color: var(--text-primary);
  }

  li + li {
    margin-top: 8px;
  }
</style>
