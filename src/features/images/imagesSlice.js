import { createSlice } from "@reduxjs/toolkit";
import cuid from "cuid";
import { gameAction } from "../game/gameActions";

export const imagesSlice = createSlice({
  name: "images",
  initialState: {
    imagesById: {},
  },
  reducers: {
    storeImage: (state, action) => {
      const { id, fileName, fileType, caption, url } = action.payload;
      state.imagesById[id] = { id, fileName, fileType, caption, url };
    },
    storeGiftImage: gameAction((state, action) => {
      const { id, fileName, fileType, caption, url } = action.payload;
      state.imagesById[id] = { id, fileName, fileType, caption, url };
    }),
  },
  extraReducers: (builder) => {
    builder.addCase("game/setGameState", (state, action) => {
      action.payload.images.forEach((image) => {
        state.imagesById[image.id] = image;
      });
    });
  },
});

export const { storeImage, storeGiftImage } = imagesSlice.actions;

export const STORE_IMAGE = "images/storeImage";
export const STORE_GIFT_IMAGE = "images/storeGiftImage";

export const toRTCStoreImage = async (storeImageAction) => {
  const image = await toRTCImage(storeImageAction.payload);
  return { ...storeImageAction, payload: image };
};

export const toReduxStoreImageAction = (storeImageAction) => {
  const image = toReduxImage(storeImageAction.payload);
  return storeImage(image);
};

export const toRTCImage = async (reduxImage) => {
  const { id, fileName, fileType, caption, url } = reduxImage;
  const data = await fetch(url).then((r) => r.blob());
  return {
    id,
    fileName,
    fileType,
    caption,
    data,
  };
};

export const toReduxImage = (rtcImage) => {
  const { id, fileName, fileType, caption, data } = rtcImage;
  const blob = new Blob([data], { type: fileType });
  return {
    id,
    fileName,
    fileType,
    caption,
    url: URL.createObjectURL(blob),
  };
};

export const createImage = ({ files, caption }) => {
  if (!files[0]) {
    return null;
  }
  const blob = new Blob(files, { type: files[0].type });
  const image = {
    id: cuid(),
    fileType: files[0].type,
    fileName: files[0].name,
    caption,
    url: URL.createObjectURL(blob),
  };
  return image;
};

export const selectImages = (state) => Object.values(state.images.imagesById);
export const selectImage = (id) => (state) => state.images.imagesById[id];

export const asyncConvertImagesRTCFormat = (images) =>
  Promise.all(images.map(toRTCImage));

export const convertImagesToReduxFormat = (images) => images.map(toReduxImage);

export default imagesSlice.reducer;
