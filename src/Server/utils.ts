import fetch from 'node-fetch'

export async function fetchAsync<T>(url: string): Promise<T> {
  const result = await fetch(url)
  return await result.json()
}

export const UrlBuildParams = (obj: Record<string, string>) =>
  Object.entries(obj)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&')

export const ifArrayGetFirstItem = <T = unknown>(a: T[] | undefined) =>
  a && a.length ? a[0] : undefined
