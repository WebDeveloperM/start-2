@echo off
rem Tadbir uchun: Chrome to'liq ekranda, manzil satrisiz ochiladi.
rem Chiqish: Alt+F4. Qayta boshlash: F5.

set "CHROME=%ProgramFiles%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%ProgramFiles(x86)%\Google\Chrome\Application\chrome.exe"
if not exist "%CHROME%" set "CHROME=%LocalAppData%\Google\Chrome\Application\chrome.exe"

start "" "%CHROME%" --kiosk --user-data-dir="%TEMP%\proyekt-start" --no-first-run --no-default-browser-check --disable-pinch --overscroll-history-navigation=0 %* "%~dp0index.html"
