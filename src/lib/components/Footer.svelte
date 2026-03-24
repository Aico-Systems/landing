<script lang="ts">
	import Icon from "./Icon.svelte";
	import { t } from "../../i18n";
	import {
		requestAppNavigation,
		shouldHandleClientNavigation,
		type AppPath,
	} from "../utils/appNavigation";
	import {
		getSectionIdFromHash,
		requestSectionNavigation,
	} from "../utils/sectionNavigation";

	function handleSectionLinkClick(event: MouseEvent, href: string) {
		const sectionId = getSectionIdFromHash(href);
		if (!sectionId) return;

		event.preventDefault();
		requestSectionNavigation(sectionId);
	}

	function handleAppLinkClick(event: MouseEvent, path: AppPath) {
		if (!shouldHandleClientNavigation(event)) return;
		event.preventDefault();
		requestAppNavigation(path);
	}
</script>

<footer class="footer">
	<div class="container">
		<div class="footer-content">
			<div class="footer-brand">
				<div class="logo">
					<img src="/Logo.svg" alt="AICOYO" class="logo-img" />
					<span class="logo-text">AICOYO</span>
				</div>
				<p>{$t("footer.tagline")}</p>
				<div class="status-pill">
					<span class="status-dot"></span>
					{$t("footer.status")}
				</div>
			</div>

			<div class="footer-right">
				<div class="footer-link-groups">
					<div class="footer-column">
						<h4>{$t("footer.columns.explore")}</h4>
						<a href="#hero" on:click={(event) => handleSectionLinkClick(event, "#hero")}
							>{$t("footer.links.overview")}</a
						>
						<a
							href="#how-it-works"
							on:click={(event) => handleSectionLinkClick(event, "#how-it-works")}
							>{$t("footer.links.implementation")}</a
						>
						<a
							href="#features"
							on:click={(event) => handleSectionLinkClick(event, "#features")}
							>{$t("footer.links.platform")}</a
						>
						<a
							href="#use-cases"
							on:click={(event) => handleSectionLinkClick(event, "#use-cases")}
							>{$t("footer.links.solutions")}</a
						>
						<a
							href="#booking"
							on:click={(event) => handleSectionLinkClick(event, "#booking")}
							>{$t("footer.links.book")}</a
						>
					</div>

					<div class="footer-column">
						<h4>{$t("footer.columns.resources")}</h4>
						<a href="/docs/" on:click={(event) => handleAppLinkClick(event, "/docs/")}>{$t("footer.links.docs")}</a>
						<a href="/blog/" on:click={(event) => handleAppLinkClick(event, "/blog/")}>{$t("footer.links.blog")}</a>
						<a href="/security/" on:click={(event) => handleAppLinkClick(event, "/security/")}>{$t("footer.links.security")}</a>
						<a href="/status/" on:click={(event) => handleAppLinkClick(event, "/status/")}>{$t("footer.links.status")}</a>
					</div>

					<div class="footer-column">
						<h4>{$t("footer.columns.legal")}</h4>
						<a href="/imprint/" on:click={(event) => handleAppLinkClick(event, "/imprint/")}>{$t("footer.links.imprint")}</a>
						<a href="/privacy/" on:click={(event) => handleAppLinkClick(event, "/privacy/")}>{$t("footer.links.privacy")}</a>
						<a href="/terms/" on:click={(event) => handleAppLinkClick(event, "/terms/")}>{$t("footer.links.terms")}</a>
						<a href="/policies/" on:click={(event) => handleAppLinkClick(event, "/policies/")}>{$t("footer.links.policies")}</a>
					</div>
				</div>

				<div class="footer-meta">
					<div class="meta-item">
						<Icon name="map-pin" size={16} strokeWidth={1.8} />
						{$t("footer.meta.location")}
					</div>
					<div class="meta-item">
						<Icon name="mail" size={16} strokeWidth={1.8} />
						<a href="mailto:nikita@aicoflow.com">nikita@aicoflow.com</a>
					</div>
					<div class="meta-item socials">
						<span>{$t("footer.meta.follow")}</span>
						<a
							href="https://www.linkedin.com"
							target="_blank"
							rel="noreferrer noopener"
						>
							<Icon name="linkedin" size={18} strokeWidth={1.6} />
						</a>
						<a
							href="https://twitter.com"
							target="_blank"
							rel="noreferrer noopener"
						>
							<Icon name="twitter" size={18} strokeWidth={1.6} />
						</a>
					</div>
				</div>
			</div>
		</div>

		<div class="footer-bottom">
			<p>{$t("footer.legal.copyright")}</p>
		</div>
	</div>
</footer>

<style>
	.footer {
		background: rgba(11, 18, 38, 0.9);
		color: rgba(226, 232, 240, 0.75);
		padding: 64px 0 32px;
		margin-top: 120px;
		border-top: 1px solid rgba(20, 91, 122, 0.08);
	}

	:global([data-theme="light"]) .footer {
		background: rgba(241, 245, 249, 0.8);
		color: var(--text-secondary);
	}

	.footer-content {
		display: grid;
		grid-template-columns: minmax(320px, 0.95fr) minmax(420px, 560px);
		gap: clamp(40px, 6vw, 96px);
		margin-bottom: 48px;
		max-width: 1140px;
		margin-left: auto;
		margin-right: auto;
		align-items: start;
	}

	.footer-brand .logo {
		display: flex;
		align-items: center;
		gap: 12px;
		font-size: 24px;
		font-weight: 700;
		color: var(--text-primary);
		margin-bottom: 16px;
	}

	.logo-img {
		height: 28px;
		width: auto;
	}

		.footer-brand p {
			font-size: 14px;
			max-width: 28ch;
		}

	.status-pill {
		margin-top: 20px;
		display: inline-flex;
		align-items: center;
		gap: 8px;
		padding: 6px 14px;
		border-radius: 999px;
		border: 1px solid rgba(52, 211, 153, 0.28);
		background: rgba(52, 211, 153, 0.08);
		font-size: 12px;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: rgba(148, 250, 210, 0.9);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: #34d399;
		box-shadow: 0 0 0 6px rgba(52, 211, 153, 0.18);
	}

	:global([data-theme="light"]) .status-pill {
		color: #0f766e;
		background: rgba(52, 211, 153, 0.12);
		border-color: rgba(52, 211, 153, 0.28);
	}

	:global([data-theme="light"]) .status-dot {
		box-shadow: 0 0 0 6px rgba(52, 211, 153, 0.12);
	}

	.footer-right {
		display: grid;
		gap: 28px;
		align-items: start;
	}

	.footer-link-groups {
		display: grid;
		grid-template-columns: repeat(3, minmax(150px, 1fr));
		gap: 28px;
		width: 100%;
	}

	.footer-column {
		min-width: 0;
	}

	.footer-column h4 {
		color: var(--text-primary);
		font-size: 16px;
		margin-bottom: 16px;
	}

	.footer-column a {
		display: block;
		font-size: 14px;
		margin-bottom: 12px;
		transition: color 0.3s ease;
		color: inherit;
	}

	.footer-column a:hover {
		color: #145B7A;
	}

	.footer-meta {
		display: flex;
		flex-wrap: wrap;
		gap: 16px 24px;
		font-size: 14px;
		color: rgba(226, 232, 240, 0.85);
		padding-top: 8px;
	}

	:global([data-theme="light"]) .footer-meta {
		color: var(--text-tertiary);
	}

	.meta-item {
		display: inline-flex;
		align-items: center;
		gap: 10px;
		opacity: 0.9;
	}

	.meta-item a {
		color: inherit;
	}

	.meta-item a:hover {
		color: #145B7A;
	}

	.meta-item :global(svg) {
		flex-shrink: 0;
	}

		.meta-item.socials {
			gap: 14px;
		}

	.meta-item.socials span {
		font-size: 12px;
		text-transform: uppercase;
		letter-spacing: 0.1em;
		opacity: 0.7;
	}

	.meta-item.socials a {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 50%;
		border: 1px solid rgba(20, 91, 122, 0.2);
		transition:
			border-color 0.3s ease,
			transform 0.3s ease;
	}

	.meta-item.socials a:hover {
		border-color: rgba(20, 91, 122, 0.5);
		transform: translateY(-1px);
	}

	.footer-bottom {
		display: flex;
		justify-content: center;
		align-items: center;
		padding-top: 30px;
		border-top: 1px solid rgba(20, 91, 122, 0.12);
		font-size: 14px;
		max-width: 1140px;
		margin: 0 auto;
	}

	@media (max-width: 968px) {
		.footer {
			padding: 56px 0 28px;
			margin-top: 96px;
		}

			.footer-content {
				grid-template-columns: 1fr;
				gap: 36px;
			}

		.footer-right {
			width: 100%;
			gap: 24px;
		}

		.footer-link-groups {
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 24px;
		}

		.footer-meta {
			width: 100%;
		}

		.meta-item.socials {
			justify-content: flex-start;
		}

			.footer-bottom { text-align: center; }
		}

		@media (max-width: 640px) {
			.footer {
				padding: 48px 0 24px;
				margin-top: 80px;
			}

			.footer-content {
				gap: 28px;
				margin-bottom: 32px;
				text-align: center;
			}

			.footer-brand {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.footer-brand .logo {
				font-size: 20px;
				margin-bottom: 12px;
				justify-content: center;
			}

			.footer-brand p {
				max-width: none;
				font-size: 15px;
				line-height: 1.55;
			}

			.status-pill {
				margin-top: 16px;
				padding: 0 12px;
				min-height: 30px;
				font-size: 11px;
				letter-spacing: 0.1em;
				justify-content: center;
			}

			.footer-right {
				align-items: center;
				text-align: center;
			}

			.footer-link-groups {
				grid-template-columns: 1fr;
				gap: 20px;
				justify-items: center;
			}

			.footer-column {
				display: flex;
				flex-direction: column;
				align-items: center;
			}

			.footer-column h4 {
				margin-bottom: 12px;
				font-size: 15px;
			}

			.footer-column a {
				margin-bottom: 10px;
				font-size: 15px;
				line-height: 1.5;
			}

			.footer-meta {
				display: grid;
				gap: 10px;
				font-size: 15px;
				justify-items: center;
				padding-top: 4px;
			}

			.meta-item {
				width: auto;
				max-width: 100%;
				align-items: center;
				justify-content: center;
				line-height: 1.5;
				text-align: center;
			}

			.meta-item.socials {
				align-items: center;
				justify-content: center;
				gap: 12px;
				flex-wrap: nowrap;
			}

			.meta-item.socials span {
				margin-right: 2px;
			}

		}

		@media (max-width: 420px) {
			.footer {
				padding: 40px 0 22px;
				margin-top: 72px;
			}

			.footer-bottom {
				padding-top: 22px;
				gap: 12px;
			}
		}
	</style>
