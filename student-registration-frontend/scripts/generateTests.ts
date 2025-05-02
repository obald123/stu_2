import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTest } from '../app/utils/testGenerator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const COMPONENTS_DIR = path.join(__dirname, '..', 'app');

async function generateTestsForAllComponents() {
  const files = fs.readdirSync(COMPONENTS_DIR);
  const componentFiles = files.filter(file => file.endsWith('.tsx'));

  for (const file of componentFiles) {
    const componentPath = path.join(COMPONENTS_DIR, file);
    generateTest(componentPath);
  }

  console.log(`Generated tests for ${componentFiles.length} components`);
}

generateTestsForAllComponents();