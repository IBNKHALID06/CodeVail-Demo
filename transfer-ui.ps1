# CodeVail UI Transfer Script
# Usage: .\transfer-ui.ps1 "C:\path\to\destination\project"

param(
    [Parameter(Mandatory=$true)]
    [string]$DestinationPath
)

Write-Host "🚀 CodeVail UI Transfer Script" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check if destination exists
if (!(Test-Path $DestinationPath)) {
    Write-Host "❌ Destination path does not exist: $DestinationPath" -ForegroundColor Red
    exit 1
}

$SourcePath = $PSScriptRoot
Write-Host "📁 Source: $SourcePath" -ForegroundColor Green
Write-Host "📁 Destination: $DestinationPath" -ForegroundColor Green
Write-Host ""

# Function to copy files/folders
function Copy-Item-Safe {
    param($Source, $Destination)
    
    if (Test-Path $Source) {
        Write-Host "📋 Copying: $Source" -ForegroundColor Yellow
        Copy-Item -Path $Source -Destination $Destination -Recurse -Force
        Write-Host "✅ Copied: $(Split-Path $Source -Leaf)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Not found: $Source" -ForegroundColor Orange
    }
}

# Core UI Components
Write-Host "📦 Copying Core UI Components..." -ForegroundColor Cyan
Copy-Item-Safe "$SourcePath\components" "$DestinationPath\components"
Copy-Item-Safe "$SourcePath\lib" "$DestinationPath\lib"
Copy-Item-Safe "$SourcePath\hooks" "$DestinationPath\hooks"

# Configuration Files
Write-Host "`n⚙️  Copying Configuration Files..." -ForegroundColor Cyan
Copy-Item-Safe "$SourcePath\tailwind.config.js" "$DestinationPath\tailwind.config.js"
Copy-Item-Safe "$SourcePath\postcss.config.mjs" "$DestinationPath\postcss.config.mjs"
Copy-Item-Safe "$SourcePath\tsconfig.json" "$DestinationPath\tsconfig.json"
Copy-Item-Safe "$SourcePath\next.config.mjs" "$DestinationPath\next.config.mjs"
Copy-Item-Safe "$SourcePath\components.json" "$DestinationPath\components.json"

# Styling
Write-Host "`n🎨 Copying Styling Files..." -ForegroundColor Cyan
Copy-Item-Safe "$SourcePath\app\globals.css" "$DestinationPath\app\globals.css"
Copy-Item-Safe "$SourcePath\styles" "$DestinationPath\styles"

# Source Code
Write-Host "`n💻 Copying Source Code..." -ForegroundColor Cyan
Copy-Item-Safe "$SourcePath\src" "$DestinationPath\src"

# Assets
Write-Host "`n🖼️  Copying Assets..." -ForegroundColor Cyan
Copy-Item-Safe "$SourcePath\public" "$DestinationPath\public"

# App Pages (optional)
Write-Host "`n📄 Copying App Pages..." -ForegroundColor Cyan
$appPages = @("login", "candidate-dashboard", "interviewer-dashboard", "interview", "call", "results", "layout.tsx")
foreach ($page in $appPages) {
    Copy-Item-Safe "$SourcePath\app\$page" "$DestinationPath\app\$page"
}

Write-Host "`n✨ Transfer Complete!" -ForegroundColor Green
Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Install dependencies: npm install" -ForegroundColor White
Write-Host "2. Install additional packages (see UI-TRANSFER-GUIDE.md)" -ForegroundColor White
Write-Host "3. Check import paths and configurations" -ForegroundColor White
Write-Host "4. Run: npm run dev" -ForegroundColor White
Write-Host "`n📖 See UI-TRANSFER-GUIDE.md for detailed instructions" -ForegroundColor Yellow
