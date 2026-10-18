@echo off
setlocal
cd /d "%~dp0"
rem === Salva as alteracoes (commit) e sobe para o GitHub ===
rem Uso: duplo clique (pergunta a mensagem) ou:  salvar.bat "o que mudou"
if not defined REPO_URL set "REPO_URL=https://github.com/danielneves2/bowlertest.git"

where git >nul 2>nul || (echo Git nao encontrado. Instale em https://git-scm.com & goto :fim)
if not exist ".git" (echo Projeto ainda nao foi enviado. Rode subir.bat primeiro. & goto :fim)

git add -A || goto :erro
git diff --cached --quiet
if not errorlevel 1 (
  echo Nenhuma alteracao nova. Verificando se ha algo pendente para enviar...
  goto :push
)

set "MSG=%~1"
if not defined MSG set /p "MSG=O que mudou? (Enter = data e hora): "
if not defined MSG set "MSG=Atualizacao %date% %time:~0,5%"
git commit -m "%MSG%" || goto :erro

:push
git push origin main || goto :erro
echo.
echo Pronto! Alteracoes no GitHub.
goto :fim

:erro
echo.
echo *** Algo deu errado (veja a mensagem acima). Nada foi apagado nem forcado. ***
:fim
echo.
pause
