const fs = require('fs');
const path = require('path');

const COMPONENTS_DIR = path.join(__dirname, '..', 'app', 'components');

function extractPropsFromComponent(componentPath) {
  const content = fs.readFileSync(componentPath, 'utf-8');
  const interfaceMatch = content.match(/interface\s+\w+Props\s*{([^}]+)}/);
  if (!interfaceMatch) return [];

  const propsContent = interfaceMatch[1];
  const propLines = propsContent.split('\n').filter(line => line.trim());

  return propLines.map(line => {
    const [name, type] = line.split(':').map(s => s.trim());
    const optional = name.includes('?');
    return {
      name: name.replace('?', '').trim(),
      type: type.replace(';', '').trim(),
      optional
    };
  });
}

function generateTestTemplate(componentName, props) {
  return `import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ${componentName} from '../components/${componentName}';

describe('${componentName}', () => {
  it('renders with default props', () => {
    render(<${componentName} />);
    const element = screen.getByTestId('${componentName.toLowerCase()}-container');
    expect(element).toBeInTheDocument();
  });

  ${props.map(prop => `
  it('handles ${prop.name} prop correctly', () => {
    const testValue = ${getTestValue(prop.type)};
    render(<${componentName} ${prop.name}={testValue} />);
    const element = screen.getByTestId('${componentName.toLowerCase()}-container');
    ${getExpectation(prop)}
  });`).join('\n')}

  it('has proper accessibility attributes', () => {
    render(<${componentName} />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});`;
}

function getTestValue(type) {
  switch (type) {
    case 'string': return '"test-value"';
    case 'number': return '42';
    case 'boolean': return 'true';
    default: return '{}';
  }
}

function getExpectation(prop) {
  const testValue = getTestValue(prop.type);
  return `expect(element).toHaveAttribute('data-${prop.name}', ${testValue});`;
}

function generateTest(componentPath) {
  const componentName = path.basename(componentPath, '.tsx');
  const props = extractPropsFromComponent(componentPath);
  const testContent = generateTestTemplate(componentName, props);
  
  const testPath = path.join(
    path.dirname(componentPath),
    '..',
    '__tests__',
    `${componentName}.test.tsx`
  );
  
  fs.writeFileSync(testPath, testContent);
  console.log(`Generated test file: ${testPath}`);
}

function generateTestsForAllComponents() {
  const files = fs.readdirSync(COMPONENTS_DIR);
  const componentFiles = files.filter(file => file.endsWith('.tsx'));

  componentFiles.forEach(file => {
    const componentPath = path.join(COMPONENTS_DIR, file);
    generateTest(componentPath);
  });

  console.log(`Generated tests for ${componentFiles.length} components`);
}

generateTestsForAllComponents();