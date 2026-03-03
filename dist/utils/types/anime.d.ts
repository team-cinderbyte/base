import type { BaseResultsInterface } from ".";
type episodeDataType = {
    id: string | string[] | null;
    title: string | string[] | null;
    link: string | string[] | null;
    image: string | null;
    [x: string]: any;
};
interface AnimeSearchResultsInterface extends BaseResultsInterface {
    episodes: episodeDataType;
    [x: string]: any;
}
export type { AnimeSearchResultsInterface };
