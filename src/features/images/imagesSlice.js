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

export const receiveImage = (image) => (dispatch) => {
  const { id, fileName, fileType, caption, data } = image;
  const blob = new Blob([data], { type: fileType });
  dispatch(
    storeImage({
      id,
      fileName,
      fileType,
      caption,
      url: URL.createObjectURL(blob),
    })
  );
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
