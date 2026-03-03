import type { AnimeSearchResultsInterface } from "../../../utils/types/anime";
import type { ProviderInfo } from "../../../utils/types/provider";
import { AnimeParser } from "../../parsers";
export default class AnimePahe extends AnimeParser {
    data: ProviderInfo;
    cachePath: string;
    constructor(basePath?: string);
    private getHeaders;
    private readCache;
    private getCookieString;
    private bypassToCache;
    /**
     * Ensures cache is fresh. Returns true when cache is usable.
     */
    writeToCache({ url, cachePath, force, }: {
        url: string;
        cachePath?: string;
        force?: boolean;
    }): Promise<boolean>;
    search(query: string, page?: number, perPage?: number, ...args: any[]): Promise<AnimeSearchResultsInterface>;
    getSession(title: string, animeId?: string): Promise<string>;
    getEpisodes({ title, session, sort, page, }: {
        title?: string;
        session?: string;
        sort?: string;
        page?: number;
    }): Promise<any>;
    getAnimeInfo({ title, session, ep_page, }: {
        title: string;
        session?: string;
        ep_page?: number;
    }): Promise<{
        session: string;
        anilist_id: string;
        title: string;
        image: string;
        synopsis: string;
        episodes: any;
    }>;
    getEpisodeSources({ title, session, episode_id, }: {
        title: string;
        session?: string;
        episode_id: string;
    }): Promise<any>;
}
