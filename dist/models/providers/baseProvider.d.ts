import type { ExtensionTypeEnum, ProviderInfo } from "../../utils/types/provider";
declare abstract class BaseProvider {
    /**
     *  provider info
     */
    protected abstract readonly data: ProviderInfo;
    cachePath?: string;
    protected generateIdentifier(name: string, isNSFW: boolean, type: ExtensionTypeEnum): string;
    getInfo(): {
        identifier: string;
        name: string;
        type: ExtensionTypeEnum;
        author: string;
        baseUrl: string;
        altUrls?: string[];
        icon: string;
        language: string | string[];
        isNSFW: boolean;
    };
}
export default BaseProvider;
