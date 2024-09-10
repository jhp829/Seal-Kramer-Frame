/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
import { neynar, pinata } from "frog/hubs";
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { getRoundById } from "../services/roundService";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  hub: pinata(),
  title: "Frog Frame",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

// app.frame("/", (c) => {
//   return c.res({
//     action: "/round",
//     image: <div>DEFAULT PAGE</div>,
//     intents: [<Button>GO TO ROUND</Button>],
//   });
// });

app.frame("/", async (c) => {
  const { frameData, verified } = c;
  const roundId = frameData?.inputText || "1";

  console.log("roundID", roundId);

  const round = await getRoundById(Number(roundId));

  return c.res({
    action: "/select-round",
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
          <div style={{ display: "flex", fontSize: 25, color: "lightgray" }}>
            {`Positions ${verified ? "YES" : "NO"} ${
              frameData?.fid ? frameData.fid : "NO ID"
            }`}
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
        </div>
      </div>
    ),
    intents: [
      <Button value="Yes">Yes</Button>,
      <Button value="No">No</Button>,
      <Button>Round selection</Button>,
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
