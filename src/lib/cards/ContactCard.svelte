<script lang="ts">
	import Card from "$lib/Card.svelte";
	import { i18n, m } from "$lib/i18n/index.svelte";
	import { CONTACT_ENDPOINT } from "$lib/site";

	/**
	 * The way to reach the team without the assistant: a short form that
	 * mails them (`CONTACT_ENDPOINT`), the visitor as Reply-To. `website` is a
	 * field no person sees: what fills it is a bot, and the workflow drops it.
	 */
	let { open, onclose }: { open: boolean; onclose: () => void } = $props();

	const c = $derived(m().contact);
	let status = $state<"idle" | "sending" | "sent" | "failed">("idle");

	async function submit(event: SubmitEvent) {
		event.preventDefault();
		const form = event.currentTarget as HTMLFormElement;
		const data = Object.fromEntries(new FormData(form)) as Record<string, string>;
		status = "sending";
		try {
			const response = await fetch(CONTACT_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ ...data, lang: i18n.locale, page: location.href }),
			});
			status = response.ok ? "sent" : "failed";
			if (response.ok) form.reset();
		} catch {
			status = "failed";
		}
	}
</script>

<Card id="contact" title={c.title} {open} {onclose}>
	{#if status === "sent"}
		<div class="sent" role="status">
			<p class="thanks">{c.sentTitle}</p>
			<p>{c.sent}</p>
		</div>
	{:else}
		<p class="intro">{c.intro}</p>
		<form onsubmit={submit}>
			<div class="pair">
				<label>
					<span>{c.name}</span>
					<input name="name" autocomplete="name" required maxlength="120" />
				</label>
				<label>
					<span>{c.company} <em>{c.optional}</em></span>
					<input name="company" autocomplete="organization" maxlength="160" />
				</label>
			</div>
			<div class="pair">
				<label>
					<span>{c.email}</span>
					<input name="email" type="email" autocomplete="email" required maxlength="200" />
				</label>
				<label>
					<span>{c.phone} <em>{c.optional}</em></span>
					<input name="phone" type="tel" autocomplete="tel" maxlength="60" />
				</label>
			</div>
			<label>
				<span>{c.message}</span>
				<textarea name="message" rows="5" required minlength="5" maxlength="4000" placeholder={c.messageHint}></textarea>
			</label>
			<!-- no person sees or fills this one -->
			<input class="trap" name="website" tabindex="-1" autocomplete="off" aria-hidden="true" />
			<div class="send">
				<button type="submit" disabled={status === "sending"}>{status === "sending" ? c.sending : c.send}</button>
				<small>{c.privacy}</small>
			</div>
			{#if status === "failed"}<p class="failed" role="alert">{c.failed}</p>{/if}
		</form>
	{/if}
	<p class="other">{c.orAssistant}</p>
</Card>

<style>
	.intro {
		margin-top: 0;
	}
	form {
		display: grid;
		gap: 0.9rem;
		margin-top: 1.25rem;
	}
	.pair {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 0.9rem;
	}
	label {
		display: grid;
		gap: 0.35rem;
	}
	label span {
		font-size: 0.85rem;
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
		padding: 0.7rem 0.8rem;
		border: 1px solid color-mix(in srgb, var(--ink) 18%, transparent);
		border-radius: 0.6rem;
		background: color-mix(in srgb, var(--ink) 3%, var(--paper));
		color: var(--ink);
		font: inherit;
		font-size: 1rem;
		transition: border-color 0.15s;
	}
	textarea {
		resize: vertical;
		min-height: 7rem;
	}
	input:focus,
	textarea:focus {
		outline: none;
		border-color: var(--accent);
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
	.send {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		gap: 0.75rem 1rem;
	}
	button {
		padding: 0.75rem 1.6rem;
		border: 0;
		border-radius: 999px;
		background: var(--ink);
		color: var(--paper);
		font: inherit;
		font-weight: 700;
		cursor: pointer;
	}
	button:hover:not(:disabled) {
		background: var(--accent);
		color: white;
	}
	button:disabled {
		opacity: 0.6;
		cursor: default;
	}
	small {
		font-size: 0.8rem;
		color: var(--ink-soft);
	}
	.failed {
		margin: 0;
		color: var(--accent);
		font-weight: 600;
	}
	.sent {
		padding: 1.25rem 1.25rem 1.1rem;
		border: 1px solid color-mix(in srgb, var(--ink) 13%, transparent);
		border-radius: 0.9rem;
		background: color-mix(in srgb, var(--accent) 8%, transparent);
	}
	.sent p {
		margin: 0;
	}
	.thanks {
		font-size: 1.15rem;
		font-weight: 800;
		margin-bottom: 0.3rem !important;
	}
	.other {
		margin-top: 1.5rem;
		font-size: 0.9rem;
		color: var(--ink-soft);
	}
	@container (max-width: 510px) {
		.pair {
			grid-template-columns: 1fr;
		}
	}
</style>
