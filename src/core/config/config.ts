// `process.env.NODE_ENV` is statically replaced at build time by
// rollup.config.js's `replace` plugin - it never exists at runtime, so no
// Node type definitions are needed, just this narrow ambient declaration.
declare const process: { env: { NODE_ENV?: string } };

const widgetAPI =
	process.env.NODE_ENV === "production"
		? "https://api.roastnest.com/api/widget"
		: "https://brief-hound-deciding.ngrok-free.app/api/widget";
export default { widgetAPI };
