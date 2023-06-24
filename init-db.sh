#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE ROLE node_rdb;
    ALTER ROLE node_rdb WITH PASSWORD 'password123';
    GRANT ALL PRIVILEGES ON DATABASE "$POSTGRES_DB" TO node_rdb;
EOSQL