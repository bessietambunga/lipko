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

                return false;
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fYXBwLmpzIl0sIm5hbWVzIjpbImJvZHkiLCJkb2N1bWVudCIsInRpbWVyIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsZWFyVGltZW91dCIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWRkIiwic2V0VGltZW91dCIsInJlbW92ZSIsIlN0cmluZyIsInByb3RvdHlwZSIsInJlcGxhY2VBbGwiLCJfZiIsIl9yIiwiX2MiLCJvIiwidG9TdHJpbmciLCJyIiwicyIsImIiLCJlIiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwibGVuZ3RoIiwiQXJyYXkiLCJzZWFyY2hFbGVtZW50IiwiZnJvbUluZGV4IiwidW5kZWZpbmVkIiwiVHlwZUVycm9yIiwiTWF0aCIsImFicyIsIkluZmluaXR5IiwiJCIsImFwcCIsInNhbmR3aWNoIiwiY29uZmlnIiwia2V5SG9va3MiLCJzZWxlY3RvciIsIndyYXBwZXIiLCJvdmVybGF5IiwiZXh0ZW5kIiwiX3RoaXMiLCJ4IiwiaXNPcGVuIiwiaGFzQ2xhc3MiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJjc3MiLCJ0b2dnbGUiLCJhZGRDbGFzcyIsInZpc2liaWxpdHkiLCJzYW5kd2ljaFRyaWdnZXIiLCJvbiIsImtleUNvZGUiLCJwcmV2ZW50RGVmYXVsdCIsInJldHVyblZhbHVlIiwib3ZlcmxheVRyaWdnZXIiLCJpbml0IiwicnVuIiwibW9kdWxlIiwiYmVhciIsImZvcm1fYWpheCIsInJlc2l6ZSIsIndoaWNoIiwiJGJ1dHRvbiIsIiRpZCIsImRhdGEiLCJwb3N0IiwiYWN0aW9uIiwiaWQiLCJxdWFudGl0eSIsInRleHQiLCJodG1sIiwicG9wb3ZlciIsImpvaW4iLCJhcHBlbmQiLCJmYWRlT3V0IiwiYXR0ciIsInRvZ2dsZUNsYXNzIiwic2xpZGVUb2dnbGUiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwib2Zmc2V0IiwidG9wIiwiJGNsb3NlIiwiY2xvc2VzdCIsImZpbmQiLCIkdGhpcyIsIiRzdWJtZW51IiwiaW5pdFBvcHVwcyIsImxvY2F0aW9uIiwiaGFzaCIsInBvcHVwIiwib3BlbiIsInN1YnN0ciIsInRpbWVvdXQiLCJlbGVtZW50IiwibW92ZSIsIl9nb18iLCJfc2VsZl8iLCJpbm5lcldpZHRoIiwiY29va2llIiwiZXhwaXJlcyIsInBhdGgiLCJjb29yZCIsImZsb29yIiwicGVyY2VudCIsInN0b3AiLCJsZWZ0IiwiZHVyYXRpb24iLCJzdGVwIiwibm93IiwiZngiLCJyZW1vdmVDb29raWUiLCJyb3RhdGUiLCJkZWciLCJyb3RhdGlvbiIsIndpZHRoIiwiY2FsbGJhY2siLCJ0aW1lIiwicmVzaXplRXZ0IiwiYXBwbHkiLCJnb29nbGVNYXAiLCJtYXBPcHRpb25zIiwiem9vbSIsInpvb21Db250cm9sIiwiem9vbUNvbnRyb2xPcHRpb25zIiwic3R5bGUiLCJnb29nbGUiLCJtYXBzIiwiWm9vbUNvbnRyb2xTdHlsZSIsIkxBUkdFIiwicG9zaXRpb24iLCJDb250cm9sUG9zaXRpb24iLCJMRUZUX1RPUCIsInBhbkNvbnRyb2wiLCJwYW5Db250cm9sT3B0aW9ucyIsInNjcm9sbHdoZWVsIiwibmF2aWdhdGlvbkNvbnRyb2wiLCJtYXBUeXBlQ29udHJvbCIsInNjYWxlQ29udHJvbCIsImRyYWdnYWJsZSIsInN0eWxlcyIsInN0eWxlcnMiLCJodWUiLCJlbGVtZW50VHlwZSIsImZlYXR1cmVUeXBlIiwiY29sb3IiLCJkaXNhYmxlRG91YmxlQ2xpY2tab29tIiwiY2VudGVyIiwiTGF0TG5nIiwibWFwIiwiTWFwIiwiZ2V0RWxlbWVudEJ5SWQiLCJidWxsZXQiLCJ1cmwiLCJzaXplIiwiU2l6ZSIsIm9yaWdpbiIsIlBvaW50IiwiYW5jaG9yIiwiTWFya2VyIiwiaWNvbiIsImNhY2hlIiwiY2IiLCJ5IiwiaW5kZXgiLCJzcmMiLCJnIiwicHVzaCIsImNudCIsImNhbGwiLCJwIiwiYyIsImEiLCJpIiwiYWMiLCJJbWFnZSIsIm9ubG9hZCIsInJldGluYSIsImRldmljZVBpeGVsUmF0aW8iLCJpbWciLCJnZXQiLCJsIiwicmVwbGFjZSIsImlzVW5kZWZpbmVkIiwib2JqIiwidXBkYXRlSW1hZ2UiLCJpbWFnZSIsInNwbGl0IiwicmFuZG9tIiwibWluIiwibWF4IiwibW92aWVzIiwibG9hZCIsImFsZXJ0IiwiZm9ybV92YWxpZGF0aW9uX2RlZmF1bHQiLCIkZm9ybSIsImVycm9ycyIsIiRlcnJvcl9ibG9jayIsImZpZWxkTmFtZSIsIiRmaWVsZCIsImNhbGxiYWNrX3N0YWNrIiwiZm9ybV9hamF4X2RlZmF1bHQiLCJyZXNwb25zZSIsInN0YXR1cyIsImhhc093blByb3BlcnR5IiwiaHJlZiIsInJlZGlyZWN0X3VybCIsIm1lc3NhZ2UiLCJ0aXRsZSIsImFqYXgiLCJ0eXBlIiwic2VyaWFsaXplIiwiZGF0YVR5cGUiLCJzdWNjZXNzIiwiZXJyb3IiLCJ1cGxvYWRfYnV0dG9uIiwiQUlNIiwic3VibWl0Iiwib25TdGFydCIsIm9uQ29tcGxldGUiLCJyZXN1bHQiLCJwaG90b191cmwiLCJ2YWwiLCJjdXN0b21fcGxhY2Vob2xkZXIiLCJNb2Rlcm5penIiLCJ0b3VjaCIsImVhY2giLCIkaW5wdXQiLCIkaW5wdXRXcmFwcGVyIiwiJHBsYWNlaG9sZGVyIiwicGxhY2Vob2xkZXJUZXh0IiwicGFyZW50IiwiaXMiLCJpbm5lckhlaWdodCIsInNob3ciLCJ0cmlnZ2VyIiwialF1ZXJ5Il0sIm1hcHBpbmdzIjoiOzs7O0FBQUEsSUFBSUEsT0FBT0MsU0FBU0QsSUFBcEI7QUFBQSxJQUEwQkUsS0FBMUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQUMsT0FBT0MsZ0JBQVAsQ0FBd0IsUUFBeEIsRUFBa0MsWUFBVztBQUN6Q0MsaUJBQWFILEtBQWI7QUFDQSxRQUFH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TUFBTixHQUFlbkosSUFBZixDQUFvQixxQkFBcEIsRUFBMkN1SixPQUEzQyxDQUFtRCxPQUFuRDtBQUNILFNBTEQ7QUFNQTdNLFVBQUUsTUFBRixFQUFVb0IsRUFBVixDQUFhLGFBQWIsRUFBNEIsNkJBQTVCLEVBQTJELEtBQTNEO0FBQ0gsS0FqQ0Q7O0FBbUNBcEIsTUFBRUMsR0FBRixDQUFNeUIsR0FBTjtBQUNILENBM2pCRCxFQTJqQkdvTCxNQTNqQkgiLCJmaWxlIjoiX19hcHAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgYm9keSA9IGRvY3VtZW50LmJvZHksIHRpbWVyO1xuXG4vLyAvLyBTaW1wbGUgSmF2YVNjcmlwdCBUZW1wbGF0aW5nXG4vLyAvLyBKb2huIFJlc2lnIC0gaHR0cDovL2Vqb2huLm9yZy8gLSBNSVQgTGljZW5zZWRcbi8vIHZhciB0bXBsID0gbnVsbDtcbi8vIDsoZnVuY3Rpb24oKXtcbi8vICAgICB2YXIgY2FjaGUgPSB7fTtcblxuLy8gICAgIHRoaXMudG1wbCA9IGZ1bmN0aW9uIHRtcGwoc3RyLCBkYXRhKXtcbi8vICAgICAgICAgLy8gRmlndXJlIG91dCBpZiB3ZSdyZSBnZXR0aW5nIGEgdGVtcGxhdGUsIG9yIGlmIHdlIG5lZWQgdG9cbi8vICAgICAgICAgLy8gbG9hZCB0aGUgdGVtcGxhdGUgLSBhbmQgYmUgc3VyZSB0byBjYWNoZSB0aGUgcmVzdWx0LlxuLy8gICAgICAgICB2YXIgZm4gPSAhL1xcVy8udGVzdChzdHIpID9cbi8vICAgICAgICAgICAgIGNhY2hlW3N0cl0gPSBjYWNoZVtzdHJdIHx8XG4vLyAgICAgICAgICAgICAgICAgdG1wbChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChzdHIpLmlubmVySFRNTCkgOlxuXG4vLyAgICAgICAgICAgICAvLyBHZW5lcmF0ZSBhIHJldXNhYmxlIGZ1bmN0aW9uIHRoYXQgd2lsbCBzZXJ2ZSBhcyBhIHRlbXBsYXRlXG4vLyAgICAgICAgICAgICAvLyBnZW5lcmF0b3IgKGFuZCB3aGljaCB3aWxsIGJlIGNhY2hlZCkuXG4vLyAgICAgICAgICAgICBuZXcgRnVuY3Rpb24oXCJvYmpcIixcbi8vICAgICAgICAgICAgICAgICBcInZhciBwPVtdLHByaW50PWZ1bmN0aW9uKCl7cC5wdXNoLmFwcGx5KHAsYXJndW1lbnRzKTt9O1wiICtcblxuLy8gICAgICAgICAgICAgICAgICAgICAvLyBJbnRyb2R1Y2UgdGhlIGRhdGEgYXMgbG9jYWwgdmFyaWFibGVzIHVzaW5nIHdpdGgoKXt9XG4vLyAgICAgICAgICAgICAgICAgICAgIFwid2l0aChvYmope3AucHVzaCgnXCIgK1xuXG4vLyAgICAgICAgICAgICAgICAgICAgIC8vIENvbnZlcnQgdGhlIHRlbXBsYXRlIGludG8gcHVyZSBKYXZhU2NyaXB0XG4vLyAgICAgICAgICAgICAgICAgICAgIHN0clxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1tcXHJcXHRcXG5dL2csIFwiIFwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiPCVcIikuam9pbihcIlxcdFwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoLygoXnwlPilbXlxcdF0qKScvZywgXCIkMVxcclwiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnJlcGxhY2UoL1xcdD0oLio/KSU+L2csIFwiJywkMSwnXCIpXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCJcXHRcIikuam9pbihcIicpO1wiKVxuLy8gICAgICAgICAgICAgICAgICAgICAgICAgLnNwbGl0KFwiJT5cIikuam9pbihcInAucHVzaCgnXCIpXG4vLyAgICAgICAgICAgICAgICAgICAgICAgICAuc3BsaXQoXCJcXHJcIikuam9pbihcIlxcXFwnXCIpXG4vLyAgICAgICAgICAgICAgICAgICAgICsgXCInKTt9cmV0dXJuIHAuam9pbignJyk7XCIpO1xuXG4vLyAgICAgICAgIC8vIFByb3ZpZGUgc29tZSBiYXNpYyBjdXJyeWluZyB0byB0aGUgdXNlclxuLy8gICAgICAgICByZXR1cm4gZGF0YSA/IGZuKCBkYXRhICkgOiBmbjtcbi8vICAgICB9O1xuLy8gfSkoKTtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Njcm9sbCcsIGZ1bmN0aW9uKCkge1xuICAgIGNsZWFyVGltZW91dCh0aW1lcik7XG4gICAgaWYoIWJvZHkuY2xhc3NMaXN0LmNvbnRhaW5zKCdkaXNhYmxlLWhvdmVyJykpXG4gICAge1xuICAgICAgICBib2R5LmNsYXNzTGlzdC5hZGQoJ2Rpc2FibGUtaG92ZXInKVxuICAgIH1cblxuICAgIHRpbWVyID0gc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICBib2R5LmNsYXNzTGlzdC5yZW1vdmUoJ2Rpc2FibGUtaG92ZXInKVxuICAgIH0sIDUwMCk7XG59LCBmYWxzZSk7XG5cbi8vIEZpbmQsIFJlcGxhY2UsIENhc2Vcbi8vIGkuZSBcIlRlc3QgdG8gc2VlIGlmIHRoaXMgd29ya3M/IChZZXN8Tm8pXCIucmVwbGFjZUFsbCgnKFllc3xObyknLCAnWWVzIScpO1xuLy8gaS5lLjIgXCJUZXN0IHRvIHNlZSBpZiB0aGlzIHdvcmtzPyAoWWVzfE5vKVwiLnJlcGxhY2VBbGwoJyh5ZXN8bm8pJywgJ1llcyEnLCB0cnVlKTtcblN0cmluZy5wcm90b3R5cGUucmVwbGFjZUFsbCA9IGZ1bmN0aW9uKF9mLCBfciwgX2MpeyBcbiAgICB2YXIgbyA9IHRoaXMudG9TdHJpbmcoKTtcbiAgICB2YXIgciA9ICcnO1xuICAgIHZhciBzID0gbztcbiAgICB2YXIgYiA9IDA7XG4gICAgdmFyIGUgPSAtMTtcbiAgICBpZihfYyl7IF9mID0gX2YudG9Mb3dlckNhc2UoKTsgcyA9IG8udG9Mb3dlckNhc2UoKTsgfVxuXG4gICAgd2hpbGUoKGU9cy5pbmRleE9mKF9mKSkgPiAtMSlcbiAgICB7XG4gICAgICAgIHIgKz0gby5zdWJzdHJpbmcoYiwgYitlKSArIF9yO1xuICAgICAgICBzID0gcy5zdWJzdHJpbmcoZStfZi5sZW5ndGgsIHMubGVuZ3RoKTtcbiAgICAgICAgYiArPSBlK19mLmxlbmd0aDtcbiAgICB9XG5cbiAgICAvLyBBZGQgTGVmdG92ZXJcbiAgICBpZihzLmxlbmd0aD4wKXsgcis9by5zdWJzdHJpbmcoby5sZW5ndGgtcy5sZW5ndGgsIG8ubGVuZ3RoKTsgfVxuXG4gICAgLy8gUmV0dXJuIE5ldyBTdHJpbmdcbiAgICByZXR1cm4gcjtcbn07XG5cbmlmICghQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICBBcnJheS5wcm90b3R5cGUuaW5kZXhPZiA9IGZ1bmN0aW9uIChzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpIHtcbiAgICAgIGlmICggdGhpcyA9PT0gdW5kZWZpbmVkIHx8IHRoaXMgPT09IG51bGwgKSB7XG4gICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoICdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyApO1xuICAgICAgfVxuXG4gICAgICB2YXIgbGVuZ3RoID0gdGhpcy5sZW5ndGggPj4+IDA7IC8vIEhhY2sgdG8gY29udmVydCBvYmplY3QubGVuZ3RoIHRvIGEgVUludDMyXG5cbiAgICAgIGZyb21JbmRleCA9ICtmcm9tSW5kZXggfHwgMDtcblxuICAgICAgaWYgKE1hdGguYWJzKGZyb21JbmRleCkgPT09IEluZmluaXR5KSB7XG4gICAgICAgIGZyb21JbmRleCA9IDA7XG4gICAgICB9XG5cbiAgICAgIGlmIChmcm9tSW5kZXggPCAwKSB7XG4gICAgICAgIGZyb21JbmRleCArPSBsZW5ndGg7XG4gICAgICAgIGlmIChmcm9tSW5kZXggPCAwKSB7XG4gICAgICAgICAgZnJvbUluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmb3IgKDtmcm9tSW5kZXggPCBsZW5ndGg7IGZyb21JbmRleCsrKSB7XG4gICAgICAgIGlmICh0aGlzW2Zyb21JbmRleF0gPT09IHNlYXJjaEVsZW1lbnQpIHtcbiAgICAgICAgICByZXR1cm4gZnJvbUluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldHVybiAtMTtcbiAgICB9O1xufVxuXG4oZnVuY3Rpb24oJCkge1xuICAgICQuYXBwID0ge1xuICAgICAgICBzYW5kd2ljaDoge1xuICAgICAgICAgICAgY29uZmlnOiB7XG4gICAgICAgICAgICAgICAga2V5SG9va3M6ICExLFxuICAgICAgICAgICAgICAgIHNlbGVjdG9yOiAnLmpzLXNhbmR3aWNoLW1lbnUnLFxuICAgICAgICAgICAgICAgIHdyYXBwZXI6ICcud3JhcHBlcicsXG4gICAgICAgICAgICAgICAgb3ZlcmxheTogJy5tZW51LW92ZXJsYXknXG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBleHRlbmQ6IGZ1bmN0aW9uKGNvbmZpZylcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25maWcgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIHg7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoeCBpbiBjb25maWcpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgX3RoaXMuY29uZmlnW3hdICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBfdGhpcy5jb25maWdbeF0gPSBjb25maWdbeF07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpc09wZW46IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gJCgnYm9keScpLmhhc0NsYXNzKCdwYWdlLXZpc2libGUnKTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIGhpZGU6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3BhZ2Utb3BlbicpO1xuXG4gICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3BhZ2UtdmlzaWJsZScpO1xuICAgICAgICAgICAgICAgIH0sIDEwKTtcblxuICAgICAgICAgICAgICAgICQodGhpcy5jb25maWcub3ZlcmxheSkuY3NzKHtcbiAgICAgICAgICAgICAgICAgICAgJ3Zpc2liaWxpdHknOiAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgdG9nZ2xlOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYgKCQoJ2JvZHknKS5oYXNDbGFzcygncGFnZS12aXNpYmxlJykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3BhZ2Utb3BlbicpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygncGFnZS12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDIwMCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2VcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncGFnZS1vcGVuJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFkZENsYXNzKCdwYWdlLXZpc2libGUnKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIHZhciB2aXNpYmlsaXR5ID0gJ3Zpc2libGUnO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEkKCdib2R5JykuaGFzQ2xhc3MoJ3BhZ2Utb3BlbicpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmlzaWJpbGl0eSA9ICdoaWRkZW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICQoX3RoaXMuY29uZmlnLm92ZXJsYXkpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JzogdmlzaWJpbGl0eVxuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgc2FuZHdpY2hUcmlnZ2VyOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIGlmIChfdGhpcy5jb25maWcua2V5SG9va3MpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5Jykub24oJ2tleWRvd24nLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihlLmtleUNvZGUgPT0gMjcgJiYgX3RoaXMuaXNPcGVuKCkpXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgX3RoaXMuY29uZmlnLnNlbGVjdG9yLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCA/IGUucHJldmVudERlZmF1bHQoKSA6IGUucmV0dXJuVmFsdWUgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMudG9nZ2xlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBvdmVybGF5VHJpZ2dlcjogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgX3RoaXMuY29uZmlnLm92ZXJsYXksIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICBfdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBpbml0OiBmdW5jdGlvbihjb25maWcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdGhpcy5leHRlbmQoY29uZmlnKTtcbiAgICAgICAgICAgICAgICB0aGlzLnNhbmR3aWNoVHJpZ2dlcigpO1xuICAgICAgICAgICAgICAgIHRoaXMub3ZlcmxheVRyaWdnZXIoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSxcblxuICAgICAgICBydW46IGZ1bmN0aW9uKClcbiAgICAgICAge1xuICAgICAgICAgICAgJC5hcHAuc2FuZHdpY2guaW5pdCgpO1xuICAgICAgICAgICAgJC5hcHAubW9kdWxlLmJlYXIuaW5pdCgpO1xuICAgICAgICAgICAgJC5hcHAubW9kdWxlLmZvcm1fYWpheCgpO1xuICAgICAgICAgICAgJC5hcHAubW9kdWxlLnJlc2l6ZShmdW5jdGlvbigpeyB9LCA1MDApO1xuXG4gICAgICAgICAgICAkKFwiLmludGVnZXJcIikub24oJ2tleXByZXNzJywgZnVuY3Rpb24gKGUpIHsgaWYoIFswLCA4XS5pbmRleE9mKCBlLndoaWNoICkgPCAwICYmICggZS53aGljaCA8IDQ4IHx8IGUud2hpY2ggPiA1NyApICkgeyByZXR1cm4gZmFsc2U7IH0gfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmluc2VydC1jYXJ0LXRyaWdnZXInLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgJGJ1dHRvbiA9ICQodGhpcyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoISRidXR0b24uaGFzQ2xhc3MoJ2luLWNhcnQnKSkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJGlkID0gJCh0aGlzKS5kYXRhKCdpZF9wcm9kdWN0Jyk7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkLnBvc3QoXCIvY2FydC9pbnNlcnQvXCIsIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGlvbjogJ2luc2VydCcsXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogJGlkLFxuICAgICAgICAgICAgICAgICAgICAgICAgcXVhbnRpdHk6IDFcbiAgICAgICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24oIGRhdGEgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCcjdG90YWxfY291bnQnKS50ZXh0KGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAgICAgJGJ1dHRvbi5odG1sKFwi0JIg0LrQvtGA0LfQuNC90LVcIikuYWRkQ2xhc3MoXCJpbi1jYXJ0XCIpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZiAoISQoJyNhZGRlZF9pbl9iYXNrZXQnKS5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBwb3BvdmVyID0gW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwicG9wb3ZlclwiIGlkPVwiYWRkZWRfaW5fYmFza2V0XCI+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxkaXYgY2xhc3M9XCJmb3JtLW9yZGVyX19jb21wbGV0ZVwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1vcmRlcl9fY29tcGxldGVfX21pZGRsZVwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAn0KLQvtCy0LDRgCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4gY2xhc3M9XCJmb3JtLW9yZGVyX19jb21wbGV0ZV9faWNvblwiPjwvc3Bhbj7QtNC+0LHQsNCy0LvQtdC9INCyINC60L7RgNC30LjQvdGDJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgXS5qb2luKCcnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLmFwcGVuZChwb3BvdmVyKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoJyNhZGRlZF9pbl9iYXNrZXQnKS5mYWRlT3V0KDgwMCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDUwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcudG9nZ2xlLXRyaWdnZXInLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICB2YXIgaWQgPSAkKHRoaXMpLmF0dHIoJ2hyZWYnKTtcbiAgICAgICAgICAgICAgICBpZiggJChpZCkubGVuZ3RoID4gMCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiggJCh0aGlzKS5oYXNDbGFzcygndWxfbGlzdC1pdGVtX2xpbmstZHJvcCcpIClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS50b2dnbGVDbGFzcygndWxfbGlzdC1pdGVtX2xpbmstZHJvcC11cCcpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJChpZCkuc2xpZGVUb2dnbGUoMTUwKTtcbiAgICAgICAgICAgICAgICAgICAgJCgnaHRtbCwgYm9keScpLmFuaW1hdGUoeyBzY3JvbGxUb3A6ICQodGhpcykub2Zmc2V0KCkudG9wIH0sICdzbG93Jyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcubmF2LWxpc3QtaXRlbS1saW5rJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgdmFyICRjbG9zZSA9ICQodGhpcykuY2xvc2VzdCgnLm5hdi1saXN0LWl0ZW0nKTtcblxuICAgICAgICAgICAgICAgIGlmICgkY2xvc2UuZmluZCgnLnN1Ym1lbnUnKS5sZW5ndGggJiYgISRjbG9zZS5oYXNDbGFzcygnb3BlbmVkJykpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgICAgICAgJGNsb3NlLmFkZENsYXNzKCdvcGVuZWQnKTtcblxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7ICAgIFxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ21vdXNlZW50ZXInLCAnLm5hdi1saXN0LWl0ZW0nLCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICBpZiAoJCh0aGlzKS5maW5kKCcuc3VibWVudScpLmxlbmd0aClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyksXG4gICAgICAgICAgICAgICAgICAgICAgICAkc3VibWVudSA9ICR0aGlzLmZpbmQoJy5zdWJtZW51Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgJHN1Ym1lbnUuYWRkQ2xhc3MoJ2lzLXNob3cnKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc2V0VGltZW91dChmdW5jdGlvbigpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzdWJtZW51LmFkZENsYXNzKCdpcy1hbmltYXRlJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9LCAxMCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdtb3VzZWxlYXZlJywgJy5uYXYtbGlzdC1pdGVtJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnLnN1Ym1lbnUnKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN1Ym1lbnUgPSAkdGhpcy5maW5kKCcuc3VibWVudScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdWJtZW51LnJlbW92ZUNsYXNzKCdpcy1hbmltYXRlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3VibWVudS5yZW1vdmVDbGFzcygnaXMtc2hvdycpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMjUwKTtcbiAgICAgICAgICAgICAgICAgICAgfSwgNTApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICBpZiggdHlwZW9mICQuaW5pdFBvcHVwcyAhPT0gJ3VuZGVmaW5lZCcgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQuaW5pdFBvcHVwcygpO1xuXG4gICAgICAgICAgICAgICAgaWYod2luZG93LmxvY2F0aW9uLmhhc2gubGVuZ3RoID4gMSAmJiAkKHdpbmRvdy5sb2NhdGlvbi5oYXNoKS5oYXNDbGFzcygncG9wdXAnKSApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5wb3B1cC5vcGVuKHdpbmRvdy5sb2NhdGlvbi5oYXNoLnN1YnN0cigxKSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgY2F0Y2goZSkge31cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG4gICAgICAgIG1vZHVsZToge1xuICAgICAgICAgICAgYmVhcjoge1xuICAgICAgICAgICAgICAgIHRpbWVvdXQ6IDIwMDAwLFxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICcjYmVhcicsXG4gICAgICAgICAgICAgICAgbW92ZTogZnVuY3Rpb24oX2dvXylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBfc2VsZl8gPSB0aGlzLCB0aW1lb3V0ID0gX3NlbGZfLnRpbWVvdXQ7XG4gICAgICAgICAgICAgICAgICAgIF9nb18gPSB3aW5kb3cuaW5uZXJXaWR0aCAtIF9nb18gLSAyOTg7XG4gICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICBpZihfZ29fID4gd2luZG93LmlubmVyV2lkdGgpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nb18gPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZigkLmNvb2tpZSgnX2dvXycpKSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIF9nb18gPSAkLmNvb2tpZSgnX2dvXycpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ19nb18nLCBfZ29fLCB7IGV4cGlyZXM6IDcsIHBhdGg6ICcvJyB9KTtcblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoJC5jb29raWUoJ2Nvb3JkaW5hdGUnKSkgIT09ICd1bmRlZmluZWQnICYmICQuY29va2llKCdjb29yZGluYXRlJykgIT09ICcnKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgY29vcmQgPSBNYXRoLmZsb29yKCQuY29va2llKCdjb29yZGluYXRlJykpO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAkKF9zZWxmXy5lbGVtZW50KS5jc3MoeyAnbGVmdCc6IGNvb3JkIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcGVyY2VudCA9IDEwMCAtIE1hdGguZmxvb3IoKCh3aW5kb3cuaW5uZXJXaWR0aCAtIGNvb3JkKSAqIDEwMCkgLyB3aW5kb3cuaW5uZXJXaWR0aCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgdGltZW91dCA9IHRpbWVvdXQgLSAoIHRpbWVvdXQgKiBwZXJjZW50IC8gMTAwKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAkKF9zZWxmXy5lbGVtZW50KS5zdG9wKCkuYW5pbWF0ZSh7IGxlZnQ6IF9nb18gfSwgeyBkdXJhdGlvbjogdGltZW91dCwgc3RlcDogZnVuY3Rpb24obm93LCBmeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICAkLmNvb2tpZSgnY29vcmRpbmF0ZScsIG5vdywgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKG5vdyA9PSBfZ29fKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQoX3NlbGZfLmVsZW1lbnQpLnRvZ2dsZUNsYXNzKCdmb290ZXItYmVhci1yZXZlcnNlJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZSgnY29vcmRpbmF0ZScsIHsgcGF0aDogJy8nIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQucmVtb3ZlQ29va2llKCdfZ29fJywgeyBwYXRoOiAnLycgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmFwcC5tb2R1bGUuYmVhci5tb3ZlKF9nb18pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICByb3RhdGU6IGZ1bmN0aW9uKCBkZWcgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCh0aGlzLmVsZW1lbnQpLmZpbmQoJy5mb290ZXItYmVhci1pbm5lcicpLnN0b3AoKS5hbmltYXRlKHsgcm90YXRpb246IGRlZyB9LCB7IGR1cmF0aW9uOiAxODAwLCBzdGVwOiBmdW5jdGlvbihub3csIGZ4KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLmNzcyh7XCJ0cmFuc2Zvcm1cIjogXCJyb3RhdGUoXCIrbm93K1wiZGVnKVwifSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZihub3cgPT0gZGVnKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICQuYXBwLm1vZHVsZS5iZWFyLnJvdGF0ZSgoZGVnKi0xKSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH19KTtcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGluaXQ6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmICgkKHdpbmRvdykud2lkdGgoKSA+IDk2MClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5yb3RhdGUoNik7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1vdmUoMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmVzaXplOiBmdW5jdGlvbiggY2FsbGJhY2ssIHRpbWUgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXNpemVFdnQ7XG4gICAgICAgICAgICAgICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJUaW1lb3V0KHdpbmRvdy5yZXNpemVFdnQpO1xuICAgICAgICAgICAgICAgICAgICAgICAgd2luZG93LnJlc2l6ZUV2dCA9IHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYWxsYmFjay5hcHBseSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgdGltZSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGdvb2dsZU1hcDogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBtYXBPcHRpb25zID0ge1xuICAgICAgICAgICAgICAgICAgICB6b29tOiAxNixcbiAgICAgICAgICAgICAgICAgICAgem9vbUNvbnRyb2w6ICEwLFxuICAgICAgICAgICAgICAgICAgICB6b29tQ29udHJvbE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBnb29nbGUubWFwcy5ab29tQ29udHJvbFN0eWxlLkxBUkdFLFxuICAgICAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IGdvb2dsZS5tYXBzLkNvbnRyb2xQb3NpdGlvbi5MRUZUX1RPUFxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBwYW5Db250cm9sOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgcGFuQ29udHJvbE9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9UT1BcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgc2Nyb2xsd2hlZWw6ICExLFxuICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0aW9uQ29udHJvbDogITEsXG4gICAgICAgICAgICAgICAgICAgIG1hcFR5cGVDb250cm9sOiAhMSxcbiAgICAgICAgICAgICAgICAgICAgc2NhbGVDb250cm9sOiAhMSxcbiAgICAgICAgICAgICAgICAgICAgZHJhZ2dhYmxlOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgc3R5bGVzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGh1ZTogJyNhZGNlZDUnIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBdXG4gICAgICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnRUeXBlOiAnbGFiZWxzJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdmlzaWJpbGl0eTogJ29uJyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBmZWF0dXJlVHlwZTogJ3dhdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzdHlsZXJzOiBbXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgY29sb3I6ICcjYzlkZmU0JyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBdLFxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlRG91YmxlQ2xpY2tab29tOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgY2VudGVyOiBuZXcgZ29vZ2xlLm1hcHMuTGF0TG5nKDQzLjU2OTc4NywgMzkuNzU2MzYyKVxuICAgICAgICAgICAgICAgIH07XG5cbiAgICAgICAgICAgICAgICB2YXIgbWFwID0gbmV3IGdvb2dsZS5tYXBzLk1hcChkb2N1bWVudC5nZXRFbGVtZW50QnlJZCggJ21hcC1jb250ZWluZXInICksIG1hcE9wdGlvbnMpO1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIHZhciBidWxsZXQgPSB7XG4gICAgICAgICAgICAgICAgICAgIHVybDogJ2ltYWdlcy9tYXAtYnVsbGV0LnBuZycsXG4gICAgICAgICAgICAgICAgICAgIHNpemU6IG5ldyBnb29nbGUubWFwcy5TaXplKDM5LCA1MiksXG4gICAgICAgICAgICAgICAgICAgIG9yaWdpbjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDAsMCksXG4gICAgICAgICAgICAgICAgICAgIGFuY2hvcjogbmV3IGdvb2dsZS5tYXBzLlBvaW50KDM5LCA1MilcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgIG5ldyBnb29nbGUubWFwcy5NYXJrZXIoe1xuICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0My41Njk3ODcsIDM5Ljc1NjM2MiksXG4gICAgICAgICAgICAgICAgICAgIG1hcDogbWFwLFxuICAgICAgICAgICAgICAgICAgICBpY29uOiBidWxsZXRcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBjYWNoZTogZnVuY3Rpb24oIHMsIGNiIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgYSwgZyA9IFtdLCBpLCB4LCBjbnQgPSBzLmxlbmd0aCwgcCA9IHsgaToge30sIGFjOiAwLCBjOiAwIH0sIGNiID0gY2IgfHwgZnVuY3Rpb24oKXt9O1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgZnVuY3Rpb24geSggaW5kZXgsIHNyYyApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGcucHVzaCggc3JjICk7XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBnLmxlbmd0aCA+PSBjbnQgKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNiLmNhbGwoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgcC5jKytcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgIGZvciAoeCBpbiBzKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhID0gc1t4XTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgaSA9IG5ldyBJbWFnZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgaS5zcmMgPSBhO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpLm9ubG9hZCA9IHkoIHgsIGEgKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgcC5pW2FdID0gaTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHAuYWMrK1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhdGNoKGUpIHt9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcmV0aW5hOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYoICdkZXZpY2VQaXhlbFJhdGlvJyBpbiB3aW5kb3cgJiYgd2luZG93LmRldmljZVBpeGVsUmF0aW8gPT0gMiApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaT0wLCBzcmMsIGltZyA9ICQoICdpbWcucmVwbGFjZS0yeCcgKS5nZXQoKSwgbCA9IGltZy5sZW5ndGg7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoaTsgaTxsOyBpKyspXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYyA9IGltZ1tpXS5zcmM7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcmMgPSBzcmMucmVwbGFjZSgvXFwuKHBuZ3xqcGd8Z2lmKSskL2ksICdAMnguJDEnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGltZ1tpXS5zcmMgPSBzcmM7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgaXNVbmRlZmluZWQ6IGZ1bmN0aW9uKCBvYmogKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHJldHVybiBvYmogPT09IHZvaWQgMDtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB1cGRhdGVJbWFnZTogZnVuY3Rpb24oZWxlbWVudClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICBpZiggJChlbGVtZW50KS5sZW5ndGggPiAwICkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaW1hZ2UgPSAkKGVsZW1lbnQpLmF0dHIoJ3NyYycpLnNwbGl0KCAnPycgKVswXSA7XG4gICAgICAgICAgICAgICAgICAgICQoZWxlbWVudCkuYXR0cignc3JjJywgaW1hZ2UgKyAnP3Y9JyArIE1hdGgucmFuZG9tKCkgKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJhbmRvbTogZnVuY3Rpb24obWluLCBtYXgpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgbWluID0gbWluIHx8IDAgO1xuICAgICAgICAgICAgICAgIG1heCA9IG1heCB8fCAxMDAgO1xuICAgICAgICAgICAgICAgIHJldHVybiBNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiAoIG1heCAtIG1pbiArIDEgKSkgKyBtaW4gO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICQuYXBwLm1vdmllcyA9IHt9O1xuICAgICQuYXBwLm1vdmllcy5sb2FkID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGFsZXJ0KCAnbG9hZCBtb3JlJyApO1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcblxuICAgICQuYXBwLm1vZHVsZS5mb3JtX3ZhbGlkYXRpb25fZGVmYXVsdCA9IGZ1bmN0aW9uKCRmb3JtLCBlcnJvcnMpIHtcbiAgICAgICAgJGZvcm0uZmluZCgnLmZvcm1fZXJyb3JfYmxvY2snKS5oaWRlKCk7XG4gICAgICAgICRmb3JtLmZpbmQoJy5lcnJvcicpLnJlbW92ZUNsYXNzKCdlcnJvcicpO1xuICAgICAgICAkZm9ybS5maW5kKCcuY2hlY2tib3hfX2xhYmVsLWVycm9yJykucmVtb3ZlQ2xhc3MoJ2NoZWNrYm94X19sYWJlbC1lcnJvcicpO1xuICAgICAgICBpZihlcnJvcnMpIHtcbiAgICAgICAgICAgIHZhciAkZXJyb3JfYmxvY2sgPSAkKCcjZm9ybS1lcnJvcnMnKTtcbiAgICAgICAgICAgICRlcnJvcl9ibG9jay5odG1sKCcnKTtcblxuICAgICAgICAgICAgZm9yKGZpZWxkTmFtZSBpbiBlcnJvcnMpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJGZpZWxkID0gJGZvcm0uZmluZCgnaW5wdXRbbmFtZT1cIicrZmllbGROYW1lKydcIl0nKTtcbiAgICAgICAgICAgICAgICAkZXJyb3JfYmxvY2suYXBwZW5kKFxuICAgICAgICAgICAgICAgICAgICBbXG4gICAgICAgICAgICAgICAgICAgICAgICAnPHNwYW4+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICRmaWVsZC5kYXRhKCdlcnJvcicpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJzwvc3Bhbj4nXG4gICAgICAgICAgICAgICAgICAgIF0uam9pbignJylcbiAgICAgICAgICAgICAgICApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfTtcblxuICAgICQuYXBwLmNhbGxiYWNrX3N0YWNrID0ge307XG4gICAgJC5hcHAuY2FsbGJhY2tfc3RhY2suZm9ybV9hamF4X2RlZmF1bHQgPSBmdW5jdGlvbigkZm9ybSwgcmVzcG9uc2UpIHtcbiAgICAgICAgaWYocmVzcG9uc2Uuc3RhdHVzKSB7XG4gICAgICAgICAgICBpZihyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgncmVkaXJlY3RfdXJsJykpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cubG9jYXRpb24uaHJlZiA9IHJlc3BvbnNlLnJlZGlyZWN0X3VybDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmKHJlc3BvbnNlLmVycm9ycykge1xuICAgICAgICAgICAgJC5hcHAubW9kdWxlLmZvcm1fdmFsaWRhdGlvbl9kZWZhdWx0KCRmb3JtLCByZXNwb25zZS5lcnJvcnMpO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZihyZXNwb25zZS5oYXNPd25Qcm9wZXJ0eSgnbWVzc2FnZScpKSB7XG4gICAgICAgICAgICAkLnBvcHVwLm1lc3NhZ2UocmVzcG9uc2UudGl0bGUsIHJlc3BvbnNlLm1lc3NhZ2UpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgICQuYXBwLm1vZHVsZS5mb3JtX2FqYXggPSBmdW5jdGlvbigpIHtcbiAgICAgICAgJCgnYm9keScpLm9uKCdzdWJtaXQnICwnLmZvcm0tYWpheCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHZhciAkZm9ybSA9ICQodGhpcyk7XG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgdXJsOiAkZm9ybS5hdHRyKCdhY3Rpb24nKSxcbiAgICAgICAgICAgICAgICB0eXBlOiAoJGZvcm0uYXR0cignbWV0aG9kJykgfHwgJ3Bvc3QnKSxcbiAgICAgICAgICAgICAgICBkYXRhOiAkZm9ybS5zZXJpYWxpemUoKSxcbiAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoJGZvcm0uZGF0YSgnY2FsbGJhY2snKSAmJiAkLmFwcC5jYWxsYmFja19zdGFjay5oYXNPd25Qcm9wZXJ0eSgkZm9ybS5kYXRhKCdjYWxsYmFjaycpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5hcHAuY2FsbGJhY2tfc3RhY2tbJGZvcm0uZGF0YSgnY2FsbGJhY2snKV0oJGZvcm0sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYXBwLmNhbGxiYWNrX3N0YWNrLmZvcm1fYWpheF9kZWZhdWx0KCRmb3JtLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZiggcmVzcG9uc2Uuc3RhdHVzID09PSB0cnVlICYmIHJlc3BvbnNlLm1lc3NhZ2UgIT09ICcnIClcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgJC5wb3B1cC5tZXNzYWdlKCByZXNwb25zZS50aXRsZSwgcmVzcG9uc2UubWVzc2FnZSApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBlcnJvcjogZnVuY3Rpb24ocmVzcG9uc2UpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkLmFwcC5jYWxsYmFja19zdGFjay5mb3JtX2FqYXhfZGVmYXVsdCgkZm9ybSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICBhbGVydChcImVycm9yXCIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICB9O1xuXG4gICAgJC5hcHAubW9kdWxlLnVwbG9hZF9idXR0b24gPSBmdW5jdGlvbigpe1xuICAgICAgICAkKCdib2R5Jykub24oJ3N1Ym1pdCcgLCcuZm9ybS1maWxlLXVwbG9hZCcsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIHJldHVybiBBSU0uc3VibWl0KHRoaXMsIHtcbiAgICAgICAgICAgICAgICBvblN0YXJ0OiBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbiggcmVzdWx0IClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCB0eXBlb2YgcmVzdWx0ID09PSAnb2JqZWN0JyAmJiByZXN1bHQuc3RhdHVzID09PSB0cnVlICYmIHR5cGVvZiByZXN1bHQucGhvdG9fdXJsICE9PSAndW5kZWZpbmVkJyApXG4gICAgICAgICAgICAgICAgICAgIHsgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICQoZG9jdW1lbnQpLm9uKCdjaGFuZ2UnLCAnLnVwbG9hZF9idXR0b25fb25jaGFuZ2UnLCBmdW5jdGlvbigpe1xuICAgICAgICAgICAgaWYoICQodGhpcykuY2xvc2VzdCgnLnVwbG9hZF9idXR0b24nKS5maW5kKCcudXBsb2FkX2J1dHRvbl9maWVsZCcpLmxlbmd0aCA+IDAgKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICQodGhpcykuY2xvc2VzdCgnLnVwbG9hZF9idXR0b24nKS5maW5kKCcudXBsb2FkX2J1dHRvbl9maWVsZCcpLmh0bWwoICQodGhpcykudmFsKCkgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQuYXBwLmN1c3RvbV9wbGFjZWhvbGRlciA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBpZiAoTW9kZXJuaXpyLnRvdWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkKCdpbnB1dCwgdGV4dGFyZWEnKS5lYWNoKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgdmFyICRpbnB1dCA9ICQodGhpcyksICRpbnB1dFdyYXBwZXIsICRwbGFjZWhvbGRlciwgcGxhY2Vob2xkZXJUZXh0ID0gJGlucHV0LmF0dHIoJ3BsYWNlaG9sZGVyJyk7XG4gICAgICAgICAgICBpZihwbGFjZWhvbGRlclRleHQpIHtcbiAgICAgICAgICAgICAgICAkaW5wdXRXcmFwcGVyID0gJGlucHV0LnBhcmVudCgpO1xuICAgICAgICAgICAgICAgICRwbGFjZWhvbGRlciA9ICQoJzxkaXYgY2xhc3M9XCJkZWZhdWx0LWlucHV0X19wbGFjZWhvbGRlclwiIHN0eWxlPVwibGluZS1oZWlnaHQ6ICcrKCRpbnB1dC5pcygndGV4dGFyZWEnKSA/ICczNnB4JyA6ICggJGlucHV0V3JhcHBlci5pbm5lckhlaWdodCgpID09IDAgPyAnMzYnIDogJGlucHV0V3JhcHBlci5pbm5lckhlaWdodCgpICkrJ3B4JykrJ1wiPicrcGxhY2Vob2xkZXJUZXh0Kyc8L2Rpdj4nKTtcbiAgICAgICAgICAgICAgICAkcGxhY2Vob2xkZXJbJGlucHV0LnZhbCgpLmxlbmd0aCA/ICdoaWRlJyA6ICdzaG93J10oKTtcbiAgICAgICAgICAgICAgICAkaW5wdXQuYWRkQ2xhc3MoJ2N1c3RvbS1wbGFjZWhvbGRlcicpLmF0dHIoJ3BsYWNlaG9sZGVyJywgJycpO1xuICAgICAgICAgICAgICAgICRpbnB1dFdyYXBwZXIuYXBwZW5kKCRwbGFjZWhvbGRlcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgJCgnYm9keScpLm9uKCdibHVyJywgJy5jdXN0b20tcGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgICAgICAgICBpZighJHRoaXMudmFsKCkubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgJHRoaXMucGFyZW50KCkuZmluZCgnLmRlZmF1bHQtaW5wdXRfX3BsYWNlaG9sZGVyJykuc2hvdygpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgJCgnYm9keScpLm9uKCdmb2N1cycsICcuY3VzdG9tLXBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkKHRoaXMpLnBhcmVudCgpLmZpbmQoJy5kZWZhdWx0LWlucHV0X19wbGFjZWhvbGRlcicpLmhpZGUoKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsICcuZGVmYXVsdC1pbnB1dF9fcGxhY2Vob2xkZXInLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkdGhpcyA9ICQodGhpcyk7XG4gICAgXG4gICAgICAgICAgICAkdGhpcy5oaWRlKCk7XG4gICAgICAgICAgICAkdGhpcy5wYXJlbnQoKS5maW5kKCcuY3VzdG9tLXBsYWNlaG9sZGVyJykudHJpZ2dlcignZm9jdXMnKTtcbiAgICAgICAgfSk7XG4gICAgICAgICQoJ2JvZHknKS5vbignc2VsZWN0c3RhcnQnLCAnLmRlZmF1bHQtaW5wdXRfX3BsYWNlaG9sZGVyJywgZmFsc2UpO1xuICAgIH07XG5cbiAgICAkLmFwcC5ydW4oKTtcbn0pKGpRdWVyeSk7Il19

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
