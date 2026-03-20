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
        min-height: var(--control-height-lg);
        padding: 0 14px;
        border-radius: var(--blueprint-radius-md);
        font-weight: 600;
        font-size: 13px;
        letter-spacing: 0.01em;
        cursor: pointer;
        transition: var(--transition-button);
        border: 1px solid var(--border-subtle);
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
        background: var(--button-primary-bg);
        border-color: var(--button-primary-bg);
        color: var(--button-primary-text);
    }

    .btn-primary:hover:not(:disabled) {
        background: var(--button-primary-bg-hover);
        border-color: var(--button-primary-bg-hover);
    }

    .btn-secondary {
        background: var(--button-secondary-bg);
        color: var(--button-secondary-text);
        border-color: var(--button-secondary-border);
    }

    .btn-secondary:hover:not(:disabled) {
        background: var(--button-secondary-bg-hover);
        border-color: var(--button-secondary-border-hover);
    }
</style>
