# Mistral Chat App

Minimal chat web app that calls the Mistral API with the official TypeScript SDK
([`@mistralai/mistralai`](https://www.npmjs.com/package/@mistralai/mistralai)).
The API key stays on the server; the browser only talks to the local backend.

## Prerequisites

- Node.js 18 or newer
- A Mistral API key from [console.mistral.ai](https://console.mistral.ai)

## Install dependencies

```bash
npm install
```

## Configure the API key

```bash
cp .env.example .env
```

Then edit `.env` and set `MISTRAL_API_KEY` to your key. `.env` is git-ignored and
is never sent to the browser.

## Run locally

Development (auto-reload on file changes):

```bash
npm run dev
```

Production-style build and run:

```bash
npm run build
npm start
```

Then open <http://localhost:3000> and start chatting.

## How it works

- `src/server.ts` — Express server. Serves `public/` and exposes `POST /api/chat`,
  which forwards the message history to `mistral-small-latest` via the official SDK
  using `MISTRAL_API_KEY` from the environment.
- `public/index.html` — plain HTML/JS chat UI that POSTs the conversation to
  `/api/chat` and renders the replies.

## Useful commands

```bash
npm run typecheck   # TypeScript check without emitting files
```
