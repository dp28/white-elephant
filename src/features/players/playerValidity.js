import { isValidGiftInput } from "../gifts/giftValidity";

export function isValidPlayerInput(player) {
  return (
    player.name &&
    player.id &&
    player.connectionId &&
    isValidGiftInput(player.gift)
  );
}
