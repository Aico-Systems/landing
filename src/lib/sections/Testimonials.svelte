<script lang="ts">
  import Icon from '../components/Icon.svelte';

  const testimonials = [
    {
      quote: "Aico has transformed our customer support. We're now handling 3x more inquiries with the same team size, and our customers are happier than ever.",
      author: "Sarah Chen",
      role: "VP of Customer Success",
      company: "TechCorp Global",
      avatar: "SC",
      rating: 5
    },
    {
      quote: "The knowledge base integration is phenomenal. Our AI agent provides accurate answers instantly, and it learns from every interaction. It's like having our best support rep available 24/7.",
      author: "Marcus Rodriguez",
      role: "CTO",
      company: "InnovateLabs",
      avatar: "MR",
      rating: 5
    },
    {
      quote: "Implementation was seamless, and the ROI was immediate. Within the first month, we reduced our response times by 85% and our support costs by 60%.",
      author: "Emily Watson",
      role: "Head of Operations",
      company: "ScaleUp Inc",
      avatar: "EW",
      rating: 5
    }
  ];

  const spotlight = testimonials[0];
  const rest = testimonials.slice(1);
</script>

<section id="testimonials" class="testimonials">
  <div class="container">
    <div class="section-header">
      <span class="eyebrow">Proof from the field</span>
      <h2>Teams trust Aico to run conversations that matter.</h2>
      <p>Leaders across support, operations, and revenue desks rely on Aico for enterprise-grade calls with measurable ROI.</p>
    </div>

    <div class="testimonials-layout">
      <div class="spotlight-card">
        <div class="spotlight-header">
          <span class="badge">Spotlight</span>
          <div class="rating">
            <Icon name="star" size={18} strokeWidth={0} />
            <Icon name="star" size={18} strokeWidth={0} />
            <Icon name="star" size={18} strokeWidth={0} />
            <Icon name="star" size={18} strokeWidth={0} />
            <Icon name="star" size={18} strokeWidth={0} />
          </div>
        </div>
        <blockquote>
          “{spotlight.quote}”
        </blockquote>
        <div class="spotlight-footer">
          <div class="avatar">{spotlight.avatar}</div>
          <div>
            <div class="name">{spotlight.author}</div>
            <div class="role">{spotlight.role}</div>
            <div class="company">{spotlight.company}</div>
          </div>
        </div>
      </div>

      <div class="testimonials-stack">
        {#each rest as testimonial, index}
          <div class="testimonial-card" style="animation-delay: {index * 0.12}s">
            <div class="card-top">
              <div class="avatar small">{testimonial.avatar}</div>
              <div>
                <div class="name">{testimonial.author}</div>
                <div class="role">{testimonial.role}</div>
                <div class="company">{testimonial.company}</div>
              </div>
            </div>
            <p>"{testimonial.quote}"</p>
            <div class="rating compact">
              {#each Array(testimonial.rating) as _, i}
                <Icon name="star" size={14} strokeWidth={0} />
              {/each}
            </div>
          </div>
        {/each}
      </div>
    </div>
  </div>
</section>

<style>
  .testimonials {
    padding: 120px 0;
    background: transparent;
    position: relative;
    z-index: 1;
  }

  .section-header {
    text-align: center;
    margin-bottom: 72px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    align-items: center;
  }

  .eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(102, 126, 234, 0.32);
    background: rgba(102, 126, 234, 0.12);
    color: #4c5fe3;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .section-header h2 {
    font-size: clamp(36px, 4vw, 48px);
    color: var(--text-primary);
  }

  .section-header p {
    color: var(--text-secondary);
    max-width: 640px;
    font-size: 18px;
    line-height: 1.8;
  }

  .testimonials-layout {
    display: grid;
    grid-template-columns: minmax(0, 1.1fr) minmax(0, 0.9fr);
    gap: 40px;
    align-items: stretch;
  }

  .spotlight-card {
    border-radius: 28px;
    padding: 48px;
    border: 1px solid rgba(102, 126, 234, 0.28);
    background: rgba(12, 19, 36, 0.65);
    backdrop-filter: blur(40px);
    color: #f8fafc;
    box-shadow: 0 40px 90px rgba(9, 12, 24, 0.4);
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  :global([data-theme="light"]) .spotlight-card {
    background: rgba(248, 249, 255, 0.86);
    color: var(--text-primary);
  }

  .spotlight-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .badge {
    font-size: 12px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    padding: 6px 16px;
    border-radius: 999px;
    border: 1px solid rgba(102, 126, 234, 0.32);
    background: rgba(102, 126, 234, 0.14);
  }

  .rating {
    display: flex;
    gap: 4px;
    color: #fbbf24;
  }

  .rating :global(svg) {
    fill: currentColor;
  }

  blockquote {
    font-size: clamp(22px, 3vw, 28px);
    line-height: 1.6;
    font-style: italic;
    margin: 0;
  }

  .spotlight-footer {
    display: flex;
    align-items: center;
    gap: 16px;
    padding-top: 24px;
    border-top: 1px solid rgba(148, 163, 209, 0.25);
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 18px;
    color: white;
    flex-shrink: 0;
  }

  .avatar.small {
    width: 48px;
    height: 48px;
    font-size: 16px;
  }

  .spotlight-footer .name {
    font-size: 16px;
    font-weight: 600;
  }

  .role {
    font-size: 14px;
    color: var(--text-secondary);
  }

  .company {
    font-size: 14px;
    font-weight: 600;
    color: #5c6cf3;
  }

  .testimonials-stack {
    display: grid;
    gap: 24px;
  }

  .testimonial-card {
    padding: 32px;
    border-radius: 22px;
    border: 1px solid rgba(102, 126, 234, 0.22);
    background: rgba(12, 19, 36, 0.55);
    backdrop-filter: blur(30px);
    color: #f1f5f9;
    display: flex;
    flex-direction: column;
    gap: 18px;
    animation: fadeInUp 0.6s ease-out both;
  }

  :global([data-theme="light"]) .testimonial-card {
    background: rgba(248, 249, 255, 0.82);
    color: var(--text-primary);
  }

  .testimonial-card:hover {
    transform: translateY(-6px);
    border-color: rgba(102, 126, 234, 0.4);
  }

  .card-top {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .testimonial-card p {
    font-size: 15px;
    line-height: 1.7;
    opacity: 0.85;
  }

  .rating.compact {
    justify-content: flex-start;
    color: #fbbf24;
  }

  .name {
    font-size: 15px;
    font-weight: 600;
  }

  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @media (max-width: 920px) {
    .testimonials-layout {
      grid-template-columns: 1fr;
    }

    .spotlight-card {
      padding: 40px;
    }
  }

  @media (max-width: 768px) {
    .testimonials {
      padding: 96px 0;
    }

    .spotlight-card {
      padding: 32px;
    }

    .testimonial-card {
      padding: 28px;
    }
  }
</style>
