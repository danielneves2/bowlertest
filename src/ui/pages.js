// Fixed-card pagination: every item stays reachable without a scrolling panel.
export function pageSlice(items,page,size){if(!Number.isInteger(size)||size<1)throw new RangeError('Page size must be a positive integer');const count=Math.max(1,Math.ceil(items.length/size)),index=Math.max(0,Math.min(Number.isFinite(page)?Math.trunc(page):0,count-1));return {index,count,items:items.slice(index*size,(index+1)*size)};}
export function pager(host,items,{size=4,lang='pt-BR',className='page-items'}={}){
 let page=0;const content=document.createElement(className==='guess-page'?'ol':'div'),nav=document.createElement('nav'),prev=document.createElement('button'),next=document.createElement('button'),count=document.createElement('span');
 content.className=className;nav.className='folio-nav';nav.setAttribute('aria-label',lang==='pt-BR'?'Páginas':'Pages');prev.type=next.type='button';prev.textContent=lang==='pt-BR'?'Anterior':'Previous';next.textContent=lang==='pt-BR'?'Próxima':'Next';count.setAttribute('aria-live','polite');nav.append(prev,count,next);host.append(content,nav);
 function draw(){const slice=pageSlice(items,page,size);page=slice.index;content.replaceChildren(...slice.items);prev.disabled=page===0;next.disabled=page===slice.count-1;count.textContent=`${page+1} / ${slice.count}`;nav.hidden=slice.count===1;}
 prev.onclick=()=>{page--;draw();};next.onclick=()=>{page++;draw();};draw();return {draw,content};
}
