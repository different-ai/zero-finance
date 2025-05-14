import os
import asyncio
from playwright.async_api import async_playwright

async def take_screenshot(url, output_path=None, viewport=None):
    """
    Take a screenshot of a webpage using Playwright.
    
    Args:
        url (str): URL of the webpage to screenshot
        output_path (str, optional): Path to save the screenshot. If None, a temporary file will be created.
        viewport (dict, optional): Viewport dimensions. Default is 1280x720.
        
    Returns:
        str: Path to the saved screenshot
    """
    if output_path is None:
        import tempfile
        output_dir = tempfile.mkdtemp()
        output_path = os.path.join(output_dir, 'screenshot.png')
    
    if viewport is None:
        viewport = {'width': 1280, 'height': 720}
    
    async with async_playwright() as playwright:
        browser = await playwright.chromium.launch(headless=True)
        page = await browser.new_page(viewport=viewport)
        
        try:
            await page.goto(url, wait_until='networkidle')
            await page.screenshot(path=output_path, full_page=True)
        finally:
            await browser.close()
    
    return output_path

def take_screenshot_sync(url, output_path=None, viewport=None):
    """
    Synchronous wrapper for take_screenshot.
    
    Args:
        url (str): URL of the webpage to screenshot
        output_path (str, optional): Path to save the screenshot
        viewport (dict, optional): Viewport dimensions
        
    Returns:
        str: Path to the saved screenshot
    """
    return asyncio.run(take_screenshot(url, output_path, viewport))
