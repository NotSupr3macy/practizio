#!/bin/bash
# SpadeChat MCP Installer for Claude Desktop (macOS)
# This script adds the SpadeChat directory to your Claude Desktop MCP configuration.
# It does NOT modify any existing MCP servers you have configured.

CONFIG_DIR="$HOME/Library/Application Support/Claude"
CONFIG_FILE="$CONFIG_DIR/claude_desktop_config.json"
MCP_URL="https://spadechat.com/api/mcp"

echo ""
echo "=================================="
echo "  SpadeChat Installer for Claude  "
echo "=================================="
echo ""

# Check if Claude Desktop config directory exists
if [ ! -d "$CONFIG_DIR" ]; then
    echo "Claude Desktop config directory not found."
    echo "Make sure Claude Desktop is installed and has been opened at least once."
    echo ""
    echo "Download Claude Desktop: https://claude.ai/download"
    exit 1
fi

# Create config file if it doesn't exist
if [ ! -f "$CONFIG_FILE" ]; then
    echo "Creating new Claude Desktop config file..."
    echo '{}' > "$CONFIG_FILE"
fi

# Check if SpadeChat is already configured
if grep -q "spadechat" "$CONFIG_FILE" 2>/dev/null; then
    echo "SpadeChat is already configured in Claude Desktop!"
    echo "Restart Claude Desktop if you haven't already."
    echo ""
    exit 0
fi

# Backup existing config
cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d%H%M%S)"
echo "Backed up existing config."

# Use python3 (available on all modern Macs) to safely merge JSON
python3 << 'PYTHON_SCRIPT'
import json
import os

config_file = os.path.expanduser("~/Library/Application Support/Claude/claude_desktop_config.json")

try:
    with open(config_file, 'r') as f:
        config = json.load(f)
except (json.JSONDecodeError, FileNotFoundError):
    config = {}

# Ensure mcpServers key exists
if 'mcpServers' not in config:
    config['mcpServers'] = {}

# Add SpadeChat (don't overwrite if somehow already there)
if 'spadechat' not in config['mcpServers']:
    config['mcpServers']['spadechat'] = {
        "url": "https://spadechat.com/api/mcp"
    }

# Write back
with open(config_file, 'w') as f:
    json.dump(config, f, indent=2)

print("SpadeChat has been added to your Claude Desktop config!")
PYTHON_SCRIPT

if [ $? -eq 0 ]; then
    echo ""
    echo "SUCCESS! SpadeChat is now connected to Claude Desktop."
    echo ""
    echo "Next steps:"
    echo "  1. Restart Claude Desktop (quit and reopen it)"
    echo "  2. Start a new conversation"
    echo "  3. Try asking: 'Find me a haircut near Eugene, Oregon'"
    echo ""
else
    echo ""
    echo "Something went wrong. Please try the manual setup:"
    echo "  1. Open: ~/Library/Application Support/Claude/claude_desktop_config.json"
    echo "  2. Add this to the mcpServers section:"
    echo '     "spadechat": { "url": "https://spadechat.com/api/mcp" }'
    echo ""
fi
