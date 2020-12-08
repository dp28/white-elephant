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
    cursor: (props) => (props.onWrappingClick ? "pointer" : "default"),
  },
  ribbon: {
    position: "absolute",
    cursor: (props) => (props.onRibbonClick ? "pointer" : "default"),
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
  animated = true,
  onWrappingClick = null,
  onRibbonClick = null,
}) {
  const classes = useStyles({ onWrappingClick, onRibbonClick });

  const onRibbonClickWithoutWrapping =
    onRibbonClick &&
    ((event) => {
      event.stopPropagation();
      onRibbonClick();
    });

  return (
    <Slide
      style={{
        transitionDelay: animated ? "1s" : 0,
        transitionDuration: animated ? "1s" : 0,
      }}
      direction="right"
      in={wrapped}
      appear={animated}
      exit={animated}
      timeout={{
        enter: 0,
        exit: 2000,
      }}
    >
      <div
        className={classes.wrapping}
        style={{ backgroundColor: wrappingColour }}
        onClick={onWrappingClick}
      >
        <Slide
          style={{
            transitionDelay: animated ? "0.5s" : 0,
            transitionTimingFunction: "ease-in",
            transitionDuration: animated ? "0.5s" : 0,
          }}
          direction="up"
          in={wrapped}
          appear={animated}
          exit={animated}
          timeout={{
            enter: 0,
            exit: 1000,
          }}
        >
          <div
            className={`${classes.bottomRibbon} ${classes.ribbon}`}
            style={{ backgroundColor: ribbonColour }}
            onClick={onRibbonClickWithoutWrapping}
          >
            <div
              className={`${classes.ribbonCentreBottom} ${classes.ribbonCentre}`}
            ></div>
          </div>
        </Slide>
        <Slide
          style={{
            transitionTimingFunction: "ease-in",
            transitionDuration: animated ? "0.5s" : 0,
          }}
          direction="left"
          in={wrapped}
          appear={animated}
          exit={animated}
          timeout={{
            enter: 0,
            exit: 500,
          }}
        >
          <div
            className={`${classes.topRibbon} ${classes.ribbon}`}
            style={{ backgroundColor: ribbonColour }}
            onClick={onRibbonClickWithoutWrapping}
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
