import { Cookie } from "set-cookie-parser";

export type BypassResult = {
  cookies: {
    object: Cookie[];
    string: string;
  };
  headers: {
    "user-agent": string;
    referer: string;
  };
};

export function bypass(
  url: string,
  cb: (err: unknown, result: BypassResult | null) => void,
): void;
