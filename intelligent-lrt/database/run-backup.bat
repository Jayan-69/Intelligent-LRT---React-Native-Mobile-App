@echo off
echo Starting database backup...
cd /d "%~dp0"
node backup-database.js
pause 