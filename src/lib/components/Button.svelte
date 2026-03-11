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
        border-radius: 10px;
        font-weight: 600;
        font-size: 14px;
        cursor: pointer;
        transition:
            background-color 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        border: 1px solid transparent;
        text-align: center;
        text-decoration: none;
        line-height: 1.2;
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
    }

    .btn-secondary {
        background: var(--card-bg);
        color: var(--text-primary);
        border-color: var(--border-color);
    }

    .btn-secondary:hover:not(:disabled) {
        background: var(--bg-secondary);
        border-color: rgba(20, 91, 122, 0.35);
    }
</style>
