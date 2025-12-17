(function(){
  const domain = 'http://sga.santos-tech.com';
  function fixHref(href){
    if(!href) return href;
    // replace old domain
    href = href.replace(/https?:\/\/(hyperxarenalasvegas.com)/g, domain);
    // if ends with .html -> remove and make absolute on domain
    if(/\.html$/.test(href)){
      const p = href.replace(/^\.\//,'').replace(/^\//,'').replace(/\.html$/,'');
      if(p === 'index') return domain + '/';
      return domain + '/' + p;
    }
    return href;
  }

  document.addEventListener('DOMContentLoaded', ()=>{
    document.querySelectorAll('a[href]').forEach(a => {
      const old = a.getAttribute('href');
      const updated = fixHref(old);
      if(updated && updated !== old) a.setAttribute('href', updated);
    });

    document.querySelectorAll('link[href]').forEach(l => {
      const old = l.getAttribute('href');
      const updated = fixHref(old);
      if(updated && updated !== old) l.setAttribute('href', updated);
    });

    document.querySelectorAll('script[src]').forEach(s => {
      const old = s.getAttribute('src');
      const updated = fixHref(old);
      if(updated && updated !== old) s.setAttribute('src', updated);
    });
  });
})();