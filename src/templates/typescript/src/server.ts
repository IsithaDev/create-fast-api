import { createServer } from "node:http";
import dotenv from "dotenv";

import app from "./app";

dotenv.config({ path: ".env.local" });

const port = process.env.PORT || 3000;

const server = createServer(app);

server.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
