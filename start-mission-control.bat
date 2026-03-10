@echo off
echo Starting Mission Control Server...
echo.
echo Mission Control will be available at:
echo http://localhost:8080/mission-control.html
echo.
echo Press Ctrl+C to stop the server
echo.
cd /d "%~dp0"
python -m http.server 8080