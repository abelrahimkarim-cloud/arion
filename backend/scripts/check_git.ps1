Set-Location 'c:\wamp64\www\streetwear-ecommerce\backend'
if (Test-Path .git) {
  Write-Host 'Git repo detected.'
  git remote -v
  git rev-parse --abbrev-ref HEAD
  git log -1 --pretty=format:"%h %s"
} else {
  Write-Host 'Not a git repository.'
}
