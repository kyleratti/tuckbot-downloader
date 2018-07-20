"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Scanner {
    constructor(options) {
        this.scanInterval = options.scanInterval;
        setInterval(this.start, this.scanInterval);
    }
}
exports.Scanner = Scanner;
//# sourceMappingURL=scanner.js.map