import { useCallback, useState, useEffect } from "react";

const MinimumGiftSideSize = 100;
const GiftMargin = 8;
const MinimumGiftSideSizeWithMargin = MinimumGiftSideSize + GiftMargin * 2;
const MinimumGiftArea =
  MinimumGiftSideSizeWithMargin * MinimumGiftSideSizeWithMargin;

export const useGiftGrid = (giftCount) => {
  const windowHeight = useWindowHeight();
  const [giftDimensions, setGiftDimensions] = useState({
    width: MinimumGiftSideSize,
    height: MinimumGiftSideSize,
  });
  const ref = useCallback(
    (element) => {
      if (!element || giftCount <= 0) {
        return null;
      }
      const bounds = element.getBoundingClientRect();
      const boardWidth = bounds.width;
      const bottom = bounds.height + bounds.y;

      const boardHeight =
        bottom < windowHeight
          ? bounds.height
          : windowHeight - bounds.y - 2 * GiftMargin;

      const dimensions = calculateGiftDimensions({
        boardWidth,
        boardHeight,
        giftCount,
      });
      setGiftDimensions(dimensions);
    },
    [windowHeight, giftCount]
  );
  return [giftDimensions, ref];
};

function useWindowHeight() {
  const [windowHeight, setWindowHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => setWindowHeight(window.innerHeight);
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowHeight;
}

function calculateGiftDimensions({ boardWidth, boardHeight, giftCount }) {
  if (boardWidth * boardHeight < giftCount * MinimumGiftArea) {
    return { width: MinimumGiftSideSize, height: MinimumGiftSideSize };
  }

  const smallestSide = boardHeight > boardWidth ? boardWidth : boardHeight;
  const largestSide = smallestSide === boardWidth ? boardHeight : boardWidth;

  if (smallestSide <= MinimumGiftSideSizeWithMargin) {
    return { width: MinimumGiftSideSize, height: MinimumGiftSideSize };
  }

  const numberOfGiftsInSquareArea = giftCount * (smallestSide / largestSide);
  const giftsOnSmallSide = Math.ceil(Math.sqrt(numberOfGiftsInSquareArea));
  const giftSideSize = Math.floor(smallestSide / giftsOnSmallSide);

  if (giftSideSize < MinimumGiftSideSizeWithMargin) {
    return { width: MinimumGiftSideSize, height: MinimumGiftSideSize };
  } else {
    return {
      width: giftSideSize - GiftMargin * 2,
      height: giftSideSize - GiftMargin * 2,
    };
  }
}
