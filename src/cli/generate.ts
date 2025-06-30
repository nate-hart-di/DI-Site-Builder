import { FigmaService } from '../modules/figma/figma.service';
import { EnvService } from '../modules/local-orchestrator/env.service';
import { Generator } from '../modules/scaffolding/generator';
import { Comparer } from '../modules/visual-compare/comparer';
import { Refiner } from '../modules/refinement/refiner';
import { ConfigService } from './config';
import path from 'path';
import fs from 'fs-extra';

export const handleGenerate = async (options: { url: string; theme: string; maxIter: string }) => {
  console.log('Starting generation process...');

  const config = await new ConfigService().loadConfig();
  if (!config.figmaApiToken || !config.diWebsitesPlatformPath) {
    console.error('Figma API token and platform path must be configured. Run `disb config --set figmaApiToken=...` and `disb config --set diWebsitesPlatformPath=...`');
    return;
  }

  const figmaService = new FigmaService(config.figmaApiToken);
  const envService = new EnvService(options.theme, config.diWebsitesPlatformPath);
  const generator = new Generator();
  const comparer = new Comparer();
  const refiner = new Refiner();

  const maxIterations = parseInt(options.maxIter, 10);
  const reportsPath = path.join(process.cwd(), 'reports', options.theme);
  await fs.ensureDir(reportsPath);

  try {
    // 1. Parse Figma URL and fetch reference image
    const { fileKey, nodeId } = figmaService.parseFigmaUrl(options.url);
    const figmaNode = await figmaService.getNode(fileKey, nodeId);
    const figmaImageUrl = await figmaService.getImage(fileKey, nodeId);
    const figmaImage = await figmaService.downloadImage(figmaImageUrl);
    const figmaImagePath = path.join(reportsPath, 'figma-reference.png');
    await fs.writeFile(figmaImagePath, figmaImage);
    console.log(`Figma reference image saved to ${figmaImagePath}`);

    // 2. Generate initial code
    let files = await generator.generate(figmaNode);

    // 3. Start local environment
    await envService.start();

    for (let i = 0; i < maxIterations; i++) {
      console.log(`\n--- Iteration ${i + 1} ---`);

      // 4. Deploy code and build theme
      await envService.deployCode(files);
      const buildStatus = await envService.buildTheme();
      if (!buildStatus.success) {
        console.error('Theme build failed:', buildStatus.log);
        break;
      }
      console.log('Theme built successfully.');

      // 5. Take screenshot
      const screenshotPath = path.join(reportsPath, `iteration-${i + 1}.png`);
      // Assuming the generated component is on the front page for now
      await envService.takeScreenshot('http://localhost:8080', screenshotPath);

      // 6. Compare images
      const diffPath = path.join(reportsPath, `iteration-${i + 1}-diff.png`);
      const diffReport = await comparer.compare(figmaImagePath, screenshotPath, diffPath);
      console.log(`Visual diff: ${diffReport.diffPercentage.toFixed(2)}%`);

      // 7. Check for convergence
      if (diffReport.diffPercentage < 0.5) {
        console.log('Convergence achieved! Visuals match the Figma design.');
        break;
      }

      if (i === maxIterations - 1) {
        console.log('Max iterations reached. Could not achieve convergence.');
        break;
      }

      // 8. Refine code
      files = await refiner.refine(files, diffReport);
    }
  } catch (error) {
    console.error('An error occurred during the generation process:', error);
  } finally {
    // 9. Stop local environment
    await envService.stop();
    console.log('Generation process finished.');
  }
};
