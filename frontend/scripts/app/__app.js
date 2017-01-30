var body = document.body, timer;
;(function($) {
    $.app = {
        sandwich: {
            config: {
                keyHooks: !1,
                selector: '.js-sandwich-menu',
                wrapper: '.wrapper',
                overlay: '.menu-overlay'
            },

            extend: function(config)
            {
                var _this = this;

                if (typeof config !== 'undefined')
                {
                    var x;
                    for (x in config)
                    {
                        if (typeof _this.config[x] !== 'undefined')
                            _this.config[x] = config[x];
                    }
                }
            },

            isOpen: function()
            {
                return $('body').hasClass('page-visible');
            },

            hide: function()
            {
                $('body').removeClass('page-open');

                setTimeout(function(){
                    $('body').removeClass('page-visible');
                }, 10);

                $(this.config.overlay).css({
                    'visibility': 'hidden'
                });
            },

            toggle: function()
            {
                if ($('body').hasClass('page-visible'))
                {
                    $('body').removeClass('page-open');

                    setTimeout(function(){
                        $('body').removeClass('page-visible');
                    }, 200);
                }
                else
                {
                    $('body').addClass('page-open');

                    setTimeout(function(){
                        $('body').addClass('page-visible');
                    }, 10);
                }

                var visibility = 'visible';

                if (!$('body').hasClass('page-open'))
                {
                    visibility = 'hidden'
                }
                
                $(_this.config.overlay).css({
                    'visibility': visibility
                });
            },

            sandwichTrigger: function()
            {
                var _this = this;

                if (_this.config.keyHooks)
                {
                    $('body').on('keydown', function(e) {
                        if(e.keyCode == 27 && _this.isOpen())
                        {
                            _this.toggle();
                        }
                    });
                };

                $('body').on('click', _this.config.selector, function(e){
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    _this.toggle();
                });
            },

            overlayTrigger: function()
            {
                var _this = this;

                $('body').on('click', _this.config.overlay, function(e){
                    _this.hide();
                });
            },

            init: function(config)
            {
                this.extend(config);
                this.sandwichTrigger();
                this.overlayTrigger();
            }
        },

        run: function()
        {
            $.app.sandwich.init();
            $.app.module.bear.init();
            $.app.module.form_ajax();
            $.app.module.resize(function(){ }, 500);

            $(".integer").on('keypress', function (e) { if( [0, 8].indexOf( e.which ) < 0 && ( e.which < 48 || e.which > 57 ) ) { return false; } });
            
            $('body').on('click', '.insert-cart-trigger', function(e){
                e.preventDefault();

                var $button = $(this);

                if (!$button.hasClass('in-cart')) {
                    var $id = $(this).data('id_product');
                    
                    $.post("/cart/insert/", {
                        action: 'insert',
                        id: $id,
                        quantity: 1
                    }, function( data ) {
                        $('#total_count').text(data);
                        $button.html("В корзине").addClass("in-cart");
                    });

                    if (!$('#added_in_basket').length) {
                        var popover = [
                            '<div class="popover" id="added_in_basket">',
                                '<div class="form-order__complete">',
                                   '<div class="form-order__complete__middle">',
                                       'Товар',
                                       '<span class="form-order__complete__icon"></span>добавлен в корзину',
                                   '</div>',
                                '</div>',
                            '</div>',
                        ].join('');

                        $('body').append(popover);

                        setTimeout(function(){
                            $('#added_in_basket').fadeOut(800, function() {
                                $(this).remove();
                            })
                        }, 500);
                    }
                }

                return false;
            });

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
        
            $('body').on('click', '.nav-list-item-link', function(e){
                var $close = $(this).closest('.nav-list-item');

                if ($close.find('.submenu').length && !$close.hasClass('opened'))
                {
                    e.preventDefault();

                    $close.addClass('opened');

                    return false;    
                }
            });

            $('body').on('mouseenter', '.nav-list-item', function(e){
                if ($(this).find('.submenu').length)
                {
                    var $this = $(this),
                        $submenu = $this.find('.submenu');

                    setTimeout(function(){
                        $submenu.addClass('is-show');

                        setTimeout(function(){
                            $submenu.addClass('is-animate');
                        }, 10);
                    }, 50);
                }
            });
            
            $('body').on('mouseleave', '.nav-list-item', function(e){
                if ($(this).find('.submenu').length)
                {
                    var $this = $(this),
                        $submenu = $this.find('.submenu');

                    setTimeout(function(){
                        $submenu.removeClass('is-animate');

                        setTimeout(function(){
                            $submenu.removeClass('is-show');
                        }, 250);
                    }, 50);
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
            bear: {
                timeout: 20000,
                element: '#bear',
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
                            $(_self_.element).toggleClass('footer-bear-reverse');

                            $.removeCookie('coordinate', { path: '/' });
                            $.removeCookie('_go_', { path: '/' });

                            $.app.module.bear.move(_go_);
                        }
                    }});
                },
                rotate: function( deg )
                {
                    $(this.element).find('.footer-bear-inner').stop().animate({ rotation: deg }, { duration: 1800, step: function(now, fx) {
                        $(this).css({"transform": "rotate("+now+"deg)"});
                        if(now == deg)
                        {
                            $.app.module.bear.rotate((deg*-1));
                        }
                    }});
                },
                init: function()
                {
                    if ($(window).width() > 960)
                    {
                        this.rotate(6);
                        this.move(0);
                    }
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