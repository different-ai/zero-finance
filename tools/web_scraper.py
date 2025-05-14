import re
import asyncio
import aiohttp
from urllib.parse import urlparse

def validate_url(url):
    """
    Validate if a string is a proper URL.
    
    Args:
        url (str): URL to validate
        
    Returns:
        bool: True if valid URL, False otherwise
    """
    if not url:
        return False
    
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def parse_html(html):
    """
    Parse HTML content and convert to a clean text format.
    
    Args:
        html (str): HTML content to parse
        
    Returns:
        str: Cleaned text with basic markdown formatting
    """
    if not html:
        return ""
    
    try:
        html = re.sub(r'<script.*?</script>', '', html, flags=re.DOTALL)
        html = re.sub(r'<style.*?</style>', '', html, flags=re.DOTALL)
        
        html = re.sub(r'<a\s+href="([^"]+)"[^>]*>(.*?)</a>', r'[\2](\1)', html, flags=re.DOTALL)
        
        html = re.sub(r'<[^>]+>', ' ', html)
        
        html = re.sub(r'\s+', ' ', html).strip()
        
        return html
    except Exception as e:
        print(f"Error parsing HTML: {e}")
        return ""

async def fetch_page(url, session=None):
    """
    Fetch a webpage and return its content.
    
    Args:
        url (str): URL to fetch
        session (aiohttp.ClientSession, optional): Session to use for request
        
    Returns:
        str: Page content
    """
    if not session:
        async with aiohttp.ClientSession() as session:
            return await fetch_page(url, session)
    
    try:
        async with session.get(url) as response:
            if response.status == 200:
                return await response.text()
            else:
                print(f"Error fetching {url}: HTTP {response.status}")
                return ""
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return ""

async def process_urls(urls, max_concurrent=5):
    """
    Process multiple URLs concurrently.
    
    Args:
        urls (list): List of URLs to process
        max_concurrent (int): Maximum number of concurrent requests
        
    Returns:
        list: List of page contents
    """
    valid_urls = [url for url in urls if validate_url(url)]
    
    if not valid_urls:
        return []
    
    results = []
    
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_page(url, session) for url in valid_urls]
        
        for i in range(0, len(tasks), max_concurrent):
            batch = tasks[i:i + max_concurrent]
            batch_results = await asyncio.gather(*batch)
            results.extend(batch_results)
    
    return results
