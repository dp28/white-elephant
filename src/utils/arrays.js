// From https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
export function shuffle(originalArray) {
  const array = [...originalArray];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}

export function sortByOrdering(originalArray) {
  const array = [...originalArray];
  array.sort((a, b) => (a.ordering || 0) - (b.ordering || 0));
  return array;
}
