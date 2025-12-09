# setup.ps1 - Automated setup script for Bus Ticket Management System (PowerShell)
# Run as: powershell -ExecutionPolicy Bypass -File setup.ps1

Write-Host "🚀 Bus Ticket Management System - Setup Script" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
Write-Host "📦 Checking Node.js..." -ForegroundColor Yellow
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}
$nodeVersion = & node --version
Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
Write-Host ""

# Check MySQL
Write-Host "🗄️  Checking MySQL..." -ForegroundColor Yellow
if (Get-Command mysql -ErrorAction SilentlyContinue) {
    Write-Host "✅ MySQL detected" -ForegroundColor Green
    $useDocker = $false
} else {
    Write-Host "⚠️  MySQL not found. Using Docker for MySQL setup..." -ForegroundColor Yellow
    $useDocker = $true
}
Write-Host ""

# Setup Backend
Write-Host "🔧 Setting up Backend..." -ForegroundColor Cyan
Push-Location backend
Write-Host "📥 Installing backend dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
Pop-Location
Write-Host ""

# Setup Frontend
Write-Host "🎨 Setting up Frontend..." -ForegroundColor Cyan
Push-Location frontend
Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
npm install --legacy-peer-deps
Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
Pop-Location
Write-Host ""

# Database Setup
Write-Host "🗄️  Setting up Database..." -ForegroundColor Yellow
if ($useDocker) {
    Write-Host "🐳 Starting MySQL with Docker..." -ForegroundColor Yellow
    $existingContainer = & docker ps -a -q -f name=mysql_bus 2>$null
    if ($existingContainer) {
        Write-Host "Removing existing MySQL container..." -ForegroundColor Yellow
        docker rm -f mysql_bus 2>$null
    }
    
    docker run -d `
        --name mysql_bus `
        -e MYSQL_ROOT_PASSWORD=thanhdat12345 `
        -e MYSQL_DATABASE=bus_ticket_management `
        -p 3306:3306 `
        mysql:8.0
    
    Write-Host "⏳ Waiting for MySQL to be ready (30s)..." -ForegroundColor Yellow
    Start-Sleep -Seconds 30
}

Write-Host "📝 Creating database schema..." -ForegroundColor Yellow

# Try to run schema
try {
    $schemaPath = Join-Path $PSScriptRoot "backend\database\schema.sql"
    Get-Content $schemaPath | & mysql -h 127.0.0.1 -u root -pthanhdat12345 bus_ticket_management
    Write-Host "✅ Database schema created" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Could not create schema automatically. Please run manually:" -ForegroundColor Yellow
    Write-Host "mysql -u root -pthanhdat12345 bus_ticket_management < backend/database/schema.sql" -ForegroundColor White
}
Write-Host ""

Write-Host "✨ Setup Complete!" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Green
Write-Host ""
Write-Host "Terminal 1 - Backend:" -ForegroundColor White
Write-Host "  cd backend; npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Terminal 2 - Frontend:" -ForegroundColor White
Write-Host "  cd frontend; npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "Then visit: http://localhost:5173" -ForegroundColor Cyan
Write-Host ""
