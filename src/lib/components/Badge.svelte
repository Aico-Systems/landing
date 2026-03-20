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
        padding: 6px 12px;
        border-radius: 999px;
        font-size: 11px;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.08em;
        width: fit-content;
        white-space: nowrap;
    }

    .badge-default {
        background: rgba(20, 91, 122, 0.08);
        border: 1px solid rgba(20, 91, 122, 0.18);
        color: #145B7A;
    }

    :global([data-theme="dark"]) .badge-default {
        background: rgba(167, 243, 208, 0.08);
        border-color: rgba(167, 243, 208, 0.18);
        color: #A7F3D0;
    }

    .badge-outline {
        background: rgba(255, 255, 255, 0.5);
        border: 1px solid rgba(20, 91, 122, 0.18);
        color: #145B7A;
    }

    :global([data-theme="dark"]) .badge-outline {
        background: rgba(15, 23, 42, 0.45);
        border-color: rgba(167, 243, 208, 0.18);
        color: #A7F3D0;
    }
</style>
