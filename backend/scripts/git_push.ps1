Set-Location 'c:\wamp64\www\streetwear-ecommerce\backend'
# Initialize repo if needed
if (-not (git rev-parse --is-inside-work-tree 2>$null)) { git init }
# Remove existing origin if present (ignore errors)
try { git remote remove origin } catch { }
# Add new origin
git remote add origin 'https://github.com/bensaadatamine4-pixel/ARIONAPIs.git'
# Stage and commit
git add -A
git commit -m 'Add show_on_homepage support and sync migrations/seeders' 2>$null
if ($LASTEXITCODE -ne 0) { Write-Host 'No changes to commit' } else { Write-Host 'Committed changes' }
# Ensure branch name
git branch -M main
# Push (may require credentials)
Write-Host 'Attempting to push to origin main...'
$push = git push -u origin main 2>&1
Write-Host $push
if ($LASTEXITCODE -eq 0) { Write-Host 'Push succeeded' } else { Write-Host 'Push failed or requires authentication' }
