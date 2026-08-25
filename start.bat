@echo off
setlocal
cd /d "%~dp0"

set "NODE_OPTIONS=--no-deprecation"

if exist "node_modules\.bin\vite.cmd" goto :start

echo Installing project dependencies...
call corepack pnpm install --frozen-lockfile
if not errorlevel 1 goto :start

echo.
echo Lockfile configuration changed. Refreshing pnpm-lock.yaml...
call corepack pnpm install --no-frozen-lockfile
if errorlevel 1 goto :install_error

:start
call corepack pnpm dev --open
if errorlevel 1 goto :run_error
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
