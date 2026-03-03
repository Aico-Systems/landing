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
        background: rgba(167, 243, 208, 0.12);
        border: 1px solid rgba(167, 243, 208, 0.30);
        color: #145B7A;
        backdrop-filter: blur(16px);
    }

    :global([data-theme="dark"]) .badge-default {
        background: rgba(167, 243, 208, 0.12);
        color: #A7F3D0;
    }

    :global([data-theme="light"]) .badge-default {
        background: rgba(167, 243, 208, 0.14);
        color: #145B7A;
    }

    .badge-outline {
        background: transparent;
        border: 1px solid rgba(167, 243, 208, 0.30);
        color: #A7F3D0;
    }

    :global([data-theme="light"]) .badge-outline {
        color: #145B7A;
        border-color: rgba(20, 91, 122, 0.4);
    }
</style>
