export const getStorageData = async (key: string) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      const result = await chrome.storage.local.get([key]);
      return result[key];
    }
    return localStorage.getItem(key);
  };
  
  export const setStorageData = async (key: string, value: string) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.set({ [key]: value });
    } else {
      localStorage.setItem(key, value);
    }
  };
  
  export const removeStorageData = async (key: string) => {
    if (typeof chrome !== 'undefined' && chrome.storage) {
      await chrome.storage.local.remove(key);
    } else {
      localStorage.removeItem(key);
    }
  };