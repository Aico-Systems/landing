import { llmsFull } from "$lib/llms";

export const prerender = true;
export const GET = () => new Response(llmsFull(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
