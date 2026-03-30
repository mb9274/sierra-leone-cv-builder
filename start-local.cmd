@echo off
setlocal
cd /d "%~dp0"
set "LISTENING_PID="
for /f "tokens=5" %%P in ('netstat -ano ^| findstr /R /C:":3000 .*LISTENING"') do set "LISTENING_PID=%%P"
if defined LISTENING_PID (
  echo AI CV Builder is already running on http://127.0.0.1:3000
  exit /b 0
)
if not exist ".next\BUILD_ID" (
  echo Production build not found.
  echo Building the app first...
  call "C:\Program Files\nodejs\npm.cmd" run build
  if errorlevel 1 (
    echo Build failed.
    pause
    exit /b 1
  )
)
echo Starting AI CV Builder on http://127.0.0.1:3000
call "C:\Program Files\nodejs\npm.cmd" run start
echo.
echo The server stopped or failed to start.
pause
