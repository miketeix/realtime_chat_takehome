# OpenPhone Realtime Chat Challenge

Built with the `express-vite` template, the OpenPhone API (including webhooks), server-side events (SSE), and utilities like `react-query`and `tailwind css`, this showcase seeks to demonstrate how two conversing chat windows would update in realtime -- make sure your sound is on for the awesome sound effects! 
Thanks,

\- Michael Teixeira

## Dev Setup


#### 1. Create `.env` at root with OpenPhone & Ngrok* API keys following example of `sample.env`. 
*Sign up with ngrok and visit their [dashboard](https://dashboard.ngrok.com/get-started/your-authtoken) for API key
```
OPENPHONE_API_KEY=""
NGROK_API_KEY=""
```

#### 2. Install dependencies 
```
yarn install
```
#### 3. Run locally 
```
yarn dev
```
#### 4. Navigate to [localhost](http://localhost:3000) in browser 
```
http://localhost:3000
```
---

#### Build 
```
yarn build
```
#### Test 
```
yarn test
```

## Architecture
-  Vite - chosen for quick loading and HMR while developing
- React Query - a comprehensive query library for react with cacheing, pagination, status flags that can be wrapped nicely in hook.
- Side-by-side chats - simply for demo purposes.
- Node / Express - chosen for persistent connection for SSE, easy to use proxy libraries, event emitters.
- Webhook created on server launch to accomodate dynamically created nGrok tunnel.
- EventEmitter used to efficiently communicate between two independent route handlers

## Limitations/Assumptions
- Optimistally adding sent message to cache for speedy/fluid UX. There is a way to refetch only certain namespaced pages, however because there is no "previousPageCursor" in the API, you would inevitably have to refetch all pages.
- SSE pushing to frontend of webhook "new messages" is a workaround to there not being any real-time websocket offerings on the Openphone API
- Unable to have "typing..." indicator with existing API and SMS tech in general

## Nice-to-haves / Improvements / ToDos
- Some sort of loader or visual indication to make the "nextPage" load a little more satisfying
- Better error state visuals


## Screenshots
- Date Dividers
- Unsent Message
- UI
