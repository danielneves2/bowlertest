@echo off
setlocal
cd /d "%~dp0"
rem === Primeiro envio do projeto para o GitHub (pode rodar de novo sem problema) ===
if not defined REPO_URL set "REPO_URL=https://github.com/danielneves2/bowlertest.git"

where git >nul 2>nul || (echo Git nao encontrado. Instale em https://git-scm.com & goto :fim)

rem Esta pasta fica dentro de outro repositorio (Desktop): so vale o .git da propria pasta.
if not exist ".git" (
  echo Criando repositorio Git nesta pasta...
  git init || goto :erro
)
git branch -M main || goto :erro

git remote get-url origin >nul 2>nul
if errorlevel 1 (git remote add origin "%REPO_URL%") else (git remote set-url origin "%REPO_URL%")
if errorlevel 1 goto :erro

git add -A || goto :erro
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "first commit" || goto :erro
) else (
  echo Nada novo para salvar; enviando o que ja esta commitado.
)

echo Enviando para %REPO_URL% ...
git push -u origin main || goto :erro
echo.
echo Pronto! Projeto enviado. Para os proximos envios use salvar.bat
goto :fim

:erro
echo.
echo *** Algo deu errado (veja a mensagem acima). Nada foi apagado nem forcado. ***
echo Se o GitHub recusou por ja ter conteudo no repositorio, me avise antes de tentar de novo.
:fim
echo.
pause
