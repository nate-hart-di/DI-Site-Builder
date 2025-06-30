import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';
import fs from 'fs-extra';
import { DiffReport } from '../../types';

export class Comparer {
  async compare(image1Path: string, image2Path: string, diffOutputPath: string): Promise<DiffReport> {
    const img1 = PNG.sync.read(await fs.readFile(image1Path));
    const img2 = PNG.sync.read(await fs.readFile(image2Path));
    const { width, height } = img1;
    const diff = new PNG({ width, height });

    const numDiffPixels = pixelmatch(img1.data, img2.data, diff.data, width, height, {
      threshold: 0.1,
    });

    const diffPercentage = (numDiffPixels / (width * height)) * 100;
    const diffImage = PNG.sync.write(diff);

    await fs.writeFile(diffOutputPath, diffImage);

    return {
      diffPercentage,
      diffImage,
    };
  }
}
