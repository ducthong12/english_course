@echo off
cd /d "%~dp0"
set PYTHONUTF8=1
if /i "%~1"=="admin" goto admin
python server.py --open
if errorlevel 1 pause
exit /b
:admin
python server.py --grant-admin
pause
