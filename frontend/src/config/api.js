const API_URL = import.meta.env.VITE_API_URL || "";

// Helpful runtime log for debugging deployments. The built app will print this in the browser console.
if (typeof window !== "undefined") {
	// eslint-disable-next-line no-console
	console.info("[Config] Using API_URL:", API_URL || "(local /api)");
}

export default API_URL;
