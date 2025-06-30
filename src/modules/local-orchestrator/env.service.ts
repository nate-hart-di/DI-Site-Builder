import execa = require('execa');
import { chromium } from 'playwright';
import path from 'path';
import fs from 'fs-extra';
import { BuildStatus } from '../../types';

export class EnvService {
  constructor(private readonly themeName: string, private readonly platformPath: string) {}

  private getThemePath(): string {
    return path.join(this.platformPath, 'dealer-themes', this.themeName);
  }

  async start(): Promise<void> {
    try {
      await execa('docker-compose', ['up', '-d'], { cwd: this.platformPath });
      console.log('Docker environment started.');
    } catch (error) {
      console.error('Error starting Docker environment:', error);
      throw error;
    }
  }

  async stop(): Promise<void> {
    try {
      await execa('docker-compose', ['down'], { cwd: this.platformPath });
      console.log('Docker environment stopped.');
    } catch (error) {
      console.error('Error stopping Docker environment:', error);
      throw error;
    }
  }

  async buildTheme(): Promise<BuildStatus> {
    const themePath = this.getThemePath();
    try {
      const { stdout, stderr } = await execa('gulp', ['build'], { cwd: themePath });
      return { success: true, log: stdout };
    } catch (error: any) {
      return { success: false, log: error.stderr || error.stdout };
    }
  }

  async takeScreenshot(url: string, outputPath: string): Promise<void> {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle' });
    await fs.ensureDir(path.dirname(outputPath));
    await page.screenshot({ path: outputPath, fullPage: true });
    await browser.close();
    console.log(`Screenshot saved to ${outputPath}`);
  }

  async deployCode(files: { path: string; content: string }[]): Promise<void> {
    const themePath = this.getThemePath();
    for (const file of files) {
      const filePath = path.join(themePath, file.path);
      await fs.ensureDir(path.dirname(filePath));
      await fs.writeFile(filePath, file.content);
    }
    console.log('Code deployed to theme folder.');
  }
}
