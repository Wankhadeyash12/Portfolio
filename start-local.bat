@echo off
cd /d "%~dp0"
start "Backend" cmd /k "cd server && npm run dev"
start "Frontend" cmd /k "cd client && npm run dev -- --host 0.0.0.0"
echo Started local portfolio servers.
echo Open http://localhost:5173
pause
