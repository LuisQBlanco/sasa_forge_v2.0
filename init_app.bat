@echo off
setlocal ENABLEDELAYEDEXPANSION

cd /d "%~dp0"

echo [SASA Forge] Initializing app with Docker Compose...

where docker >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker CLI not found. Install Docker Desktop first.
  exit /b 1
)

docker info >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Docker engine is not running.
  echo         Start Docker Desktop and wait until it shows "Engine running".
  exit /b 1
)

if not exist "infra\docker-compose.yml" (
  echo [ERROR] Missing infra\docker-compose.yml
  exit /b 1
)

echo [SASA Forge] Building and starting containers...
docker compose -f infra\docker-compose.yml up --build -d
if errorlevel 1 (
  echo [ERROR] Failed to start containers.
  exit /b 1
)

echo [SASA Forge] Waiting for API...
powershell -NoProfile -Command "$ok=$false; for($i=0;$i -lt 60;$i++){ try { $r=Invoke-WebRequest -UseBasicParsing http://localhost:8000/health -TimeoutSec 2; if($r.StatusCode -eq 200){$ok=$true; break} } catch {}; Start-Sleep -Seconds 1 }; if(-not $ok){ exit 1 }"
if errorlevel 1 (
  echo [ERROR] API did not become ready at http://localhost:8000/health
  exit /b 1
)

echo [SASA Forge] Waiting for web app...
powershell -NoProfile -Command "$ok=$false; for($i=0;$i -lt 90;$i++){ try { $r=Invoke-WebRequest -UseBasicParsing http://localhost:3000 -TimeoutSec 2; if($r.StatusCode -ge 200 -and $r.StatusCode -lt 500){$ok=$true; break} } catch {}; Start-Sleep -Seconds 1 }; if(-not $ok){ exit 1 }"
if errorlevel 1 (
  echo [ERROR] Web app did not become ready at http://localhost:3000
  exit /b 1
)

echo.
echo [OK] Services started.
echo API Health: http://localhost:8000/health
echo Web App:    http://localhost:3000
echo To view logs: docker compose -f infra\docker-compose.yml logs -f
echo To stop:      docker compose -f infra\docker-compose.yml down

exit /b 0
