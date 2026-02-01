from pathlib import Path
path = Path(r'C:\Users\USER\.openclaw\workspace\crm\backlink-outreach-tracker.md')
text = path.read_text(encoding='utf-8')
lines = text.splitlines()
start = None
for i, l in enumerate(lines):
    if l.strip().startswith('| Site |'):
        start = i
        break
if start is None:
    raise SystemExit('table header not found')
sep = start + 1
rows = []
end = sep + 1
for j in range(sep + 1, len(lines)):
    if not lines[j].strip().startswith('|'):
        end = j
        break
    rows.append(lines[j])
else:
    end = len(lines)
parsed = []
for r in rows:
    parts = [p.strip() for p in r.strip().strip('|').split('|')]
    parsed.append(parts)
new_entries = [
    ["VConnect Promote Your Business", "https://m.vconnect.com/promoteyourbusiness", "—", "—", "Directory", "9jadirectory.org", "Nigeria business directory listing", "/submit-business", "pending", "—", "Directory submission"],
    ["NigeriaGalleria Directory", "https://www.nigeriagalleria.com/directory/create-listing/", "—", "—", "Directory", "airealent.ng", "Abuja real estate directory", "Homepage", "pending", "—", "Directory submission"],
    ["NGContacts Business Directory", "https://www.ngcontacts.com/", "—", "—", "Directory", "9jadirectory.org", "Nigeria company listings", "/categories/real-estate", "pending", "—", "Directory submission"],
    ["Yellow Pages Nigeria", "https://yellowpagesnigeria.com/", "—", "—", "Directory", "housesforsaleinabuja.com", "Houses for sale Abuja", "/houses-for-sale-in-gwarinpa", "pending", "—", "Directory submission"],
    ["Nigeria Yellow Pages Online", "https://nigeriayponline.com/", "—", "—", "Directory", "landforsaleinabuja.com", "Land for sale Abuja", "/land-for-sale-in-katampe", "pending", "—", "Directory submission"],
    ["Country Yellow Pages", "https://www.countryyellowpages.net/", "—", "—", "Directory", "airealent.ng", "Abuja real estate agency", "Homepage", "pending", "—", "Directory submission"],
]
parsed.extend(new_entries)
header = "| # | Site | URL | Contact | Email | Category | Target Site | Anchor | Target Page | Status | Follow-up | Template |"
separator = "|---|------|-----|---------|-------|----------|-------------|--------|-------------|--------|-----------|----------|"
new_rows = []
for idx, row in enumerate(parsed, start=1):
    if len(row) != 11:
        row = row + ['—'] * (11 - len(row))
    new_rows.append("| {} | {} |".format(idx, " | ".join(row)))
new_lines = lines[:start] + [header, separator] + new_rows + lines[end:]
path.write_text("\n".join(new_lines) + "\n", encoding='utf-8')
print('updated')
