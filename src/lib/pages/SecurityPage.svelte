<script lang="ts">
  import PlaceholderPage from "./PlaceholderPage.svelte";
</script>

<PlaceholderPage
  activePath="/security/"
  eyebrow="Security"
  title="Security reporting"
  description="If you discover a security issue affecting this website, please report it to nikita@aicoflow.com."
  lede="This route is reserved for public security guidance and a cleaner responsible-disclosure policy."
  bullets={[
    "Include a clear description and reproducible steps",
    "Do not access, copy, or destroy third-party data",
    "Do not perform denial-of-service or availability attacks",
    "No public disclosure until remediation has been coordinated",
  ]}
/>
