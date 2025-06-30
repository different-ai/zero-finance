here’s a batch of unstructured invoice-like text you can use to test llm parsing for invoice creation. it mimics the real-world messiness of forwarded emails, text scans, sloppy pdfs, and legacy formats.

⸻

batch 1: forwarded email dump

from: rachel@karmarealestate.com  
subject: FW: RE: Invoice for Jan Work

hi ben,  

see below from our contractor. can you take care of this?

---

Hey Rachel,  

Here’s the breakdown for January:

- Consulting: 12 hours @ $95/hr = $1,140  
- Travel (Uber + subway): $68.12  
- Hardware (router + cabling): $233.50  

Subtotal: $1,441.62  
Add 8.75% tax on services: $99.86  
TOTAL: $1,541.48  

Please wire to Chase  
Acct #: 574839302  
Routing: 021000021  
Name: Jon Marcel  


⸻

batch 2: scanned text with errors

INVOICE NO 00493-b  
DATE: 11-02-2024  
BILL TO: MORNINGTIDE HEALTHCARE LLC  
ADDRESS: 1985 Broderick St, San Francisco  

DESCRIPTION  
------------------------------------------------------  
* Staff Augmentation - Jan 8 to Feb 2 → $9,600  
* Onsite Support Visit (Jan 12) → $275  
* Travel costs: $145.78  
* Meals + incidental → $48.12  

GRAND TOTAL: $10,068.90  
(Payment terms: NET 15. Late fee 1.5%/mo)  


⸻

batch 3: messy table copy-paste

company: Dustlight Audio
invoice ref: #DL-291  
date issued: March 4 2025  

| item | quantity | unit cost | total |
|------|----------|-----------|-------|
| Audio Design (Podcast S2 EP1-3) | 3 | 300 | 900 |
| Sound Licensing Rights | 1 | 250 | 250 |
| Rush Editing (EP2) | 1 | 120 | 120 |
| --- | --- | --- | --- |
| TOTAL | | | 1,270 |

please venmo @dustlightaudio or use ACH to routing 121000358 acct 001589202


⸻

batch 4: raw plaintext (slack export-style)

@alex
client finally paid the nov invoice 🙌

final amt: 4,950
breakdown:
- retainer (nov): 3,500  
- async QA work: 8h @ $100/hr = 800  
- figma + notion cleanup: 5h @ $130/hr = 650

wire hit on jan 5


⸻

batch 5: pseudo-generated OCR dump

INV 0083A7  
DR. LINA KAUR  
Patient Billing

Consultation (12.01.2024) ......... $250.00  
Follow-up call (12.04) ............ $85.00  
Prescription Fulfillment .......... $42.00  
Admin Fee ......................... $15.00  
---------------------------------------------  
Total Amount Due: $392.00  
Due By: 01.15.2025  
Paid via Credit (Amex)  


⸻

want me to add:
	•	line item tags (like “software”, “freelance”, etc)?
	•	deliberate OCR issues (e.g. 1’s as l’s, decimal misreads)?
	•	currencies (EUR, GBP)?
	•	embedded attachments or invoice numbers mentioned in reply threads?

just say the word.