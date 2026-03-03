import BaseParser from "./base";
import type { AnimeSearchResultsInterface } from "../../utils/types/anime";
declare abstract class AnimeParser extends BaseParser {
    /**
     *  are dub and sub available separately
     *  - false: the anime is available as a single item
     *  - true: the anime has variants like `anime title (sub)` and `anime title (dub)`
     */
    protected readonly separateDubandSub: boolean;
    /**
     * - get search results for a search query
     * @param query - search query
     * @param page - page number of response
     * @param perPage - number of items to show in each page
     * @param args - other arguments (depend on the provider)
     */
    abstract search(query: string, page: number, perPage: number, ...args: any[]): Promise<AnimeSearchResultsInterface>;
    abstract getAnimeInfo(...args: any): Promise<any>;
    abstract getEpisodeSources(...args: any): Promise<any>;
}
export default AnimeParser;
