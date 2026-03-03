import { bypass } from "../../../utils/helpers/ddosguard";
import type { AnimeSearchResultsInterface } from "../../../utils/types/anime";
import type { ProviderInfo } from "../../../utils/types/provider";
import { editJsonFile } from "../../../utils/use/cookie-cache";
import { AnimeParser } from "../../parsers";
import axios from "axios";
import { userAgent } from "../../../utils/use";

export default class AnimePahe extends AnimeParser {
  override data: ProviderInfo = {
    name: "AnimePahe",
    language: "en",
    type: "ANIME",
    icon: "https://animepahe.si/pikacon.ico",
    author: "Skunktank69",
    baseUrl: "https://animepahe.si/",
    altUrls: ["https://animepahe.com/", "https://animepahe.org"],
    isNSFW: false,
  };

  public override cachePath?: string;

  private getHeaders({
    sessionId = false,
    cookie = false,
  }: {
    sessionId?: any;
    cookie?: any;
  }) {
    return {
      authority: "animepahe.ru",
      accept: "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9",
      cookie: cookie,
      dnt: "1",
      "sec-ch-ua":
        '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": '"Windows"',
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-requested-with": "XMLHttpRequest",
      referer: sessionId
        ? `${this.data.baseUrl}/anime/${sessionId}`
        : this.data.baseUrl,
      "user-agent": userAgent,
    };
  }

  constructor(basePath?: string) {
    super();
    this.cachePath =
      basePath ??
      process.env.ANIMEPAHE_CACHE_DIR ??
      "../cache/animepahe/cache.json";
  }

  async writeToCache({
    url,
    cachePath = this.cachePath as string,
    force = false,
  }: {
    url: string;
    cachePath?: string;
    force?: boolean;
  }) {
    const apc = require(cachePath);
    if (apc.expires > apc.timeStamp && !force) {
      console.log("cached cookies still valid");
      return true;
    } else if (apc.expires > apc.timeStamp && force) {
      if (force) {
        console.log("forcefully updating cache");
      }
      bypass(url, async function (err, resp) {
        if (err) {
          console.log("error getting cookies", err);
          return false;
        } else {
          const cacheData = {
            ...resp?.cookies,
            timeStamp: Date.now(),
            expires: Date.now() + 604_800_000, //eggzaktly 7 days
          };
          editJsonFile(`${cachePath}`, cacheData);
          return "completed";
        }
      });
    }
  }

  override async search(
    query: string,
    page?: number,
    perPage?: number,
    ...args: any[]
  ): Promise<AnimeSearchResultsInterface> {
    const url = `${this.data.baseUrl}/api?m=search&q=${encodeURIComponent(query)}`;
    const cache = require(this.cachePath as unknown as string).string;
    const headersdef = this.getHeaders({ cookie: cache });
    return new Promise(async (resolve, reject) => {
      this.writeToCache({
        url: url,
      });

      try {
        const res = await axios.get(url, {
          headers: {
            ...headersdef,
          },
        });
        console.log({
          ...res.data,
        });
        return {
          id: res.data,
        };
      } catch (e) {
        console.log(e);
      }
    });
  }
}
