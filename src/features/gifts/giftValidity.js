export function isValidGiftInput(gift) {
  return gift?.name && (!gift.image || gift.image.url);
}
