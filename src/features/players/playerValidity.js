import { isValidGiftInput } from "../gifts/giftValidity";

export function isValidPlayerInput(player) {
  return player.name && player.id && isValidGiftInput(player.gift);
}
