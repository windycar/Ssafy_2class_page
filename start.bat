@echo off
setlocal
cd /d "%~dp0"

call corepack pnpm install --frozen-lockfile
if errorlevel 1 goto :error

call corepack pnpm dev --open
if errorlevel 1 goto :error
goto :end

:error
echo.
echo Setup failed. Check your internet connection and run start.bat again.
pause

:end
