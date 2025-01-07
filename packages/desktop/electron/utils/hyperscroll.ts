import { app } from 'electron';
import { promises as fs } from 'fs';
import path from 'path';

/**
 * Ensures the hyperscroll directory exists and returns its path.
 * The directory is created in the user's app data directory.
 */
export async function ensureHyperscrollDir(): Promise<string> {
  const userDataPath = app.getPath('userData');
  const hyperscrollPath = path.join(userDataPath, 'hyperscroll');

  try {
    await fs.access(hyperscrollPath);
  } catch {
    await fs.mkdir(hyperscrollPath, { recursive: true });
    
    // Create initial structure
    const dirs = [
      'business-details',
      'clients/active',
      'clients/archived',
      'planning',
      'settings',
    ];

    for (const dir of dirs) {
      await fs.mkdir(path.join(hyperscrollPath, dir), { recursive: true });
    }

    // Create initial files with templates
    const initialFiles = {
      'business-details/company.md': `---
type: business-details
updated: ${new Date().toISOString()}
version: 1.0
---

# Company Information

Enter your company details here.

## Location

Address:
[Your Address]

## Contact

Email: [Your Email]
Phone: [Your Phone]
`,
      'settings/preferences.md': `---
type: settings
updated: ${new Date().toISOString()}
version: 1.0
---

# Preferences

Default settings and preferences.

## General

- Theme: system
- Language: en
`,
    };

    for (const [filePath, content] of Object.entries(initialFiles)) {
      const fullPath = path.join(hyperscrollPath, filePath);
      await fs.writeFile(fullPath, content, 'utf-8');
    }
  }

  return hyperscrollPath;
} 