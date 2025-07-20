#!/bin/bash

# Load environment variables from .env file
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | grep -v '^$' | xargs)
fi

# Debug: Show what variables we have
echo "Debug info:"
echo "Host: ${POSTGRES_DB_HOST:-localhost}"
echo "User: ${POSTGRES_USERNAME:-${DATABASE_USER}}"
echo "Port: ${POSTGRES_DB_PORT:-5432}"
echo "Database: ${POSTGRES_DB_NAME:-${DATABASE_NAME}}"
echo "SSL: ${SSL_ENABLED:-true}"
echo ""

# Run typeorm-model-generator with environment variables
npx typeorm-model-generator \
  -h ${POSTGRES_DB_HOST:-localhost} \
  -u ${POSTGRES_USERNAME:-${DATABASE_USER}} \
  -x ${POSTGRES_PASSWORD:-${DATABASE_PASSWORD}} \
  -p ${POSTGRES_DB_PORT:-5432} \
  -o ./src/models/entities \
  -d ${POSTGRES_DB_NAME:-${DATABASE_NAME}} \
  -e postgres \
  --ssl ${SSL_ENABLED:-true} \
  --noConfig \
  --cf pascal \
  --cp camel

echo "✅ TypeORM entities generated successfully!"