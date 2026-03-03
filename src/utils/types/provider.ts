type ExtensionTypeEnum = "ANIME" | "MANGA" | "NOVELS" | "META" | "MOVIES";

interface ProviderInfo {
  name: string;
  type: ExtensionTypeEnum;
  author: string;
  baseUrl: string;
  altUrls?: string[];
  icon: string;
  language: string | string[];
  isNSFW: boolean;
}

export type { ProviderInfo, ExtensionTypeEnum };
