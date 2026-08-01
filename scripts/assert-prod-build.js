// Runs after `yarn build-pro` as part of `prepublishOnly` (see package.json)
// so a dev build can never reach npm again, regardless of what the working
// directory's dist/ happened to contain before `npm publish` was run.
//
// This has already shipped to production twice (1.1.7 and 1.1.9) - both
// times because dist/ was rebuilt with build-dev for local testing after
// the pre-publish verification, and never rebuilt with build-pro before the
// actual `npm publish`. This script makes that failure mode impossible: it
// fails the publish outright instead of relying on a human remembering to
// check.
const fs = require("fs");
const path = require("path");

const distFile = path.join(__dirname, "..", "dist", "index.mjs");
const contents = fs.readFileSync(distFile, "utf8");

const failures = [];

if (!contents.includes("https://api.roastnest.com/api/widget")) {
	failures.push("Production API URL (https://api.roastnest.com/api/widget) not found in dist/index.mjs.");
}

if (/https:\/\/[a-zA-Z0-9.-]*\.ngrok[a-zA-Z0-9./_-]*/.test(contents)) {
	failures.push("dist/index.mjs contains an ngrok URL - this is a dev build, not production.");
}

if (contents.includes("[Roastnest][")) {
	failures.push("dist/index.mjs contains dev-only logging ([Roastnest][API]/[Roastnest][Action]) - this is a dev build.");
}

if (fs.existsSync(distFile + ".map")) {
	failures.push("dist/index.mjs.map exists - production builds must not include sourcemaps.");
}

if (failures.length > 0) {
	console.error("\nprepublishOnly check FAILED - refusing to publish a broken/dev build:\n");
	failures.forEach((f) => console.error("  - " + f));
	console.error("\nRun `yarn build-pro` and inspect dist/ before publishing.\n");
	process.exit(1);
}

console.log("prepublishOnly check passed: dist/index.mjs is a clean production build.");
