#!/bin/bash
echo "Starting database backup..."
cd "$(dirname "$0")"
node backup-database.js 