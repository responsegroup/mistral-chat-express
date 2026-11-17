@echo off
setlocal
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed. Download it from https://nodejs.org then run this file again.
  pause
  exit /b 1
)
if not exist node_modules call npm install
if not exist .env (
  copy .env.example .env >nul
  echo Added .env - put your MISTRAL_API_KEY in it, then run this file again.
  pause
  exit /b 1
)
timeout /t 3 /nobreak >nul
start "" http://localhost:3000
call npx tsx src/server.ts
pause
