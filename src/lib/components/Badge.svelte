<script lang="ts">
    export let variant: "default" | "outline" = "default";
    export let className = "";
</script>

<span class="badge badge-{variant} {className}">
    <slot />
</span>

<style>
    .badge {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        min-height: var(--control-height-sm);
        padding: 0 10px;
        border-radius: 999px;
        border: 1px solid var(--accent-border);
        font-size: 10px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.12em;
        width: fit-content;
        white-space: nowrap;
    }

    .badge-default {
        background: var(--accent-soft);
        color: var(--accent-primary);
    }

    .badge-outline {
        background: var(--surface-elevated);
        color: var(--accent-primary);
    }
</style>
