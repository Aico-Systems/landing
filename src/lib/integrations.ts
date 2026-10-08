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
export const PIECES = 777;
export const PIECES_COUNTED = "2026-10-08";

export type AppGroup = "erp" | "service" | "messaging" | "documents" | "data";

export const APPS: Record<AppGroup, string[]> = {
	erp: ["SAP Ariba", "Dynamics 365", "NetSuite", "Odoo", "Workday", "Salesforce"],
	service: ["ServiceNow", "Jira", "Zendesk", "Freshdesk", "Azure DevOps", "Monday"],
	messaging: ["Microsoft Teams", "Slack", "WhatsApp", "Twilio SMS", "Telegram", "Outlook"],
	documents: ["SharePoint", "OneDrive", "Confluence", "Google Drive", "Notion", "Dropbox"],
	data: ["Excel 365", "Google Sheets", "Power BI", "SQL Server", "Postgres", "Webhooks"],
};
