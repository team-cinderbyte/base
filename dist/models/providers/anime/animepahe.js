import axios from "axios";
import { bypass } from "cinderbyte-bypass-ddg";
import * as cheerio from "cheerio";
import { readFile } from "node:fs/promises";
import { userAgent } from "../../../utils/use";
import { editJsonFile } from "../../../utils/use/cookie-cache";
import { AnimeParser } from "../../parsers";
import extractKwikVideo, { organizeStreamLinks, } from "../../../utils/heplers/kwik";
export default class AnimePahe extends AnimeParser {
    data = {
        name: "AnimePahe",
        language: "en",
        type: "ANIME",
        icon: "https://animepahe.si/pikacon.ico",
        author: "Skunktank69",
        baseUrl: "https://animepahe.si",
        altUrls: ["https://animepahe.com", "https://animepahe.org"],
        isNSFW: false,
    };
    cachePath;
    constructor(basePath) {
        super();
        this.cachePath =
            basePath ??
                process.env.ANIMEPAHE_CACHE_DIR ??
                "./cache/animepahe/cache.json";
    }
    getHeaders({ sessionId, cookie, }) {
        const host = new URL(this.data.baseUrl).host;
        // NOTE TO SELF ( by skunktank69 ):
        // authority must match the actual host you are calling, otherwise some setups get weird.
        // also: cookie must be omitted if empty, not `cookie: false`.
        const headers = {
            accept: "application/json, text/javascript, */*; q=0.01",
            "accept-language": "en-US,en;q=0.9",
            dnt: "1",
            "sec-ch-ua": '"Not A(Brand";v="99", "Microsoft Edge";v="121", "Chromium";v="121"',
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
            authority: host,
        };
        if (cookie)
            headers.cookie = cookie;
        return headers;
    }
    async readCache(cachePath = this.cachePath) {
        try {
            const raw = await readFile(cachePath, "utf8");
            const json = JSON.parse(raw);
            // tolerate either {string: "..."} or raw object
            return (json ?? {});
        }
        catch {
            return {};
        }
    }
    async getCookieString(cachePath = this.cachePath) {
        const cache = await this.readCache(cachePath);
        return typeof cache.string === "string" ? cache.string : "";
    }
    async bypassToCache(url) {
        return new Promise((resolve, reject) => {
            bypass(url, (err, resp) => {
                if (err)
                    return reject(err);
                const cookiesObj = resp?.cookies ?? {};
                const cacheData = {
                    ...cookiesObj,
                    timeStamp: Date.now(),
                    expires: Date.now() + 604_800_000, // 7 days
                };
                resolve(cacheData);
            });
        });
    }
    /**
     * Ensures cache is fresh. Returns true when cache is usable.
     */
    async writeToCache({ url, cachePath = this.cachePath, force = false, }) {
        const apc = await this.readCache(cachePath);
        const expires = typeof apc.expires === "number" ? apc.expires : 0;
        const now = Date.now();
        if (!force && expires > now) {
            return true;
        }
        try {
            const cacheData = await this.bypassToCache(url);
            // editJsonFile is your util; assume it writes JSON atomically-ish
            await Promise.resolve(editJsonFile(cachePath, cacheData));
            return true;
        }
        catch (err) {
            const fallbackCookie = typeof apc.string === "string" ? apc.string.trim() : "";
            if (fallbackCookie)
                return true;
            throw err;
        }
    }
    async search(query, page, perPage, ...args) {
        const url = `${this.data.baseUrl}/api?m=search&q=${encodeURIComponent(query)}`;
        await this.writeToCache({ url, force: true });
        const cookie = await this.getCookieString();
        const headers = this.getHeaders({ cookie });
        const res = await axios.get(url, { ...headers });
        return res.data;
    }
    async getSession(title, animeId) {
        const url = `${this.data.baseUrl}/api?m=search&q=${encodeURIComponent(title)}`;
        await this.writeToCache({ url, force: true });
        const cookie = await this.getCookieString();
        const headers = this.getHeaders({ cookie });
        const res = await axios.get(url, { headers });
        const data = res.data;
        if (!data?.data || !Array.isArray(data.data)) {
            throw new Error("Invalid search response");
        }
        const byId = animeId &&
            data.data.find((a) => a?.id === animeId || a?.anime_id === animeId);
        const byTitle = data.data.find((a) => a?.title === title);
        const pick = byId ?? byTitle ?? data.data[0];
        const session = pick?.session;
        if (!session)
            throw new Error("No matching anime found (missing session)");
        return String(session);
    }
    async getEpisodes({ title, session, sort, page, }) {
        await this.writeToCache({ url: this.data.baseUrl });
        const cookie = await this.getCookieString();
        const headers = this.getHeaders({ cookie });
        if (!session && title) {
            session = await this.getSession(title);
        }
        const url = `${this.data.baseUrl}/api?m=release&id=${session}&sort=${sort ?? "episode_desc"}&page=${page ?? 1}`;
        const res = await axios.get(url, { headers });
        const data = res.data;
        return {
            ...data,
        };
    }
    async getAnimeInfo({ title, session, ep_page, }) {
        await this.writeToCache({ url: this.data.baseUrl });
        const cookie = await this.getCookieString();
        const headers = this.getHeaders({ cookie });
        if (!session && title) {
            session = await this.getSession(title);
        }
        const episodes = await this.getEpisodes({
            session: session,
            page: ep_page ?? 1,
        });
        const url = `${this.data.baseUrl}/anime/${session}`;
        const res = await axios.get(url, { headers });
        const $ = cheerio.load(res.data);
        const data = {
            session,
            anilist_id: $(".external-links > a:nth-of-type(1)")
                .attr("href")
                ?.split("/anime/")[1],
            title: title ??
                $(".anime-header > .title-wrapper > .user-select-none > span")
                    .text()
                    .trim(),
            image: $(".youtube-preview > img").attr("data-src"),
            synopsis: $(".anime-synopsis").text().trim(),
            episodes,
        };
        return data;
    }
    async getEpisodeSources({ title, session, episode_id, }) {
        try {
            await this.writeToCache({ url: this.data.baseUrl });
            const cookie = await this.getCookieString();
            let headers = this.getHeaders({ cookie });
            if (!session && title) {
                session = await this.getSession(title);
            }
            headers = {
                ...headers,
                sessionId: session,
                Referer: this.data.baseUrl,
            };
            const url = `${this.data.baseUrl}/play/${session}/${episode_id}`;
            const res = await axios.get(url, { headers });
            const $ = cheerio.load(res.data);
            const buttons = $("#resolutionMenu button");
            const videoLinks = [];
            for (const button of buttons) {
                const quality = $(button).text().trim();
                const kwikLink = $(button).attr("data-src");
                const audio = $(button).attr("data-audio");
                if (kwikLink) {
                    const videoResult = await extractKwikVideo(kwikLink, {
                        baseUrl: this.data.baseUrl,
                        headers: headers,
                    });
                    if (!videoResult.error) {
                        videoLinks.push({
                            quality: quality,
                            url: videoResult.url,
                            referer: "https://kwik.cx",
                            isDub: audio === "eng",
                        });
                    }
                    const qualityOrder = {
                        "1080p": 1,
                        "720p": 2,
                        "480p": 3,
                        "360p": 4,
                    };
                    videoLinks.sort((a, b) => {
                        const qualityA = 
                        //@ts-expect-error ----
                        qualityOrder[a.quality.replace(/.*?(\d+p).*/, "$1")] || 999;
                        const qualityB = 
                        //@ts-expect-error ----
                        qualityOrder[b.quality.replace(/.*?(\d+p).*/, "$1")] || 999;
                        return qualityA - qualityB;
                    });
                    const organizedLinks = organizeStreamLinks(videoLinks);
                    return {
                        headers: {
                            Referer: "https://kwik.cx/",
                        },
                        sources: [
                            {
                                url: organizedLinks.sub[0] || organizedLinks.dub[0],
                            },
                        ],
                        multiSrc: videoLinks,
                    };
                }
            }
        }
        catch (error) {
            console.error("Error getting episode sources:", error);
            return { sources: [], multiSrc: [] };
        }
    }
}
//# sourceMappingURL=animepahe.js.map