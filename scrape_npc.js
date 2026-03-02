(async()=>{
  const html=await (await fetch('https://nigeriapropertycentre.com/abuja/estate-agents')).text();
  const matches=[...html.matchAll(/href=\"([^\"]*agent[^\"]*)\"/gi)];
  console.log('matches',matches.length);
  console.log(matches.slice(0,10).map(m=>m[1]));
})();
