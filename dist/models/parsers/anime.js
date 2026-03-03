import BaseParser from "./base";
class AnimeParser extends BaseParser {
    /**
     *  are dub and sub available separately
     *  - false: the anime is available as a single item
     *  - true: the anime has variants like `anime title (sub)` and `anime title (dub)`
     */
    separateDubandSub = false;
}
export default AnimeParser;
//# sourceMappingURL=anime.js.map