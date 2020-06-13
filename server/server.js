const express = require("express");
const http = require("http");
const app = express();

if (process.env.NODE_ENV === "development") {
  const Bundler = require("parcel-bundler");
  const bundler = new Bundler("client/index.html");
  app.use(bundler.middleware());
} else {
  app.use(express.static("dist"));
}

const server = http.createServer(app);

module.exports = server;
