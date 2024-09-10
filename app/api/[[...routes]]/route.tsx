/** @jsxImportSource frog/jsx */

import { Button, Frog, TextInput } from "frog";
import { devtools } from "frog/dev";
// import { neynar } from 'frog/hubs'
import { handle } from "frog/next";
import { serveStatic } from "frog/serve-static";
import { getRoundById } from "../services/roundService";

// import { getRoundById } from "../services/roundService";

const app = new Frog({
  assetsPath: "/",
  basePath: "/api",
  // Supply a Hub to enable frame verification.
  // hub: neynar({ apiKey: 'NEYNAR_FROG_FM' })
  title: "Frog Frame",
});

// Uncomment to use Edge Runtime
// export const runtime = 'edge'

app.frame("/", (c) => {
  const { buttonValue, inputText, status } = c;
  const fruit = inputText || buttonValue;
  return c.res({
    action: "/second",
    image: (
      <div
        style={{
          alignItems: "center",
          background:
            status === "response"
              ? "linear-gradient(to right, #432889, #17101F)"
              : "black",
          backgroundSize: "100% 100%",
          display: "flex",
          flexDirection: "column",
          flexWrap: "nowrap",
          height: "100%",
          justifyContent: "center",
          textAlign: "center",
          width: "100%",
        }}
      >
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
          {status === "response"
            ? `Nice choice.${fruit ? ` ${fruit.toUpperCase()}!!` : ""}`
            : "Welcome!"}
        </div>
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter your favorite movie..." />,
      <Button value="Yes">Yes</Button>,
      <Button value="No">No</Button>,
      <Button>GO TO ROUND SELECTION</Button>,
      status === "response" && <Button.Reset>Reset</Button.Reset>,
    ],
  });
});

app.frame("/second", (c) => {
  return c.res({
    action: `/round`,
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
        WELCOME TO THE SECOND FRAME
      </div>
    ),
    intents: [
      <TextInput placeholder="Enter round Id..." />,
      <Button>GO TO ROUND</Button>,
    ],
  });
});

app.frame("/round", async (c) => {
  const { frameData } = c;
  console.log("frameData", frameData);
  const roundId = frameData?.inputText;

  console.log("roundId", roundId);

  const round = await getRoundById(Number(roundId));
  return c.res({
    action: "/",
    image: (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh", // Full viewport height to center the content
          backgroundColor: "white", // White background
          textAlign: "center",
          width: "100%", // Full width
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column", // Stack items vertically
            justifyContent: "center", // Center content vertically
            alignItems: "center", // Center content horizontally
            height: "70%", // Adjust height to fit content
            width: "50%", // Adjust width to fit content
            background: "rgba(0, 0, 0, 0.7)", // Semi-transparent black background
            color: "white", // White text for contrast
            padding: "30px", // Increased padding for more space
            borderRadius: "15px", // Larger radius for smoother corners
            textAlign: "center", // Center the text
          }}
        >
          <div style={{ fontSize: 40, marginBottom: 30 }}>{round.question}</div>
          <div style={{ display: "flex", fontSize: 30, color: "lightgray" }}>
            {`Total Votes: ${
              round.yes + round.no !== 0 ? round.yes + round.no : "0"
            }`}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 30,
              color: "lightgray",
              marginTop: 10,
            }}
          >
            {`Yes: ${round.yes !== 0 ? round.yes : "0"},
              No: ${round.no !== 0 ? round.no : "0"})`}
          </div>
        </div>
      </div>
    ),
    intents: [
      <Button value="Yes">Yes</Button>,
      <Button value="No">No</Button>,
      <Button>START OVER</Button>,
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
