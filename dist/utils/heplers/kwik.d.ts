import { AxiosHeaders } from "axios";
export default function extractKwikVideo(url: string, { baseUrl, headers }: {
    baseUrl: string;
    headers: AxiosHeaders;
}): Promise<{
    error: boolean;
    url: any;
    isM3U8: boolean;
    originalUrl: string;
    message?: undefined;
} | {
    error: boolean;
    message: any;
    originalUrl: string;
    url?: undefined;
    isM3U8?: undefined;
}>;
export declare function organizeStreamLinks(links: any): {
    sub: any[];
    dub: any[];
};
