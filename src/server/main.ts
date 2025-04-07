import dotenv from "dotenv"
dotenv.config()
import axios from "axios";
import express from "express";
import ViteExpress from "vite-express";
import { createProxyMiddleware,  } from 'http-proxy-middleware';
import ngrok from 'ngrok';
import { MESSAGE_WEBHOOKS_API_URL, OPENPHONE_BASE_URL, PROXY_API_PATH, SERVER_EVENTS_PATH, WEBHOOKS_API_URL,  } from "../client/utilities/constants.js";
import { Message } from "../client/types/index.js";

const port = 3000;

(async function () {
  
  const app = express();

  const APP_WEBHOOK_PATH = '/webhook';
  const NEW_MESSAGE_EVENT_NAME = 'new-message';

  const tunnelUrl = await ngrok.connect({ authtoken: process.env.NGROK_API_KEY, addr: port }); // Connects to port 8080
  const { data: { data: {id: webhookId} } } = await axios.post(MESSAGE_WEBHOOKS_API_URL, {
    events: ['message.delivered'],
    url: `${tunnelUrl}${APP_WEBHOOK_PATH}`,
    label: "Mike T's Message Webook"
  }, {
    headers: {
      "Authorization": process.env.OPENPHONE_API_KEY
    }
  });

  const jsonBodyParser = express.json();
  app.post(APP_WEBHOOK_PATH, jsonBodyParser, (req, res) => {
    const { data: { object: message}} = req.body;
    app.emit(NEW_MESSAGE_EVENT_NAME, message);
    res.send("OK");
  });
  

  const proxyMiddleware = createProxyMiddleware({
    target:  OPENPHONE_BASE_URL,
    changeOrigin: true,
    pathRewrite: { [`^${PROXY_API_PATH}`]: '' },
    on: {
      proxyReq: (proxyReq, req, res) => {
        proxyReq.setHeader('Authorization', process.env.OPENPHONE_API_KEY as string);
      }
    }
  });

  app.use(PROXY_API_PATH, proxyMiddleware as express.RequestHandler);

  app.get(SERVER_EVENTS_PATH, (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
  
    app.on(NEW_MESSAGE_EVENT_NAME, (newMessage: any)=> {
      const { from } = req.query;
      if (from === newMessage?.from ) {
        res.write(`data: ${JSON.stringify(newMessage)}\n\n`);
      }
    });
    
    req.on('close', () => {
      res.end();
    });
  })


  ViteExpress.listen(app, port, () =>
    console.log(`Server is listening on port ${port}...`),
  );

  process.on('SIGINT', async function() {
    console.log('Shut down gracefully');
    try {
      app.removeAllListeners();
      console.log('Deleting webhook: ', webhookId);
      const response = await axios.delete(`${WEBHOOKS_API_URL}/${webhookId}`, {
        headers: {
          "Authorization": process.env.OPENPHONE_API_KEY
        }
      });
      await ngrok.disconnect();
    } catch (error: any) {
      console.log(error?.message)
      process.exit(1);
    } finally {
      process.exit(0);
    }
    
});

})();