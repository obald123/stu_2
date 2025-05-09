import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

interface PropType {
  name: string;
  type: string;
  optional: boolean;
  defaultValue?: any;
}

export function extractPropsFromComponent(componentPath: string): PropType[] {
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

function generateTestTemplate(componentName: string, props: PropType[]): string {
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
    ${generatePropTest(componentName, prop)}
  });`).join('\n')}

  it('has proper accessibility attributes', () => {
    render(<${componentName} />);
    const element = screen.getByRole('generic');
    expect(element).toBeInTheDocument();
  });
});
`;
}

function generatePropTest(componentName: string, prop: PropType): string {
  const testValue = getTestValue(prop.type);
  return `
    render(<${componentName} ${prop.name}={${testValue}} />);
    const element = screen.getByTestId('${componentName.toLowerCase()}-container');
    ${getExpectation(prop, testValue)}
  `;
}

function getTestValue(type: string): string {
  switch (type) {
    case 'string': return '"test-value"';
    case 'number': return '42';
    case 'boolean': return 'true';
    default: return '{}';
  }
}

function getExpectation(prop: PropType, testValue: string): string {
  return `expect(element).toHaveAttribute('data-${prop.name}', ${testValue});`;
}

export function generateTest(componentPath: string): void {
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