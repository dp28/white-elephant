import { createSlice } from "@reduxjs/toolkit";
import cuid from "cuid";

export const imagesSlice = createSlice({
  name: "images",
  initialState: {
    images: {},
  },
  reducers: {
    storeImage: (state, action) => {
      const { id, fileName, fileType, caption, url } = action.payload;
      state.images[id] = { id, fileName, fileType, caption, url };
    },
  },
});

export const { storeImage } = imagesSlice.actions;

export const STORE_IMAGE = "images/storeImage";

export const toRTCStoreImage = async (storeImageAction) => {
  const { id, fileName, fileType, caption, url } = storeImageAction.payload;
  const data = await fetch(url).then((r) => r.blob());
  const payload = {
    id,
    fileName,
    fileType,
    caption,
    data,
  };
  return { ...storeImageAction, payload };
};

export const toReduxStoreImageAction = (storeImageAction) => {
  const { id, fileName, fileType, caption, data } = storeImageAction.payload;
  const blob = new Blob([data], { type: fileType });
  return storeImage({
    id,
    fileName,
    fileType,
    caption,
    url: URL.createObjectURL(blob),
  });
};

export const createImage = ({ files, caption }) => {
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

export const selectImages = (state) => Object.values(state.images.images);

export default imagesSlice.reducer;
