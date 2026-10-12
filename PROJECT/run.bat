@echo off
title CineMatch - Recommendation Engine Server
echo ==========================================================
echo   CineMatch - Movie Recommendation Engine (DSA-3)
echo ==========================================================
echo.
echo 1. Checking MongoDB service...
sc query MongoDB | findstr "RUNNING" >nul
if %ERRORLEVEL% EQU 0 (
    echo [OK] MongoDB service is running.
) else (
    echo [INFO] Starting MongoDB service (or ensure local/Atlas Mongo is running)...
    net start MongoDB 2>nul
)

echo.
echo 2. Launching Java Spring Boot Backend on port 8080...
echo    Access URL: http://localhost:8080
echo    KEEP THIS WINDOW OPEN! (Press Ctrl+C only when you want to stop)
echo.
start "" "http://localhost:8080"
cd /d "%~dp0recommendation-engine\backend"
mvn spring-boot:run
pause
