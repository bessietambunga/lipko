var body = document.body, timer;

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
}

// Simple JavaScript Templating
// John Resig - http://ejohn.org/ - MIT Licensed
;(function(){
    var cache = {};

    this.tmpl = function tmpl(str, data){
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        var fn = !/\W/.test(str) ?
            cache[str] = cache[str] ||
                tmpl(document.getElementById(str).innerHTML) :

            // Generate a reusable function that will serve as a template
            // generator (and which will be cached).
            new Function("obj",
                "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                    "with(obj){p.push('" +

                    // Convert the template into pure JavaScript
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("<%").join("\t")
                        .replace(/((^|%>)[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)%>/g, "',$1,'")
                        .split("\t").join("');")
                        .split("%>").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return p.join('');");

        // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };
})();

(function($) {
    $.app = {
        run: function()
        {
            $.app.module.submarine.init();
            $.app.module.form_ajax();
            $.app.module.resize(function(){ }, 500);

            $('.header-logo').on('click', function(e){
                e.preventDefault();
                var vh = $(window).height();
                
                $('#wrapper-main').find('.wrapper-main').css({ 'height': vh, 'top': -vh });
                $('#wrapper-main').find('.wrapper-main').stop().show().animate({ 'top': '0' }, 250, function(){
                    $('#wrapper-main').addClass('wrapper-main-open');
                });
            });

            $(".integer").on('keypress', function (e) { if( [0, 8].indexOf( e.which ) < 0 && ( e.which < 48 || e.which > 57 ) ) { return false; } });
            
            $('body').on('click', '.toggle-trigger', function(e){
                e.preventDefault();

                var id = $(this).attr('href');
                if( $(id).length > 0 )
                {
                    if( $(this).hasClass('ul_list-item_link-drop') )
                    {
                        $(this).toggleClass('ul_list-item_link-drop-up');
                    }

                    $(id).slideToggle(150);
                    $('html, body').animate({ scrollTop: $(this).offset().top }, 'slow');
                }
            });

            if( typeof $.initPopups !== 'undefined' )
            {
                $.initPopups();

                if(window.location.hash.length > 1 && $(window.location.hash).hasClass('popup') )
                {
                    try {
                        $.popup.open(window.location.hash.substr(1));
                    }
                    catch(e) {}
                }
            }
        },
        module: {
            submarine: {
                timeout: 20000,
                element: '#submarine',
                move: function(_go_)
                {
                    var _self_ = this, timeout = _self_.timeout;
                    _go_ = window.innerWidth - _go_ - 298;
                    
                    if(_go_ > window.innerWidth)
                    {
                        _go_ = window.innerWidth;
                    }

                    if(typeof($.cookie('_go_')) !== 'undefined')
                    {
                        _go_ = $.cookie('_go_');
                    }

                    $.cookie('_go_', _go_, { expires: 7, path: '/' });

                    if(typeof($.cookie('coordinate')) !== 'undefined' && $.cookie('coordinate') !== '')
                    {
                        var coord = Math.floor($.cookie('coordinate'));
                        
                        $(_self_.element).css({ 'left': coord });

                        var percent = 100 - Math.floor(((window.innerWidth - coord) * 100) / window.innerWidth);
                        var timeout = timeout - ( timeout * percent / 100);
                    }
                   
                    $(_self_.element).stop().animate({ left: _go_ }, { duration: timeout, step: function(now, fx) {
                        
                        $.cookie('coordinate', now, { expires: 7, path: '/' });

                        if(now == _go_)
                        {
                            $(_self_.element).toggleClass('footer-submarine-reverse');

                            $.removeCookie('coordinate', { path: '/' });
                            $.removeCookie('_go_', { path: '/' });

                            $.app.module.submarine.move(_go_);
                        }
                    }});
                },
                rotate: function( deg )
                {
                    $(this.element).find('.footer-submarine-inner').stop().animate({ rotation: deg }, { duration: 1800, step: function(now, fx) {
                        $(this).css({"transform": "rotate("+now+"deg)"});
                        if(now == deg)
                        {
                            $.app.module.submarine.rotate((deg*-1));
                        }
                    }});
                },
                init: function()
                {
                    this.rotate(6);
                    this.move(0);
                }
            },
            resize: function( callback, time )
            {
                $(window).resize(function(e){
                    window.resizeEvt;
                    $(window).resize(function(){
                    clearTimeout(window.resizeEvt);
                        window.resizeEvt = setTimeout(function(){
                            callback.apply();
                        }, time);
                    });
                });
            },
            googleMap: function()
            {
                var mapOptions = {
                    zoom: 16,
                    zoomControl: !0,
                    zoomControlOptions: {
                        style: google.maps.ZoomControlStyle.LARGE,
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    panControl: !0,
                    panControlOptions: {
                        position: google.maps.ControlPosition.LEFT_TOP
                    },
                    scrollwheel: !1,
                    navigationControl: !1,
                    mapTypeControl: !1,
                    scaleControl: !1,
                    draggable: !0,
                    styles: [
                        {
                            stylers: [
                                { hue: '#adced5' }
                            ]
                        },
                        {
                            elementType: 'labels',
                            stylers: [
                                { visibility: 'on' }
                            ]
                        },
                        {
                            featureType: 'water',
                            stylers: [
                                { color: '#c9dfe4' }
                            ]
                        }
                    ],
                    disableDoubleClickZoom: !0,
                    center: new google.maps.LatLng(43.569787, 39.756362)
                };

                var map = new google.maps.Map(document.getElementById( 'map-conteiner' ), mapOptions);
                
                var bullet = {
                    url: 'images/map-bullet.png',
                    size: new google.maps.Size(39, 52),
                    origin: new google.maps.Point(0,0),
                    anchor: new google.maps.Point(39, 52)
                };
                
                new google.maps.Marker({
                    position: new google.maps.LatLng(43.569787, 39.756362),
                    map: map,
                    icon: bullet
                });
            },
            cache: function( s, cb )
            {
                try {
                    var a, g = [], i, x, cnt = s.length, p = { i: {}, ac: 0, c: 0 }, cb = cb || function(){};
                    
                    function y( index, src )
                    {
                        g.push( src );
                        
                        if( g.length >= cnt )
                        {
                            cb.call();
                        }
                        
                        p.c++
                    }

                    for (x in s)
                    {
                        a = s[x];
                        
                        i = new Image();
                        i.src = a;

                        i.onload = y( x, a );

                        p.i[a] = i;
                        p.ac++
                    }
                }
                catch(e) {}
            },
            retina: function()
            {
                if( 'devicePixelRatio' in window && window.devicePixelRatio == 2 )
                {
                    var i=0, src, img = $( 'img.replace-2x' ).get(), l = img.length;
                    for (i; i<l; i++)
                    {
                        src = img[i].src;
                        src = src.replace(/\.(png|jpg|gif)+$/i, '@2x.$1');
                        img[i].src = src;
                    }
                }
            },
            isUndefined: function( obj )
            {
                return obj === void 0;
            },
            updateImage: function(element)
            {
                if( $(element).length > 0 ) {
                    var image = $(element).attr('src').split( '?' )[0] ;
                    $(element).attr('src', image + '?v=' + Math.random() );
                }
                return false;
            },
            random: function(min, max)
            {
                min = min || 0 ;
                max = max || 100 ;
                return Math.floor(Math.random() * ( max - min + 1 )) + min ;
            }
        }
    };

    $.app.movies = {};
    $.app.movies.load = function() {
        alert( 'load more' );
        return false;
    };

    $.app.module.form_validation_default = function($form, errors) {
        $form.find('.form_error_block').hide();
        $form.find('.error').removeClass('error');
        $form.find('.checkbox__label-error').removeClass('checkbox__label-error');
        if(errors) {
            var $error_block = $('#form-errors');
            $error_block.html('');

            for(fieldName in errors)
            {
                $field = $form.find('input[name="'+fieldName+'"]');
                $error_block.append(
                    [
                        '<span>',
                        $field.data('error'),
                        '</span>'
                    ].join('')
                );
            }
        }
    };

    $.app.callback_stack = {};
    $.app.callback_stack.form_ajax_default = function($form, response) {
        if(response.status) {
            if(response.hasOwnProperty('redirect_url')) {
                window.location.href = response.redirect_url;
            }
        }
        else if(response.errors) {
            $.app.module.form_validation_default($form, response.errors);
        }
        
        if(response.hasOwnProperty('message')) {
            $.popup.message(response.title, response.message);
        }
    };

    $.app.module.form_ajax = function() {
        $('body').on('submit' ,'.form-ajax', function(e) {
            var $form = $(this);
            e.preventDefault();
            
            $.ajax({
                url: $form.attr('action'),
                type: ($form.attr('method') || 'post'),
                data: $form.serialize(),
                dataType: 'json',
                success: function(response)
                {
                    if($form.data('callback') && $.app.callback_stack.hasOwnProperty($form.data('callback'))) {
                        $.app.callback_stack[$form.data('callback')]($form, response);
                    }
                    else {
                        $.app.callback_stack.form_ajax_default($form, response);
                    }

                    if( response.status === true && response.message !== '' )
                    {
                        $.popup.message( response.title, response.message );
                    }
                },
                error: function(response)
                {
                    $.app.callback_stack.form_ajax_default($form, response);
                    alert("error");
                }
            });
        });
    };

    $.app.module.upload_button = function(){
        $('body').on('submit' ,'.form-file-upload', function(e) {
            return AIM.submit(this, {
                onStart: function()
                {

                },
                onComplete: function( result )
                {
                    if( typeof result === 'object' && result.status === true && typeof result.photo_url !== 'undefined' )
                    { }
                }
            });
        });
        
        $(document).on('change', '.upload_button_onchange', function(){
            if( $(this).closest('.upload_button').find('.upload_button_field').length > 0 )
            {
                $(this).closest('.upload_button').find('.upload_button_field').html( $(this).val() );
            }
        });
    };

    $.app.custom_placeholder = function() {
        if (Modernizr.touch) {
            return;
        }

        $('input, textarea').each(function() {
            var $input = $(this), $inputWrapper, $placeholder, placeholderText = $input.attr('placeholder');
            if(placeholderText) {
                $inputWrapper = $input.parent();
                $placeholder = $('<div class="default-input__placeholder" style="line-height: '+($input.is('textarea') ? '36px' : ( $inputWrapper.innerHeight() == 0 ? '36' : $inputWrapper.innerHeight() )+'px')+'">'+placeholderText+'</div>');
                $placeholder[$input.val().length ? 'hide' : 'show']();
                $input.addClass('custom-placeholder').attr('placeholder', '');
                $inputWrapper.append($placeholder);
            }
        });
        
        $('body').on('blur', '.custom-placeholder', function() {
            var $this = $(this);
            if(!$this.val().length) {
                $this.parent().find('.default-input__placeholder').show();
            }
        });
        $('body').on('focus', '.custom-placeholder', function() {
            $(this).parent().find('.default-input__placeholder').hide();
        });

        $('body').on('click', '.default-input__placeholder', function() {
            var $this = $(this);
    
            $this.hide();
            $this.parent().find('.custom-placeholder').trigger('focus');
        });
        $('body').on('selectstart', '.default-input__placeholder', false);
    };

    $.app.run();
})(jQuery);