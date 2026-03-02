function Parse-Int($v){
  if ($null -eq $v) { return 0 }
  $s = $v.ToString().Replace(',', '').Trim(); if ($s -eq '') { return 0 }; [int]$s
}
$files = @(
  'C:\Users\USER\Downloads\mshelhomes.com-organic-keywords-path-allglo_2026-02-19_13-24-18.csv',
  'C:\Users\USER\Downloads\propertypro.ng-organic-keywords-path-allbyl_2026-02-19_13-23-26.csv',
  'C:\Users\USER\Downloads\nigeriapropertycentre.com-blog-organic-keywo_2026-02-19_13-22-48.csv',
  'C:\Users\USER\Downloads\nigeriapropertycentre.com-organic-keywords_2026-02-19_13-22-23.csv'
)
$all = @()
foreach ($f in $files) {
  $csv = Import-Csv $f
  $csv | Where-Object { $_.Keyword -match 'abuja|maitama|asokoro|gwarinpa|jabi|wuse|katampe|life camp|lokogoma|apo|jahi|karsana|dawaki|utako' } | ForEach-Object {
    $all += [PSCustomObject]@{ Keyword = $_.Keyword; Volume = Parse-Int $_.Volume; Source = $f }
  }
}
$all | Sort-Object Volume -Descending | Select-Object -First 50 | ConvertTo-Json -Depth 3 | Out-File -Encoding UTF8 'C:\Users\USER\.openclaw\workspace\crm\_abuja_keywords.json'
