import React, { useState } from "react";
import { Button } from "@material-ui/core";
import { useDispatch } from "react-redux";
import { startNewGame } from "./gameSlice";
import { ConfirmationDialog } from "../confirm/ConfirmationDialog";

export const NewGameButton = () => {
  const dispatch = useDispatch();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Button color="inherit" onClick={() => setConfirming(true)}>
        Start New Game
      </Button>
      <ConfirmationDialog
        open={confirming}
        onCancel={() => setConfirming(false)}
        onConfirm={() => {
          dispatch(startNewGame());
          setConfirming(false);
        }}
      >
        This will end your current game.
      </ConfirmationDialog>
    </>
  );
};
