import { llmsIndex } from "$lib/llms";

export const prerender = true;
export const GET = () => new Response(llmsIndex(), { headers: { "content-type": "text/markdown; charset=utf-8" } });
