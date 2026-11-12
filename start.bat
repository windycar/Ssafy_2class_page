@echo off
setlocal
cd /d "%~dp0"

set "NODE_OPTIONS=--no-deprecation"

where node >nul 2>&1
if errorlevel 1 goto :node_error

where corepack >nul 2>&1
if errorlevel 1 (
  where npx >nul 2>&1
  if errorlevel 1 goto :package_manager_error
  set "PNPM_COMMAND=npx --yes pnpm@11.19.0"
) else (
  set "PNPM_COMMAND=corepack pnpm"
)

if exist "node_modules\.bin\vite.cmd" goto :start

echo Installing project dependencies...
call %PNPM_COMMAND% install --frozen-lockfile
if errorlevel 1 goto :install_error

:start
call %PNPM_COMMAND% dev --open
if errorlevel 1 goto :run_error
goto :end

:node_error
echo Node.js is not installed or is not in PATH. Install Node.js and try again.
pause
goto :end

:package_manager_error
echo Neither Corepack nor npx was found. Reinstall Node.js with npm and try again.
pause
goto :end

:install_error
echo.
echo Dependency installation failed.
echo Review the pnpm error above. If it reports a network error, check your connection.
pause
goto :end

:run_error
echo.
echo The development server could not start. Review the error above.
pause

:end
