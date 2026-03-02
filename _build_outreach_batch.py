import json, pathlib
path = pathlib.Path(r"C:\Users\USER\.openclaw\workspace\crm\backlink-outreach-tracker.md")
rows=[]
for line in path.read_text(encoding='utf-8', errors='ignore').splitlines():
    if not line.startswith('|') or line.startswith('| #'):
        continue
    parts=[p.strip() for p in line.strip('|').split('|')]
    if len(parts) < 11:
        continue
    idx, site, url, contact, email, category, target_site, anchor, target_page, status, follow_up, template = parts[:12]
    if '@' not in email:
        continue
    if status.lower() not in {'pending','email_found'}:
        continue
    rows.append({
        'site': site,
        'url': url,
        'contact': contact if contact and contact!='—' else 'Editor',
        'email': email,
        'category': category,
        'target_site': target_site,
        'anchor': anchor,
        'target_page': target_page,
        'status': status
    })
rows = rows[:100]
print('candidates', len(rows))
out = pathlib.Path(r"C:\Users\USER\.openclaw\workspace\crm\outreach_batch_2026_02_20.json")
out.write_text(json.dumps(rows, indent=2), encoding='utf-8')
print('saved', out)
