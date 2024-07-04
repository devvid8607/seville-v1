export enum SessionStorageEnum {
  User = "User",
  Organisation = "Organisation",
}

export const UseSessionStorage = (key: SessionStorageEnum) => {
  const setItem = (value: any) => {
    try {
      window.sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      throw error;
    }
  };

  const getItem = () => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      throw error;
    }
  };

  const removeItem = () => {
    try {
      window.sessionStorage.removeItem(key);
    } catch (error) {
      throw error;
    }
  };

  return { setItem, getItem, removeItem };
};
