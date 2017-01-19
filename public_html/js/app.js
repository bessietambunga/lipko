'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var body = document.body,
    timer;

// // Simple JavaScript Templating
// // John Resig - http://ejohn.org/ - MIT Licensed
// var tmpl = null;
// ;(function(){
//     var cache = {};

//     this.tmpl = function tmpl(str, data){
//         // Figure out if we're getting a template, or if we need to
//         // load the template - and be sure to cache the result.
//         var fn = !/\W/.test(str) ?
//             cache[str] = cache[str] ||
//                 tmpl(document.getElementById(str).innerHTML) :

//             // Generate a reusable function that will serve as a template
//             // generator (and which will be cached).
//             new Function("obj",
//                 "var p=[],print=function(){p.push.apply(p,arguments);};" +

//                     // Introduce the data as local variables using with(){}
//                     "with(obj){p.push('" +

//                     // Convert the template into pure JavaScript
//                     str
//                         .replace(/[\r\t\n]/g, " ")
//                         .split("<%").join("\t")
//                         .replace(/((^|%>)[^\t]*)'/g, "$1\r")
//                         .replace(/\t=(.*?)%>/g, "',$1,'")
//                         .split("\t").join("');")
//                         .split("%>").join("p.push('")
//                         .split("\r").join("\\'")
//                     + "');}return p.join('');");

//         // Provide some basic currying to the user
//         return data ? fn( data ) : fn;
//     };
// })();

window.addEventListener('scroll', function () {
    clearTimeout(timer);
    if (!body.classList.contains('disable-hover')) {
        body.classList.add('disable-hover');
    }

    timer = setTimeout(function () {
        body.classList.remove('disable-hover');
    }, 500);
}, false);

// Find, Replace, Case
// i.e "Test to see if this works? (Yes|No)".replaceAll('(Yes|No)', 'Yes!');
// i.e.2 "Test to see if this works? (Yes|No)".replaceAll('(yes|no)', 'Yes!', true);
String.prototype.replaceAll = function (_f, _r, _c) {
    var o = this.toString();
    var r = '';
    var s = o;
    var b = 0;
    var e = -1;
    if (_c) {
        _f = _f.toLowerCase();s = o.toLowerCase();
    }

    while ((e = s.indexOf(_f)) > -1) {
        r += o.substring(b, b + e) + _r;
        s = s.substring(e + _f.length, s.length);
        b += e + _f.length;
    }

    // Add Leftover
    if (s.length > 0) {
        r += o.substring(o.length - s.length, o.length);
    }

    // Return New String
    return r;
};

if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function (searchElement, fromIndex) {
        if (this === undefined || this === null) {
            throw new TypeError('"this" is null or not defined');
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

        for (; fromIndex < length; fromIndex++) {
            if (this[fromIndex] === searchElement) {
                return fromIndex;
            }
        }

        return -1;
    };
}

(function ($) {
    $.app = {
        sandwich: {
            config: {
                keyHooks: !1,
                selector: '.js-sandwich-menu',
                wrapper: '.wrapper',
                overlay: '.menu-overlay'
            },

            extend: function extend(config) {
                var _this = this;

                if (typeof config !== 'undefined') {
                    var x;
                    for (x in config) {
                        if (typeof _this.config[x] !== 'undefined') _this.config[x] = config[x];
                    }
                }
            },

            isOpen: function isOpen() {
                return $('body').hasClass('page-visible');
            },

            hide: function hide() {
                $('body').removeClass('page-open');

                setTimeout(function () {
                    $('body').removeClass('page-visible');
                }, 10);

                $(this.config.overlay).css({
                    'visibility': 'hidden'
                });
            },

            toggle: function toggle() {
                if ($('body').hasClass('page-visible')) {
                    $('body').removeClass('page-open');

                    setTimeout(function () {
                        $('body').removeClass('page-visible');
                    }, 200);
                } else {
                    $('body').addClass('page-open');

                    setTimeout(function () {
                        $('body').addClass('page-visible');
                    }, 10);
                }

                var visibility = 'visible';

                if (!$('body').hasClass('page-open')) {
                    visibility = 'hidden';
                }

                $(_this.config.overlay).css({
                    'visibility': visibility
                });
            },

            sandwichTrigger: function sandwichTrigger() {
                var _this = this;

                if (_this.config.keyHooks) {
                    $('body').on('keydown', function (e) {
                        if (e.keyCode == 27 && _this.isOpen()) {
                            _this.toggle();
                        }
                    });
                };

                $('body').on('click', _this.config.selector, function (e) {
                    e.preventDefault ? e.preventDefault() : e.returnValue = false;
                    _this.toggle();
                });
            },

            overlayTrigger: function overlayTrigger() {
                var _this = this;

                $('body').on('click', _this.config.overlay, function (e) {
                    _this.hide();
                });
            },

            init: function init(config) {
                this.extend(config);
                this.sandwichTrigger();
                this.overlayTrigger();
            }
        },

        run: function run() {
            $.app.sandwich.init();
            $.app.module.bear.init();
            $.app.module.form_ajax();
            $.app.module.resize(function () {}, 500);

            $(".integer").on('keypress', function (e) {
                if ([0, 8].indexOf(e.which) < 0 && (e.which < 48 || e.which > 57)) {
                    return false;
                }
            });

            $('body').on('click', '.insert-cart-trigger', function (e) {
                e.preventDefault();

                var $button = $(this);

                if (!$button.hasClass('in-cart')) {
                    var $id = $(this).data('id_product');

                    $.post("/cart/insert/", {
                        action: 'insert',
                        id: $id,
                        quantity: 1
                    }, function (data) {
                        $('#total_count').text(data);
                        $button.html("В корзине").addClass("in-cart");
                    });

                    if (!$('#added_in_basket').length) {
                        var popover = ['<div class="popover" id="added_in_basket">', '<div class="form-order__complete">', '<div class="form-order__complete__middle">', 'Товар', '<span class="form-order__complete__icon"></span>добавлен в корзину', '</div>', '</div>', '</div>'].join('');

                        $('body').append(popover);

                        setTimeout(function () {
                            $('#added_in_basket').fadeOut(800, function () {
                                $(this).remove();
                            });
                        }, 500);
                    }
                }
            });

            $('body').on('click', '.toggle-trigger', function (e) {
                e.preventDefault();

                var id = $(this).attr('href');
                if ($(id).length > 0) {
                    if ($(this).hasClass('ul_list-item_link-drop')) {
                        $(this).toggleClass('ul_list-item_link-drop-up');
                    }

                    $(id).slideToggle(150);
                    $('html, body').animate({ scrollTop: $(this).offset().top }, 'slow');
                }
            });

            $('body').on('click', '.nav-list-item-link', function (e) {
                var $close = $(this).closest('.nav-list-item');

                if ($close.find('.submenu').length && !$close.hasClass('opened')) {
                    e.preventDefault();

                    $close.addClass('opened');

                    return false;
                }
            });

            $('body').on('mouseenter', '.nav-list-item', function (e) {
                if ($(this).find('.submenu').length) {
                    var $this = $(this),
                        $submenu = $this.find('.submenu');

                    setTimeout(function () {
                        $submenu.addClass('is-show');

                        setTimeout(function () {
                            $submenu.addClass('is-animate');
                        }, 10);
                    }, 50);
                }
            });

            $('body').on('mouseleave', '.nav-list-item', function (e) {
                if ($(this).find('.submenu').length) {
                    var $this = $(this),
                        $submenu = $this.find('.submenu');

                    setTimeout(function () {
                        $submenu.removeClass('is-animate');

                        setTimeout(function () {
                            $submenu.removeClass('is-show');
                        }, 250);
                    }, 50);
                }
            });

            if (typeof $.initPopups !== 'undefined') {
                $.initPopups();

                if (window.location.hash.length > 1 && $(window.location.hash).hasClass('popup')) {
                    try {
                        $.popup.open(window.location.hash.substr(1));
                    } catch (e) {}
                }
            }
        },
        module: {
            bear: {
                timeout: 20000,
                element: '#bear',
                move: function move(_go_) {
                    var _self_ = this,
                        timeout = _self_.timeout;
                    _go_ = window.innerWidth - _go_ - 298;

                    if (_go_ > window.innerWidth) {
                        _go_ = window.innerWidth;
                    }

                    if (typeof $.cookie('_go_') !== 'undefined') {
                        _go_ = $.cookie('_go_');
                    }

                    $.cookie('_go_', _go_, { expires: 7, path: '/' });

                    if (typeof $.cookie('coordinate') !== 'undefined' && $.cookie('coordinate') !== '') {
                        var coord = Math.floor($.cookie('coordinate'));

                        $(_self_.element).css({ 'left': coord });

                        var percent = 100 - Math.floor((window.innerWidth - coord) * 100 / window.innerWidth);
                        var timeout = timeout - timeout * percent / 100;
                    }

                    $(_self_.element).stop().animate({ left: _go_ }, { duration: timeout, step: function step(now, fx) {

                            $.cookie('coordinate', now, { expires: 7, path: '/' });

                            if (now == _go_) {
                                $(_self_.element).toggleClass('footer-bear-reverse');

                                $.removeCookie('coordinate', { path: '/' });
                                $.removeCookie('_go_', { path: '/' });

                                $.app.module.bear.move(_go_);
                            }
                        } });
                },
                rotate: function rotate(deg) {
                    $(this.element).find('.footer-bear-inner').stop().animate({ rotation: deg }, { duration: 1800, step: function step(now, fx) {
                            $(this).css({ "transform": "rotate(" + now + "deg)" });
                            if (now == deg) {
                                $.app.module.bear.rotate(deg * -1);
                            }
                        } });
                },
                init: function init() {
                    if ($(window).width() > 960) {
                        this.rotate(6);
                        this.move(0);
                    }
                }
            },
            resize: function resize(callback, time) {
                $(window).resize(function (e) {
                    window.resizeEvt;
                    $(window).resize(function () {
                        clearTimeout(window.resizeEvt);
                        window.resizeEvt = setTimeout(function () {
                            callback.apply();
                        }, time);
                    });
                });
            },
            googleMap: function googleMap() {
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
                    styles: [{
                        stylers: [{ hue: '#adced5' }]
                    }, {
                        elementType: 'labels',
                        stylers: [{ visibility: 'on' }]
                    }, {
                        featureType: 'water',
                        stylers: [{ color: '#c9dfe4' }]
                    }],
                    disableDoubleClickZoom: !0,
                    center: new google.maps.LatLng(43.569787, 39.756362)
                };

                var map = new google.maps.Map(document.getElementById('map-conteiner'), mapOptions);

                var bullet = {
                    url: 'images/map-bullet.png',
                    size: new google.maps.Size(39, 52),
                    origin: new google.maps.Point(0, 0),
                    anchor: new google.maps.Point(39, 52)
                };

                new google.maps.Marker({
                    position: new google.maps.LatLng(43.569787, 39.756362),
                    map: map,
                    icon: bullet
                });
            },
            cache: function cache(s, cb) {
                try {
                    var y = function y(index, src) {
                        g.push(src);

                        if (g.length >= cnt) {
                            cb.call();
                        }

                        p.c++;
                    };

                    var a,
                        g = [],
                        i,
                        x,
                        cnt = s.length,
                        p = { i: {}, ac: 0, c: 0 },
                        cb = cb || function () {};

                    for (x in s) {
                        a = s[x];

                        i = new Image();
                        i.src = a;

                        i.onload = y(x, a);

                        p.i[a] = i;
                        p.ac++;
                    }
                } catch (e) {}
            },
            retina: function retina() {
                if ('devicePixelRatio' in window && window.devicePixelRatio == 2) {
                    var i = 0,
                        src,
                        img = $('img.replace-2x').get(),
                        l = img.length;
                    for (i; i < l; i++) {
                        src = img[i].src;
                        src = src.replace(/\.(png|jpg|gif)+$/i, '@2x.$1');
                        img[i].src = src;
                    }
                }
            },
            isUndefined: function isUndefined(obj) {
                return obj === void 0;
            },
            updateImage: function updateImage(element) {
                if ($(element).length > 0) {
                    var image = $(element).attr('src').split('?')[0];
                    $(element).attr('src', image + '?v=' + Math.random());
                }
                return false;
            },
            random: function random(min, max) {
                min = min || 0;
                max = max || 100;
                return Math.floor(Math.random() * (max - min + 1)) + min;
            }
        }
    };

    $.app.movies = {};
    $.app.movies.load = function () {
        alert('load more');
        return false;
    };

    $.app.module.form_validation_default = function ($form, errors) {
        $form.find('.form_error_block').hide();
        $form.find('.error').removeClass('error');
        $form.find('.checkbox__label-error').removeClass('checkbox__label-error');
        if (errors) {
            var $error_block = $('#form-errors');
            $error_block.html('');

            for (fieldName in errors) {
                $field = $form.find('input[name="' + fieldName + '"]');
                $error_block.append(['<span>', $field.data('error'), '</span>'].join(''));
            }
        }
    };

    $.app.callback_stack = {};
    $.app.callback_stack.form_ajax_default = function ($form, response) {
        if (response.status) {
            if (response.hasOwnProperty('redirect_url')) {
                window.location.href = response.redirect_url;
            }
        } else if (response.errors) {
            $.app.module.form_validation_default($form, response.errors);
        }

        if (response.hasOwnProperty('message')) {
            $.popup.message(response.title, response.message);
        }
    };

    $.app.module.form_ajax = function () {
        $('body').on('submit', '.form-ajax', function (e) {
            var $form = $(this);
            e.preventDefault();

            $.ajax({
                url: $form.attr('action'),
                type: $form.attr('method') || 'post',
                data: $form.serialize(),
                dataType: 'json',
                success: function success(response) {
                    if ($form.data('callback') && $.app.callback_stack.hasOwnProperty($form.data('callback'))) {
                        $.app.callback_stack[$form.data('callback')]($form, response);
                    } else {
                        $.app.callback_stack.form_ajax_default($form, response);
                    }

                    if (response.status === true && response.message !== '') {
                        $.popup.message(response.title, response.message);
                    }
                },
                error: function error(response) {
                    $.app.callback_stack.form_ajax_default($form, response);
                    alert("error");
                }
            });
        });
    };

    $.app.module.upload_button = function () {
        $('body').on('submit', '.form-file-upload', function (e) {
            return AIM.submit(this, {
                onStart: function onStart() {},
                onComplete: function onComplete(result) {
                    if ((typeof result === 'undefined' ? 'undefined' : _typeof(result)) === 'object' && result.status === true && typeof result.photo_url !== 'undefined') {}
                }
            });
        });

        $(document).on('change', '.upload_button_onchange', function () {
            if ($(this).closest('.upload_button').find('.upload_button_field').length > 0) {
                $(this).closest('.upload_button').find('.upload_button_field').html($(this).val());
            }
        });
    };

    $.app.custom_placeholder = function () {
        if (Modernizr.touch) {
            return;
        }

        $('input, textarea').each(function () {
            var $input = $(this),
                $inputWrapper,
                $placeholder,
                placeholderText = $input.attr('placeholder');
            if (placeholderText) {
                $inputWrapper = $input.parent();
                $placeholder = $('<div class="default-input__placeholder" style="line-height: ' + ($input.is('textarea') ? '36px' : ($inputWrapper.innerHeight() == 0 ? '36' : $inputWrapper.innerHeight()) + 'px') + '">' + placeholderText + '</div>');
                $placeholder[$input.val().length ? 'hide' : 'show']();
                $input.addClass('custom-placeholder').attr('placeholder', '');
                $inputWrapper.append($placeholder);
            }
        });

        $('body').on('blur', '.custom-placeholder', function () {
            var $this = $(this);
            if (!$this.val().length) {
                $this.parent().find('.default-input__placeholder').show();
            }
        });
        $('body').on('focus', '.custom-placeholder', function () {
            $(this).parent().find('.default-input__placeholder').hide();
        });

        $('body').on('click', '.default-input__placeholder', function () {
            var $this = $(this);

            $this.hide();
            $this.parent().find('.custom-placeholder').trigger('focus');
        });
        $('body').on('selectstart', '.default-input__placeholder', false);
    };

    $.app.run();
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fYXBwLmpzIl0sIm5hbWVzIjpbImJvZHkiLCJkb2N1bWVudCIsInRpbWVyIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsZWFyVGltZW91dCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWRkIiwic2V0VGltZW91dCIsInJlbW92ZSIsIlN0cmluZyIsInByb3RvdHlwZSIsInJlcGxhY2VBbGwiLCJfZiIsIl9yIiwiX2MiLCJvIiwidG9TdHJpbmciLCJyIiwicyIsImIiLCJlIiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwibGVuZ3RoIiwiQXJyYXkiLCJzZWFyY2hFbGVtZW50IiwiZnJvbUluZGV4IiwidW5kZWZpbmVkIiwiVHlwZUVycm9yIiwiTWF0aCIsImFicyIsIkluZmluaXR5IiwiJCIsImFwcCIsInNhbmR3aWNoIiwiY29uZmlnIiwia2V5SG9va3MiLCJzZWxlY3RvciIsIndyYXBwZXIiLCJvdmVybGF5IiwiZXh0ZW5kIiwiX3RoaXMiLCJ4IiwiaXNPcGVuIiwiaGFzQ2xhc3MiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJjc3MiLCJ0b2dnbGUiLCJhZGRDbGFzcyIsInZpc2liaWxpdHkiLCJzYW5kd2ljaFRyaWdnZXIiLCJvbiIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsInJldHVyblZhbHVlIiwib3ZlcmxheVRyaWdnZXIiLCJpbml0IiwicnVuIiwibW9kdWxlIiwiYmVhciIsImZvcm1fYWpheCIsInJlc2l6ZSIsIndoaWNoIiwiJGJ1dHRvbiIsIiRpZCIsImRhdGEiLCJwb3N0IiwiYWN0aW9uIiwiaWQiLCJxdWFudGl0eSIsInRleHQiLCJodG1sIiwicG9wb3ZlciIsImpvaW4iLCJhcHBlbmQiLCJmYWRlT3V0IiwiYXR0ciIsInRvZ2dsZUNsYXNzIiwic2xpZGVUb2dnbGUiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwib2Zmc2V0IiwidG9wIiwiJGNsb3NlIiwiY2xvc2VzdCIsImZpbmQiLCIkdGhpcyIsIiRzdWJtZW51IiwiaW5pdFBvcHVwcyIsImxvY2F0aW9uIiwiaGFzaCIsInBvcHVwIiwib3BlbiIsInN1YnN0ciIsInRpbWVvdXQiLCJlbGVtZW50IiwibW92ZSIsIl9nb18iLCJfc2VsZl8iLCJpbm5lcldpZHRoIiwiY29va2llIiwiZXhwaXJlcyIsInBhdGgiLCJjb29yZCIsImZsb29yIiwicGVyY2VudCIsInN0b3AiLCJsZWZ0IiwiZHVyYXRpb24iLCJzdGVwIiwibm93IiwiZngiLCJyZW1vdmVDb29raWUiLCJyb3RhdGUiLCJkZWciLCJyb3RhdGlvbiIsIndpZHRoIiwiY2FsbGJhY2siLCJ0aW1lIiwicmVzaXplRXZ0IiwiYXBwbHkiLCJnb29nbGVNYXAiLCJtYXBPcHRpb25zIiwiem9vbSIsInpvb21Db250cm9sIiwiem9vbUNvbnRyb2xPcHRpb25zIiwic3R5bGUiLCJnb29nbGUiLCJtYXBzIiwiWm9vbUNvbnRyb2xTdHlsZSIsIkxBUkdFIiwicG9zaXRpb24iLCJDb250cm9sUG9zaXRpb24iLCJMRUZUX1RPUCIsInBhbkNvbnRyb2wiLCJwYW5Db250cm9sT3B0aW9ucyIsInNjcm9sbHdoZWVsIiwibmF2aWdhdGlvbkNvbnRyb2wiLCJtYXBUeXBlQ29udHJvbCIsInNjYWxlQ29udHJvbCIsImRyYWdnYWJsZSIsInN0eWxlcyIsInN0eWxlcnMiLCJodWUiLCJlbGVtZW50VHlwZSIsImZlYXR1cmVUeXBlIiwiY29sb3IiLCJkaXNhYmxlRG91YmxlQ2xpY2tab29tIiwiY2VudGVyIiwiTGF0TG5nIiwibWFwIiwiTWFwIiwiZ2V0RWxlbWVudEJ5SWQiLCJidWxsZXQiLCJ1cmwiLCJzaXplIiwiU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwiTWFya2VyIiwiaWNvbiIsImNhY2hlIiwiY2IiLCJ5IiwiaW5kZXgiLCJzcmMiLCJnIiwicHVzaCIsImNudCIsImNhbGwiLCJwIiwiYyIsImEiLCJpIiwiYWMiLCJJbWFnZSIsIm9ubG9hZCIsInJldGluYSIsImRldmljZVBpeGVsUmF0aW8iLCJpbWciLCJnZXQiLCJsIiwicmVwbGFjZSIsImlzVW5kZWZpbmVkIiwib2JqIiwidXBkYXRlSW1hZ2UiLCJpbWFnZSIsInNwbGl0IiwicmFuZG9tIiwibWluIiwibWF4IiwibW92aWVzIiwibG9hZCIsImFsZXJ0IiwiZm9ybV92YWxpZGF0aW9uX2RlZmF1bHQiLCIkZm9ybSIsImVycm9ycyIsIiRlcnJvcl9ibG9jayIsImZpZWxkTmFtZSIsIiRmaWVsZCIsImNhbGxiYWNrX3N0YWNrIiwiZm9ybV9hamF4X2RlZmF1bHQiLCJyZXNwb25zZSIsInN0YXR1cyIsImhhc093blByb3BlcnR5IiwiaHJlZiIsInJlZGlyZWN0X3VybCIsIm1lc3NhZ2UiLCJ0aXRsZSIsImFqYXgiLCJ0eXBlIiwic2VyaWFsaXplIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwiZXJyb3IiLCJ1cGxvYWRfYnV0dG9uIiwiQUlNIiwic3VibWl0Iiwib25TdGFydCIsIm9uQ29tcGxldGUiLCJyZXN1bHQiLCJwaG90b191cmwiLCJ2YWwiLCJjdXN0b21fcGxhY2Vob2xkZXIiLCJNb2Rlcm5penIiLCJ0b3VjaCIsImVhY2giLCIkaW5wdXQiLCIkaW5wdXRXcmFwcGVyIiwiJHBsYWNlaG9sZGVyIiwicGxhY2Vob2xkZXJUZXh0IiwicGFyZW50IiwiaXMiLCJpbm5lckhlaWdodCIsInNob3ciLCJ0cmlnZ2VyIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsT0FBT0MsU0FBU0QsSUFBcEI7QUFBQSxJQUEwQkUsS0FBMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUMsT0FBT0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBVztBQUN6Q0MsaUJBQWFILEtBQWI7QUFDQSxRQUFH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Q0FBb0IscUJBQXBCLEVBQTJDdUosT0FBM0MsQ0FBbUQsT0FBbkQ7QUFDSCxTQUxEO0FBTUE3TSxVQUFFLE1BQUYsRUFBVW9CLEVBQVYsQ0FBYSxhQUFiLEVBQTRCLDZCQUE1QixFQUEyRCxLQUEzRDtBQUNILEtBakNEOztBQW1DQXBCLE1BQUVDLEdBQUYsQ0FBTXlCLEdBQU47QUFDSCxDQXpqQkQsRUF5akJHb0wsTUF6akJIIiwiZmlsZSI6Il9fYXBwLmpzIiwic291cmNlc0NvbnRlbnQiOlsidmFyIGJvZHkgPSBkb2N1bWVudC5ib2R5LCB0aW1lcjtcblxuLy8gLy8gU2ltcGxlIEphdmFTY3JpcHQgVGVtcGxhdGluZ1xuLy8gLy8gSm9obiBSZXNpZyAtIGh0dHA6Ly9lam9obi5vcmcvIC0gTUlUIExpY2Vuc2VkXG4vLyB2YXIgdG1wbCA9IG51bGw7XG4vLyA7KGZ1bmN0aW9uKCl7XG4vLyAgICAgdmFyIGNhY2hlID0ge307XG5cbi8vICAgICB0aGlzLnRtcGwgPSBmdW5jdGlvbiB0bXBsKHN0ciwgZGF0YSl7XG4vLyAgICAgICAgIC8vIEZpZ3VyZSBvdXQgaWYgd2UncmUgZ2V0dGluZyBhIHRlbXBsYXRlLCBvciBpZiB3ZSBuZWVkIHRvXG4vLyAgICAgICAgIC8vIGxvYWQgdGhlIHRlbXBsYXRlIC0gYW5kIGJlIHN1cmUgdG8gY2FjaGUgdGhlIHJlc3VsdC5cbi8vICAgICAgICAgdmFyIGZuID0gIS9cXFcvLnRlc3Qoc3RyKSA/XG4vLyAgICAgICAgICAgICBjYWNoZVtzdHJdID0gY2FjaGVbc3RyXSB8fFxuLy8gICAgICAgICAgICAgICAgIHRtcGwoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoc3RyKS5pbm5lckhUTUwpIDpcblxuLy8gICAgICAgICAgICAgLy8gR2VuZXJhdGUgYSByZXVzYWJsZSBmdW5jdGlvbiB0aGF0IHdpbGwgc2VydmUgYXMgYSB0ZW1wbGF0ZVxuLy8gICAgICAgICAgICAgLy8gZ2VuZXJhdG9yIChhbmQgd2hpY2ggd2lsbCBiZSBjYWNoZWQpLlxuLy8gICAgICAgICAgICAgbmV3IEZ1bmN0aW9uKFwib2JqXCIsXG4vLyAgICAgICAgICAgICAgICAgXCJ2YXIgcD1bXSxwcmludD1mdW5jdGlvbigpe3AucHVzaC5hcHBseShwLGFyZ3VtZW50cyk7fTtcIiArXG5cbi8vICAgICAgICAgICAgICAgICAgICAgLy8gSW50cm9kdWNlIHRoZSBkYXRhIGFzIGxvY2FsIHZhcmlhYmxlcyB1c2luZyB3aXRoKCl7fVxuLy8gICAgICAgICAgICAgICAgICAgICBcIndpdGgob2JqKXtwLnB1c2goJ1wiICtcblxuLy8gICAgICAgICAgICAgICAgICAgICAvLyBDb252ZXJ0IHRoZSB0ZW1wbGF0ZSBpbnRvIHB1cmUgSmF2YVNjcmlwdFxuLy8gICAgICAgICAgICAgICAgICAgICBzdHJcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9bXFxyXFx0XFxuXS9nLCBcIiBcIilcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIjwlXCIpLmpvaW4oXCJcXHRcIilcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8oKF58JT4pW15cXHRdKiknL2csIFwiJDFcXHJcIilcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC5yZXBsYWNlKC9cXHQ9KC4qPyklPi9nLCBcIicsJDEsJ1wiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiXFx0XCIpLmpvaW4oXCInKTtcIilcbi8vICAgICAgICAgICAgICAgICAgICAgICAgIC5zcGxpdChcIiU+XCIpLmpvaW4oXCJwLnB1c2goJ1wiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiXFxyXCIpLmpvaW4oXCJcXFxcJ1wiKVxuLy8gICAgICAgICAgICAgICAgICAgICArIFwiJyk7fXJldHVybiBwLmpvaW4oJycpO1wiKTtcblxuLy8gICAgICAgICAvLyBQcm92aWRlIHNvbWUgYmFzaWMgY3VycnlpbmcgdG8gdGhlIHVzZXJcbi8vICAgICAgICAgcmV0dXJuIGRhdGEgPyBmbiggZGF0YSApIDogZm47XG4vLyAgICAgfTtcbi8vIH0pKCk7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdzY3JvbGwnLCBmdW5jdGlvbigpIHtcbiAgICBjbGVhclRpbWVvdXQodGltZXIpO1xuICAgIGlmKCFib2R5LmNsYXNzTGlzdC5jb250YWlucygnZGlzYWJsZS1ob3ZlcicpKVxuICAgIHtcbiAgICAgICAgYm9keS5jbGFzc0xpc3QuYWRkKCdkaXNhYmxlLWhvdmVyJylcbiAgICB9XG5cbiAgICB0aW1lciA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgYm9keS5jbGFzc0xpc3QucmVtb3ZlKCdkaXNhYmxlLWhvdmVyJylcbiAgICB9LCA1MDApO1xufSwgZmFsc2UpO1xuXG4vLyBGaW5kLCBSZXBsYWNlLCBDYXNlXG4vLyBpLmUgXCJUZXN0IHRvIHNlZSBpZiB0aGlzIHdvcmtzPyAoWWVzfE5vKVwiLnJlcGxhY2VBbGwoJyhZZXN8Tm8pJywgJ1llcyEnKTtcbi8vIGkuZS4yIFwiVGVzdCB0byBzZWUgaWYgdGhpcyB3b3Jrcz8gKFllc3xObylcIi5yZXBsYWNlQWxsKCcoeWVzfG5vKScsICdZZXMhJywgdHJ1ZSk7XG5TdHJpbmcucHJvdG90eXBlLnJlcGxhY2VBbGwgPSBmdW5jdGlvbihfZiwgX3IsIF9jKXsgXG4gICAgdmFyIG8gPSB0aGlzLnRvU3RyaW5nKCk7XG4gICAgdmFyIHIgPSAnJztcbiAgICB2YXIgcyA9IG87XG4gICAgdmFyIGIgPSAwO1xuICAgIHZhciBlID0gLTE7XG4gICAgaWYoX2MpeyBfZiA9IF9mLnRvTG93ZXJDYXNlKCk7IHMgPSBvLnRvTG93ZXJDYXNlKCk7IH1cblxuICAgIHdoaWxlKChlPXMuaW5kZXhPZihfZikpID4gLTEpXG4gICAge1xuICAgICAgICByICs9IG8uc3Vic3RyaW5nKGIsIGIrZSkgKyBfcjtcbiAgICAgICAgcyA9IHMuc3Vic3RyaW5nKGUrX2YubGVuZ3RoLCBzLmxlbmd0aCk7XG4gICAgICAgIGIgKz0gZStfZi5sZW5ndGg7XG4gICAgfVxuXG4gICAgLy8gQWRkIExlZnRvdmVyXG4gICAgaWYocy5sZW5ndGg+MCl7IHIrPW8uc3Vic3RyaW5nKG8ubGVuZ3RoLXMubGVuZ3RoLCBvLmxlbmd0aCk7IH1cblxuICAgIC8vIFJldHVybiBOZXcgU3RyaW5nXG4gICAgcmV0dXJuIHI7XG59O1xuXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbiAoc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KSB7XG4gICAgICBpZiAoIHRoaXMgPT09IHVuZGVmaW5lZCB8fCB0aGlzID09PSBudWxsICkge1xuICAgICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCAnXCJ0aGlzXCIgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcgKTtcbiAgICAgIH1cblxuICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoID4+PiAwOyAvLyBIYWNrIHRvIGNvbnZlcnQgb2JqZWN0Lmxlbmd0aCB0byBhIFVJbnQzMlxuXG4gICAgICBmcm9tSW5kZXggPSArZnJvbUluZGV4IHx8IDA7XG5cbiAgICAgIGlmIChNYXRoLmFicyhmcm9tSW5kZXgpID09PSBJbmZpbml0eSkge1xuICAgICAgICBmcm9tSW5kZXggPSAwO1xuICAgICAgfVxuXG4gICAgICBpZiAoZnJvbUluZGV4IDwgMCkge1xuICAgICAgICBmcm9tSW5kZXggKz0gbGVuZ3RoO1xuICAgICAgICBpZiAoZnJvbUluZGV4IDwgMCkge1xuICAgICAgICAgIGZyb21JbmRleCA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZm9yICg7ZnJvbUluZGV4IDwgbGVuZ3RoOyBmcm9tSW5kZXgrKykge1xuICAgICAgICBpZiAodGhpc1tmcm9tSW5kZXhdID09PSBzZWFyY2hFbGVtZW50KSB7XG4gICAgICAgICAgcmV0dXJuIGZyb21JbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICByZXR1cm4gLTE7XG4gICAgfTtcbn1cblxuKGZ1bmN0aW9uKCQpIHtcbiAgICAkLmFwcCA9IHtcbiAgICAgICAgc2FuZHdpY2g6IHtcbiAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgIGtleUhvb2tzOiAhMSxcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJy5qcy1zYW5kd2ljaC1tZW51JyxcbiAgICAgICAgICAgICAgICB3cmFwcGVyOiAnLndyYXBwZXInLFxuICAgICAgICAgICAgICAgIG92ZXJsYXk6ICcubWVudS1vdmVybGF5J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZXh0ZW5kOiBmdW5jdGlvbihjb25maWcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB4O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHggaW4gY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLmNvbmZpZ1t4XSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY29uZmlnW3hdID0gY29uZmlnW3hdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNPcGVuOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQoJ2JvZHknKS5oYXNDbGFzcygncGFnZS12aXNpYmxlJyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoaWRlOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdwYWdlLW9wZW4nKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdwYWdlLXZpc2libGUnKTtcbiAgICAgICAgICAgICAgICB9LCAxMCk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMuY29uZmlnLm92ZXJsYXkpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JzogJ2hpZGRlbidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHRvZ2dsZTogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICgkKCdib2R5JykuaGFzQ2xhc3MoJ3BhZ2UtdmlzaWJsZScpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdwYWdlLW9wZW4nKTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3BhZ2UtdmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3BhZ2Utb3BlbicpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncGFnZS12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblxuICAgICAgICAgICAgICAgIGlmICghJCgnYm9keScpLmhhc0NsYXNzKCdwYWdlLW9wZW4nKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHkgPSAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKF90aGlzLmNvbmZpZy5vdmVybGF5KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAndmlzaWJpbGl0eSc6IHZpc2liaWxpdHlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNhbmR3aWNoVHJpZ2dlcjogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuY29uZmlnLmtleUhvb2tzKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZS5rZXlDb2RlID09IDI3ICYmIF90aGlzLmlzT3BlbigpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIF90aGlzLmNvbmZpZy5zZWxlY3RvciwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb3ZlcmxheVRyaWdnZXI6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIF90aGlzLmNvbmZpZy5vdmVybGF5LCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oY29uZmlnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuZXh0ZW5kKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zYW5kd2ljaFRyaWdnZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlUcmlnZ2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcnVuOiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICQuYXBwLnNhbmR3aWNoLmluaXQoKTtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5iZWFyLmluaXQoKTtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5mb3JtX2FqYXgoKTtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5yZXNpemUoZnVuY3Rpb24oKXsgfSwgNTAwKTtcblxuICAgICAgICAgICAgJChcIi5pbnRlZ2VyXCIpLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uIChlKSB7IGlmKCBbMCwgOF0uaW5kZXhPZiggZS53aGljaCApIDwgMCAmJiAoIGUud2hpY2ggPCA0OCB8fCBlLndoaWNoID4gNTcgKSApIHsgcmV0dXJuIGZhbHNlOyB9IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5pbnNlcnQtY2FydC10cmlnZ2VyJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyICRidXR0b24gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEkYnV0dG9uLmhhc0NsYXNzKCdpbi1jYXJ0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRpZCA9ICQodGhpcykuZGF0YSgnaWRfcHJvZHVjdCcpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJC5wb3N0KFwiL2NhcnQvaW5zZXJ0L1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdpbnNlcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3RvdGFsX2NvdW50JykudGV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b24uaHRtbChcItCSINC60L7RgNC30LjQvdC1XCIpLmFkZENsYXNzKFwiaW4tY2FydFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKCcjYWRkZWRfaW5fYmFza2V0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9wb3ZlciA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiBpZD1cImFkZGVkX2luX2Jhc2tldFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1vcmRlcl9fY29tcGxldGVcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZvcm0tb3JkZXJfX2NvbXBsZXRlX19taWRkbGVcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ9Ci0L7QstCw0YAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZm9ybS1vcmRlcl9fY29tcGxldGVfX2ljb25cIj48L3NwYW4+0LTQvtCx0LDQstC70LXQvSDQsiDQutC+0YDQt9C40L3RgycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQocG9wb3Zlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjYWRkZWRfaW5fYmFza2V0JykuZmFkZU91dCg4MDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnRvZ2dsZS10cmlnZ2VyJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICAgICAgaWYoICQoaWQpLmxlbmd0aCA+IDAgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoICQodGhpcykuaGFzQ2xhc3MoJ3VsX2xpc3QtaXRlbV9saW5rLWRyb3AnKSApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ3VsX2xpc3QtaXRlbV9saW5rLWRyb3AtdXAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQoaWQpLnNsaWRlVG9nZ2xlKDE1MCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKHRoaXMpLm9mZnNldCgpLnRvcCB9LCAnc2xvdycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm5hdi1saXN0LWl0ZW0tbGluaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIHZhciAkY2xvc2UgPSAkKHRoaXMpLmNsb3Nlc3QoJy5uYXYtbGlzdC1pdGVtJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGNsb3NlLmZpbmQoJy5zdWJtZW51JykubGVuZ3RoICYmICEkY2xvc2UuaGFzQ2xhc3MoJ29wZW5lZCcpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZS5hZGRDbGFzcygnb3BlbmVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdtb3VzZWVudGVyJywgJy5uYXYtbGlzdC1pdGVtJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnLnN1Ym1lbnUnKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN1Ym1lbnUgPSAkdGhpcy5maW5kKCcuc3VibWVudScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdWJtZW51LmFkZENsYXNzKCdpcy1zaG93Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3VibWVudS5hZGRDbGFzcygnaXMtYW5pbWF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignbW91c2VsZWF2ZScsICcubmF2LWxpc3QtaXRlbScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5zdWJtZW51JykubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdWJtZW51ID0gJHRoaXMuZmluZCgnLnN1Ym1lbnUnKTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3VibWVudS5yZW1vdmVDbGFzcygnaXMtYW5pbWF0ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN1Ym1lbnUucmVtb3ZlQ2xhc3MoJ2lzLXNob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIHR5cGVvZiAkLmluaXRQb3B1cHMgIT09ICd1bmRlZmluZWQnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkLmluaXRQb3B1cHMoKTtcblxuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDEgJiYgJCh3aW5kb3cubG9jYXRpb24uaGFzaCkuaGFzQ2xhc3MoJ3BvcHVwJykgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQucG9wdXAub3Blbih3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKGUpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb2R1bGU6IHtcbiAgICAgICAgICAgIGJlYXI6IHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAyMDAwMCxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnI2JlYXInLFxuICAgICAgICAgICAgICAgIG1vdmU6IGZ1bmN0aW9uKF9nb18pXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGZfID0gdGhpcywgdGltZW91dCA9IF9zZWxmXy50aW1lb3V0O1xuICAgICAgICAgICAgICAgICAgICBfZ29fID0gd2luZG93LmlubmVyV2lkdGggLSBfZ29fIC0gMjk4O1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYoX2dvXyA+IHdpbmRvdy5pbm5lcldpZHRoKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZ29fID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoJC5jb29raWUoJ19nb18nKSkgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZ29fID0gJC5jb29raWUoJ19nb18nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdfZ29fJywgX2dvXywgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKCQuY29va2llKCdjb29yZGluYXRlJykpICE9PSAndW5kZWZpbmVkJyAmJiAkLmNvb2tpZSgnY29vcmRpbmF0ZScpICE9PSAnJylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvb3JkID0gTWF0aC5mbG9vcigkLmNvb2tpZSgnY29vcmRpbmF0ZScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJChfc2VsZl8uZWxlbWVudCkuY3NzKHsgJ2xlZnQnOiBjb29yZCB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSAxMDAgLSBNYXRoLmZsb29yKCgod2luZG93LmlubmVyV2lkdGggLSBjb29yZCkgKiAxMDApIC8gd2luZG93LmlubmVyV2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSB0aW1lb3V0IC0gKCB0aW1lb3V0ICogcGVyY2VudCAvIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJChfc2VsZl8uZWxlbWVudCkuc3RvcCgpLmFuaW1hdGUoeyBsZWZ0OiBfZ29fIH0sIHsgZHVyYXRpb246IHRpbWVvdXQsIHN0ZXA6IGZ1bmN0aW9uKG5vdywgZngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ2Nvb3JkaW5hdGUnLCBub3csIHsgZXhwaXJlczogNywgcGF0aDogJy8nIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihub3cgPT0gX2dvXylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKF9zZWxmXy5lbGVtZW50KS50b2dnbGVDbGFzcygnZm9vdGVyLWJlYXItcmV2ZXJzZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoJ2Nvb3JkaW5hdGUnLCB7IHBhdGg6ICcvJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZSgnX2dvXycsIHsgcGF0aDogJy8nIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hcHAubW9kdWxlLmJlYXIubW92ZShfZ29fKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcm90YXRlOiBmdW5jdGlvbiggZGVnIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5lbGVtZW50KS5maW5kKCcuZm9vdGVyLWJlYXItaW5uZXInKS5zdG9wKCkuYW5pbWF0ZSh7IHJvdGF0aW9uOiBkZWcgfSwgeyBkdXJhdGlvbjogMTgwMCwgc3RlcDogZnVuY3Rpb24obm93LCBmeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3Moe1widHJhbnNmb3JtXCI6IFwicm90YXRlKFwiK25vdytcImRlZylcIn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYobm93ID09IGRlZylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmFwcC5tb2R1bGUuYmVhci5yb3RhdGUoKGRlZyotMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5NjApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm90YXRlKDYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlKDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc2l6ZTogZnVuY3Rpb24oIGNhbGxiYWNrLCB0aW1lIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVzaXplRXZ0O1xuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh3aW5kb3cucmVzaXplRXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXNpemVFdnQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRpbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnb29nbGVNYXA6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgem9vbTogMTYsXG4gICAgICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogZ29vZ2xlLm1hcHMuWm9vbUNvbnRyb2xTdHlsZS5MQVJHRSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9UT1BcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGFuQ29udHJvbDogITAsXG4gICAgICAgICAgICAgICAgICAgIHBhbkNvbnRyb2xPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfVE9QXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbHdoZWVsOiAhMSxcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkNvbnRyb2w6ICExLFxuICAgICAgICAgICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogITEsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlQ29udHJvbDogITEsXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogITAsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBodWU6ICcjYWRjZWQ1JyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHZpc2liaWxpdHk6ICdvbicgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICd3YXRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNvbG9yOiAnI2M5ZGZlNCcgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZURvdWJsZUNsaWNrWm9vbTogITAsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0My41Njk3ODcsIDM5Ljc1NjM2MilcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdtYXAtY29udGVpbmVyJyApLCBtYXBPcHRpb25zKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgYnVsbGV0ID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICdpbWFnZXMvbWFwLWJ1bGxldC5wbmcnLFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgzOSwgNTIpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLDApLFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgzOSwgNTIpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDMuNTY5Nzg3LCAzOS43NTYzNjIpLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogYnVsbGV0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGU6IGZ1bmN0aW9uKCBzLCBjYiApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEsIGcgPSBbXSwgaSwgeCwgY250ID0gcy5sZW5ndGgsIHAgPSB7IGk6IHt9LCBhYzogMCwgYzogMCB9LCBjYiA9IGNiIHx8IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHkoIGluZGV4LCBzcmMgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnLnB1c2goIHNyYyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggZy5sZW5ndGggPj0gY250IClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi5jYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHAuYysrXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHggaW4gcylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHNbeF07XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuc3JjID0gYTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaS5vbmxvYWQgPSB5KCB4LCBhICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHAuaVthXSA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwLmFjKytcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJldGluYTogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKCAnZGV2aWNlUGl4ZWxSYXRpbycgaW4gd2luZG93ICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID09IDIgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGk9MCwgc3JjLCBpbWcgPSAkKCAnaW1nLnJlcGxhY2UtMngnICkuZ2V0KCksIGwgPSBpbWcubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGk7IGk8bDsgaSsrKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcmMgPSBpbWdbaV0uc3JjO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjID0gc3JjLnJlcGxhY2UoL1xcLihwbmd8anBnfGdpZikrJC9pLCAnQDJ4LiQxJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdbaV0uc3JjID0gc3JjO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiggb2JqIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBkYXRlSW1hZ2U6IGZ1bmN0aW9uKGVsZW1lbnQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYoICQoZWxlbWVudCkubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKS5zcGxpdCggJz8nIClbMF0gO1xuICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmF0dHIoJ3NyYycsIGltYWdlICsgJz92PScgKyBNYXRoLnJhbmRvbSgpICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5kb206IGZ1bmN0aW9uKG1pbiwgbWF4KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1pbiA9IG1pbiB8fCAwIDtcbiAgICAgICAgICAgICAgICBtYXggPSBtYXggfHwgMTAwIDtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKCBtYXggLSBtaW4gKyAxICkpICsgbWluIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLmFwcC5tb3ZpZXMgPSB7fTtcbiAgICAkLmFwcC5tb3ZpZXMubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCggJ2xvYWQgbW9yZScgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAkLmFwcC5tb2R1bGUuZm9ybV92YWxpZGF0aW9uX2RlZmF1bHQgPSBmdW5jdGlvbigkZm9ybSwgZXJyb3JzKSB7XG4gICAgICAgICRmb3JtLmZpbmQoJy5mb3JtX2Vycm9yX2Jsb2NrJykuaGlkZSgpO1xuICAgICAgICAkZm9ybS5maW5kKCcuZXJyb3InKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgJGZvcm0uZmluZCgnLmNoZWNrYm94X19sYWJlbC1lcnJvcicpLnJlbW92ZUNsYXNzKCdjaGVja2JveF9fbGFiZWwtZXJyb3InKTtcbiAgICAgICAgaWYoZXJyb3JzKSB7XG4gICAgICAgICAgICB2YXIgJGVycm9yX2Jsb2NrID0gJCgnI2Zvcm0tZXJyb3JzJyk7XG4gICAgICAgICAgICAkZXJyb3JfYmxvY2suaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGZvcihmaWVsZE5hbWUgaW4gZXJyb3JzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRmaWVsZCA9ICRmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCInK2ZpZWxkTmFtZSsnXCJdJyk7XG4gICAgICAgICAgICAgICAgJGVycm9yX2Jsb2NrLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAkZmllbGQuZGF0YSgnZXJyb3InKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+J1xuICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLmFwcC5jYWxsYmFja19zdGFjayA9IHt9O1xuICAgICQuYXBwLmNhbGxiYWNrX3N0YWNrLmZvcm1fYWpheF9kZWZhdWx0ID0gZnVuY3Rpb24oJGZvcm0sIHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cykge1xuICAgICAgICAgICAgaWYocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ3JlZGlyZWN0X3VybCcpKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZXNwb25zZS5yZWRpcmVjdF91cmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5mb3JtX3ZhbGlkYXRpb25fZGVmYXVsdCgkZm9ybSwgcmVzcG9uc2UuZXJyb3JzKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ21lc3NhZ2UnKSkge1xuICAgICAgICAgICAgJC5wb3B1cC5tZXNzYWdlKHJlc3BvbnNlLnRpdGxlLCByZXNwb25zZS5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLmFwcC5tb2R1bGUuZm9ybV9hamF4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJ2JvZHknKS5vbignc3VibWl0JyAsJy5mb3JtLWFqYXgnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJGZvcm0uYXR0cignYWN0aW9uJyksXG4gICAgICAgICAgICAgICAgdHlwZTogKCRmb3JtLmF0dHIoJ21ldGhvZCcpIHx8ICdwb3N0JyksXG4gICAgICAgICAgICAgICAgZGF0YTogJGZvcm0uc2VyaWFsaXplKCksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCRmb3JtLmRhdGEoJ2NhbGxiYWNrJykgJiYgJC5hcHAuY2FsbGJhY2tfc3RhY2suaGFzT3duUHJvcGVydHkoJGZvcm0uZGF0YSgnY2FsbGJhY2snKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYXBwLmNhbGxiYWNrX3N0YWNrWyRmb3JtLmRhdGEoJ2NhbGxiYWNrJyldKCRmb3JtLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFwcC5jYWxsYmFja19zdGFjay5mb3JtX2FqYXhfZGVmYXVsdCgkZm9ybSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIHJlc3BvbnNlLnN0YXR1cyA9PT0gdHJ1ZSAmJiByZXNwb25zZS5tZXNzYWdlICE9PSAnJyApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQucG9wdXAubWVzc2FnZSggcmVzcG9uc2UudGl0bGUsIHJlc3BvbnNlLm1lc3NhZ2UgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJC5hcHAuY2FsbGJhY2tfc3RhY2suZm9ybV9hamF4X2RlZmF1bHQoJGZvcm0sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQuYXBwLm1vZHVsZS51cGxvYWRfYnV0dG9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnYm9keScpLm9uKCdzdWJtaXQnICwnLmZvcm0tZmlsZS11cGxvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICByZXR1cm4gQUlNLnN1Ym1pdCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKVxuICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oIHJlc3VsdCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcgJiYgcmVzdWx0LnN0YXR1cyA9PT0gdHJ1ZSAmJiB0eXBlb2YgcmVzdWx0LnBob3RvX3VybCAhPT0gJ3VuZGVmaW5lZCcgKVxuICAgICAgICAgICAgICAgICAgICB7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy51cGxvYWRfYnV0dG9uX29uY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCAkKHRoaXMpLmNsb3Nlc3QoJy51cGxvYWRfYnV0dG9uJykuZmluZCgnLnVwbG9hZF9idXR0b25fZmllbGQnKS5sZW5ndGggPiAwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy51cGxvYWRfYnV0dG9uJykuZmluZCgnLnVwbG9hZF9idXR0b25fZmllbGQnKS5odG1sKCAkKHRoaXMpLnZhbCgpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkLmFwcC5jdXN0b21fcGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnaW5wdXQsIHRleHRhcmVhJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHRoaXMpLCAkaW5wdXRXcmFwcGVyLCAkcGxhY2Vob2xkZXIsIHBsYWNlaG9sZGVyVGV4dCA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xuICAgICAgICAgICAgaWYocGxhY2Vob2xkZXJUZXh0KSB7XG4gICAgICAgICAgICAgICAgJGlucHV0V3JhcHBlciA9ICRpbnB1dC5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAkcGxhY2Vob2xkZXIgPSAkKCc8ZGl2IGNsYXNzPVwiZGVmYXVsdC1pbnB1dF9fcGxhY2Vob2xkZXJcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiAnKygkaW5wdXQuaXMoJ3RleHRhcmVhJykgPyAnMzZweCcgOiAoICRpbnB1dFdyYXBwZXIuaW5uZXJIZWlnaHQoKSA9PSAwID8gJzM2JyA6ICRpbnB1dFdyYXBwZXIuaW5uZXJIZWlnaHQoKSApKydweCcpKydcIj4nK3BsYWNlaG9sZGVyVGV4dCsnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgJHBsYWNlaG9sZGVyWyRpbnB1dC52YWwoKS5sZW5ndGggPyAnaGlkZScgOiAnc2hvdyddKCk7XG4gICAgICAgICAgICAgICAgJGlucHV0LmFkZENsYXNzKCdjdXN0b20tcGxhY2Vob2xkZXInKS5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcbiAgICAgICAgICAgICAgICAkaW5wdXRXcmFwcGVyLmFwcGVuZCgkcGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICQoJ2JvZHknKS5vbignYmx1cicsICcuY3VzdG9tLXBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgaWYoISR0aGlzLnZhbCgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICR0aGlzLnBhcmVudCgpLmZpbmQoJy5kZWZhdWx0LWlucHV0X19wbGFjZWhvbGRlcicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQoJ2JvZHknKS5vbignZm9jdXMnLCAnLmN1c3RvbS1wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuZGVmYXVsdC1pbnB1dF9fcGxhY2Vob2xkZXInKS5oaWRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmRlZmF1bHQtaW5wdXRfX3BsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIFxuICAgICAgICAgICAgJHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgJHRoaXMucGFyZW50KCkuZmluZCgnLmN1c3RvbS1wbGFjZWhvbGRlcicpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdib2R5Jykub24oJ3NlbGVjdHN0YXJ0JywgJy5kZWZhdWx0LWlucHV0X19wbGFjZWhvbGRlcicsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgJC5hcHAucnVuKCk7XG59KShqUXVlcnkpOyJdfQ==

'use strict';

;(function ($) {
	$.cart = {
		initRequestClick: function initRequestClick() {
			$('body').on('click', '.j-remover-request', function (e) {
				e.preventDefault();

				var $remover = $(this).closest('.remover'),
				    product = $(this).data('element'),
				    status = $(this).data('status');

				if (status !== 0) {
					if ($('#cart-product-' + product).length) {
						$('#cart-product-' + product).fadeOut(function () {
							$(this).remove();
						});
					}

					console.log(product + ' as ' + status);
				}

				setTimeout(function () {
					$remover.fadeOut(function () {
						$(this).remove();
					});
				}, 150);

				return !1;
			});
		},

		init: function init() {
			$.cart.initBuy();
			$.cart.initRemove();
			$.cart.initControll();

			$.cart.initRequestClick();

			$('body').on('click', '.j-cart-remove', function (e) {
				e.preventDefault();

				if (!$(this).closest('.list-item-footer').find('.remover').length) {
					var $remover,
					    product = $(this).data('element');

					$remover = ['<div class="remover">', '<div class="remover__content">', '<div class="remover__title">', 'Действительно удалить?', '</div>', '<div class="remover__buttons">', '<a href="#" data-element="' + product + '" data-status="1" class="remover__button is-yes j-remover-request">Да</a>', '<a href="#" data-element="' + product + '" data-status="0" class="remover__button is-no j-remover-request">Нет</a>', '</div>', '</div>', '</div>'].join(' ');

					$(this).closest('.list-item-footer').append($remover);
				} else {
					var $remover = $(this).closest('.list-item-footer').find('.remover');

					$remover.fadeOut(function () {
						$(this).remove();
					});
				}

				return !1;
			});
		},

		initBuy: function initBuy() {
			$('.add-cart-trigger').on('click', function (e) {
				e.preventDefault();
				$.cart.buyItem($(this).attr('href').split('-')[1]);
			});
		},
		initControll: function initControll() {
			$('.increase-cart-trigger').on('click', function (e) {
				e.preventDefault();
				$.cart.increase($(this).attr('href').split('-')[1]);
			});

			$('.decrease-cart-trigger').on('click', function (e) {
				e.preventDefault();
				$.cart.decrease($(this).attr('href').split('-')[1]);
			});
		},
		initRemove: function initRemove() {
			$('.remove-cart-trigger').on('click', function (e) {
				e.preventDefault();
				$.cart.removeItem($(this).attr('href').split('-')[1], this);
			});
		},
		removeItem: function removeItem(id, _self_) {
			$.post('/ajax/cart/remove/', { item: id }, function (data) {
				if ($('#list-item-' + id).find('.incart').length > 0) {
					$('#list-item-' + id).find('.incart').remove();
				}

				if ($(_self_).hasClass('list-item-incart')) {
					$(_self_).remove();
				} else {
					$('#incart-item-' + id).html('<a href="#item-' + id + '" title="Добавить в корзину" class="button-cart add-cart-trigger">Купить кресло</a>');
					$.cart.initBuy();
				}

				$.cart.addedItem('Товар удален из корзины.');
			});
		},
		buyItem: function buyItem(id) {
			var count = 1;

			if ($('#count-' + id).length > 0) {
				count = parseInt($('#count-' + id).val());
			}

			$.post('../cart.json', { item: id, count: count }, function (data) {
				if ($('#cart-count').length > 0) {
					$('#cart-count').html(data.count);
				}

				if ($('#cart-price').length > 0) {
					$('#cart-price').html(data.money);
				}

				if ($('#count-' + id).length > 0) {
					$('#count-' + id).val(1);
				}

				if ($('#list-item-' + id).find('.incart').length == 0) {
					$('#incart-item-' + id).html('<a href="#item-' + id + '" title="Удалить из корзины" class="button-remove remove-cart-trigger">Кресло в корзине</a>');

					$.cart.initRemove();
				}

				$.cart.addedItem();
			}, 'JSON');
		},
		addedItem: function addedItem(text, large) {
			text = !text ? 'Товар добавлен в корзину.' : text;
			large = !large ? false : large;
			var timeout = !large ? 1500 : 5000,
			    addclass = !large ? '' : ' adding-large';

			if ($('body').find('#item-added-to-cart').length == 0) {
				$('body').append('<div id="item-added-to-cart" class="showadding' + addclass + '"><div class="adding-inner"><div class="adding-content">' + text + '</div></div></div>');
				setTimeout(function () {
					$('body').find('#item-added-to-cart').remove();
				}, timeout);
			} else {
				setTimeout(function () {
					$('body').find('#item-added-to-cart').remove();
				}, timeout);
			}
		},
		increase: function increase(id) {
			if ($('#count-' + id).length > 0) {
				var value = parseInt($('#count-' + id).val());
				value = !value ? 0 : value;

				value++;

				$('#count-' + id).val(value);
			}

			if ($('#cart-table').length > 0) {
				$.cart.reTotal(id);
			}
		},
		decrease: function decrease(id) {
			if ($('#count-' + id).length > 0) {
				var value = parseInt($('#count-' + id).val());
				value = !value ? 1 : value;

				if (value >= 2) value--;else value = 1;

				$('#count-' + id).val(value);
			}

			if ($('#cart-table').length > 0) {
				$.cart.reTotal(id);
			}
		},
		reTotal: function reTotal(id) {
			if ($('#count-' + id).length > 0) {
				var count = parseInt($('#count-' + id).val());

				$.post('/ajax/cart/recount/', { item: id, count: count }, function (data) {
					var price = parseInt($('#cart-item-price-' + id).html());
					var total = count * price;

					$('#cart-item-total-' + id).html(total);
					$('#cart-total-count').html(data.count);
					$('#cart-total-price').html(data.money);

					if ($('#cart-count').length > 0) {
						$('#cart-count').html(data.count);
					}

					if ($('#cart-price').length > 0) {
						$('#cart-price').html(data.money);
					}
				}, 'JSON');
			}
		}
	};

	$.cart.init();
})(jQuery);
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9jYXJ0LmpzIl0sIm5hbWVzIjpbIiQiLCJjYXJ0IiwiaW5pdFJlcXVlc3RDbGljayIsIm9uIiwiZSIsInByZXZlbnREZWZhdWx0IiwiJHJlbW92ZXIiLCJjbG9zZXN0IiwicHJvZHVjdCIsImRhdGEiLCJzdGF0dXMiLCJsZW5ndGgiLCJmYWRlT3V0IiwicmVtb3ZlIiwiY29uc29sZSIsImxvZyIsInNldFRpbWVvdXQiLCJpbml0IiwiaW5pdEJ1eSIsImluaXRSZW1vdmUiLCJpbml0Q29udHJvbGwiLCJmaW5kIiwiam9pbiIsImFwcGVuZCIsImJ1eUl0ZW0iLCJhdHRyIiwic3BsaXQiLCJpbmNyZWFzZSIsImRlY3JlYXNlIiwicmVtb3ZlSXRlbSIsImlkIiwiX3NlbGZfIiwicG9zdCIsIml0ZW0iLCJoYXNDbGFzcyIsImh0bWwiLCJhZGRlZEl0ZW0iLCJjb3VudCIsInBhcnNlSW50IiwidmFsIiwibW9uZXkiLCJ0ZXh0IiwibGFyZ2UiLCJ0aW1lb3V0IiwiYWRkY2xhc3MiLCJ2YWx1ZSIsInJlVG90YWwiLCJwcmljZSIsInRvdGFsIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOztBQUFBLENBQUMsQ0FBQyxVQUFTQSxDQUFULEVBQVk7QUFDVkEsR0FBRUMsSUFBRixHQUFTO0FBQ0xDLG9CQUFrQiw0QkFDbEI7QUFDSUYsS0FBRSxNQUFGLEVBQVVHLEVBQVYsQ0FBYSxPQUFiLEVBQXNCLG9CQUF0QixFQUE0QyxVQUFTQyxDQUFULEVBQVc7QUFDbkRBLE1BQUVDLGNBQUY7O0FBRUEsUUFBSUMsV0FBV04sRUFBRSxJQUFGLEVBQVFPLE9BQVIsQ0FBZ0IsVUFBaEIsQ0FBZjtBQUFBLFFBQTRDQyxVQUFVUixFQUFFLElBQUYsRUFBUVMsSUFBUixDQUFhLFNBQWIsQ0FBdEQ7QUFBQSxRQUErRUMsU0FBU1YsRUFBRSxJQUFGLEVBQVFTLElBQVIsQ0FBYSxRQUFiLENBQXhGOztBQUVBLFFBQUlDLFdBQVcsQ0FBZixFQUNBO0FBQ0ksU0FBSVYsRUFBRSxtQkFBaUJRLE9B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QztBQUNBckMsT0FBRSxtQkFBRixFQUF1Qm1DLElBQXZCLENBQTRCMUIsS0FBSytCLEtBQWpDOztBQUVBLFNBQUl4QyxFQUFFLGFBQUYsRUFBaUJXLE1BQWpCLEdBQTBCLENBQTlCLEVBQ0E7QUFDQ1gsUUFBRSxhQUFGLEVBQWlCbUMsSUFBakIsQ0FBdUIxQixLQUFLNEIsS0FBNUI7QUFDQTs7QUFFRCxTQUFJckMsRUFBRSxhQUFGLEVBQWlCVyxNQUFqQixHQUEwQixDQUE5QixFQUNBO0FBQ0NYLFFBQUUsYUFBRixFQUFpQm1DLElBQWpCLENBQXVCMUIsS0FBSytCLEtBQTVCO0FBQ0E7QUFDRCxLQWpCRCxFQWlCRyxNQWpCSDtBQWtCQTtBQUNEO0FBeE9VLEVBQVQ7O0FBMk9IeEMsR0FBRUMsSUFBRixDQUFPZ0IsSUFBUDtBQUNBLENBN09BLEVBNk9FZ0MsTUE3T0YiLCJmaWxlIjoiX2NhcnQuanMiLCJzb3VyY2VzQ29udGVudCI6WyI7KGZ1bmN0aW9uKCQpIHtcbiAgICAkLmNhcnQgPSB7XG4gICAgICAgIGluaXRSZXF1ZXN0Q2xpY2s6IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuai1yZW1vdmVyLXJlcXVlc3QnLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgJHJlbW92ZXIgPSAkKHRoaXMpLmNsb3Nlc3QoJy5yZW1vdmVyJyksIHByb2R1Y3QgPSAkKHRoaXMpLmRhdGEoJ2VsZW1lbnQnKSwgc3RhdHVzID0gJCh0aGlzKS5kYXRhKCdzdGF0dXMnKTtcblxuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgIT09IDApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCgnI2NhcnQtcHJvZHVjdC0nK3Byb2R1Y3QpLmxlbmd0aClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI2NhcnQtcHJvZHVjdC0nK3Byb2R1Y3QpLmZhZGVPdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhwcm9kdWN0ICsgJyBhcyAnICsgc3RhdHVzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkcmVtb3Zlci5mYWRlT3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9LCAxNTApO1xuXG4gICAgICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH0sXG5cbiAgICBcdGluaXQ6IGZ1bmN0aW9uKClcbiAgICBcdHtcbiAgICBcdFx0JC5jYXJ0LmluaXRCdXkoKTtcbiAgICBcdFx0JC5jYXJ0LmluaXRSZW1vdmUoKTtcbiAgICBcdFx0JC5jYXJ0LmluaXRDb250cm9sbCgpO1xuXG4gICAgICAgICAgICAkLmNhcnQuaW5pdFJlcXVlc3RDbGljaygpO1xuXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5qLWNhcnQtcmVtb3ZlJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEkKHRoaXMpLmNsb3Nlc3QoJy5saXN0LWl0ZW0tZm9vdGVyJykuZmluZCgnLnJlbW92ZXInKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHJlbW92ZXIsIHByb2R1Y3QgPSAkKHRoaXMpLmRhdGEoJ2VsZW1lbnQnKTtcblxuICAgICAgICAgICAgICAgICAgICAkcmVtb3ZlciA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicmVtb3ZlclwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZW1vdmVyX19jb250ZW50XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZW1vdmVyX190aXRsZVwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn0JTQtdC50YHRgtCy0LjRgtC10LvRjNC90L4g0YPQtNCw0LvQuNGC0Yw/JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJyZW1vdmVyX19idXR0b25zXCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGRhdGEtZWxlbWVudD1cIicgKyBwcm9kdWN0ICsgJ1wiIGRhdGEtc3RhdHVzPVwiMVwiIGNsYXNzPVwicmVtb3Zlcl9fYnV0dG9uIGlzLXllcyBqLXJlbW92ZXItcmVxdWVzdFwiPtCU0LA8L2E+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8YSBocmVmPVwiI1wiIGRhdGEtZWxlbWVudD1cIicgKyBwcm9kdWN0ICsgJ1wiIGRhdGEtc3RhdHVzPVwiMFwiIGNsYXNzPVwicmVtb3Zlcl9fYnV0dG9uIGlzLW5vIGotcmVtb3Zlci1yZXF1ZXN0XCI+0J3QtdGCPC9hPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PidcbiAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcgJyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy5saXN0LWl0ZW0tZm9vdGVyJykuYXBwZW5kKCRyZW1vdmVyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRyZW1vdmVyID0gJCh0aGlzKS5jbG9zZXN0KCcubGlzdC1pdGVtLWZvb3RlcicpLmZpbmQoJy5yZW1vdmVyJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgJHJlbW92ZXIuZmFkZU91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuICExO1xuICAgICAgICAgICAgfSk7XG4gICAgXHR9LFxuXG4gICAgXHRpbml0QnV5OiBmdW5jdGlvbigpXG4gICAgXHR7XG4gICAgXHRcdCQoJy5hZGQtY2FydC10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFx0XHRcdCQuY2FydC5idXlJdGVtKCAkKHRoaXMpLmF0dHIoJ2hyZWYnKS5zcGxpdCgnLScpWzFdICk7XG4gICAgXHRcdH0pO1xuICAgIFx0fSxcbiAgICBcdGluaXRDb250cm9sbDogZnVuY3Rpb24oKVxuICAgIFx0e1xuICAgIFx0XHQkKCcuaW5jcmVhc2UtY2FydC10cmlnZ2VyJykub24oJ2NsaWNrJywgZnVuY3Rpb24oZSl7XG4gICAgXHRcdFx0ZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIFx0XHRcdCQuY2FydC5pbmNyZWFzZSggJCh0aGlzKS5hdHRyKCdocmVmJykuc3BsaXQoJy0nKVsxXSApO1xuICAgIFx0XHR9KTtcblxuXHRcdFx0JCgnLmRlY3JlYXNlLWNhcnQtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgIFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcdFx0XHQkLmNhcnQuZGVjcmVhc2UoICQodGhpcykuYXR0cignaHJlZicpLnNwbGl0KCctJylbMV0gKTtcbiAgICBcdFx0fSk7XG4gICAgXHR9LFxuICAgIFx0aW5pdFJlbW92ZTogZnVuY3Rpb24oKVxuICAgIFx0e1xuICAgIFx0XHQkKCcucmVtb3ZlLWNhcnQtdHJpZ2dlcicpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpe1xuICAgIFx0XHRcdGUucHJldmVudERlZmF1bHQoKTtcbiAgICBcdFx0XHQkLmNhcnQucmVtb3ZlSXRlbSgkKHRoaXMpLmF0dHIoJ2hyZWYnKS5zcGxpdCgnLScpWzFdLCB0aGlzKTtcbiAgICBcdFx0fSk7XG4gICAgXHR9LFxuICAgIFx0cmVtb3ZlSXRlbTogZnVuY3Rpb24oaWQsIF9zZWxmXylcblx0XHR7XG5cdFx0XHQkLnBvc3QoJy9hamF4L2NhcnQvcmVtb3ZlLycsIHsgaXRlbTogaWQgfSwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRpZiggJCgnI2xpc3QtaXRlbS0nK2lkKS5maW5kKCcuaW5jYXJ0JykubGVuZ3RoID4gMCApXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkKCcjbGlzdC1pdGVtLScraWQpLmZpbmQoJy5pbmNhcnQnKS5yZW1vdmUoKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRcblx0XHRcdFx0aWYoJChfc2VsZl8pLmhhc0NsYXNzKCdsaXN0LWl0ZW0taW5jYXJ0JykpXG5cdFx0XHRcdHtcblx0XHRcdFx0XHQkKF9zZWxmXykucmVtb3ZlKCk7XG5cdFx0XHRcdH1cblx0XHRcdFx0ZWxzZVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JCgnI2luY2FydC1pdGVtLScraWQpLmh0bWwoICc8YSBocmVmPVwiI2l0ZW0tJytpZCsnXCIgdGl0bGU9XCLQlNC+0LHQsNCy0LjRgtGMINCyINC60L7RgNC30LjQvdGDXCIgY2xhc3M9XCJidXR0b24tY2FydCBhZGQtY2FydC10cmlnZ2VyXCI+0JrRg9C/0LjRgtGMINC60YDQtdGB0LvQvjwvYT4nICk7XG5cdFx0XHRcdFx0JC5jYXJ0LmluaXRCdXkoKTtcblx0XHRcdFx0fVxuXG5cdFx0ICAgICAgICAkLmNhcnQuYWRkZWRJdGVtKCfQotC+0LLQsNGAINGD0LTQsNC70LXQvSDQuNC3INC60L7RgNC30LjQvdGLLicpO1xuXHRcdFx0fSk7XG5cdFx0fSxcblx0XHRidXlJdGVtOiBmdW5jdGlvbihpZClcblx0XHR7XG5cdFx0XHR2YXIgY291bnQgPSAxO1xuXHRcdFx0XG5cdFx0XHRpZiggJCgnI2NvdW50LScraWQpLmxlbmd0aCA+IDAgKSB7XG5cdFx0XHRcdGNvdW50ID0gcGFyc2VJbnQoICQoJyNjb3VudC0nK2lkKS52YWwoKSApIDtcblx0XHRcdH1cblxuXHRcdFx0JC5wb3N0KCcuLi9jYXJ0Lmpzb24nLCB7IGl0ZW06IGlkLCBjb3VudDogY291bnQgfSwgZnVuY3Rpb24oZGF0YSkge1xuXHRcdFx0XHRpZiggJCgnI2NhcnQtY291bnQnKS5sZW5ndGggPiAwIClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCQoJyNjYXJ0LWNvdW50JykuaHRtbCggZGF0YS5jb3VudCApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiggJCgnI2NhcnQtcHJpY2UnKS5sZW5ndGggPiAwIClcblx0XHRcdFx0e1xuXHRcdFx0XHRcdCQoJyNjYXJ0LXByaWNlJykuaHRtbCggZGF0YS5tb25leSApO1xuXHRcdFx0XHR9XG5cdFx0XHRcdFxuXHRcdFx0XHRpZiggJCgnI2NvdW50LScraWQpLmxlbmd0aCA+IDAgKVxuXHRcdFx0XHR7XG5cdFx0XHRcdFx0JCgnI2NvdW50LScraWQpLnZhbCgxKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdGlmKCAkKCcjbGlzdC1pdGVtLScraWQpLmZpbmQoJy5pbmNhcnQnKS5sZW5ndGggPT0gMCApIHtcblx0XHRcdFx0XHQkKCcjaW5jYXJ0LWl0ZW0tJytpZCkuaHRtbCggJzxhIGhyZWY9XCIjaXRlbS0nICsgaWQgKyAnXCIgdGl0bGU9XCLQo9C00LDQu9C40YLRjCDQuNC3INC60L7RgNC30LjQvdGLXCIgY2xhc3M9XCJidXR0b24tcmVtb3ZlIHJlbW92ZS1jYXJ0LXRyaWdnZXJcIj7QmtGA0LXRgdC70L4g0LIg0LrQvtGA0LfQuNC90LU8L2E+JyApO1xuXG5cdFx0XHRcdFx0JC5jYXJ0LmluaXRSZW1vdmUoKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdCQuY2FydC5hZGRlZEl0ZW0oKTtcblx0XHRcdH0sICdKU09OJyk7XG5cdFx0fSxcblx0XHRhZGRlZEl0ZW06IGZ1bmN0aW9uKHRleHQsIGxhcmdlKVxuXHRcdHtcblx0XHQgICAgdGV4dCA9ICF0ZXh0ID8gJ9Ci0L7QstCw0YAg0LTQvtCx0LDQstC70LXQvSDQsiDQutC+0YDQt9C40L3Rgy4nIDogdGV4dCA7XG5cdFx0ICAgIGxhcmdlID0gIWxhcmdlID8gZmFsc2UgOiBsYXJnZSA7XG5cdFx0ICAgIHZhciB0aW1lb3V0ID0gIWxhcmdlID8gMTUwMCA6IDUwMDAsIGFkZGNsYXNzID0gIWxhcmdlID8gJycgOiAnIGFkZGluZy1sYXJnZScgO1xuXHRcdCAgICBcblx0XHQgICAgaWYoICQoJ2JvZHknKS5maW5kKCcjaXRlbS1hZGRlZC10by1jYXJ0JykubGVuZ3RoID09IDAgKSB7XG5cdFx0ICAgICAgICAkKCdib2R5JykuYXBwZW5kKCc8ZGl2IGlkPVwiaXRlbS1hZGRlZC10by1jYXJ0XCIgY2xhc3M9XCJzaG93YWRkaW5nJyArIGFkZGNsYXNzICsgJ1wiPjxkaXYgY2xhc3M9XCJhZGRpbmctaW5uZXJcIj48ZGl2IGNsYXNzPVwiYWRkaW5nLWNvbnRlbnRcIj4nICsgdGV4dCArICc8L2Rpdj48L2Rpdj48L2Rpdj4nKTtcblx0XHQgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcblx0XHQgICAgICAgICAgICAkKCdib2R5JykuZmluZCgnI2l0ZW0tYWRkZWQtdG8tY2FydCcpLnJlbW92ZSgpIDtcblx0XHQgICAgICAgIH0sdGltZW91dCk7XG5cdFx0ICAgIH1cblx0XHQgICAgZWxzZSB7XG5cdFx0ICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG5cdFx0ICAgICAgICAgICAgJCgnYm9keScpLmZpbmQoJyNpdGVtLWFkZGVkLXRvLWNhcnQnKS5yZW1vdmUoKSA7XG5cdFx0ICAgICAgICB9LHRpbWVvdXQpO1xuXHRcdCAgICB9XG5cdFx0fSxcblx0XHRpbmNyZWFzZTogZnVuY3Rpb24oaWQpXG5cdFx0e1xuXHRcdFx0aWYoICQoJyNjb3VudC0nK2lkKS5sZW5ndGggPiAwICkge1xuXHRcdCAgICAgICAgdmFyIHZhbHVlID0gcGFyc2VJbnQoICQoJyNjb3VudC0nK2lkKS52YWwoKSApIDtcblx0XHQgICAgICAgICAgICB2YWx1ZSA9ICF2YWx1ZSA/IDAgOiB2YWx1ZSA7XG5cdFx0ICAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICAgdmFsdWUrKyA7XG5cdFx0ICAgICAgICAgICAgXG5cdFx0ICAgICAgICAgICAgJCgnI2NvdW50LScraWQpLnZhbCggdmFsdWUgKSA7XG5cdFx0ICAgIH1cblx0XHRcdFxuXHRcdFx0aWYoJCgnI2NhcnQtdGFibGUnKS5sZW5ndGggPiAwKVxuXHRcdFx0e1xuXHRcdFx0XHQkLmNhcnQucmVUb3RhbChpZCk7XG5cdFx0XHR9XG5cdFx0fSxcblx0XHRkZWNyZWFzZTogZnVuY3Rpb24oaWQpXG5cdFx0e1xuXHRcdFx0aWYoICQoJyNjb3VudC0nK2lkKS5sZW5ndGggPiAwIClcblx0XHRcdHtcblx0XHRcdFx0dmFyIHZhbHVlID0gcGFyc2VJbnQoICQoJyNjb3VudC0nK2lkKS52YWwoKSApIDtcblx0XHRcdFx0XHR2YWx1ZSA9ICF2YWx1ZSA/IDEgOiB2YWx1ZSA7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0aWYoIHZhbHVlID49IDIgKSB2YWx1ZS0tIDtcblx0XHRcdFx0XHRlbHNlIHZhbHVlID0gMSA7XG5cdFx0XHRcdFx0XG5cdFx0XHRcdFx0JCgnI2NvdW50LScraWQpLnZhbCggdmFsdWUgKSA7XG5cdFx0XHR9XG5cdFx0XHRcblx0XHRcdGlmKCQoJyNjYXJ0LXRhYmxlJykubGVuZ3RoID4gMClcblx0XHRcdHtcblx0XHRcdFx0JC5jYXJ0LnJlVG90YWwoaWQpO1xuXHRcdFx0fVxuXHRcdH0sXG5cdFx0cmVUb3RhbDogZnVuY3Rpb24oaWQpXG5cdFx0e1xuXHRcdFx0aWYoICQoJyNjb3VudC0nK2lkKS5sZW5ndGggPiAwIClcblx0XHRcdHtcblx0XHRcdFx0dmFyIGNvdW50ID0gcGFyc2VJbnQoICQoJyNjb3VudC0nK2lkKS52YWwoKSApO1xuXHRcdFx0XHRcblx0XHRcdFx0JC5wb3N0KCcvYWpheC9jYXJ0L3JlY291bnQvJywgeyBpdGVtOiBpZCwgY291bnQ6IGNvdW50IH0sIGZ1bmN0aW9uKGRhdGEpIHtcblx0XHRcdFx0XHR2YXIgcHJpY2UgPSBwYXJzZUludCggJCgnI2NhcnQtaXRlbS1wcmljZS0nK2lkKS5odG1sKCkgKTtcblx0XHRcdFx0XHR2YXIgdG90YWwgPSBjb3VudCAqIHByaWNlO1xuXG5cdFx0XHRcdFx0JCgnI2NhcnQtaXRlbS10b3RhbC0nK2lkKS5odG1sKHRvdGFsKSA7XG5cdFx0XHRcdFx0JCgnI2NhcnQtdG90YWwtY291bnQnKS5odG1sKGRhdGEuY291bnQpO1xuXHRcdFx0XHRcdCQoJyNjYXJ0LXRvdGFsLXByaWNlJykuaHRtbChkYXRhLm1vbmV5KTtcblxuXHRcdFx0XHRcdGlmKCAkKCcjY2FydC1jb3VudCcpLmxlbmd0aCA+IDAgKVxuXHRcdFx0XHRcdHtcblx0XHRcdFx0XHRcdCQoJyNjYXJ0LWNvdW50JykuaHRtbCggZGF0YS5jb3VudCApO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRpZiggJCgnI2NhcnQtcHJpY2UnKS5sZW5ndGggPiAwIClcblx0XHRcdFx0XHR7XG5cdFx0XHRcdFx0XHQkKCcjY2FydC1wcmljZScpLmh0bWwoIGRhdGEubW9uZXkgKTtcblx0XHRcdFx0XHR9XG5cdFx0XHRcdH0sICdKU09OJyk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0JC5jYXJ0LmluaXQoKTtcbn0pKGpRdWVyeSk7Il19
