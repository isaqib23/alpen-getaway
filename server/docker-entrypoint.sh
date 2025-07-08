#!/bin/sh
echo "Running migrations..."
npm run migration:run:prod

echo "seeding database..."
npm run seed
echo "Starting app..."
exec node dist/main.js
