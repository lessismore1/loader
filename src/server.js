import http from "http";
import express from "express";
import bodyParser from "body-parser";
import path from "path";

import { server, env } from "decentraland-commons";
import db from "./lib/db";

env.load();

const SERVER_PORT = env.get("SERVER_PORT", 5000);
const app = express();
const httpServer = http.Server(app);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

if (env.isProduction()) {
  const webappPath = env.get(
    "WEBAPP_PATH",
    path.join(__dirname, "..", "webapp/build")
  );

  app.use("/", express.static(webappPath, { extensions: ["html"] }));
} else {
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Request-Method", "*");
    res.setHeader("Access-Control-Allow-Methods", "OPTIONS, GET");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    next();
  });
}

app.post(
  "/api/test",
  server.handleRequest(async (req, res) => {
    // const param = server.extractFromReq(req, 'param')
    return "success";
  })
);

httpServer.listen(SERVER_PORT, () =>
  console.log("Server running on port", SERVER_PORT)
);
