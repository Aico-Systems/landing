<script lang="ts">
	import Card from "$lib/Card.svelte";
	import { i18n, m } from "$lib/i18n/index.svelte";
	import { CONTACT_ENDPOINT } from "$lib/site";

	/**
	 * The way to reach the team without the assistant, drawn like the rest of
	 * the cards: two windows on a board. On the left the visitor writes; on
	 * the right the team's inbox shows, as it is typed, the message the way
	 * the team will read it. Sending runs it across to the inbox, which says
	 * it was delivered and answers. A topic chip lowers the bar to start: it
	 * names what it is about and, in an empty message, writes the first words.
	 *
	 * It posts to `CONTACT_ENDPOINT` (mails the team, the visitor as
	 * Reply-To). `website` is a field no person sees: what fills it is a bot,
	 * and the workflow drops it.
	 */
	let { open, onclose }: { open: boolean; onclose: () => void } = $props();

	const c = $derived(m().contact);
	let status = $state<"idle" | "sending" | "sent" | "failed">("idle");
	let name = $state("");
	let company = $state("");
	let email = $state("");
	let phone = $state("");
	let message = $state("");
	let topic = $state<string | null>(null);
	let box = $state<HTMLTextAreaElement>();
	let inbox = $state<HTMLElement>();

	function pick(t: { label: string; starter: string }) {
		topic = topic === t.label ? null : t.label;
		if (topic && !message.trim() && t.starter) {
			message = t.starter;
			// the cursor where the visitor goes on writing
			queueMicrotask(() => {
				box?.focus();
				box?.setSelectionRange(message.length, message.length);
			});
		}
	}

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		const website = new FormData(event.currentTarget as HTMLFormElement).get("website");
		status = "sending";
		try {
			const [response] = await Promise.all([
				fetch(CONTACT_ENDPOINT, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ name, company, email, phone, message, topic, website, lang: i18n.locale, page: location.href }),
				}),
				// the message takes its time to cross, however fast the post is
				new Promise((r) => setTimeout(r, 900)),
			]);
			status = response.ok ? "sent" : "failed";
			// on a phone the inbox is under the form: bring the answer into view
			if (status === "sent") queueMicrotask(() => inbox?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
		} catch {
			status = "failed";
		}
	}

	function again() {
		message = "";
		topic = null;
		status = "idle";
	}

	const from = $derived([name.trim(), company.trim()].filter(Boolean).join(" · "));
</script>

<Card id="contact" title={c.title} {open} {onclose}>
	<p class="intro">{c.intro}</p>

	<div class="topics" role="group" aria-label={c.topicsLabel}>
		{#each c.topics as t (t.label)}
			<button type="button" class:on={topic === t.label} aria-pressed={topic === t.label} disabled={status === "sent"} onclick={() => pick(t)}>{t.label}</button>
		{/each}
	</div>

	<div class="board" class:sending={status === "sending"} class:sent={status === "sent"}>
		<form class="window you" onsubmit={submit}>
			<header><span class="dot"></span>{c.you}<span class="lang">{i18n.locale}</span></header>
			<div class="fields">
				<div class="pair">
					<label>
						<span>{c.name}</span>
						<input name="name" autocomplete="name" required maxlength="120" bind:value={name} disabled={status === "sent"} />
					</label>
					<label>
						<span>{c.company} <em>{c.optional}</em></span>
						<input name="company" autocomplete="organization" maxlength="160" bind:value={company} disabled={status === "sent"} />
					</label>
				</div>
				<div class="pair">
					<label>
						<span>{c.email}</span>
						<input name="email" type="email" autocomplete="email" required maxlength="200" bind:value={email} disabled={status === "sent"} />
					</label>
					<label>
						<span>{c.phone} <em>{c.optional}</em></span>
						<input name="phone" type="tel" autocomplete="tel" maxlength="60" bind:value={phone} disabled={status === "sent"} />
					</label>
				</div>
				<label>
					<span>{c.message}</span>
					<textarea
						name="message"
						rows="4"
						required
						minlength="5"
						maxlength="4000"
						placeholder={c.messageHint}
						bind:value={message}
						bind:this={box}
						disabled={status === "sent"}
					></textarea>
				</label>
				<!-- no person sees or fills this one -->
				<input class="trap" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
			</div>
			<footer>
				{#if status === "sent"}
					<button type="button" class="send" onclick={again}>{c.another}</button>
				{:else}
					<button type="submit" class="send" disabled={status === "sending"}>
						{status === "sending" ? c.sending : c.send}
						<svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true"><path d="M2 8h11M9 4l4 4-4 4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" /></svg>
					</button>
				{/if}
				<small>{c.privacy}</small>
			</footer>
			{#if status === "failed"}<p class="failed" role="alert">{c.failed}</p>{/if}
		</form>

		<div class="lane" aria-hidden="true"><i></i></div>

		<div class="window team" aria-live="polite" bind:this={inbox}>
			<header><span class="dot"></span>{c.team}</header>
			<div class="inbox">
				{#if message.trim() || from}
					<div class="mail">
						<div class="who">
							<b>{from || "…"}</b>
							{#if topic}<span class="tag">{topic}</span>{/if}
						</div>
						<p>{message.trim() || "…"}</p>
						{#if email.trim()}<span class="reply">{c.replyTo(email.trim())}</span>{/if}
						{#if status === "sent"}<span class="delivered">✓ {c.delivered}</span>{/if}
					</div>
					{#if status === "sent"}<p class="answer">{c.sent}</p>{/if}
				{:else}
					<div class="empty">
						<i style="width: 70%"></i><i style="width: 90%"></i><i style="width: 55%"></i>
						<p>{c.previewEmpty}</p>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<p class="other">{c.orAssistant}</p>
</Card>

<style>
	.intro {
		margin-top: 0;
	}
	/* what it is about: chips, the chosen one in the accent */
	.topics {
		display: flex;
		flex-wrap: wrap;
		gap: 0.45rem;
		margin: 1.1rem 0 1rem;
	}
	.topics button {
		padding: 0.45rem 0.9rem;
		border: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
		border-radius: 999px;
		background: none;
		color: var(--ink);
		font: inherit;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background 0.15s,
			border-color 0.15s,
			color 0.15s;
	}
	.topics button:hover:not(:disabled) {
		border-color: var(--accent);
	}
	.topics button.on {
		border-color: var(--accent);
		background: var(--accent);
		color: white;
	}
	.topics button:disabled {
		opacity: 0.5;
		cursor: default;
	}

	/* the board: a dot grid, the cards' drawing surface, the two windows on it */
	.board {
		--line: color-mix(in srgb, var(--ink) 15%, transparent);
		display: grid;
		grid-template-columns: minmax(0, 1.25fr) 2.5rem minmax(0, 1fr);
		align-items: stretch;
		padding: 1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 1rem;
		background: radial-gradient(color-mix(in srgb, var(--ink) 14%, transparent) 1px, transparent 1.2px) 0 0 / 14px 14px;
	}
	.window {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--line);
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--ink) 3%, var(--paper));
		overflow: hidden;
		box-shadow: 0 1rem 2.5rem -1.5rem color-mix(in srgb, black 60%, transparent);
	}
	header {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.55rem 0.8rem;
		border-bottom: 1px solid var(--line);
		font-size: 0.78rem;
		font-weight: 600;
		color: var(--ink-soft);
	}
	.dot {
		width: 0.45rem;
		height: 0.45rem;
		border-radius: 50%;
		background: var(--accent);
	}
	.team .dot {
		background: var(--ink-soft);
	}
	.sent .team .dot {
		background: #22c55e;
	}
	.lang {
		margin-left: auto;
		padding: 0.05rem 0.35rem;
		border: 1px solid var(--line);
		border-radius: 0.3rem;
		font-size: 0.66rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	/* the visitor's window: the form */
	.fields {
		display: grid;
		gap: 0.7rem;
		padding: 0.9rem;
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.7rem;
	}
	label {
		display: grid;
		gap: 0.3rem;
	}
	label span {
		font-size: 0.78rem;
		font-weight: 600;
	}
	em {
		font-style: normal;
		font-weight: 400;
		color: var(--ink-soft);
	}
	input,
	textarea {
		box-sizing: border-box;
		width: 100%;
		padding: 0.6rem 0.7rem;
		border: 1px solid var(--line);
		border-radius: 0.55rem;
		background: var(--paper);
		color: var(--ink);
		font: inherit;
		font-size: 0.95rem;
		transition: border-color 0.15s;
	}
	textarea {
		resize: vertical;
		min-height: 6rem;
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
	}
	input:disabled,
	textarea:disabled {
		opacity: 0.6;
	}
	::placeholder {
		color: color-mix(in srgb, var(--ink) 40%, transparent);
	}
	.trap {
		position: absolute;
		left: -10000px;
		width: 1px;
		height: 1px;
		opacity: 0;
	}
	footer {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.6rem 0.9rem;
		margin-top: auto;
		padding: 0 0.9rem 0.9rem;
	}
	.send {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.7rem 1.4rem;
		border: 0;
		border-radius: 999px;
		background: var(--accent);
		color: white;
		font: inherit;
		font-weight: 700;
		cursor: pointer;
		transition: transform 0.15s;
	}
	.send:hover:not(:disabled) {
		transform: translateX(2px);
	}
	.send:disabled {
		opacity: 0.7;
		cursor: default;
	}
	small {
		font-size: 0.75rem;
		color: var(--ink-soft);
	}
	.failed {
		margin: 0;
		padding: 0 0.9rem 0.9rem;
		color: var(--accent);
		font-weight: 600;
		font-size: 0.85rem;
	}

	/* the lane between them: a dot runs across while the message goes */
	.lane {
		position: relative;
		align-self: center;
		height: 1px;
		margin: 0 0.3rem;
		background: var(--line);
	}
	.lane::after {
		content: "";
		position: absolute;
		top: -3px;
		right: -1px;
		border: 3.5px solid transparent;
		border-left: 5px solid var(--ink-soft);
		border-right: 0;
	}
	.lane i {
		position: absolute;
		top: -2px;
		left: 0;
		width: 5px;
		height: 5px;
		border-radius: 50%;
		background: var(--accent);
		box-shadow: 0 0 6px var(--accent);
		opacity: 0;
	}
	.sending .lane i {
		animation: cross 0.9s ease-in-out infinite;
	}
	@keyframes cross {
		0% {
			left: 0;
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			left: calc(100% - 5px);
			opacity: 0;
		}
	}

	/* the team's inbox: the message as the team will read it */
	.inbox {
		display: grid;
		align-content: start;
		gap: 0.6rem;
		padding: 0.9rem;
		font-size: 0.86rem;
		line-height: 1.4;
	}
	.mail {
		display: grid;
		gap: 0.4rem;
		padding: 0.7rem 0.8rem;
		border: 1px solid var(--line);
		border-radius: 0.7rem;
		background: var(--paper);
		animation: arrive 0.3s ease-out both;
	}
	.who {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.4rem;
	}
	.who b {
		color: var(--accent);
		font-size: 0.8rem;
	}
	.tag {
		padding: 0.05rem 0.45rem;
		border: 1px solid var(--line);
		border-radius: 999px;
		font-size: 0.7rem;
		color: var(--ink-soft);
	}
	.mail p {
		margin: 0;
		white-space: pre-wrap;
		overflow-wrap: anywhere;
		display: -webkit-box;
		-webkit-line-clamp: 7;
		line-clamp: 7;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
	.reply {
		font-size: 0.72rem;
		color: var(--ink-soft);
		overflow-wrap: anywhere;
	}
	.delivered {
		justify-self: end;
		font-size: 0.72rem;
		font-weight: 700;
		color: #22c55e;
		animation: arrive 0.3s ease-out both;
	}
	.answer {
		justify-self: start;
		max-width: 92%;
		margin: 0;
		padding: 0.55rem 0.75rem;
		border-radius: 0.8rem 0.8rem 0.8rem 0.2rem;
		background: color-mix(in srgb, var(--ink) 8%, var(--paper));
		font-size: 0.86rem;
		line-height: 1.4;
		animation: arrive 0.35s ease-out 0.35s both;
	}
	.empty {
		display: grid;
		gap: 0.4rem;
	}
	.empty i {
		display: block;
		height: 0.45rem;
		border-radius: 0.25rem;
		background: color-mix(in srgb, var(--ink) 10%, transparent);
	}
	.empty p {
		margin: 0.4rem 0 0;
		line-height: 1.4;
		font-size: 0.8rem;
		color: var(--ink-soft);
	}
	@keyframes arrive {
		from {
			opacity: 0;
			translate: 0 0.3rem;
		}
	}

	.other {
		margin-top: 1.25rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}

	/* a phone: the windows stacked, the lane running down between them */
	@container (max-width: 570px) {
		.board {
			grid-template-columns: 1fr;
			padding: 0.6rem;
		}
		.pair {
			grid-template-columns: 1fr;
		}
		.lane {
			justify-self: center;
			width: 1px;
			height: 1.6rem;
			margin: 0;
		}
		.lane::after {
			top: auto;
			right: auto;
			bottom: -1px;
			left: -3px;
			border: 3.5px solid transparent;
			border-top: 5px solid var(--ink-soft);
			border-bottom: 0;
		}
		.lane i {
			top: 0;
			left: -2px;
		}
		.sending .lane i {
			animation-name: cross-down;
		}
	}
	@keyframes cross-down {
		0% {
			top: 0;
			opacity: 1;
		}
		90% {
			opacity: 1;
		}
		100% {
			top: calc(100% - 5px);
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.mail,
		.delivered,
		.answer,
		.sending .lane i {
			animation: none;
		}
	}
</style>
