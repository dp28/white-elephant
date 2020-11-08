import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { selectImages, createImage, storeImage } from "./imagesSlice";
import { buildBroadcast } from "../../communication/messages";
import { broadcastMessage } from "../messages/messagesSlice";

export function Images() {
  const images = useSelector(selectImages);
  const dispatch = useDispatch();

  const onSubmit = (event) => {
    event.preventDefault();
    const storeAction = storeImage(image);
    dispatch(storeAction);
    dispatch(broadcastMessage(buildBroadcast({ payload: storeAction })));
    setCaption("");
  };

  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState("");

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          onChange={(event) => {
            const files = event.target.files;
            setImage(createImage({ files, caption }));
          }}
          accept="image/*"
          required={true}
        />

        {image && <img src={image.url} alt={image.fileName} width="200" />}

        <input
          type="text"
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
          placeholder="caption"
        />

        <input type="submit" value="Upload" />
      </form>

      <hr />

      {images.map((image) => (
        <img
          src={image.url}
          alt={image.caption || image.fileName}
          key={image.id}
          width="200"
        />
      ))}
    </div>
  );
}
