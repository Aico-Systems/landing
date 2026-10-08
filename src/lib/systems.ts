import type { VerticalId } from "$lib/verticals";

/**
 * The systems each industry runs, as the vertical cards show them: what a
 * worker's question is answered from, booked into or reported through.
 * Researched per vertical (2026-10, analyst rankings, vendor customer
 * lists, trade press; DACH and North America first). Mandy reaches them
 * through an Activepieces piece where one exists ([piece]), otherwise
 * through the system's API or a webhook.
 *
 * Names and domains are the vendors' own. The logos in src/lib/logos are
 * fetched once by tools/logos/fetch.py (Simple Icons, the Activepieces
 * piece logo, or the vendor's site icon) and used to name systems Mandy
 * works with; the marks belong to their owners. A system without a logo
 * file gets a lettered tile.
 */
export type SystemKind =
	| "erp"
	| "wms"
	| "mes"
	| "maintenance"
	| "quality"
	| "workforce"
	| "documents"
	| "messaging"
	| "tickets"
	| "shop"
	| "shipping"
	| "returns"
	| "resale"
	| "sorting"
	| "yard"
	| "customs"
	| "routing"
	| "serialisation"
	| "temperature"
	| "mro"
	| "techdocs"
	| "groundops"
	| "baggage"
	| "safety"
	| "plm"
	| "replenishment"
	| "tasks"
	| "voice"
	| "instructions"
	| "andon"
	| "marketplace"
	| "helpdesk";

export interface System {
	name: string;
	domain: string;
	kind: SystemKind;
	/** The Activepieces piece that connects it, when there is one. */
	piece?: string;
	/** Its Simple Icons slug, when Simple Icons has its mark. */
	icon?: string;
	/** Where its logo is, when neither Simple Icons nor the piece has it:
	 *  an image URL, or a page whose header carries the logo as inline SVG
	 *  ("inline:<url>"). Without one, the vendor's site icon is used. */
	logo?: string;
}

export const SYSTEMS = {
	sap: { name: "SAP S/4HANA", domain: "sap.com", kind: "erp", icon: "sap" },
	sapEwm: { name: "SAP EWM", domain: "sap.com", kind: "wms", icon: "sap" },
	dynamics: { name: "Dynamics 365", domain: "microsoft.com", kind: "erp", piece: "microsoft-dynamics-365-business-central" },
	netsuite: { name: "NetSuite", domain: "netsuite.com", kind: "erp", piece: "netsuite" },
	manhattan: { name: "Manhattan Active", domain: "manh.com", kind: "wms" },
	blueYonder: { name: "Blue Yonder", domain: "blueyonder.com", kind: "wms" },
	infios: { name: "Infios", domain: "infios.com", kind: "wms" },
	korber: { name: "Körber", domain: "koerber.com", kind: "wms" },
	extensiv: { name: "Extensiv", domain: "extensiv.com", kind: "wms", logo: "https://www.extensiv.com/hs-fs/hubfs/DSG+Extensiv_Three_Color_Logo_RGB-300.png?width=300&height=128&name=DSG+Extensiv_Three_Color_Logo_RGB-300.png" },
	vocollect: { name: "Honeywell Vocollect", domain: "honeywell.com", kind: "voice" },
	ukg: { name: "UKG Pro", domain: "ukg.com", kind: "workforce" },
	atoss: { name: "ATOSS", domain: "atoss.com", kind: "workforce" },
	transporeon: { name: "Transporeon", domain: "transporeon.com", kind: "yard" },
	servicenow: { name: "ServiceNow", domain: "servicenow.com", kind: "tickets", piece: "service-now" },
	maintainx: { name: "MaintainX", domain: "getmaintainx.com", kind: "maintenance" },
	maximo: { name: "IBM Maximo", domain: "ibm.com", kind: "maintenance", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/IBM_logo.svg" },
	sharepoint: { name: "SharePoint", domain: "microsoft.com", kind: "documents", piece: "microsoft-sharepoint" },
	teams: { name: "Microsoft Teams", domain: "microsoft.com", kind: "messaging", piece: "microsoft-teams" },
	flip: { name: "Flip", domain: "getflip.com", kind: "messaging" },
	beekeeper: { name: "Beekeeper", domain: "beekeeper.io", kind: "messaging" },
	opcenter: { name: "Siemens Opcenter", domain: "siemens.com", kind: "mes", icon: "siemens" },
	teamcenter: { name: "Siemens Teamcenter", domain: "siemens.com", kind: "plm", icon: "siemens" },
	plex: { name: "Plex", domain: "plex.com", kind: "mes" },
	itac: { name: "iTAC.MOM", domain: "itac.de", kind: "mes" },
	hydra: { name: "MPDV HYDRA X", domain: "mpdv.com", kind: "mes" },
	babtec: { name: "Babtec", domain: "babtec.com", kind: "quality" },
	casq: { name: "CASQ-it", domain: "boehme-weihs.de", kind: "quality" },
	ignition: { name: "Ignition", domain: "inductiveautomation.com", kind: "andon" },
	tulip: { name: "Tulip", domain: "tulip.co", kind: "instructions" },
	vanderlande: { name: "Vanderlande", domain: "vanderlande.com", kind: "sorting" },
	intelligrated: { name: "Honeywell Intelligrated", domain: "honeywell.com", kind: "sorting" },
	descartes: { name: "Descartes", domain: "descartes.com", kind: "routing", logo: "https://www.descartes.com/themes/descartes/logo-dark.png" },
	ptv: { name: "PTV", domain: "ptvgroup.com", kind: "routing" },
	aeb: { name: "AEB", domain: "aeb.com", kind: "customs" },
	dakosy: { name: "DAKOSY", domain: "dakosy.de", kind: "customs", logo: "inline:https://www.dakosy.de/" },
	shopify: { name: "Shopify", domain: "shopify.com", kind: "shop", piece: "shopify", icon: "shopify" },
	shopware: { name: "Shopware", domain: "shopware.com", kind: "shop", icon: "shopware" },
	jtl: { name: "JTL", domain: "jtl-software.de", kind: "erp" },
	xentral: { name: "Xentral", domain: "xentral.com", kind: "erp" },
	plentymarkets: { name: "plentymarkets", domain: "plentymarkets.com", kind: "erp" },
	shiphero: { name: "ShipHero", domain: "shiphero.com", kind: "wms" },
	sendcloud: { name: "Sendcloud", domain: "sendcloud.com", kind: "shipping" },
	shipstation: { name: "ShipStation", domain: "shipstation.com", kind: "shipping" },
	loop: { name: "Loop Returns", domain: "loopreturns.com", kind: "returns" },
	gorgias: { name: "Gorgias", domain: "gorgias.com", kind: "helpdesk" },
	zendesk: { name: "Zendesk", domain: "zendesk.com", kind: "helpdesk", piece: "zendesk", icon: "zendesk" },
	amazon: { name: "Amazon Seller Central", domain: "sellercentral.amazon.com", kind: "marketplace", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Amazon_logo.svg" },
	gk: { name: "GK Software", domain: "gk-software.com", kind: "erp" },
	relex: { name: "RELEX", domain: "relexsolutions.com", kind: "replenishment" },
	workcloud: { name: "Zebra Workcloud", domain: "zebra.com", kind: "workforce" },
	yoobic: { name: "YOOBIC", domain: "yoobic.com", kind: "tasks" },
	smartsense: { name: "SmartSense", domain: "smartsense.co", kind: "temperature" },
	testo: { name: "testo Saveris", domain: "testo.com", kind: "temperature" },
	danfoss: { name: "Danfoss", domain: "danfoss.com", kind: "temperature", logo: "https://www.danfoss.com/static/images/new-logo.svg" },
	servicechannel: { name: "ServiceChannel", domain: "servicechannel.com", kind: "maintenance", logo: "https://servicechannel.com/dist/images/temp/svg/logo.svg" },
	ocado: { name: "Ocado", domain: "ocadogroup.com", kind: "shop" },
	zigzag: { name: "ZigZag", domain: "zigzag.global", kind: "returns" },
	parcellab: { name: "parcelLab", domain: "parcellab.com", kind: "returns" },
	narvar: { name: "Narvar", domain: "narvar.com", kind: "returns" },
	trove: { name: "Trove", domain: "trove.com", kind: "resale" },
	returnpro: { name: "ReturnPro", domain: "returnpro.com", kind: "returns" },
	centric: { name: "Centric PLM", domain: "centricsoftware.com", kind: "plm", logo: "https://images.ctfassets.net/32vxorm5v0vi/7zKz43DPvoHTtEtz4weDpG/4670c96639ce1004b855d58528b910ad/centric-icon__1_.svg" },
	lectra: { name: "Lectra", domain: "lectra.com", kind: "plm", logo: "https://www.lectra.com/themes/custom/lectra_b5/logo.svg" },
	fluent: { name: "Fluent Commerce", domain: "fluentcommerce.com", kind: "shop" },
	inspectorio: { name: "Inspectorio", domain: "inspectorio.com", kind: "quality" },
	zalando: { name: "Zalando ZEOS", domain: "zeos.eu", kind: "marketplace", icon: "zalando" },
	veeva: { name: "Veeva Vault", domain: "veeva.com", kind: "quality", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Veeva_Systems_logo.svg" },
	trackwise: { name: "TrackWise", domain: "honeywell.com", kind: "quality" },
	mastercontrol: { name: "MasterControl", domain: "mastercontrol.com", kind: "quality", logo: "https://www.mastercontrol.com/images/default-source/mcui-design-system/logos/mastercontrol/teal/mc-logo-teal-hz.svg" },
	securpharm: { name: "securPharm", domain: "securpharm.de", kind: "serialisation", logo: "https://www.securpharm.de/wp-content/uploads/2024/08/cropped-favicon-192x192.bmp" },
	tracelink: { name: "TraceLink", domain: "tracelink.com", kind: "serialisation" },
	rfxcel: { name: "rfxcel", domain: "rfxcel.com", kind: "serialisation" },
	vaisala: { name: "Vaisala viewLinc", domain: "vaisala.com", kind: "temperature" },
	controlant: { name: "Controlant", domain: "controlant.com", kind: "temperature" },
	amos: { name: "AMOS", domain: "swiss-as.com", kind: "mro" },
	boeing: { name: "Boeing Toolbox", domain: "services.boeing.com", kind: "techdocs", icon: "boeing" },
	airnavx: { name: "Airbus airnavX", domain: "airbus.com", kind: "techdocs", icon: "airbus" },
	trax: { name: "TRAX", domain: "trax.aero", kind: "mro", logo: "https://www.trax.aero/images/favicon-trax.svg" },
	ifs: { name: "IFS Maintenix", domain: "ifs.com", kind: "mro", logo: "https://commons.wikimedia.org/wiki/Special:FilePath/Ifs_logo.svg" },
	ramco: { name: "Ramco Aviation", domain: "ramco.com", kind: "mro", logo: "https://www.ramco.com/hs-fs/hubfs/website-assets/ramco-logo.png?width=130&height=28&name=ramco-logo.png" },
	groundstar: { name: "INFORM GroundStar", domain: "inform-software.com", kind: "groundops" },
	amadeus: { name: "Amadeus", domain: "amadeus.com", kind: "groundops" },
	worldtracer: { name: "SITA WorldTracer", domain: "sita.aero", kind: "baggage" },
	coruson: { name: "Ideagen Coruson", domain: "ideagen.com", kind: "safety" },
	ariba: { name: "SAP Ariba", domain: "ariba.com", kind: "erp", piece: "sap-ariba", icon: "sap" },
	odoo: { name: "Odoo", domain: "odoo.com", kind: "erp", piece: "odoo", icon: "odoo" },
	workday: { name: "Workday", domain: "workday.com", kind: "workforce", piece: "workday" },
	salesforce: { name: "Salesforce", domain: "salesforce.com", kind: "erp", piece: "salesforce" },
	jira: { name: "Jira", domain: "atlassian.com", kind: "tickets", piece: "jira-cloud", icon: "jira" },
	freshdesk: { name: "Freshdesk", domain: "freshdesk.com", kind: "helpdesk", piece: "freshdesk" },
	azureDevops: { name: "Azure DevOps", domain: "dev.azure.com", kind: "tickets", piece: "azure-devops" },
	monday: { name: "monday.com", domain: "monday.com", kind: "tasks", piece: "monday" },
	slack: { name: "Slack", domain: "slack.com", kind: "messaging", piece: "slack" },
	whatsapp: { name: "WhatsApp", domain: "whatsapp.com", kind: "messaging", piece: "whatsapp", icon: "whatsapp" },
	twilio: { name: "Twilio SMS", domain: "twilio.com", kind: "messaging", piece: "twilio" },
	telegram: { name: "Telegram", domain: "telegram.org", kind: "messaging", piece: "telegram-bot", icon: "telegram" },
	outlook: { name: "Outlook", domain: "outlook.com", kind: "messaging", piece: "microsoft-outlook" },
	onedrive: { name: "OneDrive", domain: "onedrive.com", kind: "documents", piece: "microsoft-onedrive" },
	confluence: { name: "Confluence", domain: "atlassian.com", kind: "documents", piece: "confluence", icon: "confluence" },
	googleDrive: { name: "Google Drive", domain: "drive.google.com", kind: "documents", piece: "google-drive", icon: "googledrive" },
	notion: { name: "Notion", domain: "notion.so", kind: "documents", piece: "notion", icon: "notion" },
	dropbox: { name: "Dropbox", domain: "dropbox.com", kind: "documents", piece: "dropbox", icon: "dropbox" },
	excel: { name: "Excel 365", domain: "microsoft.com", kind: "documents", piece: "microsoft-excel-365" },
	googleSheets: { name: "Google Sheets", domain: "sheets.google.com", kind: "documents", piece: "google-sheets", icon: "googlesheets" },
	powerBi: { name: "Power BI", domain: "powerbi.com", kind: "documents", piece: "microsoft-power-bi" },
	sqlServer: { name: "SQL Server", domain: "microsoft.com", kind: "documents", piece: "microsoft-sql-server" },
	postgres: { name: "Postgres", domain: "postgresql.org", kind: "documents", piece: "postgres", icon: "postgresql" },
	webhooks: { name: "Webhooks", domain: "activepieces.com", kind: "tickets", piece: "webhook", logo: "local:webhooks" },
} satisfies Record<string, System>;

export type SystemId = keyof typeof SYSTEMS;

/** What each industry runs, most used first. */
export const VERTICAL_SYSTEMS: Record<VerticalId, SystemId[]> = {
	warehouse: ["sapEwm", "manhattan", "blueYonder", "infios", "extensiv", "dynamics", "ukg", "atoss", "transporeon", "servicenow", "sharepoint", "teams", "flip", "vocollect"],
	manufacturing: ["sap", "opcenter", "maximo", "plex", "itac", "hydra", "babtec", "casq", "ignition", "tulip", "maintainx", "teamcenter", "sharepoint", "teams"],
	parcel: ["korber", "vanderlande", "intelligrated", "sap", "descartes", "ptv", "transporeon", "aeb", "dakosy", "maximo", "teams", "beekeeper"],
	ecommerce: ["shopify", "shopware", "amazon", "jtl", "xentral", "plentymarkets", "shiphero", "extensiv", "sendcloud", "shipstation", "loop", "gorgias", "zendesk", "netsuite"],
	grocery: ["sap", "gk", "relex", "blueYonder", "workcloud", "ukg", "atoss", "yoobic", "flip", "smartsense", "testo", "danfoss", "servicechannel", "ocado"],
	fashion: ["sap", "manhattan", "zalando", "zigzag", "parcellab", "narvar", "loop", "trove", "returnpro", "centric", "lectra", "fluent", "inspectorio", "zendesk"],
	pharma: ["sap", "sapEwm", "korber", "manhattan", "veeva", "trackwise", "mastercontrol", "securpharm", "tracelink", "rfxcel", "vaisala", "controlant", "sharepoint", "teams"],
	aviation: ["amos", "boeing", "airnavx", "trax", "ifs", "ramco", "sap", "groundstar", "amadeus", "worldtracer", "coruson", "teams"],
};
