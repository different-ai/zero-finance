# Mock Data - Pay Functionality

## Current State
The pay functionality now extracts bank details from invoices but there are some areas that need improvement:

### What's Working
1. Raw text content is now preserved in the database (rawTextContent field)
2. Extraction prompt prioritizes raw text for finding bank details
3. UI shows extraction progress and results clearly
4. Bank lookup function uses AI to identify banks from routing numbers

### What Needs Improvement
1. **Bank Name Lookup**: ✅ Now implemented with web search!
   - Using Vercel AI SDK's web_search_preview tool
   - Searches real-time information for routing numbers
   - Returns bank name with confidence score and sources
   
2. **Web Search Integration**: ✅ Implemented!
   - Using openai.responses('o4-mini') with web_search_preview tool
   - Forces web search for accurate, up-to-date bank information
   - Returns sources for verification
   
3. **Raw Text Preservation**: While we save raw text for new cards, existing cards don't have this data
   - Need a migration script to re-process existing cards
   - Or fetch raw text on-demand when needed

### Test Case
The user tested with an invoice containing:
```
redwood router services inc.
ADDRESS: 575 7th St, San Francisco, CA 94103, USA
CONTACT: billing@redwoodrouter.com • +1 (415) 555-0123
INVOICE # 2025-0711
...
please remit payment via ach bank: first republic bank 
routing: 321081669
account: 1420098765
```

The system should now extract:
- Bank: First Republic Bank
- Routing: 321081669
- Account: 1420098765

## Next Steps
1. Test the updated functionality with the invoice drop
2. Consider adding a proper bank routing number database
3. Implement web search if needed for unknown routing numbers
4. Add unit tests for the extraction logic 