@echo off
setlocal enabledelayedexpansion

echo.
echo ==================================
echo   SpadeChat Installer for Claude
echo ==================================
echo.

set "CONFIG_DIR=%APPDATA%\Claude"
set "CONFIG_FILE=%CONFIG_DIR%\claude_desktop_config.json"

:: Check if Claude Desktop config directory exists
if not exist "%CONFIG_DIR%" (
    echo Claude Desktop config directory not found.
    echo Make sure Claude Desktop is installed and has been opened at least once.
    echo.
    echo Download Claude Desktop: https://claude.ai/download
    pause
    exit /b 1
)

:: Check if config file exists, create if not
if not exist "%CONFIG_FILE%" (
    echo Creating new Claude Desktop config file...
    echo {} > "%CONFIG_FILE%"
)

:: Check if SpadeChat is already configured
findstr /i "spadechat" "%CONFIG_FILE%" >nul 2>&1
if %errorlevel% equ 0 (
    echo SpadeChat is already configured in Claude Desktop!
    echo Restart Claude Desktop if you haven't already.
    echo.
    pause
    exit /b 0
)

:: Backup existing config
copy "%CONFIG_FILE%" "%CONFIG_FILE%.backup" >nul 2>&1
echo Backed up existing config.

:: Use PowerShell to safely merge JSON
powershell -ExecutionPolicy Bypass -Command ^
    "$configFile = '%CONFIG_FILE%'; " ^
    "$config = if (Test-Path $configFile) { Get-Content $configFile -Raw | ConvertFrom-Json } else { [PSCustomObject]@{} }; " ^
    "if (-not $config.mcpServers) { $config | Add-Member -NotePropertyName 'mcpServers' -NotePropertyValue ([PSCustomObject]@{}) -Force }; " ^
    "if (-not $config.mcpServers.spadechat) { $config.mcpServers | Add-Member -NotePropertyName 'spadechat' -NotePropertyValue ([PSCustomObject]@{ url = 'https://spadechat.com/api/mcp' }) -Force }; " ^
    "$config | ConvertTo-Json -Depth 10 | Set-Content $configFile -Encoding UTF8; " ^
    "Write-Host 'SpadeChat has been added to your Claude Desktop config!'"

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! SpadeChat is now connected to Claude Desktop.
    echo.
    echo Next steps:
    echo   1. Restart Claude Desktop ^(quit and reopen it^)
    echo   2. Start a new conversation
    echo   3. Try asking: 'Find me a haircut near Eugene, Oregon'
    echo.
) else (
    echo.
    echo Something went wrong. Please try manual setup:
    echo   1. Open: %APPDATA%\Claude\claude_desktop_config.json
    echo   2. Add this to the mcpServers section:
    echo      "spadechat": { "url": "https://spadechat.com/api/mcp" }
    echo.
)

pause
