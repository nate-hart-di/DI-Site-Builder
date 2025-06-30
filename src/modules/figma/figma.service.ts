import axios from 'axios';
import { FigmaNode, FigmaImage } from '../../types';

export class FigmaService {
  private readonly api;

  constructor(private readonly apiToken: string) {
    this.api = axios.create({
      baseURL: 'https://api.figma.com/v1',
      headers: {
        'X-Figma-Token': this.apiToken,
      },
    });
  }

  async getNode(fileKey: string, nodeId: string): Promise<FigmaNode> {
    try {
      const response = await this.api.get(`/files/${fileKey}/nodes`, {
        params: { ids: nodeId },
      });
      const nodes = response.data.nodes;
      if (nodes && nodes[nodeId]) {
        return nodes[nodeId].document;
      }
      throw new Error('Node not found');
    } catch (error) {
      console.error('Error fetching Figma node:', error);
      throw error;
    }
  }

  async getImage(fileKey: string, nodeId: string, scale: number = 2): Promise<string> {
    try {
      const response = await this.api.get<FigmaImage>(`/images/${fileKey}`, {
        params: { ids: nodeId, scale, format: 'png' },
      });
      const images = response.data.images;
      if (images && images[nodeId]) {
        return images[nodeId];
      }
      throw new Error('Image not found');
    } catch (error) {
      console.error('Error fetching Figma image:', error);
      throw error;
    }
  }

  async downloadImage(url: string): Promise<Buffer> {
    try {
      const response = await axios.get(url, { responseType: 'arraybuffer' });
      return Buffer.from(response.data, 'binary');
    } catch (error) {
      console.error('Error downloading image:', error);
      throw error;
    }
  }

  parseFigmaUrl(url: string): { fileKey: string; nodeId: string } {
    const match = url.match(/figma\.com\/file\/([^\/]+)\/.*node-id=([^&]+)/);
    if (match) {
      const [, fileKey, nodeId] = match;
      return { fileKey, nodeId: decodeURIComponent(nodeId) };
    }
    throw new Error('Invalid Figma URL');
  }
}
