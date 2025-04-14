#!/bin/bash

set -e

echo "⏳ Wating MySQL..."
./wait-for-it.sh mysql:3306 --timeout=60 --strict -- echo "✅ MySQL is up"

echo "Running migrations..."
npm run migration:run

echo "Insert csv dummy in product"
npm run insert:dummy

echo "🧪 Running tests..."
npm run test:prod