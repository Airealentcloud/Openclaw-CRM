# Nigeria Guest Post Outreach Emails
# Run in PowerShell: .\send-outreach-emails.ps1

$Email = "israelakhas1@gmail.com"
$AppPassword = "retq wqqp ijsr rwur"
$SMTPServer = "smtp.gmail.com"
$SMTPPort = 587

$Recipients = @(
    @{
        Name = "Editor"
        Email = "contact@nairametrics.com"
        Site = "Nairametrics"
        Topic = "Property Investment Trends in Nigeria for 2026"
    },
    @{
        Name = "Editor"
        Email = "editor@businessday.ng"
        Site = "BusinessDay NG"
        Topic = "Abuja Real Estate Market Analysis"
    },
    @{
        Name = "Editor"
        Email = "hello@nigeriabusinesspro.com"
        Site = "Nigeria Business Pro"
        Topic = "How Technology is Transforming Real Estate in Nigeria"
    },
    @{
        Name = "Editor"
        Email = "contact@techpoint.africa"
        Site = "Techpoint Africa"
        Topic = "PropTech: The Future of Property Buying in Nigeria"
    },
    @{
        Name = "Editor"
        Email = "editorial@thisdaylive.com"
        Site = "Thisdaylive"
        Topic = "AI and Real Estate: Opportunities for Nigerian Buyers"
    },
    @{
        Name = "Editor"
        Email = "hello@techcabal.com"
        Site = "TechCabal"
        Topic = "Nigeria's PropTech Revolution"
    },
    @{
        Name = "Editor"
        Email = "info@homers.ng"
        Site = "Homers Nigeria"
        Topic = "Best Areas to Invest in Abuja Real Estate"
    },
    @{
        Name = "Editor"
        Email = "contact@naijatechguide.com"
        Site = "NaijaTechGuide"
        Topic = "Virtual Property Tours: The New Normal in Nigeria"
    },
    @{
        Name = "Editor"
        Email = "info@theafricanvestor.com"
        Site = "The Africanvestor"
        Topic = "Fractional Ownership in African Real Estate"
    },
    @{
        Name = "Editor"
        Email = "hello@carolinewabara.com"
        Site = "Caroline Wabara"
        Topic = "Digital Marketing for Real Estate in Nigeria"
    }
)

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Nigeria Guest Post Outreach" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Account: $Email" -ForegroundColor Yellow
Write-Host "Recipients: $($Recipients.Count)" -ForegroundColor Yellow
Write-Host "============================================================" -ForegroundColor Cyan

$Success = 0

foreach ($recipient in $Recipients) {
    $Subject = "Guest Post Proposal: $($recipient.Topic)"
    
    $Body = "Hi $($recipient.Name),

I hope this email finds you well.

I'm reaching out from A.I Realent Global Resources Ltd., a leading real estate company based in Abuja, Nigeria.

I'd like to contribute a guest post to $($recipient.Site) on the topic:

**$($recipient.Topic)**

This article would provide valuable insights for your readers about the Nigerian real estate market, covering:
- Current market trends and opportunities
- Practical advice for property buyers and investors
- Expert analysis backed by real-world experience

We believe this content would resonate well with your audience and provide genuine value.

Would you be interested in reviewing a draft? I'd be happy to send it over.

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
        Write-Host "Sent to $($recipient.Site) ($($recipient.Email))" -ForegroundColor Green
        $Success++
    }
    catch {
        Write-Host "Failed $($recipient.Site): $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "Complete: $Success/$($Recipients.Count) emails sent" -ForegroundColor Green
Write-Host "============================================================" -ForegroundColor Cyan
