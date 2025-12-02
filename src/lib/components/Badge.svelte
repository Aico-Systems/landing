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
        gap: 8px;
        padding: 6px 14px;
        border-radius: 999px;
        font-size: 13px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        width: fit-content;
        white-space: nowrap;
    }

    .badge-default {
        background: rgba(102, 126, 234, 0.12);
        border: 1px solid rgba(102, 126, 234, 0.35);
        color: #4c5fe3;
        backdrop-filter: blur(16px);
    }

    :global([data-theme="light"]) .badge-default {
        background: rgba(102, 126, 234, 0.14);
        color: #303a9e;
    }

    .badge-outline {
        background: transparent;
        border: 1px solid rgba(102, 126, 234, 0.32);
        color: #dbe3ff;
    }

    :global([data-theme="light"]) .badge-outline {
        color: #4c5fe3;
        border-color: rgba(102, 126, 234, 0.4);
    }
</style>
