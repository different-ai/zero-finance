# Avoid Client-Side Logic in Next.js Page Components

**Date:** 2024-08-03

**Context:** When implementing the BIOS-themed landing page with a demo component, we initially tried using client-side logic with useState, dynamic imports, and click handlers to show the demo in a "full view" mode. This approach caused several issues.

**Problem:** Using 'use client' directive with useState hooks in a Next.js page component that also exports metadata prevents proper server-side rendering. This creates hydration mismatches and potentially broken UI.

**Solution:** 
- For interactive features like the demo view, create a separate page route (e.g., /demo-view) instead of trying to handle it with client-side state
- Use simple anchor links to navigate between the views
- Keep the main landing page as a server component
- Use CSS for visual effects and styling rather than client-side logic

**Guidelines for the future:**
1. Keep page components (those in the app directory) as server components whenever possible
2. If client interactivity is needed, extract it into a client component and import it into the page
3. For tabbed interfaces or view switching, consider separate routes instead of client-side state
4. Navigation between content views should use Next.js Link components or standard anchor tags
5. Use CSS and HTML for simple interactive elements (hover effects, simple visibility toggles) 