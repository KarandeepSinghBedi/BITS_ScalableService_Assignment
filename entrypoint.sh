#!/bin/sh
set -e

echo "Database Setup"
npm run prisma:seed


echo "Starting the Node.js server..."
npm run start
