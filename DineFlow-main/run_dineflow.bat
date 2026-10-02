@echo off
setlocal
title DineFlow - Restaurant Management System
echo ========================================================
echo   Starting DineFlow Backend and Frontend Web App
echo ========================================================
echo.
echo Starting FastAPI on 127.0.0.1:8000...
start "DineFlow Backend" cmd /k "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000"

for /L %%i in (1,1,30) do (
	powershell -NoProfile -Command "try { Invoke-RestMethod -Uri 'http://127.0.0.1:8000/health' -TimeoutSec 1 | Out-Null; exit 0 } catch { exit 1 }" >nul 2>&1
	if not errorlevel 1 goto backend_ready
	timeout /t 1 /nobreak >nul
)

echo Backend did not become healthy within 30 seconds. Check the DineFlow Backend window.
exit /b 1

:backend_ready
echo Backend is ready. Opening the React application...
start "" http://127.0.0.1:8000/app/
