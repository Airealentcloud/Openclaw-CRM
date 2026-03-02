const fs = require('fs');

async function fetchText(url){
  const res = await fetch(url, {headers:{'User-Agent':'Mozilla/5.0'}});
  if(!res.ok) throw new Error(`HTTP ${res.status} ${url}`);
  return await res.text();
}

function extractTotalResults(html){
  const m = html.match(/Results\s+\d+\s*-\s*\d+\s+of\s+([\d,]+)/i);
  if(!m) return null;
  return parseInt(m[1].replace(/,/g,''),10);
}

function extractLinks(html, pattern){
  const re = new RegExp(`href=\\\"(${pattern})\\\"`, 'g');
  const links = new Set();
  let m;
  while((m=re.exec(html))){
    links.add(m[1]);
  }
  return Array.from(links);
}

function stripTags(s){
  return s.replace(/<[^>]+>/g,' ').replace(/\s+/g,' ').trim();
}

function parseProfile(html){
  const data = {};
  const re = /<p>\s*<strong>([^<]+)<\/strong><br\s*\/?>([\s\S]*?)<\/p>/g;
  let m;
  while((m=re.exec(html))){
    const label = stripTags(m[1]);
    const valueHtml = m[2];
    let value = stripTags(valueHtml);
    if(label.toLowerCase()==='website'){
      const href = valueHtml.match(/href=\"([^\"]+)\"/i);
      if(href) value = href[1];
    }
    if(label.toLowerCase()==='email'){
      const href = valueHtml.match(/mailto:([^\"\s]+)/i);
      if(href) value = href[1];
    }
    data[label] = value;
  }
  return data;
}

async function scrapeList(listUrl, linkPattern, maxLinks){
  let html = await fetchText(listUrl);
  const total = extractTotalResults(html);
  const perPage = (html.match(/Results\s+\d+\s*-\s*(\d+)\s+of/i)||[])[1];
  const per = perPage?parseInt(perPage,10):20;
  let pages = total?Math.ceil(total/per):1;
  // cap pages if maxLinks provided
  if(maxLinks) pages = Math.min(pages, Math.ceil(maxLinks/per));
  const links = new Set(extractLinks(html, linkPattern));
  for(let p=2;p<=pages;p++){
    const pageUrl = listUrl.includes('?')?`${listUrl}&page=${p}`:`${listUrl}?page=${p}`;
    html = await fetchText(pageUrl);
    extractLinks(html, linkPattern).forEach(l=>links.add(l));
  }
  return Array.from(links);
}

async function main(){
  const leads=[];
  // Developers (Abuja)
  const devLinks = await scrapeList('https://nigeriapropertycentre.com/abuja/developers', '/developers/[^\\\"]+', 120);
  for(const rel of devLinks){
    if(leads.length>=150) break;
    const url = rel.startsWith('http')?rel:`https://nigeriapropertycentre.com${rel}`;
    try{
      const html = await fetchText(url);
      const details = parseProfile(html);
      leads.push({
        name: rel.replace('/developers/','').replace(/-\d+$/,'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
        website: details['Website']||'',
        email: details['Email']||'',
        phone: details['Phone']||details['Whatsapp']||'',
        address: details['Address']||'',
        category: 'Developer',
        notes: 'Nigeria Property Centre profile'
      });
    }catch(e){
      // skip
    }
  }
  // Agents (Abuja) - fill to 150
  if(leads.length<150){
    const needed = 150 - leads.length;
    const agentLinks = await scrapeList('https://nigeriapropertycentre.com/agents?city=abuja', '/agents/[^\\\"]+', needed+20);
    for(const rel of agentLinks){
      if(leads.length>=150) break;
      const url = rel.startsWith('http')?rel:`https://nigeriapropertycentre.com${rel}`;
      try{
        const html = await fetchText(url);
        const details = parseProfile(html);
        leads.push({
          name: rel.replace('/agents/','').replace(/-\d+$/,'').replace(/-/g,' ').replace(/\b\w/g,c=>c.toUpperCase()),
          website: details['Website']||'',
          email: details['Email']||'',
          phone: details['Phone']||details['Whatsapp']||'',
          address: details['Address']||'',
          category: 'Estate Agent',
          notes: 'Nigeria Property Centre profile'
        });
      }catch(e){
        // skip
      }
    }
  }
  // Write CSV
  const header = ['Company Name','Website','Email','Phone','Address','Category','Notes'];
  const rows = [header];
  for(const l of leads){
    rows.push([l.name,l.website,l.email,l.phone,l.address,l.category,l.notes].map(v=>`"${String(v||'').replace(/"/g,'""')}"`));
  }
  fs.writeFileSync('crm/abuja_leads.csv', rows.map(r=>r.join(',')).join('\n'), 'utf8');
  const summary = `Abuja real estate leads generated from Nigeria Property Centre.\nTotal leads: ${leads.length}.\nBreakdown: ${leads.filter(l=>l.category==='Developer').length} developers, ${leads.filter(l=>l.category==='Estate Agent').length} estate agents.\nFields include website/email/phone/address when present on profile. Some entries may lack email/website in source.`;
  fs.writeFileSync('findings.md', summary, 'utf8');
  console.log(summary);
}

main().catch(err=>{console.error(err); process.exit(1);});
