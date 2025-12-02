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
        padding: 14px 32px;
        border-radius: 8px;
        font-weight: 600;
        font-size: 16px;
        cursor: pointer;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            background 0.2s ease,
            color 0.2s ease;
        border: none;
        text-align: center;
        text-decoration: none;
        will-change: transform;
        transform: translateZ(0);
        line-height: 1.2;
    }

    .btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none !important;
        box-shadow: none !important;
    }

    .btn-primary {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
    }

    .btn-primary:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
    }

    .btn-secondary {
        background: transparent;
        color: #667eea;
        border: 2px solid #667eea;
    }

    .btn-secondary:hover:not(:disabled) {
        background: #667eea;
        color: white;
    }
</style>
