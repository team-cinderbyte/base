// import Chromium from "@sparticuz/chromium";
// import * as PwCore from "playwright-core";
// import { existsSync } from "node:fs";
// import { platform } from "node:os";
// import { BrowserArgs } from ".";
// const useServerlessChromium = platform() === "linux";
// function isTruthyEnv(v: unknown) {
//   return v === "1" || v === "true" || v === "TRUE" || v === "yes";
// }
// async function getChromiumImpl() {
//   // In serverless (linux), use playwright-core with sparticuz/chromium.
//   if (useServerlessChromium) return PwCore.chromium;
//   // Locally, prefer full playwright if installed (it bundles browsers).
//   // Keep it dynamic so ESM doesn’t choke and deployments don’t require it.
//   try {
//     const mod: any = await import("playwright");
//     return mod.chromium ?? PwCore.chromium;
//   } catch {
//     // If playwright isn't installed, fall back to playwright-core (needs a local browser).
//     return PwCore.chromium;
//   }
// }
// /**
//  * Launches the headless browser
//  */
// export async function LaunchBrowser() {
//   const isServerless =
//     isTruthyEnv(process.env.VERCEL) ||
//     isTruthyEnv(process.env.NETLIFY) ||
//     typeof process.env.AWS_LAMBDA_FUNCTION_NAME === "string" ||
//     isTruthyEnv(process.env.AWS_LAMBDA_FUNCTION);
//   const envHeadless =
//     typeof process.env.HEADLESS_BROWSER !== "undefined"
//       ? String(process.env.HEADLESS_BROWSER).toLowerCase() === "true"
//       : null;
//   const defaultHeadless = isServerless ? false : false;
//   const chromium = await getChromiumImpl();
//   const candidateExecPath = useServerlessChromium
//     ? await Chromium.executablePath()
//     : null;
//   const executablePath =
//     useServerlessChromium &&
//     typeof candidateExecPath === "string" &&
//     candidateExecPath.length > 0 &&
//     existsSync(candidateExecPath)
//       ? candidateExecPath
//       : undefined;
//   const launchOptions: PwCore.LaunchOptions = {
//     headless: envHeadless === null ? defaultHeadless : envHeadless,
//     args: isServerless
//       ? [...BrowserArgs.baseArgs, ...BrowserArgs.serverlessArgs]
//       : BrowserArgs.baseArgs,
//     timeout: isServerless ? 30_000 : 60_000,
//     executablePath,
//   };
//   if (!launchOptions.executablePath && useServerlessChromium) {
//     console.warn(
//       "Chromium binary not found at expected path. Falling back to default executable resolution.",
//     );
//   }
//   console.log(
//     "Launching browser with headless=%s args=%d exec=%s",
//     launchOptions.headless,
//     launchOptions.args?.length ?? 0,
//     launchOptions.executablePath ?? "(default)",
//   );
//   try {
//     const browser = await chromium.launch(launchOptions);
//     console.log("Browser launched successfully");
//     return browser;
//   } catch (e) {
//     console.error("Failed to launch browser with primary options:", e);
//     const fallbackOptions: PwCore.LaunchOptions = {
//       headless: true,
//       args: [
//         "--no-sandbox",
//         "--disable-setuid-sandbox",
//         "--disable-dev-shm-usage",
//       ],
//       executablePath: useServerlessChromium
//         ? ((await Chromium.executablePath()) ?? undefined)
//         : undefined,
//     };
//     if (useServerlessChromium && !fallbackOptions.executablePath) {
//       throw new Error(
//         "Serverless chromium executablePath() returned empty; cannot launch.",
//       );
//     }
//     console.warn("Attempting fallback launch...");
//     return await chromium.launch(fallbackOptions);
//   }
// }
// export default LaunchBrowser;
//# sourceMappingURL=browser.js.map