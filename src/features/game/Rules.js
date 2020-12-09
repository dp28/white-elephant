import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    paddingTop: theme.spacing(3),
    paddingBottom: theme.spacing(3),
  },
  title: {
    fontSize: "1.1rem",
    marginBottom: theme.spacing(1),
    marginTop: theme.spacing(2),
    color: theme.palette.primary.dark,
  },
  text: {
    marginBottom: theme.spacing(1),
  },
  emphasis: {
    color: theme.palette.primary.dark,
    fontWeight: "bold",
  },
}));

export function Rules() {
  const classes = useStyles();

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>How to play</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          <Typography>
            Once the game starts, players are put into a random order. On their
            turn, each player has a choice. They can either:
          </Typography>
          <ul>
            <li>
              <Typography>
                <span className={classes.emphasis}>Open</span> a wrapped gift
              </Typography>
            </li>
            <li>
              <Typography>
                <span className={classes.emphasis}>Steal</span> an open gift
                from another player
              </Typography>
            </li>
          </ul>
          <Typography gutterBottom>
            If they steal a gift, the player who's gift has been stolen
            immediately gets another turn, and can choose to open a gift or
            steal from someone else. They cannot steal back the gift that was
            just stolen from them.
          </Typography>
          <Typography gutterBottom>
            At most <span className={classes.emphasis}>3</span> players in a row
            can steal gifts. Once this happens, the last player to be stolen
            from must open a new gift.
          </Typography>

          <Typography className={classes.title}>Taking your turn</Typography>
          <Typography gutterBottom>
            On your turn, you can either click on a gift to open/steal it, or
            you can tell the host which gift you want. The host can take turns
            on behalf of any player.
          </Typography>
          <Typography>
            Once someone opens a gift, their name will be shown on that gift.
            The background of the name indicates who owns the gift:
          </Typography>
          <ul>
            <li>
              <Typography gutterBottom>
                <Chip color="primary" label="Player" /> - You
              </Typography>
            </li>
            <li>
              <Typography gutterBottom>
                <Chip color="secondary" label="Player" /> - The player who's
                turn it is
              </Typography>
            </li>
            <li>
              <Typography gutterBottom>
                <Chip label="Player" /> - All other players
              </Typography>
            </li>
          </ul>

          <Typography className={classes.title}>Ending the game</Typography>
          <Typography gutterBottom>
            The player who opened the first gift gets one extra turn at the end
            of the game (as they might not ever have had the option to exchange
            their gift). If they choose to steal a gift, they exchange their
            gift with the player they steal from. That player then has the
            option to steal from others.
          </Typography>
          <Typography gutterBottom>
            There are <span className={classes.emphasis}>no limits</span> to the
            number of consecutive steals at this point - the game is only over
            when a player decides to stick with their gift and click "Finish
            game".
          </Typography>
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
