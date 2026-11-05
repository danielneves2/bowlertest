@echo off
title BOWLER TEST - servidor local
cd /d "%~dp0"
where node >/dev/null 2>nul
if errorlevel 1 (
  echo Node.js nao encontrado. Instale em https://nodejs.org e tente de novo.
  pause
  exit /b 1
)
echo Iniciando BOWLER TEST em http://127.0.0.1:4173
echo Feche esta janela para parar o servidor.
start "" cmd /c "timeout /t 2 /nobreak >/dev/null & start http://127.0.0.1:4173"
call npm run dev
pause
