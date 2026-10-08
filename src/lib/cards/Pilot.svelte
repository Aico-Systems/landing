<script lang="ts">
	/**
	 * The pilot as a plan: a ruler of weeks, each phase a bar over the
	 * weeks it takes, its name and what happens beside it. The long live
	 * phase is the one in orange: it is the pilot.
	 */
	let {
		week,
		phases,
	}: { week: string; phases: { name: string; from: number; to: number; what: string }[] } = $props();

	const weeks = $derived(Math.max(...phases.map((p) => p.to)) + 1);
	const longest = $derived(phases.reduce((a, b) => (b.to - b.from > a.to - a.from ? b : a)));
</script>

<div class="plan" style="--weeks: {weeks}">
	<div class="ruler" aria-hidden="true">
		<span class="label">{week}</span>
		{#each Array.from({ length: weeks }, (_, i) => i) as w (w)}<span class="tick">{w}</span>{/each}
	</div>
	<ol>
		{#each phases as p (p.name)}
			<li>
				<span class="name">{p.name}</span>
				<span class="bar" class:main={p === longest} class:point={p.from === p.to} style="--from: {p.from}; --to: {p.to}">
					<span class="what">{p.what}</span>
				</span>
				<span class="sr">{week} {p.from === p.to ? p.from : `${p.from}–${p.to}`}</span>
			</li>
		{/each}
	</ol>
</div>

<style>
	.plan {
		--label: 6.5rem;
		margin-top: 1rem;
		padding: 1rem 1.1rem 1.1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		/* a faint column per week behind the bars */
		background:
			repeating-linear-gradient(
					90deg,
					color-mix(in srgb, var(--ink) 7%, transparent) 0 1px,
					transparent 1px calc((100% - var(--label)) / var(--weeks))
				)
				var(--label) 0 / calc(100% - var(--label)) 100% no-repeat,
			linear-gradient(color-mix(in srgb, var(--ink) 4%, transparent), transparent 70%);
		background-origin: content-box;
	}
	.ruler,
	li {
		display: grid;
		grid-template-columns: var(--label) repeat(var(--weeks), minmax(0, 1fr));
		align-items: center;
	}
	.ruler {
		padding-bottom: 0.5rem;
		font-size: 0.7rem;
		font-variant-numeric: tabular-nums;
		color: var(--ink-soft);
	}
	.tick {
		padding-left: 0.2rem;
	}
	ol {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.45rem;
	}
	li {
		min-height: 2rem;
	}
	.name {
		font-size: 0.88rem;
		font-weight: 700;
		font-stretch: 105%;
	}
	/* a phase's bar over its weeks; what happens runs on from it */
	.bar {
		grid-column: calc(var(--from) + 2) / calc(var(--to) + 3);
		position: relative;
		height: 1.6rem;
		border-radius: 0.35rem;
		background: color-mix(in srgb, var(--ink) 18%, transparent);
	}
	.bar.main {
		background: var(--accent);
	}
	.what {
		position: absolute;
		top: 50%;
		translate: 0 -50%;
		left: calc(100% + 0.6rem);
		white-space: nowrap;
		font-size: 0.82rem;
		color: var(--ink-soft);
	}
	/* in the long bar the words fit inside it; the last phase's lean left */
	.bar.main .what {
		left: 0.6rem;
		color: white;
		font-weight: 600;
	}
	li:last-child .what {
		left: auto;
		right: calc(100% + 0.6rem);
	}
	.sr {
		position: absolute;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip-path: inset(50%);
	}
	@media (max-width: 620px) {
		.plan {
			--label: 5rem;
		}
		.what {
			display: none;
		}
		.bar.main .what {
			display: block;
		}
	}
</style>
