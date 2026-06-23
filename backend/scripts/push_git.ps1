Set-Location 'c:\wamp64\www\streetwear-ecommerce\backend'
Write-Host 'Attempting git push origin master...'
$push = git push -u origin master 2>&1
Write-Host $push
if ($LASTEXITCODE -eq 0) { Write-Host 'Push succeeded' } else { Write-Host 'Push failed or requires authentication' ; exit 1 }
