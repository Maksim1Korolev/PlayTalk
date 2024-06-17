#!/bin/sh
# Start Redis server in the background
redis-server &
# Wait for Redis server to start
sleep 1
# Flush all Redis data
redis-cli FLUSHALL
# Bring Redis server process to foreground
fg
