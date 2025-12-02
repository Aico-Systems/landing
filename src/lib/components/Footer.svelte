<script lang="ts">
    import Icon from "./Icon.svelte";
</script>

<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-brand">
                <div class="logo">
                    <img src="/Logo.png" alt="Aico" class="logo-img" />
                    <span class="logo-text">Aico</span>
                </div>
                <p>Your brand’s voice, operationalized by AI.</p>
                <div class="status-pill">
                    <span class="status-dot"></span>
                    Systems operational
                </div>
            </div>

            <div class="footer-right">
                <div class="footer-links">
                    <div class="footer-column">
                        <h4>Product</h4>
                        <a href="#hero">Overview</a>
                        <a href="#features">Platform</a>
                        <a href="#use-cases">Solutions</a>
                    </div>

                    <div class="footer-column">
                        <h4>Company</h4>
                        <a href="#contact">Contact</a>
                        <a href="#testimonials">Customers</a>
                        <a href="mailto:hello@aico.ai">Press</a>
                    </div>

                    <div class="footer-column">
                        <h4>Resources</h4>
                        <a href="#how-it-works">Implementation</a>
                        <a href="#cta">Security</a>
                        <a href="#use-cases">Customer stories</a>
                    </div>
                </div>

                <div class="footer-meta">
                    <div class="meta-item">
                        <Icon name="map-pin" size={16} strokeWidth={1.8} />
                        San Francisco · New York · Remote-first
                    </div>
                    <div class="meta-item">
                        <Icon name="mail" size={16} strokeWidth={1.8} />
                        <a href="mailto:hello@aico.ai">hello@aico.ai</a>
                    </div>
                    <div class="meta-item socials">
                        <span>Follow</span>
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
            <p>&copy; 2025 Aico. All rights reserved.</p>
            <div class="footer-legal">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
            </div>
        </div>
    </div>
</footer>

<style>
    .footer {
        background: rgba(4, 7, 14, 0.9);
        color: rgba(226, 232, 240, 0.75);
        padding: 64px 0 32px;
        margin-top: 120px;
        border-top: 1px solid rgba(102, 126, 234, 0.08);
    }

    :global([data-theme="light"]) .footer {
        background: rgba(241, 244, 255, 0.8);
        color: var(--text-secondary);
    }

    .footer-content {
        display: grid;
        grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
        gap: 48px;
        margin-bottom: 48px;
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
        height: 40px;
        width: auto;
    }

    .footer-brand p {
        font-size: 14px;
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
        display: flex;
        flex-direction: column;
        gap: 32px;
        align-items: flex-start;
    }

    .footer-links {
        display: flex;
        gap: 48px;
        flex-wrap: wrap;
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
        color: #667eea;
    }

    .footer-meta {
        display: grid;
        gap: 14px;
        font-size: 14px;
        color: rgba(226, 232, 240, 0.85);
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
        color: #667eea;
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
        border: 1px solid rgba(102, 126, 234, 0.2);
        transition:
            border-color 0.3s ease,
            transform 0.3s ease;
    }

    .meta-item.socials a:hover {
        border-color: rgba(102, 126, 234, 0.5);
        transform: translateY(-1px);
    }

    .footer-bottom {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 30px;
        border-top: 1px solid rgba(102, 126, 234, 0.12);
        font-size: 14px;
    }

    .footer-legal {
        display: flex;
        gap: 24px;
    }

    .footer-legal a {
        color: inherit;
    }

    .footer-legal a:hover {
        color: #667eea;
    }

    @media (max-width: 968px) {
        .footer-content {
            grid-template-columns: 1fr;
            gap: 36px;
        }

        .footer-right {
            width: 100%;
            gap: 24px;
        }

        .footer-meta {
            width: 100%;
        }

        .meta-item.socials {
            justify-content: flex-start;
        }

        .footer-bottom {
            flex-direction: column;
            gap: 16px;
            text-align: center;
        }
    }
</style>
