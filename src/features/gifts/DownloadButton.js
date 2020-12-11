import React from "react";
import { Button } from "@material-ui/core";

export const DownloadButton = ({
  getFile,
  className,
  children,
  buttonVariant,
}) => {
  const download = async (event) => {
    event.preventDefault();

    const file = await getFile();

    const link = document.createElement("a");
    link.href = file.url;
    link.download = file.name;
    link.click();
    link.remove();
  };

  return (
    <Button
      color="primary"
      className={className}
      variant={buttonVariant}
      onClick={download}
    >
      {children}
    </Button>
  );
};
