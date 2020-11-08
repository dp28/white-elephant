import generateId from "cuid";
import { storeData, loadData } from "./persistentStorage";

const ID_KEY = "__identity";

let id;

export function fetchId() {
  if (id) {
    return id;
  }

  const storedId = loadData(ID_KEY);
  if (storedId) {
    return storedId;
  }

  const newId = generateId();
  storeData(ID_KEY, newId);
  return newId;
}
