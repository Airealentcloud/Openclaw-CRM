$path='C:\Users\USER\.openclaw\workspace\crm\backlink-outreach-tracker.md'
$rows = @()
Get-Content $path -Encoding UTF8 | ForEach-Object {
  $line = $_
  if (-not $line.StartsWith('|') -or $line.StartsWith('| #')) { return }
  $parts = $line.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
  if ($parts.Count -lt 11) { return }
  $idx=$parts[0]; $site=$parts[1]; $url=$parts[2]; $contact=$parts[3]; $email=$parts[4]; $status=$parts[9]; $category=$parts[5]; $target=$parts[6];
  if ($idx -eq '---' -or $site -eq 'Site') { return }
  $link = if ($url -and $url -ne '—') { '<a href="{0}" target="_blank">link</a>' -f $url } else { '<em>—</em>' }
  if (-not $email -or $email -eq '—') { $email='<em>—</em>' }
  if (-not $contact -or $contact -eq '—') { $contact='—' }
  $statusClass = if ($status -eq 'pending' -or $status -eq 'email_found') { 'status-pending' } elseif ($status -eq 'form_submitted') { 'status-form' } else { 'status-sent' }
  $row = '<tr><td>{0}</td><td>{1}</td><td>{2}</td><td>{3}</td><td>{4}</td><td><span class="pill {5}">{6}</span></td><td>{7}</td><td>{8}</td></tr>' -f $idx,$site,$link,$contact,$email,$statusClass,$status,$category,$target
  $rows += $row
}
$out = 'C:\Users\USER\.openclaw\workspace\crm\_rows.html'
$rows -join "`n" | Set-Content -Path $out -Encoding UTF8
Write-Host 'rows written'
