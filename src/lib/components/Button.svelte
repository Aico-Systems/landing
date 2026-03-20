<script lang="ts">
    export let variant: "primary" | "secondary" = "primary";
    export let type: "button" | "submit" | "reset" = "button";
    export let href: string | undefined = undefined;
    export let onClick: ((e: MouseEvent) => void) | undefined = undefined;
    export let disabled = false;
    export let className = "";

    function handleClick(e: MouseEvent) {
        if (onClick) onClick(e);
    }
</script>

{#if href}
    <a
        {href}
        class="btn btn-{variant} {className}"
        on:click={handleClick}
        role="button"
    >
        <slot />
    </a>
{:else}
    <button
        {type}
        {disabled}
        class="btn btn-{variant} {className}"
        on:click={handleClick}
    >
        <slot />
    </button>
{/if}

<style>
    .btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 44px;
        padding: 10px 18px;
        border-radius: 12px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease,
            box-shadow 0.2s ease,
            transform 0.2s ease;
        border: 1px solid transparent;
        text-align: center;
        text-decoration: none;
        line-height: 1.2;
        box-shadow: none;
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .btn-primary {
        background: #145B7A;
        border-color: #145B7A;
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        background: #114d67;
        border-color: #114d67;
        box-shadow: 0 1px 0 rgba(15, 23, 42, 0.12);
    }

    .btn-secondary {
        background: rgba(255, 255, 255, 0.78);
        color: var(--text-primary);
        border-color: rgba(15, 23, 42, 0.12);
    }

    .btn-secondary:hover:not(:disabled) {
        background: rgba(255, 255, 255, 0.92);
        border-color: rgba(20, 91, 122, 0.28);
        box-shadow: 0 1px 0 rgba(15, 23, 42, 0.08);
    }

    :global([data-theme="dark"]) .btn-secondary {
        background: rgba(15, 23, 42, 0.72);
        border-color: rgba(148, 163, 184, 0.22);
    }

    :global([data-theme="dark"]) .btn-secondary:hover:not(:disabled) {
        background: rgba(15, 23, 42, 0.88);
        border-color: rgba(167, 243, 208, 0.22);
    }
</style>
