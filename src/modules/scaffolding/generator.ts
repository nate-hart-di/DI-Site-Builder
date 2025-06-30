import { FigmaNode } from '../../types';

export class Generator {
  async generate(node: FigmaNode, themeName: string): Promise<{ path: string; content: string }[]> {
    console.log(`Generating initial code for node: ${node.name}`);
    
    const blockName = node.name.toLowerCase().replace(/\s/g, '-');

    // 1. Create new PHP partial
    const phpContent = `<?php\n// Generated code for ${node.name}\n?>`;
    const phpPath = `partials/hero/${blockName}.php`;

    // 2. Create new SCSS partial
    const scssContent = `// Generated SCSS for ${node.name}\n.${blockName} {\n}`;
    const scssPath = `css/hero/_${blockName}.scss`;

    // 3. Modify existing files to include the new partials
    // For now, we'll just log what we would do.
    console.log(`Would modify front-page.php to include: get_template_part('${phpPath}')`);
    console.log(`Would modify home.scss to include: @import 'hero/${blockName}';`);

    return [
      { path: phpPath, content: phpContent },
      { path: scssPath, content: scssContent },
    ];
  }
}
