# Automated ASURA Repository Initializer
Write-Host ">>> Initializing ASURA Autonomous Core Git Repository <<<" -ForegroundColor Cyan

if (Get-Command git -ErrorAction SilentlyContinue) {
    git init
    git add .
    git commit -m "feat(core): initialize ASURA 24/7 autonomous multi-agent system & glassmorphic dashboard"
    Write-Host "[SUCCESS] Git repository initialized with initial commit." -ForegroundColor Green
    Write-Host "To link your GitHub remote repository, run:" -ForegroundColor Yellow
    Write-Host "  git remote add origin https://github.com/YOUR_USER/asura-system.git" -ForegroundColor White
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
} else {
    Write-Host "[NOTICE] Git executable not detected in system PATH. Install Git or commit directly via GitHub Desktop / IDE." -ForegroundColor Yellow
}
