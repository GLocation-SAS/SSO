import { chromium } from 'playwright';

(async () => {
  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    console.log("Navigating to UI Kit...");
    await page.goto('http://localhost:3000/es/uikit', { waitUntil: 'networkidle', timeout: 60000 });
    console.log("Taking full page screenshot...");
    await page.screenshot({ path: 'recursos/uikit_completo.png', fullPage: true });
    console.log("Screenshot saved.");
    await browser.close();
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    process.exit(1);
  }
})();
