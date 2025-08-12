import express from "express";
import compression from "compression";
import { Server } from "http";
import { getConfig } from "@/config";
import { gracefulShutdown } from "@/utils/shutdown";
import { connectMongo } from "@/db";
import { MenuModel } from "@/db/schema/menu.schema";
import routes from "@/routes";

// bootstrap phase
const config = getConfig();
connectMongo(config.MONGODB_URI);

let server: Server;
const app = express();
const port = Number(config.APP_PORT) || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.disable("x-powered-by");

app.use("/", routes);

app.use((req, res) => {
  res.status(404).json({ message: "Not Found" });
});

server = app.listen(port, () => {
  const lines = [
    `\x1b[32m✓\x1b[0m Server running`,
    `http://localhost:${port}`,
    `Environment: \x1b[33m${config.APP_ENV || "development"}\x1b[0m`,
  ];

  const w = Math.max(
    ...lines.map((l) => l.replace(/\x1b\[[0-9;]*m/g, "").length)
  );
  const pad = (txt: string) =>
    txt + " ".repeat(w - txt.replace(/\x1b\[[0-9;]*m/g, "").length);

  console.log(`\x1b[36m╭${"─".repeat(w + 2)}╮\x1b[0m`);
  lines.forEach((l) =>
    console.log(`\x1b[36m│\x1b[0m ${pad(l)} \x1b[36m│\x1b[0m`)
  );
  console.log(`\x1b[36m╰${"─".repeat(w + 2)}╯\x1b[0m`);
  console.log(`\x1b[90mPress Ctrl+C to stop\x1b[0m\n`);
});

process.on("SIGTERM", () => gracefulShutdown("SIGTERM", server));
process.on("SIGINT", () => gracefulShutdown("SIGINT", server));
process.on("uncaughtException", () =>
  gracefulShutdown("uncaughtException", server)
);
process.on("unhandledRejection", () =>
  gracefulShutdown("unhandledRejection", server)
);