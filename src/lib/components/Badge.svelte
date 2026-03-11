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
        padding: 5px 12px;
        border-radius: 999px;
        font-size: 11px;
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
    }

    :global([data-theme="dark"]) .badge-default {
        color: #A7F3D0;
    }

    .badge-outline {
        background: transparent;
        border: 1px solid rgba(20, 91, 122, 0.34);
        color: #145B7A;
    }

    :global([data-theme="dark"]) .badge-outline {
        border-color: rgba(167, 243, 208, 0.35);
        color: #A7F3D0;
    }
</style>
