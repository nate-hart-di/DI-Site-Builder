import { EnvService } from '../modules/local-orchestrator/env.service';
import { ConfigService } from './config';

export const handleEnvStart = async () => {
  console.log('Starting environment...');
  const config = await new ConfigService().loadConfig();
  if (!config.diWebsitesPlatformPath) {
    console.error('Platform path must be configured. Run `disb config --set diWebsitesPlatformPath=...`');
    return;
  }
  // EnvService constructor requires themeName, but it's not used for start/stop.
  const envService = new EnvService('', config.diWebsitesPlatformPath);
  await envService.start();
};

export const handleEnvStop = async () => {
  console.log('Stopping environment...');
  const config = await new ConfigService().loadConfig();
  if (!config.diWebsitesPlatformPath) {
    console.error('Platform path must be configured. Run `disb config --set diWebsitesPlatformPath=...`');
    return;
  }
  const envService = new EnvService('', config.diWebsitesPlatformPath);
  await envService.stop();
};
