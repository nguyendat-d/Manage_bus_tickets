# Start Backend Server
Set-Location F:\cacduan\Manage_bus_tickets\backend
Write-Host "Starting Bus Ticket Backend Server..." -ForegroundColor Green
Write-Host "Location: $(Get-Location)" -ForegroundColor Yellow
node app.js
