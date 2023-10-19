import { browserStorageLocalGet, browserStorageLocalSet } from "@/shared/utils/browser";

let cacheMap;

export const get = async (prop?) => {
  if (cacheMap) {
    return cacheMap.get(prop);
  }

  const result = await browserStorageLocalGet(null);
  cacheMap = new Map(Object.entries(result).map(([k, v]) => [k, v]));

  return prop ? result[prop] : result;
};

export const set = async (prop, value): Promise<void> => {
  await browserStorageLocalSet({ [prop]: value });
  cacheMap.set(prop, value);
};

export const byteInUse = async (): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (chrome) {
      chrome.storage.local.getBytesInUse((value) => {
        resolve(value);
      });
    } else {
      reject("ByteInUse only works in Chrome");
    }
  });
};
