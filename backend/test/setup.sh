#!/bin/bash
# setup.sh - Automated setup script for Bus Ticket Management System

echo "🚀 Bus Ticket Management System - Setup Script"
echo "=============================================="
echo ""

# Check Node.js
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+"
    exit 1
fi
echo "✅ Node.js $(node -v) detected"
echo ""

# Check MySQL
echo "🗄️  Checking MySQL..."
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL not found. Using Docker for MySQL setup..."
    USE_DOCKER=true
else
    echo "✅ MySQL detected"
    USE_DOCKER=false
fi
echo ""

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend
echo "📥 Installing backend dependencies..."
npm install --legacy-peer-deps
echo "✅ Backend dependencies installed"
cd ..
echo ""

# Setup Frontend
echo "🎨 Setting up Frontend..."
cd frontend
echo "📥 Installing frontend dependencies..."
npm install --legacy-peer-deps
echo "✅ Frontend dependencies installed"
cd ..
echo ""

# Database Setup
echo "🗄️  Setting up Database..."
if [ "$USE_DOCKER" = true ]; then
    echo "🐳 Starting MySQL with Docker..."
    docker run -d \
        --name mysql_bus \
        -e MYSQL_ROOT_PASSWORD=thanhdat12345 \
        -e MYSQL_DATABASE=bus_ticket_management \
        -p 3306:3306 \
        mysql:8.0
    
    echo "⏳ Waiting for MySQL to be ready (30s)..."
    sleep 30
fi

echo "📝 Creating database schema..."
mysql -h 127.0.0.1 -u root -pthanhdat12345 bus_ticket_management < backend/database/schema.sql 2>/dev/null || \
mysql -u root -pthanhdat12345 bus_ticket_management < backend/database/schema.sql

echo "✅ Database schema created"
echo ""

echo "✨ Setup Complete!"
echo ""
echo "🚀 To start the application:"
echo ""
echo "Terminal 1 - Backend:"
echo "  cd backend && npm run dev"
echo ""
echo "Terminal 2 - Frontend:"
echo "  cd frontend && npm run dev"
echo ""
echo "Then visit: http://localhost:5173"
echo ""
