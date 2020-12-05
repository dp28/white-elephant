import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Slide } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  wrapping: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
  ribbon: {
    position: "absolute",
    boxShadow:
      "0px 1px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 1px 0px rgba(0,0,0,0.12);",
  },
  bottomRibbon: {
    width: "10%",
    height: "100%",
    top: 0,
    left: "45%",
  },
  topRibbon: {
    width: "100%",
    height: "10%",
    left: 0,
    top: "45%",
  },
  ribbonCentre: {
    filter: "brightness(95%)",
    backgroundColor: "inherit",
  },
  ribbonCentreTop: {
    width: "100%",
    height: "50%",
    marginTop: "2%",
  },
  ribbonCentreBottom: {
    height: "100%",
    width: "50%",
    marginLeft: "25%",
  },
}));

export function Wrapping({
  wrappingColour,
  ribbonColour = "gold",
  wrapped = true,
}) {
  const classes = useStyles();

  return (
    <Slide
      style={{ transitionDelay: "1s", transitionDuration: "1s" }}
      direction="right"
      in={wrapped}
      appear={true}
      exit={true}
      timeout={{
        enter: 0,
        exit: 2000,
      }}
    >
      <div
        className={classes.wrapping}
        style={{ backgroundColor: wrappingColour }}
      >
        <Slide
          style={{
            transitionDelay: "0.5s",
            transitionTimingFunction: "ease-in",
            transitionDuration: "0.5s",
          }}
          direction="up"
          in={wrapped}
          appear={true}
          exit={true}
          timeout={{
            enter: 0,
            exit: 1000,
          }}
        >
          <div
            className={`${classes.bottomRibbon} ${classes.ribbon}`}
            style={{ backgroundColor: ribbonColour }}
          >
            <div
              className={`${classes.ribbonCentreBottom} ${classes.ribbonCentre}`}
            ></div>
          </div>
        </Slide>
        <Slide
          style={{
            transitionTimingFunction: "ease-in",
            transitionDuration: "0.5s",
          }}
          direction="left"
          in={wrapped}
          appear={true}
          exit={true}
          timeout={{
            enter: 0,
            exit: 500,
          }}
        >
          <div
            className={`${classes.topRibbon} ${classes.ribbon}`}
            style={{ backgroundColor: ribbonColour }}
          >
            <div
              className={`${classes.ribbonCentreTop} ${classes.ribbonCentre}`}
            ></div>
          </div>
        </Slide>
      </div>
    </Slide>
  );
}
