# Quick Start Development Servers
# Run this script to start both backend and frontend

Write-Host "🚀 Starting Bus Ticket Management System..." -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js detected: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found! Please install Node.js first." -ForegroundColor Red
    exit 1
}

# Start Backend Server
Write-Host ""
Write-Host "📦 Starting Backend Server..." -ForegroundColor Yellow
$backendPath = Join-Path $PSScriptRoot "backend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Backend Server' -ForegroundColor Cyan; node app.js"

# Wait a bit for backend to start
Start-Sleep -Seconds 3

# Start Frontend Server
Write-Host "🎨 Starting Frontend Server..." -ForegroundColor Yellow
$frontendPath = Join-Path $PSScriptRoot "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; Write-Host '🖥️  Frontend Server' -ForegroundColor Cyan; npm run dev"

Write-Host ""
Write-Host "✅ Servers are starting!" -ForegroundColor Green
Write-Host ""
Write-Host "📍 Access points:" -ForegroundColor Cyan
Write-Host "   Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "   Frontend: http://localhost:3001" -ForegroundColor White
Write-Host ""
Write-Host "📝 Admin credentials:" -ForegroundColor Cyan
Write-Host "   Email:    admin@bus.com" -ForegroundColor White
Write-Host "   Password: Admin123456" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Note: Email service errors are normal (system works without email)" -ForegroundColor Yellow
Write-Host ""
Write-Host "Press any key to close this window..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
