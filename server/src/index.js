import dotenv from "dotenv";
import { fileURLToPath } from "url";

// server/.env, regardless of the folder the command is run from
dotenv.config({ path: fileURLToPath(new URL("../.env", import.meta.url)) });
import app from "./app.js";

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`);
  console.log(`Jawek zabour`);
});
