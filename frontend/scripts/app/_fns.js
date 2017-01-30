window.addEventListener('scroll', function() {
    clearTimeout(timer);
    if(!body.classList.contains('disable-hover'))
    {
        body.classList.add('disable-hover')
    }

    timer = setTimeout(function(){
        body.classList.remove('disable-hover')
    }, 500);
}, false);

// Find, Replace, Case
// i.e "Test to see if this works? (Yes|No)".replaceAll('(Yes|No)', 'Yes!');
// i.e.2 "Test to see if this works? (Yes|No)".replaceAll('(yes|no)', 'Yes!', true);
String.prototype.replaceAll = function(_f, _r, _c){ 
    var o = this.toString();
    var r = '';
    var s = o;
    var b = 0;
    var e = -1;
    if(_c){ _f = _f.toLowerCase(); s = o.toLowerCase(); }

    while((e=s.indexOf(_f)) > -1)
    {
        r += o.substring(b, b+e) + _r;
        s = s.substring(e+_f.length, s.length);
        b += e+_f.length;
    }

    // Add Leftover
    if(s.length>0){ r+=o.substring(o.length-s.length, o.length); }

    // Return New String
    return r;
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
      if ( this === undefined || this === null ) {
        throw new TypeError( '"this" is null or not defined' );
      }

      var length = this.length >>> 0; // Hack to convert object.length to a UInt32

      fromIndex = +fromIndex || 0;

      if (Math.abs(fromIndex) === Infinity) {
        fromIndex = 0;
      }

      if (fromIndex < 0) {
        fromIndex += length;
        if (fromIndex < 0) {
          fromIndex = 0;
        }
      }

      for (;fromIndex < length; fromIndex++) {
        if (this[fromIndex] === searchElement) {
          return fromIndex;
        }
      }

      return -1;
    };
};
