export const getLocalstorageData = (key) => {
  const data = JSON.parse(localStorage.getItem(key));
  return data;
};

export const setLocalstorageData = (value, key) => {
  localStorage.setItem(key, JSON.stringify(value));
};
