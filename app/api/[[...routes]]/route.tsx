/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar, pinata } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { getRoundById } from "../services/roundService";
import { fetchVote, undoVote, vote } from "../services/voteService";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  hub: pinata(),
  title: "Kramer-like frame",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", async (c) => {
  const { buttonValue, frameData } = c;
  const roundId = 1;

  const myVote = await fetchVote(roundId, String(frameData?.fid));
  let voted = !!myVote;

  if (buttonValue && !voted) {
    await vote(roundId, String(frameData?.fid), buttonValue === "Yes");
    voted = true;
  }

  if (buttonValue === "Undo") {
    await undoVote(roundId, String(frameData?.fid));
    voted = false;
  }

  const round = await getRoundById(roundId);

  return c.res({
    image: (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "white",
          textAlign: "center",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "70%",
            width: "80%",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "30px",
            borderRadius: "15px",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 30, marginBottom: 70 }}>{round.question}</div>
          {voted && (
            <>
              <div
                style={{ display: "flex", fontSize: 25, color: "lightgray" }}
              >
                {`You voted: ${myVote?.voteType ? "yes" : "no"}`}
              </div>
              <div
                style={{ display: "flex", fontSize: 25, color: "lightgray" }}
              >
                Positions
              </div>
              <div
                style={{
                  display: "flex",
                  fontSize: 25,
                  color: "lightgray",
                  marginTop: 10,
                }}
              >
                {`Yes: ${round.yes !== 0 ? round.yes : "0"},
                  No: ${round.no !== 0 ? round.no : "0"}`}
              </div>
            </>
          )}
        </div>
      </div>
    ),
    intents: [
      !voted && <Button value="Yes">Yes</Button>,
      !voted && <Button value="No">No</Button>,
      voted && <Button value="Undo">Undo Vote</Button>,
      // <Button action="/select-round">Round selection</Button>,
    ],
  });
});

app.frame("/select-round", (c) => {
  return c.res({
    action: `/`,
    image: (
      <div
        style={{
          color: "white",
          fontSize: 60,
          fontStyle: "normal",
          letterSpacing: "-0.025em",
          lineHeight: 1.4,
          marginTop: 30,
          padding: "0 120px",
          whiteSpace: "pre-wrap",
        }}
      >
        Round selection
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter round Id..." />,
      <Button>GO TO ROUND</Button>,
    ],
  });
});

devtools(app, { serveStatic });

export const GET = handle(app);
export const POST = handle(app);

// NOTE: That if you are using the devtools and enable Edge Runtime, you will need to copy the devtools
// static assets to the public folder. You can do this by adding a script to your package.json:
// ```json
// {
//   scripts: {
//     "copy-static": "cp -r ./node_modules/frog/_lib/ui/.frog ./public/.frog"
//   }
// }
// ```
// Next, you'll want to set up the devtools to use the correct assets path:
// ```ts
// devtools(app, { assetsPath: '/.frog' })
// ```
