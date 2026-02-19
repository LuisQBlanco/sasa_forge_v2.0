@echo off
setlocal
cd /d "%~dp0"

docker --version >nul 2>&1
if errorlevel 1 (
  echo Docker is not installed or not available in PATH.
  pause
  exit /b 1
)

docker compose version >nul 2>&1
if errorlevel 1 (
  echo Docker Compose plugin is not available.
  pause
  exit /b 1
)

echo Building and starting SASA Forge prod-like stack...
docker compose -f infra\docker-compose.prod.yml up -d --build
set EXIT_CODE=%ERRORLEVEL%

echo.
if not "%EXIT_CODE%"=="0" (
  echo Failed to start prod-like stack. Exit code: %EXIT_CODE%
  pause
  exit /b %EXIT_CODE%
)

echo Stack started.
echo Open:
echo   http://localhost/
echo   http://localhost/api/health
echo   http://localhost/api/docs
pause
exit /b 0
