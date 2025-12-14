#!/bin/bash

# Backend Quick Setup Script

echo "🚀 Freelancer Management Backend - Quick Setup"
echo "=============================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "📋 Creating .env file from template..."
    cp .env.example .env
    echo "✅ .env created. Please update with your configuration."
    echo "   Edit: nano .env"
    echo ""
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

echo ""
echo "✅ Dependencies installed!"
echo ""

# Display next steps
echo "🔧 Next Steps:"
echo "1. Update .env file with your database credentials:"
echo "   nano .env"
echo ""
echo "2. Create and seed the database:"
echo "   npm run db:migrate"
echo "   npm run db:seed"
echo ""
echo "3. Start the development server:"
echo "   npm run dev"
echo ""
echo "📚 For more information, see BACKEND_README.md"
echo ""
