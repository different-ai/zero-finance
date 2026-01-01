#!/bin/bash
# Wrapper to ensure Node is found and environment is set
export PATH=$PATH:/usr/local/bin:/opt/homebrew/bin
DIR="$(cd "$(dirname "$0")" && pwd)"
/usr/local/bin/node "$DIR/index.js" >> /tmp/zerofinance-host-wrapper.log 2>&1
