@echo off
setlocal
cd /d "%~dp0"
if not exist ".next\BUILD_ID" (
  echo Production build not found.
  echo Run: npm.cmd run build
  pause
  exit /b 1
)
echo Starting AI CV Builder on http://127.0.0.1:3000
call "C:\Program Files\nodejs\npm.cmd" run start
echo.
echo The server stopped or failed to start.
pause
