#!/bin/bash

echo "🧪 Testing backend configuration and modules..."

# Test 1: Config module loads
echo "1. Testing config module..."
node -e "const config = require('./src/config'); console.log('✅ Config loaded'); console.log('Env:', config.env);" || { echo "❌ Config failed"; exit 1; }

# Test 2: Logger module loads
echo "2. Testing logger module..."
node -e "const logger = require('./src/loaders/logger'); logger.info('Test log'); console.log('✅ Logger loaded');" || { echo "❌ Logger failed"; exit 1; }

# Test 3: Response formatter loads
echo "3. Testing response formatter..."
node -e "const formatter = require('./src/utils/responseFormatter'); console.log('✅ Response formatter loaded');" || { echo "❌ Response formatter failed"; exit 1; }

# Test 4: Date utils loads
echo "4. Testing date utils..."
node -e "const dateUtils = require('./src/utils/dateUtils'); console.log('Now:', dateUtils.format(dateUtils.now())); console.log('✅ Date utils loaded');" || { echo "❌ Date utils failed"; exit 1; }

# Test 5: Pagination utils loads
echo "5. Testing pagination utils..."
node -e "const pagination = require('./src/utils/pagination'); console.log('✅ Pagination utils loaded');" || { echo "❌ Pagination failed"; exit 1; }

# Test 6: Health check utils loads
echo "6. Testing health check utils..."
node -e "const health = require('./src/utils/healthCheck'); console.log('Simple health:', health.getSimpleHealth().status); console.log('✅ Health check loaded');" || { echo "❌ Health check failed"; exit 1; }

echo ""
echo "✅ All module tests passed!"
echo ""
