#!/bin/bash
cd "$(dirname "$0")"

if ! command -v node >/dev/null 2>&1; then
  echo "Node.js is not installed. Download it from https://nodejs.org then run this file again."
  exit 1
fi

[ -d node_modules ] || npm install

if [ ! -f .env ]; then
  cp .env.example .env
  echo "Added .env - put your MISTRAL_API_KEY in it, then run this file again."
  exit 1
fi

sleep 1
open http://localhost:3000 2>/dev/null || xdg-open http://localhost:3000 2>/dev/null &
sleep 2
npx tsx src/server.ts
