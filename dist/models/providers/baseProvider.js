class BaseProvider {
    cachePath;
    generateIdentifier(name, isNSFW, type) {
        return `${type.toLowerCase()}.${isNSFW ? "nsfw" : "sfw"}.${name}`.replaceAll("/[^0-9a-zA-Z]+/gm", "-");
    }
    getInfo() {
        return {
            ...this.data,
            identifier: this.generateIdentifier(this.data.name, this.data.isNSFW, this.data.type),
        };
    }
}
export default BaseProvider;
//# sourceMappingURL=baseProvider.js.map