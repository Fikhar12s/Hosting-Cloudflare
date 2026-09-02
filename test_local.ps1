try {
    $json = Get-Content -Raw "test_payload.json"
    $response = Invoke-RestMethod -Uri "http://127.0.0.1:8787/kommo/incoming-message" -Method POST -ContentType "application/json" -Body $json
    Write-Host "✅ Berhasil Mengirim Webhook!" -ForegroundColor Green
    Write-Host "Respons dari Worker:"
    $response | ConvertTo-Json -Depth 5 | Write-Host
} catch {
    Write-Host "❌ Gagal Mengirim Webhook!" -ForegroundColor Red
    Write-Host $_.Exception.Message
}

Write-Host "`nTekan tombol apa saja untuk menutup jendela ini..."
$null = $Host.UI.RawUI.ReadKey('NoEcho,IncludeKeyDown')
