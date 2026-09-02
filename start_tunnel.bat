@echo off
echo ========================================================
echo Membuka Terowongan (Tunnel) dari Kommo ke Localhost...
echo ========================================================
echo.
echo Jika muncul peringatan Firewall, klik "Allow" / "Izinkan".
echo Tunggu beberapa saat sampai muncul URL berawalan https://
echo yang berakhiran .trycloudflare.com
echo.
echo URL tersebut adalah Webhook URL Anda! Salin URL itu ke Kommo.
echo.
"%~dp0cloudflared.exe" tunnel --url http://localhost:8787
pause
