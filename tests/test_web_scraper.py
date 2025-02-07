import unittest
from unittest.mock import patch, MagicMock
import asyncio
import pytest
from tools.web_scraper import (
    validate_url,
    parse_html,
    fetch_page,
    process_urls
)

pytestmark = pytest.mark.asyncio

class TestWebScraper(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        """Set up any necessary test fixtures."""
        cls.mock_response = MagicMock()
        cls.mock_response.status = 200
        cls.mock_response.text.return_value = "Test content"
        
        cls.mock_client_session = MagicMock()
        cls.mock_client_session.__aenter__.return_value = cls.mock_client_session
        cls.mock_client_session.__aexit__.return_value = None
        cls.mock_client_session.get.return_value.__aenter__.return_value = cls.mock_response

    def setUp(self):
        """Set up test fixtures before each test method."""
        self.urls = ["http://example1.com", "http://example2.com"]
        self.mock_session = self.mock_client_session

    def test_validate_url(self):
        # Test valid URLs
        self.assertTrue(validate_url('https://example.com'))
        self.assertTrue(validate_url('http://example.com/path?query=1'))
        self.assertTrue(validate_url('https://sub.example.com:8080/path'))
        
        # Test invalid URLs
        self.assertFalse(validate_url('not-a-url'))
        self.assertFalse(validate_url('http://'))
        self.assertFalse(validate_url('https://'))
        self.assertFalse(validate_url(''))

    def test_parse_html(self):
        # Test with empty or None input
        self.assertEqual(parse_html(None), "")
        self.assertEqual(parse_html(""), "")
        
        # Test with simple HTML
        html = """
        <html>
            <body>
                <h1>Title</h1>
                <p>Paragraph text</p>
                <a href="https://example.com">Link text</a>
                <script>var x = 1;</script>
                <style>.css { color: red; }</style>
            </body>
        </html>
        """
        result = parse_html(html)
        self.assertIn("Title", result)
        self.assertIn("Paragraph text", result)
        self.assertIn("[Link text](https://example.com)", result)
        self.assertNotIn("var x = 1", result)  # Script content should be filtered
        self.assertNotIn(".css", result)  # Style content should be filtered
        
        # Test with nested elements
        html = """
        <html>
            <body>
                <div>
                    <p>Level 1</p>
                    <div>
                        <p>Level 2</p>
                    </div>
                </div>
            </body>
        </html>
        """
        result = parse_html(html)
        self.assertIn("Level 1", result)
        self.assertIn("Level 2", result)
        
        # Test with malformed HTML
        html = "<p>Unclosed paragraph"
        result = parse_html(html)
        self.assertIn("Unclosed paragraph", result)

    async def test_fetch_page(self):
        """Test fetching a single page."""
        with patch('aiohttp.ClientSession') as mock_session:
            mock_session.return_value = self.mock_client_session
            content = await fetch_page("http://example.com", self.mock_session)
            self.assertEqual(content, "Test content")
            self.mock_session.get.assert_called_once_with("http://example.com")

    async def test_process_urls(self):
        """Test processing multiple URLs concurrently."""
        with patch('aiohttp.ClientSession') as mock_session:
            mock_session.return_value = self.mock_client_session
            results = await process_urls(self.urls, max_concurrent=2)
            self.assertEqual(len(results), 2)
            self.assertEqual(results[0], "Test content")
            self.assertEqual(results[1], "Test content")
            self.assertEqual(self.mock_session.get.call_count, 2)

if __name__ == '__main__':
    unittest.main()
