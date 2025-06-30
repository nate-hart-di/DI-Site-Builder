import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

describe('CLI', () => {
  it('should show help for the main command', async () => {
    const { stdout } = await execAsync('ts-node src/cli/index.ts --help');
    expect(stdout).toContain('Usage: di-site-builder [options] [command]');
  });

  it('should show help for the generate command', async () => {
    const { stdout } = await execAsync('ts-node src/cli/index.ts generate --help');
    expect(stdout).toContain('Usage: di-site-builder generate [options]');
    expect(stdout).toContain('--url <figmaNodeUrl>');
    expect(stdout).toContain('--theme <themeName>');
  });

  it('should show help for the config command', async () => {
    const { stdout } = await execAsync('ts-node src/cli/index.ts config --help');
    expect(stdout).toContain('Usage: di-site-builder config [options]');
    expect(stdout).toContain('--set <key>=<value>');
  });

  it('should show help for the doctor command', async () => {
    const { stdout } = await execAsync('ts-node src/cli/index.ts doctor --help');
    expect(stdout).toContain('Usage: di-site-builder doctor [options]');
  });
});
