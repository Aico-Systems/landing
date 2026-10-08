/**
 * What Mandy can connect to, beyond the systems named in the cards: apps
 * by what they are for, as the page lists them. Names are names, the same
 * in every language; the groups' labels are in the locale files.
 *
 * The connections run on Activepieces pieces (the AICO backend, see
 * backend/src/services/integration/pieces.ts): any published piece is one
 * pinned package away. PIECES is the number published on npm
 * (@activepieces/piece-*) on PIECES_COUNTED; recount when updating:
 * curl "https://registry.npmjs.org/-/v1/search?text=%40activepieces%2Fpiece-&size=250&from=<0,250,…>"
 */
import type { SystemId } from "$lib/systems";

export const PIECES = 777;
export const PIECES_COUNTED = "2026-10-08";

export type AppGroup = "erp" | "service" | "messaging" | "documents" | "data";

/** The apps by what they are for: systems from the registry, so they carry
 *  their logos. */
export const APPS: Record<AppGroup, SystemId[]> = {
	erp: ["ariba", "dynamics", "netsuite", "odoo", "workday", "salesforce"],
	service: ["servicenow", "jira", "zendesk", "freshdesk", "azureDevops", "monday"],
	messaging: ["teams", "slack", "whatsapp", "twilio", "telegram", "outlook"],
	documents: ["sharepoint", "onedrive", "confluence", "googleDrive", "notion", "dropbox"],
	data: ["excel", "googleSheets", "powerBi", "sqlServer", "postgres", "webhooks"],
};
