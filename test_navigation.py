import asyncio
import json
import os
from pathlib import Path
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        context = await browser.new_context(viewport={"width": 1280, "height": 1800})
        page = await context.new_page()

        print("Navigating to /library...")
        await page.goto("http://localhost:8080/library", wait_until="networkidle")
        
        # Take screenshot of library
        await page.screenshot(path="/tmp/browser/library_page.png")
        
        print("Finding 'Partida Direta' card...")
        # Find card containing 'Partida Direta'
        card = page.locator("div.Card", has_text="Partida Direta")
        if await card.count() == 0:
            print("ERROR: Partida Direta card not found")
            await browser.close()
            return

        explore_button = card.locator("button", has_text="Explorar")
        print("Clicking Explore button...")
        await explore_button.click()
        
        # Wait for navigation
        await page.wait_for_timeout(2000)
        print(f"Current URL after click: {page.url}")
        await page.screenshot(path="/tmp/browser/after_click_explore.png")

        if "/library/" in page.url:
            print("Successfully navigated to laboratory detail.")
            # Check for Iniciar Simulação button
            start_button = page.locator("button", has_text="Iniciar Simulação")
            if await start_button.count() > 0:
                print("Clicking Start Simulation button...")
                await start_button.click()
                await page.wait_for_timeout(2000)
                print(f"Current URL after simulation start: {page.url}")
                await page.screenshot(path="/tmp/browser/after_click_simulation.png")
            else:
                print("ERROR: Start Simulation button not found in lab detail.")
                # Print page content to debug
                content = await page.content()
                with open("/tmp/browser/lab_detail_content.html", "w") as f:
                    f.write(content)
        else:
            print(f"ERROR: Did not navigate to laboratory detail. Current URL: {page.url}")

        await browser.close()

if __name__ == "__main__":
    asyncio.run(main())
