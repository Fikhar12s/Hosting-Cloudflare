@echo off
echo Mengirim request ke localhost:8787...
curl -X POST http://localhost:8787/kommo/incoming-message ^
     -H "Content-Type: application/json" ^
     -d @test_payload.json

echo.
echo ====================================
echo.
pause
