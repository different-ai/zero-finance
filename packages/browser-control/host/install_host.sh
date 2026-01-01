#!/bin/bash

# 1. Define variables
HOST_NAME="com.zerofinance.agent_bridge"
HOST_DIR="$(cd "$(dirname "$0")" && pwd)"
HOST_PATH="$HOST_DIR/host_wrapper.sh"
MANIFEST_PATH="$HOST_DIR/com.zerofinance.agent_bridge.json"

# 2. Make host script executable
chmod +x "$HOST_PATH"

# 3. Create the Host Manifest file dynamically (needs absolute path)
cat <<EOF > "$MANIFEST_PATH"
{
  "name": "$HOST_NAME",
  "description": "0 Finance Agent Bridge Host",
  "path": "$HOST_PATH",
  "type": "stdio",
  "allowed_origins": [
    "chrome-extension://hajbgjgakahfnhadlohbepaggdkjonip/"
  ]
}
EOF

echo "Created Host Manifest at $MANIFEST_PATH"
# echo "NOTE: You must replace <YOUR_EXTENSION_ID> in that file after loading the extension in Chrome!"

# 4. Symlink to Chrome's NativeMessagingHosts directory
TARGET_DIR="$HOME/Library/Application Support/Google/Chrome/NativeMessagingHosts"
mkdir -p "$TARGET_DIR"
ln -sf "$MANIFEST_PATH" "$TARGET_DIR/$HOST_NAME.json"

echo "Registered Native Host in $TARGET_DIR"
echo "Done."
