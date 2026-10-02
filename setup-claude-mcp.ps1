# Run this in PowerShell.
$ProjectRoot = 'E:\UGM - TRPL\Semester 5\idmc-chatbot'

Set-Location $ProjectRoot

Write-Host 'Installing official Figma plugin for Claude Code...'
claude plugin install figma@claude-plugins-official

Write-Host 'Adding project-local filesystem MCP...'
claude mcp add --scope local --transport stdio filesystem -- cmd /c npx -y @modelcontextprotocol/server-filesystem "$ProjectRoot"

Write-Host ''
Write-Host 'Configured MCP servers:'
claude mcp list

Write-Host ''
Write-Host 'Next:'
Write-Host '1. Start Claude Code from this project root: claude'
Write-Host '2. In Claude Code run /plugin, open Installed > figma, and authenticate Figma.'
Write-Host '3. Run /mcp and confirm Figma + filesystem are connected.'
Write-Host '4. Ask: Read README.md and implement the current Phase 1 only.'
