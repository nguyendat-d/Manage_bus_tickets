# fix-booking-database.ps1
# Script to fix the bookings table schema

Write-Host "=== FIX BOOKING DATABASE SCHEMA ===" -ForegroundColor Green
Write-Host ""

$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"
$sqlFile = "backend\database\fix_bookings_schema.sql"

# Check if MySQL exists
if (-not (Test-Path $mysqlPath)) {
    Write-Host "ERROR: MySQL not found at: $mysqlPath" -ForegroundColor Red
    Write-Host "Please install MySQL or update the path in this script." -ForegroundColor Yellow
    exit 1
}

# Check if SQL file exists
if (-not (Test-Path $sqlFile)) {
    Write-Host "ERROR: SQL file not found: $sqlFile" -ForegroundColor Red
    exit 1
}

Write-Host "MySQL found: $mysqlPath" -ForegroundColor Cyan
Write-Host "SQL file: $sqlFile" -ForegroundColor Cyan
Write-Host ""
Write-Host "Please enter your MySQL root password when prompted..." -ForegroundColor Yellow
Write-Host ""

# Run the SQL script
try {
    & $mysqlPath -u root -p --database=bus_ticket_management < $sqlFile
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ Database schema fixed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Cyan
        Write-Host "1. Restart your backend server (npm start)" -ForegroundColor White
        Write-Host "2. Test the booking function in your app" -ForegroundColor White
        Write-Host ""
    } else {
        Write-Host ""
        Write-Host "❌ Error running SQL script. Exit code: $LASTEXITCODE" -ForegroundColor Red
        Write-Host "Please check your MySQL password and try again." -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
