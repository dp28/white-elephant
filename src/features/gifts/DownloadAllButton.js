import React, { useState } from "react";
import { useSelector } from "react-redux";
import { selectGifts } from "./giftsSlice";
import { selectPlayersById } from "../players/playersSlice";
import { toBlobOrNull, selectImagesById } from "../images/imagesSlice";
import { selectGame } from "../game/gameSlice";
import {
  Button,
  Checkbox,
  FormControlLabel,
  makeStyles,
} from "@material-ui/core";
import { downloadZip } from "client-zip";
import { DownloadButton } from "./DownloadButton";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    flexDirection: "column",
  },
  button: {
    marginTop: theme.spacing(1),
  },
}));

export const DownloadAllButton = () => {
  const classes = useStyles();
  const gifts = useSelector(selectGifts);
  const playersById = useSelector(selectPlayersById);
  const imagesById = useSelector(selectImagesById);
  const [includeImages, setIncludeImages] = useState(true);
  const [includeGivers, setIncludeGivers] = useState(false);
  const [includeMessages, setIncludeMessages] = useState(false);
  const game = useSelector(selectGame);

  const getImageFiles = async () => {
    const imagePromises = gifts.map(async (gift) => {
      const image = imagesById[gift.imageId];
      if (!image) {
        return null;
      }

      const giver = playersById[gift.broughtByPlayerId];
      const receiver = playersById[gift.ownerId];
      try {
        const imageBlob = await toBlobOrNull(image.url);

        const suffix = includeGivers
          ? `from ${giver.name} to ${receiver.name}`
          : `ended with ${receiver?.name}`;

        const extension = image.fileName.split(".").pop();

        return {
          name: `${gift.name} [${suffix}].${extension}`,
          input: imageBlob,
        };
      } catch (error) {
        console.error("Failed to download image for", gift.name, error);
        return null;
      }
    });

    const images = await Promise.all(imagePromises);
    return images.filter(Boolean);
  };

  const getResultsCSV = () => {
    const headers = ["Gift name"];

    if (includeGivers) {
      headers.push("From");
      headers.push("To");
    } else {
      headers.push("Received by");
    }

    if (includeMessages) {
      headers.push("Secret message");
    }

    const rows = gifts.map((gift) => {
      const result = [gift.name];

      if (includeGivers) {
        result.push(playersById[gift.broughtByPlayerId].name);
      }

      result.push(playersById[gift.ownerId].name);

      if (includeMessages) {
        result.push(gift.messageToReceiver);
      }
      return result;
    });

    const content = [headers]
      .concat(rows)
      .map((row) => row.join(","))
      .join("\n");

    return {
      name: `${game.name} - white elephant results.csv`,
      input: content,
    };
  };

  const getResultsCSVFile = () => {
    const { name, input } = getResultsCSV();
    return {
      name,
      url: encodeURI("data:text/csv;charset=utf-8," + input),
    };
  };

  const buildZipFile = async () => {
    try {
      const imageFiles = await getImageFiles();
      const csvFile = getResultsCSV();
      const zipFileBlob = await downloadZip([csvFile, ...imageFiles]).blob();
      return {
        name: `${game.name} - white elephant results.zip`,
        url: URL.createObjectURL(zipFileBlob),
      };
    } catch (error) {
      console.error("Failed to download images", error);
      return getResultsCSVFile();
    }
  };

  const buildDownloadFile = async () => {
    return includeImages ? await buildZipFile() : getResultsCSVFile();
  };

  return (
    <form className={classes.container}>
      <div>
        <FormControlLabel
          label="Include gift images in download"
          control={
            <Checkbox
              checked={includeImages}
              onChange={() => setIncludeImages(!includeImages)}
              name="includeImages"
            />
          }
        />
      </div>
      <div>
        <FormControlLabel
          label="Include the names of the players who brought each gift"
          control={
            <Checkbox
              checked={includeGivers}
              onChange={() => setIncludeGivers(!includeGivers)}
              name="includeGivers"
            />
          }
        />
      </div>
      <div>
        <FormControlLabel
          label="Include the secret messages written by the players who brought each gift"
          control={
            <Checkbox
              checked={includeMessages}
              onChange={() => setIncludeMessages(!includeMessages)}
              name="includeMessages"
            />
          }
        />
      </div>
      <div>
        <DownloadButton
          className={classes.button}
          buttonVariant="contained"
          getFile={buildDownloadFile}
        >
          Download all gifts
        </DownloadButton>
      </div>
    </form>
  );
};
