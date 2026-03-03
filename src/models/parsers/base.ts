import BaseProvider from "../providers";

abstract class BaseParser extends BaseProvider {
  /**
   *  base search function
   *
   */
  abstract search(query: string, ...args: any[]): Promise<unknown>;
}

export default BaseParser;
