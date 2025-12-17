#!/usr/bin/env node

/**
 * Icon Generator Script
 * 
 * Helper script to create icon components from Figma SVG.
 * 
 * Usage:
 *   node scripts/create-icon.js IconName
 * 
 * Then paste the SVG code when prompted, and it will generate the component.
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function createIcon() {
  const iconName = process.argv[2];
  
  if (!iconName) {
    console.error('Usage: node scripts/create-icon.js IconName');
    process.exit(1);
  }
  
  const pascalName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join('');
  
  const kebabName = iconName.toLowerCase().replace(/\s+/g, '-');
  
  console.log(`\nCreating icon: ${pascalName} (${kebabName})\n`);
  
  console.log('Please paste the SVG code from Figma:');
  console.log('(Press Ctrl+D (Mac/Linux) or Ctrl+Z (Windows) when done)\n');
  
  let svgCode = '';
  for await (const line of rl) {
    svgCode += line + '\n';
  }
  
  if (!svgCode.trim()) {
    console.error('No SVG code provided');
    process.exit(1);
  }
  
  // Extract viewBox
  const viewBoxMatch = svgCode.match(/viewBox=["']([^"']+)["']/);
  const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';
  
  // Extract paths
  const pathMatches = svgCode.matchAll(/<path[^>]*d=["']([^"']+)["'][^>]*>/g);
  const paths = Array.from(pathMatches).map(match => {
    const fullMatch = match[0];
    const d = match[1];
    const fill = fullMatch.match(/fill=["']([^"']+)["']/)?.[1];
    const stroke = fullMatch.match(/stroke=["']([^"']+)["']/)?.[1];
    const strokeWidth = fullMatch.match(/stroke-width=["']([^"']+)["']/)?.[1] || '1.5';
    
    return { d, fill, stroke, strokeWidth };
  });
  
  // Generate component code
  const componentCode = `/**
 * ${pascalName} Icon
 * 
 * SVG icon component - optimized for minimal bundle size.
 * Converted from Figma SVG.
 */

import React from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';

export interface ${pascalName}IconProps extends SvgProps {
  /**
   * Icon color
   */
  color?: string;
}

export const ${pascalName}Icon: React.FC<${pascalName}IconProps> = ({
  color = '#090D0F',
  width = 24,
  height = 24,
  ...props
}) => {
  return (
    <Svg
      width={width}
      height={height}
      viewBox="${viewBox}"
      fill="none"
      {...props}
    >
${paths.map(path => {
  if (path.fill && path.fill !== 'none') {
    return `      <Path
        d="${path.d}"
        fill={color}
      />`;
  } else {
    return `      <Path
        d="${path.d}"
        stroke={color}
        strokeWidth={path.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />`;
  }
}).join('\n')}
    </Svg>
  );
};

export default ${pascalName}Icon;
`;
  
  // Write component file
  const iconDir = path.join(__dirname, '../src/components/icons');
  const iconFile = path.join(iconDir, `${pascalName}.tsx`);
  
  fs.writeFileSync(iconFile, componentCode);
  console.log(`\n✅ Created: ${iconFile}`);
  
  // Update index.ts
  const indexFile = path.join(iconDir, 'index.ts');
  let indexContent = fs.readFileSync(indexFile, 'utf8');
  
  // Add import
  const importLine = `import ${pascalName}Icon from './${pascalName}';`;
  if (!indexContent.includes(importLine)) {
    const lastImport = indexContent.match(/import \w+Icon from '\.\/\w+';/g)?.pop();
    if (lastImport) {
      indexContent = indexContent.replace(
        lastImport,
        `${lastImport}\n${importLine}`
      );
    }
  }
  
  // Add register
  const registerLine = `registerIcon('${kebabName}', ${pascalName}Icon);`;
  if (!indexContent.includes(registerLine)) {
    const lastRegister = indexContent.match(/registerIcon\('[^']+', \w+Icon\);?/g)?.pop();
    if (lastRegister) {
      indexContent = indexContent.replace(
        lastRegister,
        `${lastRegister}\n${registerLine}`
      );
    }
  }
  
  // Add export
  const exportLine = `export { ${pascalName}Icon } from './${pascalName}';`;
  if (!indexContent.includes(exportLine)) {
    const lastExport = indexContent.match(/export \{ \w+Icon \} from '\.\/\w+';/g)?.pop();
    if (lastExport) {
      indexContent = indexContent.replace(
        lastExport,
        `${lastExport}\n${exportLine}`
      );
    }
  }
  
  // Add to IconName type
  const typeMatch = indexContent.match(/export type IconName = \s*\| '([^']+)'/);
  if (typeMatch) {
    const typeLine = `export type IconName = \n  | '${kebabName}'`;
    if (!indexContent.includes(`'${kebabName}'`)) {
      indexContent = indexContent.replace(
        /export type IconName =[^;]+;/,
        (match) => match.replace(/\| '([^']+)'$/, `| '$1'\n  | '${kebabName}'`)
      );
    }
  }
  
  fs.writeFileSync(indexFile, indexContent);
  console.log(`✅ Updated: ${indexFile}`);
  
  console.log(`\n🎉 Icon "${pascalName}" created successfully!`);
  console.log(`\nUsage:`);
  console.log(`  import { ${pascalName}Icon } from '@/components/icons';`);
  console.log(`  <${pascalName}Icon width={24} height={24} color="#090D0F" />`);
  console.log(`\nOr:`);
  console.log(`  import { Icon } from '@/components/icons';`);
  console.log(`  <Icon name="${kebabName}" size={24} />`);
  
  rl.close();
}

createIcon().catch(console.error);

