import fs from 'fs-extra';
import path from 'path';
import os from 'os';
import { Config } from '../types';

const configDir = path.join(os.homedir(), '.di-site-builder');
const configPath = path.join(configDir, 'config.json');

export class ConfigService {
  async loadConfig(): Promise<Config> {
    await fs.ensureDir(configDir);
    if (await fs.pathExists(configPath)) {
      return fs.readJson(configPath);
    }
    return {};
  }

  async saveConfig(config: Config): Promise<void> {
    await fs.writeJson(configPath, config, { spaces: 2 });
  }
}

export const handleConfig = async (options: { set?: string }) => {
  const configService = new ConfigService();
  const config = await configService.loadConfig();

  if (options.set) {
    const [key, value] = options.set.split('=');
    if (key === 'figmaApiToken' || key === 'diWebsitesPlatformPath') {
      config[key] = value;
      await configService.saveConfig(config);
      console.log(`Set ${key} to ${value}`);
    } else {
      console.error(`Invalid config key: ${key}`);
    }
  } else {
    console.log('Current configuration:');
    console.log(JSON.stringify(config, null, 2));
  }
};
