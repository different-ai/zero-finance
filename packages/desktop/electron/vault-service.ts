import fs from 'fs/promises';
import path from 'path';

export async function createVault(vaultPath: string) {
  try {
    // Create the main vault directory
    await fs.mkdir(vaultPath, { recursive: true });

    // Create hyprsqrl directory and its subdirectories
    const hyprsqrlPath = path.join(vaultPath, 'hyprsqrl');
    await fs.mkdir(hyprsqrlPath, { recursive: true });
    await fs.mkdir(path.join(hyprsqrlPath, 'tasks'), { recursive: true });
    await fs.mkdir(path.join(hyprsqrlPath, 'invoices'), { recursive: true });
    await fs.mkdir(path.join(hyprsqrlPath, 'notes'), { recursive: true });

    // Create initial README
    const readmeContent = `# HyprSqrl Vault

This is your HyprSqrl vault. It contains:

hyprsqrl/
  ├── tasks/     # Task management and tracking
  ├── invoices/  # Invoice storage and processing
  └── notes/     # General notes and documentation
`;

    await fs.writeFile(path.join(vaultPath, 'README.md'), readmeContent, 'utf-8');

    return true;
  } catch (error) {
    console.error('0xHypr', 'Failed to create vault:', error);
    throw error;
  }
} 