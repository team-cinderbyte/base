// import LaunchBrowser from "./browser";
const userAgent =
  "--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

const BrowserArgs = {
  baseArgs: [
    "--no-sandbox",
    "--disable-setuid-sandbox",
    "--disable-dev-shm-usage",
    "--disable-blink-features=AutomationControlled",
    "--disable-gpu",
    "--disable-background-networking",
    "--disable-default-apps",
    "--disable-extensions",
    "--disable-infobars",
    "--disable-notifications",
    "--disable-offline-sync",
    "--disable-sync",
    "--disable-translate",
    "--no-first-run",
    "--no-zygote",
    userAgent,
  ],

  // Serverless-specific optimizations
  serverlessArgs: [
    "--disable-background-timer-throttling",
    "--disable-backgrounding-occluded-windows",
    "--disable-renderer-backgrounding",
    "--disable-features=TranslateUI",
    "--disable-ipc-flooding-protection",
    "--disable-hang-monitor",
    "--disable-prompt-on-repost",
    "--disable-domain-reliability",
    "--disable-component-extensions-with-background-pages",
    "--memory-pressure-off",
    "--max_old_space_size=4096",
    userAgent,
  ],
};

export { BrowserArgs };
// export { LaunchBrowser };
export { userAgent };
