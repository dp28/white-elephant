const prefix = "__we__";

export function loadData(key) {
  return JSON.parse(localStorage.getItem(prefix + key));
}

export function storeData(key, value) {
  localStorage.setItem(prefix + key, JSON.stringify(value));
}
