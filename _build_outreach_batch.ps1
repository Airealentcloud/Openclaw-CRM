$path = "C:\Users\USER\.openclaw\workspace\crm\backlink-outreach-tracker.md"
$rows = @()
Get-Content $path | ForEach-Object {
    $line = $_
    if (-not $line.StartsWith('|') -or $line.StartsWith('| #')) { return }
    $parts = $line.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
    if ($parts.Count -lt 11) { return }
    $idx = $parts[0]
    $site = $parts[1]
    $url = $parts[2]
    $contact = $parts[3]
    $email = $parts[4]
    $category = $parts[5]
    $target_site = $parts[6]
    $anchor = $parts[7]
    $target_page = $parts[8]
    $status = $parts[9]
    if ($email -notmatch '@') { return }
    if (@('pending','email_found') -notcontains $status.ToLower()) { return }
    if (-not $contact -or $contact -eq '—') { $contact = 'Editor' }
    $rows += [pscustomobject]@{
        site = $site
        url = $url
        contact = $contact
        email = $email
        category = $category
        target_site = $target_site
        anchor = $anchor
        target_page = $target_page
        status = $status
    }
}
$rows = $rows | Select-Object -First 100
Write-Host "candidates $($rows.Count)"
$out = "C:\Users\USER\.openclaw\workspace\crm\outreach_batch_2026_02_20.json"
$rows | ConvertTo-Json -Depth 5 | Set-Content -Path $out -Encoding UTF8
Write-Host "saved $out"
