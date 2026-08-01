// `process.env.NODE_ENV` is statically replaced at build time by
// rollup.config.js's `replace` plugin (same pattern as core/config/config.ts)
// - it never exists at runtime, so no Node type definitions are needed.
declare const process: { env: { NODE_ENV?: string } };

const isDev = process.env.NODE_ENV !== "production";

export function devLog(scope: "API" | "Action", label: string, data?: unknown): void {
	if (!isDev) return;
	if (data !== undefined) {
		console.log(`[Roastnest][${scope}] ${label}`, data);
	} else {
		console.log(`[Roastnest][${scope}] ${label}`);
	}
}
