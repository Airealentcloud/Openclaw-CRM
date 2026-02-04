# Nigeria Guest Post Outreach - Updated Correct Emails
# Run in PowerShell: .\send-outreach-emails-v2.ps1

$Email = "israelakhas1@gmail.com"
$AppPassword = "retq wqqp ijsr rwur"
$SMTPServer = "smtp.gmail.com"
$SMTPPort = 587

$Recipients = @(
    @{
        Name = "Nairametrics Team"
        Email = "outreach@nairametrics.com"
        Site = "Nairametrics"
        Topic = "Property Investment Trends in Nigeria for 2026"
        Note = "Updated email - was contact@"
    },
    @{
        Name = "Nairametrics Team"
        Email = "info@nairametrics.com"
        Site = "Nairametrics"
        Topic = "Property Investment Trends in Nigeria for 2026"
        Note = "Backup email"
    },
    @{
        Name = "Editorial Team"
        Email = "editorial@businessday.ng"
        Site = "BusinessDay NG"
        Topic = "Abuja Real Estate Market Analysis"
        Note = "Using editorial email"
    },
    @{
        Name = "Business Team"
        Email = "business@techpoint.africa"
        Site = "Techpoint Africa"
        Topic = "PropTech: The Future of Property Buying in Nigeria"
        Note = "Updated from contact@ to business@"
    },
    @{
        Name = "Editorial Team"
        Email = "editorial@thisdaylive.com"
        Site = "Thisdaylive"
        Topic = "AI and Real Estate: Opportunities for Nigerian Buyers"
    },
    @{
        Name = "Team"
        Email = "hello@techcabal.com"
        Site = "TechCabal"
        Topic = "Nigeria's PropTech Revolution"
    },
    @{
        Name = "Team"
        Email = "info@homers.ng"
        Site = "Homers Nigeria"
        Topic = "Best Areas to Invest in Abuja Real Estate"
    },
    @{
        Name = "Contact"
        Email = "contact@naijatechguide.com"
        Site = "NaijaTechGuide"
        Topic = "Virtual Property Tours: The New Normal in Nigeria"
    },
    @{
        Name = "Team"
        Email = "info@theafricanvestor.com"
        Site = "The Africanvestor"
        Topic = "Fractional Ownership in African Real Estate"
    },
    @{
        Name = "Caroline Wabara"
        Email = "hello@carolinewabara.com"
        Site = "Caroline Wabara"
        Topic = "Digital Marketing for Real Estate in Nigeria"
    }
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Nigeria Guest Post Outreach - ROUND 2" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Account: $Email" -ForegroundColor Yellow
Write-Host "Recipients: $($Recipients.Count)" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$Success = 0
$Failed = 0

foreach ($recipient in $Recipients) {
    $Subject = "Guest Post Proposal: $($recipient.Topic)"
    
    $Body = "Hi,

I hope this email finds you well.

I'm reaching out from A.I Realent Global Resources Ltd., a leading real estate company based in Abuja, Nigeria.

I'd like to contribute a guest post to $($recipient.Site) on the topic:

**$($recipient.Topic)**

This article would provide valuable insights for your readers about the Nigerian real estate market, covering:
- Current market trends and opportunities
- Practical advice for property buyers and investors
- Expert analysis backed by real-world experience

Would you be interested in reviewing a draft?

Thank you for your time.

Best regards,
Israel Akhabue
CEO, A.I Realent Global Resources Ltd.
Website: https://airealent.ng
Phone: +234 818 162 4267"

    try {
        $MailMessage = New-Object System.Net.Mail.MailMessage
        $MailMessage.From = New-Object System.Net.Mail.MailAddress($Email)
        $MailMessage.To.Add($recipient.Email)
        $MailMessage.Subject = $Subject
        $MailMessage.Body = $Body
        
        $SMTPClient = New-Object System.Net.Mail.SmtpClient($SMTPServer, $SMTPPort)
        $SMTPClient.EnableSsl = $true
        $SMTPClient.Credentials = New-Object System.Net.NetworkCredential($Email, $AppPassword)
        
        $SMTPClient.Send($MailMessage)
        Write-Host "[SENT] $($recipient.Site) -> $($recipient.Email)" -ForegroundColor Green
        $Success++
    }
    catch {
        Write-Host "[FAILED] $($recipient.Site): $($_.Exception.Message)" -ForegroundColor Red
        $Failed++
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Complete: $Success sent, $Failed failed" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan
