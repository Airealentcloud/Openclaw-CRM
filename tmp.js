(async()=>{
 const profile='https://nigeriapropertycentre.com/agents/01-wealthy-heirs-realty-208355';
 const html=await (await fetch(profile)).text();
 const idx=html.indexOf('Address');
 console.log(html.slice(idx-200, idx+400));
})();
