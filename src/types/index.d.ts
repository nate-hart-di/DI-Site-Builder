export interface FigmaNode {
  id: string;
  name: string;
  type: string;
  children?: FigmaNode[];
}

export interface FigmaImage {
  images: {
    [nodeId: string]: string;
  };
}

export interface Config {
  figmaApiToken?: string;
  diWebsitesPlatformPath?: string;
}

export interface DiffReport {
  diffPercentage: number;
  diffImage: Buffer;
}

export interface BuildStatus {
  success: boolean;
  log: string;
}
