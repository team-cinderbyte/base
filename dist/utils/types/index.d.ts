interface BaseResultsInterface {
    id: {
        source: string | number | null;
        [x: string]: any;
    };
    title: {
        source: string | null;
        original: string | null;
        lang: {
            [x: string]: any;
        };
    };
    synopsis: {
        source: string | null;
        [x: string]: any;
    };
    images: {
        cover: string | [] | null;
        banner: string | [] | null;
    };
}
export type { BaseResultsInterface };
