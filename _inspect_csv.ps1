$files = @(
  'C:\Users\USER\Downloads\mshelhomes.com-organic-keywords-path-allglo_2026-02-19_13-24-18.csv',
  'C:\Users\USER\Downloads\propertypro.ng-organic-keywords-path-allbyl_2026-02-19_13-23-26.csv',
  'C:\Users\USER\Downloads\nigeriapropertycentre.com-blog-organic-keywo_2026-02-19_13-22-48.csv',
  'C:\Users\USER\Downloads\nigeriapropertycentre.com-organic-keywords_2026-02-19_13-22-23.csv'
)

foreach ($f in $files) {
  Write-Host "FILE" $f
  $csv = Import-Csv $f
  $headers = $csv[0].PSObject.Properties.Name
  $headers | ForEach-Object { Write-Host $_ }
  Write-Host "rows" $csv.Count
  Write-Host ""
}
