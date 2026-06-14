const assert = require("assert");
const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

const baseUrl = process.env.APP_BASE_URL || "http://localhost:8080";
const loginPath = process.env.LOGIN_PATH || "/Krinterior-AI/app/login";
const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

function appUrl(path) {
  return new URL(path, baseUrl).toString();
}

describe("Krinterior AI login", function () {
  this.timeout(60000);
  let driver;

  before(async function () {
    const options = new chrome.Options();
    if (process.env.CI || process.env.HEADLESS !== "false") {
      options.addArguments("--headless=new", "--no-sandbox", "--disable-dev-shm-usage");
    }
    driver = await new Builder().forBrowser("chrome").setChromeOptions(options).build();
  });

  after(async function () {
    if (driver) await driver.quit();
  });

  it("loads the login form with stable automation IDs", async function () {
    await driver.get(appUrl(loginPath));

    await driver.wait(until.elementLocated(By.css('[data-testid="login-email-input"]')), 15000);
    await driver.findElement(By.css('[data-testid="login-password-input"]'));
    await driver.findElement(By.css('[data-testid="login-submit-button"]'));
  });

  it("submits valid credentials when E2E secrets are configured", async function () {
    if (!email || !password) {
      this.skip();
      return;
    }

    await driver.get(appUrl(loginPath));
    await driver.wait(until.elementLocated(By.css('[data-testid="login-email-input"]')), 15000);
    await driver.findElement(By.css('[data-testid="login-email-input"]')).sendKeys(email);
    await driver.findElement(By.css('[data-testid="login-password-input"]')).sendKeys(password);
    await driver.findElement(By.css('[data-testid="login-submit-button"]')).click();

    await driver.wait(async () => {
      const currentUrl = await driver.getCurrentUrl();
      return currentUrl.includes("/dashboard") || currentUrl.includes("/(tabs)") || currentUrl.includes("#/dashboard");
    }, 20000);

    const currentUrl = await driver.getCurrentUrl();
    assert.match(currentUrl, /dashboard|\(tabs\)/);
  });
});
