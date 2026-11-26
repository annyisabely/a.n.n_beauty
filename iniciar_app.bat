@echo off
cd /d "%~dp0"
echo Iniciando GlowAI + Beleza na Web...
start cmd /k node proxy.js
timeout /t 2
start http://localhost:5500

