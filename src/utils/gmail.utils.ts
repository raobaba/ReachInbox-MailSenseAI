import { AxiosRequestConfig } from "axios";

const createConfig = (url: string, accessToken: string): AxiosRequestConfig => {
    return {
        method: 'get', 
        url: url,
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-type': 'application/json'
        },
    };
};

export { createConfig };
