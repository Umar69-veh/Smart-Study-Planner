// Primary source: Vite build-time env variable
let API_URL = import.meta.env.VITE_API_URL || "";

// Safety fallback: if the site is hosted on Vercel but the env var wasn't set
// in the Vercel project settings at build time, use the known Railway URL.
// This is safe for public clients because it contains a public host only.
if (!API_URL && typeof window !== "undefined") {
	const host = window.location.hostname || "";
	if (host.endsWith("vercel.app") || host === "your-vercel-domain.vercel.app") {
		API_URL = "https://smart-study-planner-production-032d.up.railway.app";
	}
}

// Helpful runtime log for debugging deployments. The built app will print this in the browser console.
if (typeof window !== "undefined") {
	// eslint-disable-next-line no-console
	console.info("[Config] Using API_URL:", API_URL || "(local /api)");
}

export default API_URL;
