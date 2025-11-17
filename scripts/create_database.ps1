<#
Runs the SQL in scripts/create_database.sql using the local mysql client.
Usage: Open PowerShell and run this script as a user that can run mysql client.
You will be prompted for the MySQL root password.
#>

# Determine project root (parent of scripts)
$projectRoot = Split-Path $PSScriptRoot -Parent

# Load .env if present to pick DB settings
$envFile = Join-Path $projectRoot '.env'
$dbName = 'bookingdb'
$dbUser = 'appuser'
$dbPass = 'apppassword'
$dbHost = '127.0.0.1'
if (Test-Path $envFile) {
    Get-Content $envFile | ForEach-Object {
        if ($_ -match '^\s*DB_NAME\s*=\s*(.+)') { $dbName = $matches[1].Trim() }
        if ($_ -match '^\s*DB_USER\s*=\s*(.+)') { $dbUser = $matches[1].Trim() }
        if ($_ -match '^\s*DB_PASS\s*=\s*(.+)') { $dbPass = $matches[1].Trim() }
        if ($_ -match '^\s*DB_HOST\s*=\s*(.+)') { $dbHost = $matches[1].Trim() }
    }
} else {
    Write-Host "No .env found at $envFile — using defaults." -ForegroundColor Yellow
}

# Decide host part for CREATE USER: if DB_HOST is 'db' (docker service), create user@'%' so containers can connect.
$userHost = if ($dbHost -eq 'db') { '%' } elseif ($dbHost -eq '127.0.0.1' -or $dbHost -eq 'localhost') { 'localhost' } else { '%' }

# Check mysql client
$mysql = Get-Command mysql -ErrorAction SilentlyContinue
if (-not $mysql) {
    Write-Host "mysql client not found in PATH. Please install MySQL client or MySQL Server and ensure 'mysql' is in PATH." -ForegroundColor Yellow
    exit 1
}

$rootUser = Read-Host "Enter MySQL root user (default 'root')"
if ([string]::IsNullOrWhiteSpace($rootUser)) { $rootUser = 'root' }
$rootPass = Read-Host "Enter password for $rootUser (will be hidden)" -AsSecureString
$plainPass = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($rootPass))

# Build SQL content dynamically using values from .env
$sql = @"
CREATE DATABASE IF NOT EXISTS `$dbName` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS '$dbUser'@'$userHost' IDENTIFIED BY '$dbPass';
GRANT ALL PRIVILEGES ON `$dbName`.* TO '$dbUser'@'$userHost';
FLUSH PRIVILEGES;
"@

# Write to a temp file and execute
$tmp = [System.IO.Path]::Combine($env:TEMP, [System.IO.Path]::GetRandomFileName() + '.sql')
Set-Content -Path $tmp -Value $sql -Encoding UTF8

& mysql -u $rootUser -p$plainPass < $tmp

if ($LASTEXITCODE -eq 0) {
    Write-Host "Database '$dbName' and user '$dbUser'@'$userHost' created/updated successfully." -ForegroundColor Green
    Remove-Item $tmp -ErrorAction SilentlyContinue
    exit 0
} else {
    Write-Error "mysql exited with code $LASTEXITCODE"
    Remove-Item $tmp -ErrorAction SilentlyContinue
    exit $LASTEXITCODE
}
