import { ConfigService } from './config';
import execa = require('execa');

export const handleDoctor = async () => {
  console.log('Running environment health check...');
  let allGood = true;

  // Check for config
  const configService = new ConfigService();
  const config = await configService.loadConfig();

  if (!config.figmaApiToken) {
    console.error('❌ Figma API token is not configured. Run `disb config --set figmaApiToken=...`');
    allGood = false;
  } else {
    console.log('✅ Figma API token is configured.');
  }

  if (!config.diWebsitesPlatformPath) {
    console.error('❌ DI Websites Platform path is not configured. Run `disb config --set diWebsitesPlatformPath=...`');
    allGood = false;
  } else {
    console.log('✅ DI Websites Platform path is configured.');
  }

  // Check for Docker
  try {
    await execa('docker', ['info']);
    console.log('✅ Docker is running.');
  } catch (error) {
    console.error('❌ Docker is not running. Please start Docker Desktop.');
    allGood = false;
  }

  if (allGood) {
    console.log('\nAll checks passed! Your environment is ready.');
  } else {
    console.log('\nPlease fix the issues above and run `disb doctor` again.');
  }
};
