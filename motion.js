/* Progressive enhancement: content stays readable without JS or observers. */
(function(){
 'use strict';
 var reduced=window.matchMedia('(prefers-reduced-motion: reduce)');
 if(reduced.matches||!('IntersectionObserver' in window))return;
 var seen=new WeakSet();
 var observer=new IntersectionObserver(function(entries){entries.forEach(function(entry){if(entry.isIntersecting){entry.target.classList.add('pm-visible');observer.unobserve(entry.target);}});},{threshold:.08});
 function reveal(root){
  root.querySelectorAll('.service,.case,.ml-card,.rv-card').forEach(function(el){
   if(seen.has(el))return;seen.add(el);el.classList.add('pm-reveal');observer.observe(el);
  });
 }
 function results(){document.querySelectorAll('#aiResults .ai-card').forEach(function(el,i){el.style.setProperty('--pm-delay',Math.min(i,11)*50+'ms');el.classList.add('pm-result');});}
 function init(){
  reveal(document);
  var search=document.getElementById('aiResults');
  if(search)new MutationObserver(results).observe(search,{childList:true});
  var reviews=document.getElementById('rvGrid')||document.querySelector('.rv-grid');
  if(reviews){
   var known=new Set(),loaded=false;
   function reviewChange(){
    var cards=reviews.querySelectorAll('.rv-card');
    if(!cards.length)return;
    cards.forEach(function(node){var id=node.getAttribute('data-review-id');if(id&&loaded&&!known.has(id))node.classList.add('pm-review-new');if(id)known.add(id);});
    if(!loaded)reveal(reviews);loaded=true;
   }
   reviewChange();new MutationObserver(reviewChange).observe(reviews,{childList:true});
  }
  var grid=document.getElementById('servicesGrid');if(grid)new MutationObserver(function(){reveal(grid.parentElement);}).observe(grid,{childList:true});
  var library=document.getElementById('mlGrid');if(library)new MutationObserver(function(){reveal(library);}).observe(library,{childList:true});
  var cases=document.getElementById('casesGrid');if(cases)new MutationObserver(function(){reveal(cases.parentElement);}).observe(cases,{childList:true});
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
 reduced.addEventListener('change',function(e){if(e.matches){observer.disconnect();document.querySelectorAll('.pm-reveal').forEach(function(el){el.classList.add('pm-visible');});}});
})();
