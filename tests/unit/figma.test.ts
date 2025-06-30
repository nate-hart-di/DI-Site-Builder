import { FigmaService } from '../../src/modules/figma/figma.service';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock the 'create' method to return a mocked axios instance
const mockedAxiosInstance = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
  request: jest.fn(),
  head: jest.fn(),
  options: jest.fn(),
  defaults: {
    headers: {
      common: {}
    }
  },
  interceptors: {
    request: { use: jest.fn(), eject: jest.fn() },
    response: { use: jest.fn(), eject: jest.fn() }
  },
  getUri: jest.fn(),
};

mockedAxios.create.mockReturnValue(mockedAxiosInstance as any);


describe('FigmaService', () => {
  let figmaService: FigmaService;

  beforeEach(() => {
    figmaService = new FigmaService('fake-token');
    jest.clearAllMocks();
  });

  it('should parse a valid Figma URL', () => {
    const url = 'https://www.figma.com/file/someFileKey/some-title?node-id=123%3A456';
    const { fileKey, nodeId } = figmaService.parseFigmaUrl(url);
    expect(fileKey).toBe('someFileKey');
    expect(nodeId).toBe('123:456');
  });

  it('should throw an error for an invalid Figma URL', () => {
    const url = 'https://www.notfigma.com/file/someFileKey';
    expect(() => figmaService.parseFigmaUrl(url)).toThrow('Invalid Figma URL');
  });

  it('should fetch a node', async () => {
    const fileKey = 'someFileKey';
    const nodeId = '123:456';
    const mockNode = { id: nodeId, name: 'Test Node', type: 'FRAME' };
    mockedAxiosInstance.get.mockResolvedValue({
      data: {
        nodes: {
          [nodeId]: { document: mockNode },
        },
      },
    });

    const node = await figmaService.getNode(fileKey, nodeId);
    expect(node).toEqual(mockNode);
    expect(mockedAxiosInstance.get).toHaveBeenCalledWith(`/files/${fileKey}/nodes`, {
      params: { ids: nodeId },
    });
  });

  it('should fetch an image URL', async () => {
    const fileKey = 'someFileKey';
    const nodeId = '123:456';
    const mockImageUrl = 'https://some.image.url/image.png';
    mockedAxiosInstance.get.mockResolvedValue({
      data: {
        images: {
          [nodeId]: mockImageUrl,
        },
      },
    });

    const imageUrl = await figmaService.getImage(fileKey, nodeId);
    expect(imageUrl).toBe(mockImageUrl);
    expect(mockedAxiosInstance.get).toHaveBeenCalledWith(`/images/${fileKey}`, {
      params: { ids: nodeId, scale: 2, format: 'png' },
    });
  });

  it('should download an image', async () => {
    const imageUrl = 'https://some.image.url/image.png';
    const mockImageBuffer = Buffer.from('fake-image-data');
    // For the downloadImage, we use the global axios, not the instance
    mockedAxios.get.mockResolvedValue({ data: mockImageBuffer });

    const imageBuffer = await figmaService.downloadImage(imageUrl);
    expect(imageBuffer).toEqual(mockImageBuffer);
    expect(mockedAxios.get).toHaveBeenCalledWith(imageUrl, { responseType: 'arraybuffer' });
  });
});
