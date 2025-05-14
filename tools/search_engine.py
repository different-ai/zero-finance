import sys
from duckduckgo_search import DDGS

def search(query, max_results=5, max_attempts=3):
    """
    Search the web using DuckDuckGo and print results.
    
    Args:
        query (str): Search query
        max_results (int): Maximum number of results to return
        max_attempts (int): Maximum number of attempts to make
        
    Returns:
        list: Search results
    """
    for attempt in range(1, max_attempts + 1):
        sys.stderr.write(f"DEBUG: Searching for query: {query} (attempt {attempt}/{max_attempts})\n")
        
        try:
            with DDGS() as ddgs:
                results = ddgs.text(query, max_results=max_results)
                
                results = list(results)
                
                if not results:
                    sys.stderr.write("DEBUG: No results found\n")
                    return []
                
                sys.stderr.write(f"DEBUG: Found {len(results)} results\n")
                
                for i, result in enumerate(results, 1):
                    print(f"=== Result {i} ===")
                    print(f"URL: {result.get('href', 'N/A')}")
                    print(f"Title: {result.get('title', 'N/A')}")
                    print(f"Snippet: {result.get('body', 'N/A')}")
                    print()
                
                return results
                
        except Exception as e:
            sys.stderr.write(f"ERROR: Search failed: {e}\n")
            if attempt == max_attempts:
                sys.exit(1)
