import { test, expect } from "@playwright/test";

import {
  SidebarContent,
  signInbutton,
  searchField,
  searchButton,
  welcomeContent,
} from "./variables/mainScreen.js";

test.describe("4.1 Main Screen TestSet", async () => {
  let context;
  let page;
  let upMenuFish,
    leftMenuFish,
    leftMenuDog,
    leftMenuReptiles,
    leftMenuCats,
    leftMenuBirds;
  let fishPage, dogPage, reptilesPage, catsPage, birdsPage;
  let basketButton;

  test.beforeAll(async ({ browser }) => {
    context = await browser.newContext();
    page = await context.newPage();
    await page.goto("https://petstore.octoperf.com/actions/Catalog.action");
    upMenuFish = page.locator("#QuickLinks").getByRole("link").first();
    fishPage = page.getByRole("heading", { name: "Fish" });
    leftMenuFish = page.locator("#SidebarContent").getByRole("link").first();
    basketButton = page.locator("#MenuContent").getByRole("link").first();
    leftMenuDog = page.locator("#SidebarContent").getByRole("link").nth(1);
    dogPage = page.getByRole("heading", { name: "Dogs" });
    leftMenuCats = page.locator("#SidebarContent").getByRole("link").nth(2);
    catsPage = page.getByRole("heading", { name: "Cats" });
    leftMenuReptiles = page.locator("#SidebarContent").getByRole("link").nth(3);
    reptilesPage = page.getByRole("heading", { name: "Reptiles" });
    leftMenuBirds = page.locator("#SidebarContent").getByRole("link").nth(4);
    birdsPage = page.getByRole("heading", { name: "Birds" });
  });

  test.beforeEach(async ({ page }) => {
    await page.goto("https://petstore.octoperf.com/actions/Catalog.action");
  });

  test.afterAll(async () => {
    await context.close();
  });

  // // בדיקת פירוט של החיות הנמכרות בכל משפחת חיות
  test("4.1.1.1 Detailed inspection of the animals sold in each animal family", async ({
    page,
  }) => {
    await expect(page.locator(SidebarContent)).toContainText(
      "Saltwater, Freshwater Various Breeds Various Breeds, Exotic Varieties Lizards, Turtles, Snakes Exotic Varieties"
    );
  });

  // מעבר לעמוד הרשמה לאתר דרך כפתור Sign in בהצלחה
  test("4.1.2.1 Go to registratiom page via Sign in button", async ({
    page,
  }) => {
    await page.locator(signInbutton).click("Sign in");
    await page.waitForLoadState("load");
    await expect(page.locator("#signon")).not.toBeNull();
  });

  // חיפוש קטגוריות דרך שדה חיפוש
  test("4.1.3.1 Search categories through field search", async ({ page }) => {
    const fishPageURL = page.url();
    await page.locator(searchField).click();
    await page.locator(searchField).fill("Fish");
    await page.locator(searchButton).click();
    await expect(fishPageURL).toBe(
      "https://petstore.octoperf.com/actions/Catalog.action?viewCategory=&categoryId=FISH"
    );
  });

  // חיפוש חיות דרך שדה חיפוש
  test("4.1.3.2 Search for animals through the search field", async ({
    page,
  }) => {
    // const searchField = page.locator("[name=keyword]");
    // const searchButton = page.locator("[name=searchProducts]");
    await page.locator(searchField).click();
    await page.locator(searchField).fill("Koi");
    await page.locator(searchButton).click();
    await expect(page.getByRole("cell", { name: "Koi" })).toBeVisible();
    // await expect(page.getByRole('rowgroup')).toContainText('Koi');
    await page.locator(searchField).click();
    await page.locator(searchField).fill("Poodle");
    await page.locator(searchButton).click();
    await expect(page.getByRole("cell", { name: "Poodle" })).toBeVisible();
  });

  // חיפוש חיה ע״י הקלדת חלק מהמילה
  test("4.1.3.3 Search for an animal by typing part of the word", async ({
    page,
  }) => {
    // const searchField = page.locator("[name=keyword]");
    // const searchButton = page.locator("[name=searchProducts]");
    //await searchField.click();
    await page.locator(searchField).fill("K");
    await page.locator(searchButton).click();
    await expect(page.getByRole("cell", { name: "Koi" })).toBeVisible();
    // await searchField.click();
    await page.locator(searchField).fill("Po");
    await page.locator(searchButton).click();
    await expect(page.getByRole("cell", { name: "Poodle" })).toBeVisible();
  });

  // כניסה לסל קניות דרך לחיצה על האייקון
  test("4.1.4.1 Entering the shopping basket by clicking on the icon", async ({
    page,
  }) => {
    await page.pause();
    // await basketButton.click();
    const basketButton = page.locator("#MenuContent").getByRole("link").first();
    await basketButton.click();
    await expect(
      page.getByRole("heading", { name: "Shopping Cart" })
    ).toBeVisible();
  });

  // עדכון כמות פריטים למוצר שקיים בסל ולחיצה על כפתור "עדכון סל קניות"
  test("4.1.4.2 Updating the amount of items for the product that is in the basket", async ({
    page,
  }) => {
    const searchField = page.locator("[name=keyword]");
    const searchButton = page.locator("[name=searchProducts]");
    await searchField.click();
    await searchField.fill("Koi");
    await searchButton.click();
    await page
      .getByRole("link", { name: "Fresh Water fish from Japan" })
      .click();
    await page.getByRole("link", { name: "Add to Cart" }).first().click();

    const basketButton = page.locator("[name=img_cart]");
    await basketButton.click();
    await expect(page.getByRole("cell", { name: "FI-FW-01" })).toBeVisible();
    await page.locator('input[name="EST-4"]').click();
    await page.locator('input[name="EST-4"]').fill("2");
    await page.getByRole("button", { name: "Update Cart" }).click();
    await expect(page.locator('input[name="EST-4"]')).toBeVisible();
  });

  // עדכון כמות פריטים למוצר שקיים בסל ורענון העמוד
  test("4.1.4.3 Updating the amount of items for the product in the basket and refreshing the page", async ({
    page,
  }) => {
    const searchField = page.locator("[name=keyword]");
    const searchButton = page.locator("[name=searchProducts]");
    await searchField.click();
    await searchField.fill("Koi");
    await searchButton.click();
    await page
      .getByRole("link", { name: "Fresh Water fish from Japan" })
      .click();
    await page.getByRole("link", { name: "Add to Cart" }).first().click();

    const basketButton = page.locator("[name=img_cart]");
    await basketButton.click();
    await expect(page.getByRole("cell", { name: "FI-FW-01" })).toBeVisible();
    await page.locator('input[name="EST-4"]').click();
    await page.locator('input[name="EST-4"]').fill("2");
    await page.reload();
    const quantity = page.locator("input[name=EST-4]");
    await expect(quantity).toHaveValue("1");
  });

  // מעבר לאתר בוני האפליקציה בהצלחה (mybatis)
  test("4.1.5.1 Go to the app builder site successfully (mybatis)", async ({
    page,
  }) => {
    const page1Promise = page.waitForEvent("popup");
    await page.getByRole("link", { name: "www.mybatis.org" }).click();
    const page1 = await page1Promise;
    await expect(
      page1.getByRole("link", { name: "The MyBatis Blog" })
    ).toBeVisible();
  });

  // בדיקה כאשר מחובר למערכת שם המשתמש מופיע עם הכיתוב Welcome מעל התפריט השמאלי
  test("4.1.6.1 Checking when connected to the system, the user name appears with the inscription Welcome above the left menu", async ({
    page,
  }) => {
    const signInbutton = page.getByRole("link", { name: "Sign In" });
    const userNameField = page.locator("[name=username]");
    const loginButton = page.locator("[name=signon]");
    //const welcomeContent = page.locator("[id=WelcomeContent]");
    await signInbutton.click();
    //await userNameField.click();
    await userNameField.fill("j2ee");
    await loginButton.click();
    await expect(page.locator(welcomeContent)).toContainText("Welcome j2ee");
  });

  // התמונה של החיה שבחרתי כמועדפת עלי בעת הרישום תוצג כתמונה ראשית
  test("4.1.10.1 Entry to the fish category via the menu above the picture", async ({
    page,
  }) => {
    // const upMenuFish = page.locator("#QuickLinks").getByRole("link").first();
    // const fishPage = page.getByRole("heading", { name: "Fish" });
    await upMenuFish.click();
    await expect(fishPage).toBeVisible();
  });

  // כניסה לקטגורית כלבים ע"י התפריט שמעל לתמונה
  test("4.1.10.2 Enter the dog category via the menu above the picture", async ({
    page,
  }) => {
    const upMenuDogs = page.locator("#QuickLinks").getByRole("link").nth(1);
    const dogPage = page.getByRole("heading", { name: "Dogs" });
    await upMenuDogs.click();
    await expect(dogPage).toBeVisible();
  });

  // כניסה לקטגורית לטאות ע"י התפריט שמעל לתמונה
  test("4.1.10.3 Entry to the lizards category via the menu above the picture", async ({
    page,
  }) => {
    const upMenuReptails = page.locator("#QuickLinks").getByRole("link").nth(2);
    const reptailsPage = page.getByRole("heading", { name: "Reptiles" });
    await upMenuReptails.click();
    await expect(reptailsPage).toBeVisible();
  });

  // כניסה לקטגורית חתולים ע"י התפריט שמעל לתמונה
  test("4.1.10.4 Enter the cat category via the menu above the picture", async ({
    page,
  }) => {
    const upMenuCats = page.locator("#QuickLinks").getByRole("link").nth(3);
    const catsPage = page.getByRole("heading", { name: "Cats" });
    await upMenuCats.click();
    await expect(catsPage).toBeVisible();
  });

  // כניסה לקטגורית ציפורים ע"י התפריט שמעל לתמונה
  test("4.1.10.5 Entry to the birds category via the menu above the picture", async ({
    page,
  }) => {
    const upMenuBirds = page.locator("#QuickLinks").getByRole("link").nth(4);
    const birdsPage = page.getByRole("heading", { name: "Birds" });
    await upMenuBirds.click();
    await expect(birdsPage).toBeVisible();
  });

  // כניסה לקטגורית דגים ע"י התפריט השמאלי
  test("4.11.1.1 Enter the fish category via the left menu", async ({
    page,
  }) => {
    await leftMenuFish.click();
    await expect(fishPage).toBeVisible();
  });

  // כניסה לקטגורית כלבים ע"י התפריט השמאלי
  test("4.11.1.2 Enter the dogs category via the left menu", async ({
    page,
  }) => {
    await leftMenuDog.click();
    await expect(dogPage).toBeVisible();
  });

  // כניסה לקטגורית לטאות ע"י התפריט השמאלי
  test("4.11.1.3 Enter the reptiles category via the left menu", async ({
    page,
  }) => {
    await leftMenuReptiles.click();
    await expect(reptilesPage).toBeVisible();
  });

  // כניסה לקטגורית חתולים ע"י התפריט השמאלי
  test("4.11.1.4 Enter the cats category via the left menu", async ({
    page,
  }) => {
    await leftMenuCats.click();
    await expect(catsPage).toBeVisible();
  });

  // כניסה לקטגורית ציפורים ע"י התפריט השמאלי
  test("4.11.1.5 Enter the birds category via the left menu", async ({
    page,
  }) => {
    await leftMenuBirds.click();
    await expect(birdsPage).toBeVisible();
  });

  // ללמוד github or gitlab ולהכניס את הקוד לשם
  // בדיקה שלא מופיע הכיתוב Welcome כאשר הסטטוס הוא אורח
  test("4.1.12.1 Checking that the inscription Welcome does not appear when the status is guest", async ({
    page,
  }) => {
    await expect(page.locator(welcomeContent)).not.toContainText("Welcome");
  });
});
