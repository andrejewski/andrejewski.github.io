
(function() {
  if(!window.localStorage) return;
  // modified http://joelcalifa.com/blog/revisiting-visited
  localStorage.setItem('visited-'+window.location.pathname,true);
  Array.prototype.slice.call(document.getElementsByTagName('a'), 0)
    .forEach(function(link) {
      if(link.host !== window.location.host) return;
      var path = link.pathname;
      if(path.slice(-1) !== '/') path += '/';
      if(localStorage.getItem('visited-' + path)) {
        link.dataset.visited = true;
      }
    });
}).call(this);

