import fetch from 'node-fetch';

export async function fetchAsync(url : string) : Promise<any> {
    const result = await fetch(url);
    return await result.json();
}

export const UrlBuildParams = (obj : object) =>
    Object.entries(obj).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');