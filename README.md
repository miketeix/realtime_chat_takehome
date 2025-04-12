# OpenPhone Realtime Chat Challenge

Built with the `express-vite` template, the OpenPhone API (including webhooks), server-sent events (SSE), and utilities like `react-query`and `tailwind css`, this showcase seeks to demonstrate how two conversing chat windows would update in realtime -- make sure your sound is on for the awesome sound effects! 
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
- Vite - chosen for quick loading and HMR while developing
- React Query - a comprehensive query library for react with cacheing, pagination, status flags that can be wrapped nicely in hook.
- Side-by-side chats - simply for demo purposes.
- Node / Express - chosen for persistent connection for SSE, easy to use proxy libraries, event emitters.
- Webhook created on server launch to accomodate dynamically created nGrok tunnel.
- EventEmitter used to efficiently communicate between two independent route handlers

## Limitations/Assumptions
- Optimistally adding sent message to cache for speedy/fluid UX. There is a way to refetch only targeted paged (e.g. the first page), but because the contents of the first page changes, it invalidates the rest of the pages in the cache and you'd be forced to fetch all of them again.
- SSE pushing to frontend of webhook "new messages" is a workaround to there not being any real-time websocket offerings on the Openphone API
- Unable to have "typing..." indicator with existing API and SMS tech in general

## Nice-to-haves / Improvements / ToDos
- Virtualization of chat messages when out of view (render only messageBubble components in messageList that are within view)
- Some sort of loader or visual indication to make the "nextPage" load a little more satisfying
- Better error state visuals
- Retry on failed message send
- Implement placeholder UI: phone call, contact info and avatar image, attachments, emojis
- Authentication


## Screenshots
- Date Dividers
  <img width="503" alt="Screenshot 2025-04-06 at 5 15 52 PM" src="https://github.com/user-attachments/assets/f5c236bd-6b69-44ab-9d03-d6469f5699ed" />

- Unsent Message
  <img width="450" alt="Screenshot 2025-04-06 at 4 14 00 PM" src="https://github.com/user-attachments/assets/52e9c7d1-e463-4792-8765-f61f1fb07712" />

- UI
<img width="1389" alt="Screenshot 2025-04-07 at 3 18 39 AM" src="https://github.com/user-attachments/assets/2fa93811-76a8-43c1-80e9-fa427acb1e46" />
