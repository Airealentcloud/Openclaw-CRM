# Send outreach emails in batches of 10 every 10 minutes
# Uses Gmail app password from .secrets/gmail-smtp.md

$SecretsPath = "C:\Users\USER\.openclaw\workspace\.secrets\gmail-smtp.md"
$TrackerPath = "C:\Users\USER\.openclaw\workspace\crm\backlink-outreach-tracker.md"
$LogPath = "C:\Users\USER\.openclaw\workspace\crm\outreach_log_2026_02_20.csv"

# Load secrets
$secrets = Get-Content $SecretsPath
$email = ($secrets | Select-String -Pattern '^email:' | ForEach-Object { $_.Line.Split(':')[1].Trim() })
$appPassword = ($secrets | Select-String -Pattern '^app_password:' | ForEach-Object { $_.Line.Split(':')[1].Trim() })
$fromName = ($secrets | Select-String -Pattern '^from_name:' | ForEach-Object { $_.Line.Split(':')[1].Trim() })
$smtpServer = ($secrets | Select-String -Pattern '^host:' | ForEach-Object { $_.Line.Split(':')[1].Trim() })
$smtpPort = ($secrets | Select-String -Pattern '^port:' | ForEach-Object { $_.Line.Split(':')[1].Trim() })

# Build list (pending/email_found first, then outreach_sent)
$rows = @()
Get-Content $TrackerPath | ForEach-Object {
    $line = $_
    if (-not $line.StartsWith('|') -or $line.StartsWith('| #')) { return }
    $parts = $line.Trim('|').Split('|') | ForEach-Object { $_.Trim() }
    if ($parts.Count -lt 11) { return }
    $site = $parts[1]
    $url = $parts[2]
    $contact = $parts[3]
    $emailAddr = $parts[4]
    $category = $parts[5]
    $targetSite = $parts[6]
    $anchor = $parts[7]
    $targetPage = $parts[8]
    $status = $parts[9]
    if ($emailAddr -notmatch '@') { return }
    if (-not $contact -or $contact -eq '—') { $contact = 'Editor' }
    $rows += [pscustomobject]@{
        site = $site
        url = $url
        contact = $contact
        email = $emailAddr
        category = $category
        target_site = $targetSite
        anchor = $anchor
        target_page = $targetPage
        status = $status
    }
}

$priority = $rows | Where-Object { $_.status -in @('pending','email_found') }
$followup = $rows | Where-Object { $_.status -eq 'outreach_sent' }
$targets = @()
$targets += $priority
$targets += $followup
$targets = $targets | Sort-Object email -Unique | Select-Object -First 100

if (-not $targets -or $targets.Count -eq 0) {
    Write-Host "No email targets found." -ForegroundColor Yellow
    exit 1
}

# Email template
function Build-Body($t) {
@"
Hi $($t.contact),

I’m Israel Akhabue, CEO of A.I Realent Global Resources Ltd. (Abuja). I’d like to contribute a guest post to $($t.site).

Proposed angle: practical insights on Abuja/Nigeria real estate + verification tips for buyers (aligned to your audience).

If you’re open to it, I’ll send a draft tailored to $($t.site) and link to: https://$($t.target_site)$($t.target_page)

Would you like to review a draft?

Best regards,
Israel Akhabue
A.I Realent Global Resources Ltd.
https://airealent.ng
+234 818 162 4267
"@
}

# Setup SMTP
$smtp = New-Object System.Net.Mail.SmtpClient($smtpServer, [int]$smtpPort)
$smtp.EnableSsl = $true
$smtp.Credentials = New-Object System.Net.NetworkCredential($email, $appPassword)

# Ensure log header
if (-not (Test-Path $LogPath)) {
    "timestamp,site,email,status,result" | Out-File -FilePath $LogPath -Encoding UTF8
}

# Dedupe: skip emails already sent today
$sentToday = @{}
if (Test-Path $LogPath) {
    $today = (Get-Date).ToString('yyyy-MM-dd')
    $logRows = Import-Csv $LogPath
    foreach ($r in $logRows) {
        if ($r.timestamp -and $r.timestamp.StartsWith($today) -and $r.result -eq 'sent') {
            $sentToday[$r.email] = $true
        }
    }
}

$batchSize = 10
$delaySeconds = 600
$sentCount = 0

for ($i = 0; $i -lt $targets.Count; $i += $batchSize) {
    $batch = $targets[$i..([Math]::Min($i + $batchSize - 1, $targets.Count - 1))]
    foreach ($t in $batch) {
        if ($sentToday.ContainsKey($t.email)) {
            Write-Host "[SKIP] Already sent today -> $($t.email)" -ForegroundColor DarkYellow
            continue
        }
        $subject = "Guest Post Proposal: Abuja Real Estate Insights"
        $body = Build-Body $t
        try {
            $msg = New-Object System.Net.Mail.MailMessage
            $msg.From = New-Object System.Net.Mail.MailAddress($email, $fromName)
            $msg.To.Add($t.email)
            $msg.Subject = $subject
            $msg.Body = $body
            $smtp.Send($msg)
            $sentCount++
            "$((Get-Date).ToString('s')),$($t.site),$($t.email),$($t.status),sent" | Out-File -FilePath $LogPath -Append -Encoding UTF8
            $sentToday[$t.email] = $true
            Write-Host "[SENT] $($t.site) -> $($t.email)" -ForegroundColor Green
        } catch {
            "$((Get-Date).ToString('s')),$($t.site),$($t.email),$($t.status),failed" | Out-File -FilePath $LogPath -Append -Encoding UTF8
            Write-Host "[FAILED] $($t.site): $($_.Exception.Message)" -ForegroundColor Red
        }
    }
    if ($i + $batchSize -lt $targets.Count) {
        Write-Host "Batch complete. Sleeping $delaySeconds seconds..." -ForegroundColor Cyan
        Start-Sleep -Seconds $delaySeconds
    }
}

Write-Host "Done. Total sent: $sentCount" -ForegroundColor Yellow
