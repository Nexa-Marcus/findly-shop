'use strict';
const products = Array.isArray(window.FINDLY_PRODUCTS) ? window.FINDLY_PRODUCTS.filter(p=>p && p.active!==false) : [];
let activeCategory='Alle', query='';
const cards=document.getElementById('cards'),chips=document.getElementById('chips');
function safeUrl(value){try{const u=new URL(value);return u.protocol==='https:'?u.href:null}catch{return null}}
function render(){
 const categories=['Alle',...new Set(products.map(p=>p.category||'Sonstiges'))];
 if(!categories.includes(activeCategory))activeCategory='Alle';
 chips.replaceChildren();
 for(const category of categories){const button=document.createElement('button');button.className='chip'+(category===activeCategory?' active':'');button.textContent=category;button.addEventListener('click',()=>{activeCategory=category;render()});chips.append(button)}
 const filtered=products.filter(p=>(activeCategory==='Alle'||p.category===activeCategory)&&[p.name,p.description,p.category].join(' ').toLocaleLowerCase('de').includes(query));
 document.getElementById('count').textContent=filtered.length+' Fundstücke';document.getElementById('empty').hidden=filtered.length!==0;cards.replaceChildren();
 for(const p of filtered){
  const card=document.createElement('article');card.className='card';
  const visual=document.createElement('div');visual.className='product-visual';
  const img=safeUrl(p.imageUrl);
  if(img){const image=document.createElement('img');image.src=img;image.alt=p.name||'Produktbild';image.loading='lazy';image.referrerPolicy='no-referrer';image.style.cssText='width:100%;height:100%;object-fit:cover;';image.onerror=()=>{image.remove();visual.textContent=p.emoji||'📦'};visual.append(image)}else{visual.textContent=p.emoji||'📦'}
  const details=document.createElement('div');details.className='product-details';
  const cat=document.createElement('div');cat.className='cat';cat.textContent=p.category||'Fundstück';
  const name=document.createElement('h3');name.textContent=p.name||'Unbenannt';
  const desc=document.createElement('p');desc.textContent=p.description||'';
  details.append(cat,name,desc);
  if(p.price){const price=document.createElement('div');price.className='price-hint';price.textContent='Preis beim Anbieter prüfen · zuletzt eingetragen: '+p.price;details.append(price)}
  const link=safeUrl(p.affiliateUrl);const button=document.createElement('button');button.className='buy';button.textContent=link?'Beim Anbieter ansehen ↗':'Partnerlink folgt';button.disabled=!link;
  if(link){button.classList.add('live');button.addEventListener('click',()=>window.open(link,'_blank','noopener,noreferrer'))}
  details.append(button);card.append(visual,details);cards.append(card);
 }
}
document.getElementById('search').addEventListener('input',e=>{query=e.target.value.trim().toLocaleLowerCase('de');render()});
document.getElementById('year').textContent=new Date().getFullYear();render();
