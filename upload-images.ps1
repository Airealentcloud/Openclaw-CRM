# Upload property images to WordPress Media Library
# Usage: Run in PowerShell: .\upload-images.ps1

$propertyId = 18851
$siteUrl = "https://airealent.ng"

# Image files to upload
$imageFiles = @(
    "C:\Users\USER\.openclaw\media\inbound\file_10---99dfec50-5728-4273-ab7e-43e884d2570c.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_11---96dd1145-2548-4a76-bc2e-fdfbc4ad670c.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_12---1ce1af4e-253d-4e10-b720-1f902ef285f1.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_13---98ef0be2-9bc2-473f-9a8d-c31bb65b2e83.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_14---49daf79e-fcd1-4535-bfcf-69dd4677649e.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_15---4e4551b5-7ce4-4624-8cb9-09af8a6d6b57.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_16---df727929-1313-4c7b-9306-093d2aec624d.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_17---8eb4567a-b40a-45af-ad9c-ea268f37ca62.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_18---efaaa479-e8c7-4263-98ed-9f5e365b20a0.jpg",
    "C:\Users\USER\.openclaw\media\inbound\file_19---ae6ca763-005e-4c4c-b6c2-30fba4407ede.jpg"
)

Write-Host "Property Image Upload Script" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host "Property ID: $propertyId" -ForegroundColor Yellow
Write-Host "Images to upload: $($imageFiles.Count)" -ForegroundColor Yellow
Write-Host ""

# Check if files exist
$validFiles = @()
foreach ($file in $imageFiles) {
    if (Test-Path $file) {
        $validFiles += $file
        Write-Host "✓ Found: $(Split-Path $file -Leaf)"
    } else {
        Write-Host "✗ Not found: $file" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "$($validFiles.Count) files ready for upload" -ForegroundColor Green
Write-Host ""
Write-Host "To upload, you need WordPress Application Password." -ForegroundColor Yellow
Write-Host "Set one up at: Users → Profile → Application Passwords" -ForegroundColor Yellow
Write-Host ""
Write-Host "Then run curl commands like:" -ForegroundColor Yellow
Write-Host ""
foreach ($file in $validFiles) {
    $filename = Split-Path $file -Leaf
    Write-Host "curl -X POST `"$siteUrl/wp-json/wp/v2/media`" \"
    Write-Host "  -H `"Content-Disposition: attachment; filename=\`"$filename\`"`" \"
    Write-Host "  -H `"Content-Type: image/jpeg`" \"
    Write-Host "  --data-binary @\`"$file\`" \"
    Write-Host "  -u `"username:app-password`""
    Write-Host ""
}
