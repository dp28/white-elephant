import generateId from "cuid";

const ID_KEY = "__identity";

let id;

export function fetchId() {
  if (id) {
    return id;
  }

  const storedId = localStorage.getItem(ID_KEY);
  if (storedId) {
    return storedId;
  }

  const newId = generateId();
  localStorage.setItem(ID_KEY, newId);
  return newId;
}
