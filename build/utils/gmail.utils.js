"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createConfig = void 0;
const createConfig = (url, accessToken) => {
    return {
        method: 'get',
        url: url,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
        },
    };
};
exports.createConfig = createConfig;
