import dotenv from "dotenv"
dotenv.config()
import express from "express";
import ViteExpress from "vite-express";
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

const proxyMiddleware = createProxyMiddleware<Request, Response>({
  target: 'https://api.openphone.com/v1/',
  changeOrigin: true,
  pathRewrite: {'^/openphone-api' : ''},
  on: {
    proxyReq: (proxyReq, req, res) => {
      /* handle proxyReq */
      proxyReq.setHeader('Authorization', process.env.OPENPHONE_API_KEY as string);
    },
  }
});

app.use('/openphone-api', proxyMiddleware);

app.get("/hello", (_, res) => {
  res.send("Hello Vite + React + TypeScript!");
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000..."),
);
