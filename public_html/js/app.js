'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var body = document.body,
    timer;
;(function ($) {
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
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9fYXBwLmpzIl0sIm5hbWVzIjpbImJvZHkiLCJkb2N1bWVudCIsInRpbWVyIiwiJCIsImFwcCIsInNhbmR3aWNoIiwiY29uZmlnIiwia2V5SG9va3MiLCJzZWxlY3RvciIsIndyYXBwZXIiLCJvdmVybGF5IiwiZXh0ZW5kIiwiX3RoaXMiLCJ4IiwiaXNPcGVuIiwiaGFzQ2xhc3MiLCJoaWRlIiwicmVtb3ZlQ2xhc3MiLCJzZXRUaW1lb3V0IiwiY3NzIiwidG9nZ2xlIiwiYWRkQ2xhc3MiLCJ2aXNpYmlsaXR5Iiwic2FuZHdpY2hUcmlnZ2VyIiwib24iLCJlIiwia2V5Q29kZSIsInByZXZlbnREZWZhdWx0IiwicmV0dXJuVmFsdWUiLCJvdmVybGF5VHJpZ2dlciIsImluaXQiLCJydW4iLCJtb2R1bGUiLCJiZWFyIiwiZm9ybV9hamF4IiwicmVzaXplIiwiaW5kZXhPZiIsIndoaWNoIiwiJGJ1dHRvbiIsIiRpZCIsImRhdGEiLCJwb3N0IiwiYWN0aW9uIiwiaWQiLCJxdWFudGl0eSIsInRleHQiLCJodG1sIiwibGVuZ3RoIiwicG9wb3ZlciIsImpvaW4iLCJhcHBlbmQiLCJmYWRlT3V0IiwicmVtb3ZlIiwiYXR0ciIsInRvZ2dsZUNsYXNzIiwic2xpZGVUb2dnbGUiLCJhbmltYXRlIiwic2Nyb2xsVG9wIiwib2Zmc2V0IiwidG9wIiwiJGNsb3NlIiwiY2xvc2VzdCIsImZpbmQiLCIkdGhpcyIsIiRzdWJtZW51IiwiaW5pdFBvcHVwcyIsIndpbmRvdyIsImxvY2F0aW9uIiwiaGFzaCIsInBvcHVwIiwib3BlbiIsInN1YnN0ciIsInRpbWVvdXQiLCJlbGVtZW50IiwibW92ZSIsIl9nb18iLCJfc2VsZl8iLCJpbm5lcldpZHRoIiwiY29va2llIiwiZXhwaXJlcyIsInBhdGgiLCJjb29yZCIsIk1hdGgiLCJmbG9vciIsInBlcmNlbnQiLCJzdG9wIiwibGVmdCIsImR1cmF0aW9uIiwic3RlcCIsIm5vdyIsImZ4IiwicmVtb3ZlQ29va2llIiwicm90YXRlIiwiZGVnIiwicm90YXRpb24iLCJ3aWR0aCIsImNhbGxiYWNrIiwidGltZSIsInJlc2l6ZUV2dCIsImNsZWFyVGltZW91dCIsImFwcGx5IiwiZ29vZ2xlTWFwIiwibWFwT3B0aW9ucyIsInpvb20iLCJ6b29tQ29udHJvbCIsInpvb21Db250cm9sT3B0aW9ucyIsInN0eWxlIiwiZ29vZ2xlIiwibWFwcyIsIlpvb21Db250cm9sU3R5bGUiLCJMQVJHRSIsInBvc2l0aW9uIiwiQ29udHJvbFBvc2l0aW9uIiwiTEVGVF9UT1AiLCJwYW5Db250cm9sIiwicGFuQ29udHJvbE9wdGlvbnMiLCJzY3JvbGx3aGVlbCIsIm5hdmlnYXRpb25Db250cm9sIiwibWFwVHlwZUNvbnRyb2wiLCJzY2FsZUNvbnRyb2wiLCJkcmFnZ2FibGUiLCJzdHlsZXMiLCJzdHlsZXJzIiwiaHVlIiwiZWxlbWVudFR5cGUiLCJmZWF0dXJlVHlwZSIsImNvbG9yIiwiZGlzYWJsZURvdWJsZUNsaWNrWm9vbSIsImNlbnRlciIsIkxhdExuZyIsIm1hcCIsIk1hcCIsImdldEVsZW1lbnRCeUlkIiwiYnVsbGV0IiwidXJsIiwic2l6ZSIsIlNpemUiLCJvcmlnaW4iLCJQb2ludCIsImFuY2hvciIsIk1hcmtlciIsImljb24iLCJjYWNoZSIsInMiLCJjYiIsInkiLCJpbmRleCIsInNyYyIsImciLCJwdXNoIiwiY250IiwiY2FsbCIsInAiLCJjIiwiYSIsImkiLCJhYyIsIkltYWdlIiwib25sb2FkIiwicmV0aW5hIiwiZGV2aWNlUGl4ZWxSYXRpbyIsImltZyIsImdldCIsImwiLCJyZXBsYWNlIiwiaXNVbmRlZmluZWQiLCJvYmoiLCJ1cGRhdGVJbWFnZSIsImltYWdlIiwic3BsaXQiLCJyYW5kb20iLCJtaW4iLCJtYXgiLCJtb3ZpZXMiLCJsb2FkIiwiYWxlcnQiLCJmb3JtX3ZhbGlkYXRpb25fZGVmYXVsdCIsIiRmb3JtIiwiZXJyb3JzIiwiJGVycm9yX2Jsb2NrIiwiZmllbGROYW1lIiwiJGZpZWxkIiwiY2FsbGJhY2tfc3RhY2siLCJmb3JtX2FqYXhfZGVmYXVsdCIsInJlc3BvbnNlIiwic3RhdHVzIiwiaGFzT3duUHJvcGVydHkiLCJocmVmIiwicmVkaXJlY3RfdXJsIiwibWVzc2FnZSIsInRpdGxlIiwiYWpheCIsInR5cGUiLCJzZXJpYWxpemUiLCJkYXRhVHlwZSIsInN1Y2Nlc3MiLCJlcnJvciIsInVwbG9hZF9idXR0b24iLCJBSU0iLCJzdWJtaXQiLCJvblN0YXJ0Iiwib25Db21wbGV0ZSIsInJlc3VsdCIsInBob3RvX3VybCIsInZhbCIsImN1c3RvbV9wbGFjZWhvbGRlciIsIk1vZGVybml6ciIsInRvdWNoIiwiZWFjaCIsIiRpbnB1dCIsIiRpbnB1dFdyYXBwZXIiLCIkcGxhY2Vob2xkZXIiLCJwbGFjZWhvbGRlclRleHQiLCJwYXJlbnQiLCJpcyIsImlubmVySGVpZ2h0Iiwic2hvdyIsInRyaWdnZXIiLCJqUXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7QUFBQSxJQUFJQSxPQUFPQyxTQUFTRCxJQUFwQjtBQUFBLElBQTBCRSxLQUExQjtBQUNBLENBQUMsQ0FBQyxVQUFTQyxDQUFULEVBQVk7QUFDVkEsTUFBRUMsR0FBRixHQUFRO0FBQ0pDLGtCQUFVO0FBQ05DLG9CQUFRO0FBQ0pDLDBCQUFVLENBQUMsQ0FEUDtBQUVKQywwQkFBVSxtQkFGTjtBQUdKQyx5QkFBUyxVQUhMO0FBSUpDLHlCQUFTO0FBSkwsYUFERjs7QUFRTkMsb0JBQVEsZ0JBQVNMLE1BQVQsRUFDUjtBQUNJLG9CQUFJTSxRQUFRLElBQVo7O0FBRUEsb0JBQUksT0FBT04sTUFBUCxLQUFrQixXQUF0QixFQUNBO0FBQ0ksd0JBQUlPLENBQUo7QUFDQSx5QkFBS0EsQ0FBTCxJQUFVUCxNQUFWLEVBQ0E7QUFDSSw0QkFBSSxPQUFPTSxNQUFNTixNQUFOLENBQWFPLENBQWIsQ0FBUCxLQUEyQixXQUEvQixFQUNJRCxNQUFNTixNQUFOLENBQWFPLENBQWIsSUFBa0JQLE9BQU9PLENBQVAsQ0FBbEI7QUFDUDtBQUNKO0FBQ0osYUFyQks7O0FBdUJOQyxvQkFBUSxrQkFDUjtBQUNJLHVC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b2R5ID0gZG9jdW1lbnQuYm9keSwgdGltZXI7XG47KGZ1bmN0aW9uKCQpIHtcbiAgICAkLmFwcCA9IHtcbiAgICAgICAgc2FuZHdpY2g6IHtcbiAgICAgICAgICAgIGNvbmZpZzoge1xuICAgICAgICAgICAgICAgIGtleUhvb2tzOiAhMSxcbiAgICAgICAgICAgICAgICBzZWxlY3RvcjogJy5qcy1zYW5kd2ljaC1tZW51JyxcbiAgICAgICAgICAgICAgICB3cmFwcGVyOiAnLndyYXBwZXInLFxuICAgICAgICAgICAgICAgIG92ZXJsYXk6ICcubWVudS1vdmVybGF5J1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgZXh0ZW5kOiBmdW5jdGlvbihjb25maWcpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdmFyIF90aGlzID0gdGhpcztcblxuICAgICAgICAgICAgICAgIGlmICh0eXBlb2YgY29uZmlnICE9PSAndW5kZWZpbmVkJylcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZhciB4O1xuICAgICAgICAgICAgICAgICAgICBmb3IgKHggaW4gY29uZmlnKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAodHlwZW9mIF90aGlzLmNvbmZpZ1t4XSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgX3RoaXMuY29uZmlnW3hdID0gY29uZmlnW3hdO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaXNPcGVuOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgcmV0dXJuICQoJ2JvZHknKS5oYXNDbGFzcygncGFnZS12aXNpYmxlJyk7XG4gICAgICAgICAgICB9LFxuXG4gICAgICAgICAgICBoaWRlOiBmdW5jdGlvbigpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdwYWdlLW9wZW4nKTtcblxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdwYWdlLXZpc2libGUnKTtcbiAgICAgICAgICAgICAgICB9LCAxMCk7XG5cbiAgICAgICAgICAgICAgICAkKHRoaXMuY29uZmlnLm92ZXJsYXkpLmNzcyh7XG4gICAgICAgICAgICAgICAgICAgICd2aXNpYmlsaXR5JzogJ2hpZGRlbidcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHRvZ2dsZTogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmICgkKCdib2R5JykuaGFzQ2xhc3MoJ3BhZ2UtdmlzaWJsZScpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdwYWdlLW9wZW4nKTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ3BhZ2UtdmlzaWJsZScpO1xuICAgICAgICAgICAgICAgICAgICB9LCAyMDApO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ3BhZ2Utb3BlbicpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hZGRDbGFzcygncGFnZS12aXNpYmxlJyk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDEwKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICB2YXIgdmlzaWJpbGl0eSA9ICd2aXNpYmxlJztcblxuICAgICAgICAgICAgICAgIGlmICghJCgnYm9keScpLmhhc0NsYXNzKCdwYWdlLW9wZW4nKSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIHZpc2liaWxpdHkgPSAnaGlkZGVuJ1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAkKF90aGlzLmNvbmZpZy5vdmVybGF5KS5jc3Moe1xuICAgICAgICAgICAgICAgICAgICAndmlzaWJpbGl0eSc6IHZpc2liaWxpdHlcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG5cbiAgICAgICAgICAgIHNhbmR3aWNoVHJpZ2dlcjogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgICAgICBpZiAoX3RoaXMuY29uZmlnLmtleUhvb2tzKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCdrZXlkb3duJywgZnVuY3Rpb24oZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZS5rZXlDb2RlID09IDI3ICYmIF90aGlzLmlzT3BlbigpKVxuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIF90aGlzLmNvbmZpZy5zZWxlY3RvciwgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQgPyBlLnByZXZlbnREZWZhdWx0KCkgOiBlLnJldHVyblZhbHVlID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIF90aGlzLnRvZ2dsZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgb3ZlcmxheVRyaWdnZXI6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuXG4gICAgICAgICAgICAgICAgJCgnYm9keScpLm9uKCdjbGljaycsIF90aGlzLmNvbmZpZy5vdmVybGF5LCBmdW5jdGlvbihlKXtcbiAgICAgICAgICAgICAgICAgICAgX3RoaXMuaGlkZSgpO1xuICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfSxcblxuICAgICAgICAgICAgaW5pdDogZnVuY3Rpb24oY29uZmlnKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIHRoaXMuZXh0ZW5kKGNvbmZpZyk7XG4gICAgICAgICAgICAgICAgdGhpcy5zYW5kd2ljaFRyaWdnZXIoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm92ZXJsYXlUcmlnZ2VyKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sXG5cbiAgICAgICAgcnVuOiBmdW5jdGlvbigpXG4gICAgICAgIHtcbiAgICAgICAgICAgICQuYXBwLnNhbmR3aWNoLmluaXQoKTtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5iZWFyLmluaXQoKTtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5mb3JtX2FqYXgoKTtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5yZXNpemUoZnVuY3Rpb24oKXsgfSwgNTAwKTtcblxuICAgICAgICAgICAgJChcIi5pbnRlZ2VyXCIpLm9uKCdrZXlwcmVzcycsIGZ1bmN0aW9uIChlKSB7IGlmKCBbMCwgOF0uaW5kZXhPZiggZS53aGljaCApIDwgMCAmJiAoIGUud2hpY2ggPCA0OCB8fCBlLndoaWNoID4gNTcgKSApIHsgcmV0dXJuIGZhbHNlOyB9IH0pO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkKCdib2R5Jykub24oJ2NsaWNrJywgJy5pbnNlcnQtY2FydC10cmlnZ2VyJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyICRidXR0b24gPSAkKHRoaXMpO1xuXG4gICAgICAgICAgICAgICAgaWYgKCEkYnV0dG9uLmhhc0NsYXNzKCdpbi1jYXJ0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRpZCA9ICQodGhpcykuZGF0YSgnaWRfcHJvZHVjdCcpO1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJC5wb3N0KFwiL2NhcnQvaW5zZXJ0L1wiLCB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3Rpb246ICdpbnNlcnQnLFxuICAgICAgICAgICAgICAgICAgICAgICAgaWQ6ICRpZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIHF1YW50aXR5OiAxXG4gICAgICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uKCBkYXRhICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCgnI3RvdGFsX2NvdW50JykudGV4dChkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICRidXR0b24uaHRtbChcItCSINC60L7RgNC30LjQvdC1XCIpLmFkZENsYXNzKFwiaW4tY2FydFwiKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYgKCEkKCcjYWRkZWRfaW5fYmFza2V0JykubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgcG9wb3ZlciA9IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cInBvcG92ZXJcIiBpZD1cImFkZGVkX2luX2Jhc2tldFwiPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8ZGl2IGNsYXNzPVwiZm9ybS1vcmRlcl9fY29tcGxldGVcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPGRpdiBjbGFzcz1cImZvcm0tb3JkZXJfX2NvbXBsZXRlX19taWRkbGVcIj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJ9Ci0L7QstCw0YAnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuIGNsYXNzPVwiZm9ybS1vcmRlcl9fY29tcGxldGVfX2ljb25cIj48L3NwYW4+0LTQvtCx0LDQstC70LXQvSDQsiDQutC+0YDQt9C40L3RgycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgICAgICAgICAgICAgICAgIF0uam9pbignJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgICQoJ2JvZHknKS5hcHBlbmQocG9wb3Zlcik7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKCcjYWRkZWRfaW5fYmFza2V0JykuZmFkZU91dCg4MDAsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKHRoaXMpLnJlbW92ZSgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgICB9LCA1MDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLnRvZ2dsZS10cmlnZ2VyJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgdmFyIGlkID0gJCh0aGlzKS5hdHRyKCdocmVmJyk7XG4gICAgICAgICAgICAgICAgaWYoICQoaWQpLmxlbmd0aCA+IDAgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoICQodGhpcykuaGFzQ2xhc3MoJ3VsX2xpc3QtaXRlbV9saW5rLWRyb3AnKSApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQodGhpcykudG9nZ2xlQ2xhc3MoJ3VsX2xpc3QtaXRlbV9saW5rLWRyb3AtdXAnKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQoaWQpLnNsaWRlVG9nZ2xlKDE1MCk7XG4gICAgICAgICAgICAgICAgICAgICQoJ2h0bWwsIGJvZHknKS5hbmltYXRlKHsgc2Nyb2xsVG9wOiAkKHRoaXMpLm9mZnNldCgpLnRvcCB9LCAnc2xvdycpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICBcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLm5hdi1saXN0LWl0ZW0tbGluaycsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIHZhciAkY2xvc2UgPSAkKHRoaXMpLmNsb3Nlc3QoJy5uYXYtbGlzdC1pdGVtJyk7XG5cbiAgICAgICAgICAgICAgICBpZiAoJGNsb3NlLmZpbmQoJy5zdWJtZW51JykubGVuZ3RoICYmICEkY2xvc2UuaGFzQ2xhc3MoJ29wZW5lZCcpKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICAgICAgICAgICRjbG9zZS5hZGRDbGFzcygnb3BlbmVkJyk7XG5cbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAgICBcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgJCgnYm9keScpLm9uKCdtb3VzZWVudGVyJywgJy5uYXYtbGlzdC1pdGVtJywgZnVuY3Rpb24oZSl7XG4gICAgICAgICAgICAgICAgaWYgKCQodGhpcykuZmluZCgnLnN1Ym1lbnUnKS5sZW5ndGgpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpLFxuICAgICAgICAgICAgICAgICAgICAgICAgJHN1Ym1lbnUgPSAkdGhpcy5maW5kKCcuc3VibWVudScpO1xuXG4gICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdWJtZW51LmFkZENsYXNzKCdpcy1zaG93Jyk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc3VibWVudS5hZGRDbGFzcygnaXMtYW5pbWF0ZScpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSwgMTApO1xuICAgICAgICAgICAgICAgICAgICB9LCA1MCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBcbiAgICAgICAgICAgICQoJ2JvZHknKS5vbignbW91c2VsZWF2ZScsICcubmF2LWxpc3QtaXRlbScsIGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgIGlmICgkKHRoaXMpLmZpbmQoJy5zdWJtZW51JykubGVuZ3RoKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICR0aGlzID0gJCh0aGlzKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICRzdWJtZW51ID0gJHRoaXMuZmluZCgnLnN1Ym1lbnUnKTtcblxuICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAkc3VibWVudS5yZW1vdmVDbGFzcygnaXMtYW5pbWF0ZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHN1Ym1lbnUucmVtb3ZlQ2xhc3MoJ2lzLXNob3cnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIDI1MCk7XG4gICAgICAgICAgICAgICAgICAgIH0sIDUwKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgaWYoIHR5cGVvZiAkLmluaXRQb3B1cHMgIT09ICd1bmRlZmluZWQnIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkLmluaXRQb3B1cHMoKTtcblxuICAgICAgICAgICAgICAgIGlmKHdpbmRvdy5sb2NhdGlvbi5oYXNoLmxlbmd0aCA+IDEgJiYgJCh3aW5kb3cubG9jYXRpb24uaGFzaCkuaGFzQ2xhc3MoJ3BvcHVwJykgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQucG9wdXAub3Blbih3aW5kb3cubG9jYXRpb24uaGFzaC5zdWJzdHIoMSkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGNhdGNoKGUpIHt9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LFxuICAgICAgICBtb2R1bGU6IHtcbiAgICAgICAgICAgIGJlYXI6IHtcbiAgICAgICAgICAgICAgICB0aW1lb3V0OiAyMDAwMCxcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAnI2JlYXInLFxuICAgICAgICAgICAgICAgIG1vdmU6IGZ1bmN0aW9uKF9nb18pXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICB2YXIgX3NlbGZfID0gdGhpcywgdGltZW91dCA9IF9zZWxmXy50aW1lb3V0O1xuICAgICAgICAgICAgICAgICAgICBfZ29fID0gd2luZG93LmlubmVyV2lkdGggLSBfZ29fIC0gMjk4O1xuICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgaWYoX2dvXyA+IHdpbmRvdy5pbm5lcldpZHRoKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZ29fID0gd2luZG93LmlubmVyV2lkdGg7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZih0eXBlb2YoJC5jb29raWUoJ19nb18nKSkgIT09ICd1bmRlZmluZWQnKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBfZ29fID0gJC5jb29raWUoJ19nb18nKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICQuY29va2llKCdfZ29fJywgX2dvXywgeyBleHBpcmVzOiA3LCBwYXRoOiAnLycgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mKCQuY29va2llKCdjb29yZGluYXRlJykpICE9PSAndW5kZWZpbmVkJyAmJiAkLmNvb2tpZSgnY29vcmRpbmF0ZScpICE9PSAnJylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGNvb3JkID0gTWF0aC5mbG9vcigkLmNvb2tpZSgnY29vcmRpbmF0ZScpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJChfc2VsZl8uZWxlbWVudCkuY3NzKHsgJ2xlZnQnOiBjb29yZCB9KTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHBlcmNlbnQgPSAxMDAgLSBNYXRoLmZsb29yKCgod2luZG93LmlubmVyV2lkdGggLSBjb29yZCkgKiAxMDApIC8gd2luZG93LmlubmVyV2lkdGgpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHRpbWVvdXQgPSB0aW1lb3V0IC0gKCB0aW1lb3V0ICogcGVyY2VudCAvIDEwMCk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgJChfc2VsZl8uZWxlbWVudCkuc3RvcCgpLmFuaW1hdGUoeyBsZWZ0OiBfZ29fIH0sIHsgZHVyYXRpb246IHRpbWVvdXQsIHN0ZXA6IGZ1bmN0aW9uKG5vdywgZngpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIFxuICAgICAgICAgICAgICAgICAgICAgICAgJC5jb29raWUoJ2Nvb3JkaW5hdGUnLCBub3csIHsgZXhwaXJlczogNywgcGF0aDogJy8nIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihub3cgPT0gX2dvXylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkKF9zZWxmXy5lbGVtZW50KS50b2dnbGVDbGFzcygnZm9vdGVyLWJlYXItcmV2ZXJzZScpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5yZW1vdmVDb29raWUoJ2Nvb3JkaW5hdGUnLCB7IHBhdGg6ICcvJyB9KTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLnJlbW92ZUNvb2tpZSgnX2dvXycsIHsgcGF0aDogJy8nIH0pO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJC5hcHAubW9kdWxlLmJlYXIubW92ZShfZ29fKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfX0pO1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgcm90YXRlOiBmdW5jdGlvbiggZGVnIClcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICQodGhpcy5lbGVtZW50KS5maW5kKCcuZm9vdGVyLWJlYXItaW5uZXInKS5zdG9wKCkuYW5pbWF0ZSh7IHJvdGF0aW9uOiBkZWcgfSwgeyBkdXJhdGlvbjogMTgwMCwgc3RlcDogZnVuY3Rpb24obm93LCBmeCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgJCh0aGlzKS5jc3Moe1widHJhbnNmb3JtXCI6IFwicm90YXRlKFwiK25vdytcImRlZylcIn0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYobm93ID09IGRlZylcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkLmFwcC5tb2R1bGUuYmVhci5yb3RhdGUoKGRlZyotMSkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9fSk7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBpbml0OiBmdW5jdGlvbigpXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiAoJCh3aW5kb3cpLndpZHRoKCkgPiA5NjApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMucm90YXRlKDYpO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5tb3ZlKDApO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJlc2l6ZTogZnVuY3Rpb24oIGNhbGxiYWNrLCB0aW1lIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKGUpe1xuICAgICAgICAgICAgICAgICAgICB3aW5kb3cucmVzaXplRXZ0O1xuICAgICAgICAgICAgICAgICAgICAkKHdpbmRvdykucmVzaXplKGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgIGNsZWFyVGltZW91dCh3aW5kb3cucmVzaXplRXZ0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdpbmRvdy5yZXNpemVFdnQgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2suYXBwbHkoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sIHRpbWUpO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICBnb29nbGVNYXA6IGZ1bmN0aW9uKClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICB2YXIgbWFwT3B0aW9ucyA9IHtcbiAgICAgICAgICAgICAgICAgICAgem9vbTogMTYsXG4gICAgICAgICAgICAgICAgICAgIHpvb21Db250cm9sOiAhMCxcbiAgICAgICAgICAgICAgICAgICAgem9vbUNvbnRyb2xPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzdHlsZTogZ29vZ2xlLm1hcHMuWm9vbUNvbnRyb2xTdHlsZS5MQVJHRSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBnb29nbGUubWFwcy5Db250cm9sUG9zaXRpb24uTEVGVF9UT1BcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGFuQ29udHJvbDogITAsXG4gICAgICAgICAgICAgICAgICAgIHBhbkNvbnRyb2xPcHRpb25zOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBwb3NpdGlvbjogZ29vZ2xlLm1hcHMuQ29udHJvbFBvc2l0aW9uLkxFRlRfVE9QXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIHNjcm9sbHdoZWVsOiAhMSxcbiAgICAgICAgICAgICAgICAgICAgbmF2aWdhdGlvbkNvbnRyb2w6ICExLFxuICAgICAgICAgICAgICAgICAgICBtYXBUeXBlQ29udHJvbDogITEsXG4gICAgICAgICAgICAgICAgICAgIHNjYWxlQ29udHJvbDogITEsXG4gICAgICAgICAgICAgICAgICAgIGRyYWdnYWJsZTogITAsXG4gICAgICAgICAgICAgICAgICAgIHN0eWxlczogW1xuICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlcnM6IFtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyBodWU6ICcjYWRjZWQ1JyB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgXVxuICAgICAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbGVtZW50VHlwZTogJ2xhYmVscycsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IHZpc2liaWxpdHk6ICdvbicgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmVhdHVyZVR5cGU6ICd3YXRlcicsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGVyczogW1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGNvbG9yOiAnI2M5ZGZlNCcgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIF1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgXSxcbiAgICAgICAgICAgICAgICAgICAgZGlzYWJsZURvdWJsZUNsaWNrWm9vbTogITAsXG4gICAgICAgICAgICAgICAgICAgIGNlbnRlcjogbmV3IGdvb2dsZS5tYXBzLkxhdExuZyg0My41Njk3ODcsIDM5Ljc1NjM2MilcbiAgICAgICAgICAgICAgICB9O1xuXG4gICAgICAgICAgICAgICAgdmFyIG1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoICdtYXAtY29udGVpbmVyJyApLCBtYXBPcHRpb25zKTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICB2YXIgYnVsbGV0ID0ge1xuICAgICAgICAgICAgICAgICAgICB1cmw6ICdpbWFnZXMvbWFwLWJ1bGxldC5wbmcnLFxuICAgICAgICAgICAgICAgICAgICBzaXplOiBuZXcgZ29vZ2xlLm1hcHMuU2l6ZSgzOSwgNTIpLFxuICAgICAgICAgICAgICAgICAgICBvcmlnaW46IG5ldyBnb29nbGUubWFwcy5Qb2ludCgwLDApLFxuICAgICAgICAgICAgICAgICAgICBhbmNob3I6IG5ldyBnb29nbGUubWFwcy5Qb2ludCgzOSwgNTIpXG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICBuZXcgZ29vZ2xlLm1hcHMuTWFya2VyKHtcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IG5ldyBnb29nbGUubWFwcy5MYXRMbmcoNDMuNTY5Nzg3LCAzOS43NTYzNjIpLFxuICAgICAgICAgICAgICAgICAgICBtYXA6IG1hcCxcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogYnVsbGV0XG4gICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgY2FjaGU6IGZ1bmN0aW9uKCBzLCBjYiApXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGEsIGcgPSBbXSwgaSwgeCwgY250ID0gcy5sZW5ndGgsIHAgPSB7IGk6IHt9LCBhYzogMCwgYzogMCB9LCBjYiA9IGNiIHx8IGZ1bmN0aW9uKCl7fTtcbiAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgIGZ1bmN0aW9uIHkoIGluZGV4LCBzcmMgKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBnLnB1c2goIHNyYyApO1xuICAgICAgICAgICAgICAgICAgICAgICAgXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggZy5sZW5ndGggPj0gY250IClcbiAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYi5jYWxsKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIHAuYysrXG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBmb3IgKHggaW4gcylcbiAgICAgICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICAgICAgYSA9IHNbeF07XG4gICAgICAgICAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAgICAgICAgIGkgPSBuZXcgSW1hZ2UoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGkuc3JjID0gYTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaS5vbmxvYWQgPSB5KCB4LCBhICk7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHAuaVthXSA9IGk7XG4gICAgICAgICAgICAgICAgICAgICAgICBwLmFjKytcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBjYXRjaChlKSB7fVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHJldGluYTogZnVuY3Rpb24oKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIGlmKCAnZGV2aWNlUGl4ZWxSYXRpbycgaW4gd2luZG93ICYmIHdpbmRvdy5kZXZpY2VQaXhlbFJhdGlvID09IDIgKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGk9MCwgc3JjLCBpbWcgPSAkKCAnaW1nLnJlcGxhY2UtMngnICkuZ2V0KCksIGwgPSBpbWcubGVuZ3RoO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGk7IGk8bDsgaSsrKVxuICAgICAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgICAgICBzcmMgPSBpbWdbaV0uc3JjO1xuICAgICAgICAgICAgICAgICAgICAgICAgc3JjID0gc3JjLnJlcGxhY2UoL1xcLihwbmd8anBnfGdpZikrJC9pLCAnQDJ4LiQxJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICBpbWdbaV0uc3JjID0gc3JjO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiggb2JqIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gb2JqID09PSB2b2lkIDA7XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgdXBkYXRlSW1hZ2U6IGZ1bmN0aW9uKGVsZW1lbnQpXG4gICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgaWYoICQoZWxlbWVudCkubGVuZ3RoID4gMCApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGltYWdlID0gJChlbGVtZW50KS5hdHRyKCdzcmMnKS5zcGxpdCggJz8nIClbMF0gO1xuICAgICAgICAgICAgICAgICAgICAkKGVsZW1lbnQpLmF0dHIoJ3NyYycsIGltYWdlICsgJz92PScgKyBNYXRoLnJhbmRvbSgpICk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICByYW5kb206IGZ1bmN0aW9uKG1pbiwgbWF4KVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgIG1pbiA9IG1pbiB8fCAwIDtcbiAgICAgICAgICAgICAgICBtYXggPSBtYXggfHwgMTAwIDtcbiAgICAgICAgICAgICAgICByZXR1cm4gTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogKCBtYXggLSBtaW4gKyAxICkpICsgbWluIDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLmFwcC5tb3ZpZXMgPSB7fTtcbiAgICAkLmFwcC5tb3ZpZXMubG9hZCA9IGZ1bmN0aW9uKCkge1xuICAgICAgICBhbGVydCggJ2xvYWQgbW9yZScgKTtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH07XG5cbiAgICAkLmFwcC5tb2R1bGUuZm9ybV92YWxpZGF0aW9uX2RlZmF1bHQgPSBmdW5jdGlvbigkZm9ybSwgZXJyb3JzKSB7XG4gICAgICAgICRmb3JtLmZpbmQoJy5mb3JtX2Vycm9yX2Jsb2NrJykuaGlkZSgpO1xuICAgICAgICAkZm9ybS5maW5kKCcuZXJyb3InKS5yZW1vdmVDbGFzcygnZXJyb3InKTtcbiAgICAgICAgJGZvcm0uZmluZCgnLmNoZWNrYm94X19sYWJlbC1lcnJvcicpLnJlbW92ZUNsYXNzKCdjaGVja2JveF9fbGFiZWwtZXJyb3InKTtcbiAgICAgICAgaWYoZXJyb3JzKSB7XG4gICAgICAgICAgICB2YXIgJGVycm9yX2Jsb2NrID0gJCgnI2Zvcm0tZXJyb3JzJyk7XG4gICAgICAgICAgICAkZXJyb3JfYmxvY2suaHRtbCgnJyk7XG5cbiAgICAgICAgICAgIGZvcihmaWVsZE5hbWUgaW4gZXJyb3JzKVxuICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICRmaWVsZCA9ICRmb3JtLmZpbmQoJ2lucHV0W25hbWU9XCInK2ZpZWxkTmFtZSsnXCJdJyk7XG4gICAgICAgICAgICAgICAgJGVycm9yX2Jsb2NrLmFwcGVuZChcbiAgICAgICAgICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAgICAgICAgICAgJzxzcGFuPicsXG4gICAgICAgICAgICAgICAgICAgICAgICAkZmllbGQuZGF0YSgnZXJyb3InKSxcbiAgICAgICAgICAgICAgICAgICAgICAgICc8L3NwYW4+J1xuICAgICAgICAgICAgICAgICAgICBdLmpvaW4oJycpXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLmFwcC5jYWxsYmFja19zdGFjayA9IHt9O1xuICAgICQuYXBwLmNhbGxiYWNrX3N0YWNrLmZvcm1fYWpheF9kZWZhdWx0ID0gZnVuY3Rpb24oJGZvcm0sIHJlc3BvbnNlKSB7XG4gICAgICAgIGlmKHJlc3BvbnNlLnN0YXR1cykge1xuICAgICAgICAgICAgaWYocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ3JlZGlyZWN0X3VybCcpKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSByZXNwb25zZS5yZWRpcmVjdF91cmw7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZihyZXNwb25zZS5lcnJvcnMpIHtcbiAgICAgICAgICAgICQuYXBwLm1vZHVsZS5mb3JtX3ZhbGlkYXRpb25fZGVmYXVsdCgkZm9ybSwgcmVzcG9uc2UuZXJyb3JzKTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYocmVzcG9uc2UuaGFzT3duUHJvcGVydHkoJ21lc3NhZ2UnKSkge1xuICAgICAgICAgICAgJC5wb3B1cC5tZXNzYWdlKHJlc3BvbnNlLnRpdGxlLCByZXNwb25zZS5tZXNzYWdlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAkLmFwcC5tb2R1bGUuZm9ybV9hamF4ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgICQoJ2JvZHknKS5vbignc3VibWl0JyAsJy5mb3JtLWFqYXgnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB2YXIgJGZvcm0gPSAkKHRoaXMpO1xuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAkLmFqYXgoe1xuICAgICAgICAgICAgICAgIHVybDogJGZvcm0uYXR0cignYWN0aW9uJyksXG4gICAgICAgICAgICAgICAgdHlwZTogKCRmb3JtLmF0dHIoJ21ldGhvZCcpIHx8ICdwb3N0JyksXG4gICAgICAgICAgICAgICAgZGF0YTogJGZvcm0uc2VyaWFsaXplKCksXG4gICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbihyZXNwb25zZSlcbiAgICAgICAgICAgICAgICB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCRmb3JtLmRhdGEoJ2NhbGxiYWNrJykgJiYgJC5hcHAuY2FsbGJhY2tfc3RhY2suaGFzT3duUHJvcGVydHkoJGZvcm0uZGF0YSgnY2FsbGJhY2snKSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQuYXBwLmNhbGxiYWNrX3N0YWNrWyRmb3JtLmRhdGEoJ2NhbGxiYWNrJyldKCRmb3JtLCByZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAkLmFwcC5jYWxsYmFja19zdGFjay5mb3JtX2FqYXhfZGVmYXVsdCgkZm9ybSwgcmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgaWYoIHJlc3BvbnNlLnN0YXR1cyA9PT0gdHJ1ZSAmJiByZXNwb25zZS5tZXNzYWdlICE9PSAnJyApXG4gICAgICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICQucG9wdXAubWVzc2FnZSggcmVzcG9uc2UudGl0bGUsIHJlc3BvbnNlLm1lc3NhZ2UgKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZXJyb3I6IGZ1bmN0aW9uKHJlc3BvbnNlKVxuICAgICAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAgICAgJC5hcHAuY2FsbGJhY2tfc3RhY2suZm9ybV9hamF4X2RlZmF1bHQoJGZvcm0sIHJlc3BvbnNlKTtcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJlcnJvclwiKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfTtcblxuICAgICQuYXBwLm1vZHVsZS51cGxvYWRfYnV0dG9uID0gZnVuY3Rpb24oKXtcbiAgICAgICAgJCgnYm9keScpLm9uKCdzdWJtaXQnICwnLmZvcm0tZmlsZS11cGxvYWQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICByZXR1cm4gQUlNLnN1Ym1pdCh0aGlzLCB7XG4gICAgICAgICAgICAgICAgb25TdGFydDogZnVuY3Rpb24oKVxuICAgICAgICAgICAgICAgIHtcblxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgb25Db21wbGV0ZTogZnVuY3Rpb24oIHJlc3VsdCApXG4gICAgICAgICAgICAgICAge1xuICAgICAgICAgICAgICAgICAgICBpZiggdHlwZW9mIHJlc3VsdCA9PT0gJ29iamVjdCcgJiYgcmVzdWx0LnN0YXR1cyA9PT0gdHJ1ZSAmJiB0eXBlb2YgcmVzdWx0LnBob3RvX3VybCAhPT0gJ3VuZGVmaW5lZCcgKVxuICAgICAgICAgICAgICAgICAgICB7IH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgICAgIFxuICAgICAgICAkKGRvY3VtZW50KS5vbignY2hhbmdlJywgJy51cGxvYWRfYnV0dG9uX29uY2hhbmdlJywgZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIGlmKCAkKHRoaXMpLmNsb3Nlc3QoJy51cGxvYWRfYnV0dG9uJykuZmluZCgnLnVwbG9hZF9idXR0b25fZmllbGQnKS5sZW5ndGggPiAwIClcbiAgICAgICAgICAgIHtcbiAgICAgICAgICAgICAgICAkKHRoaXMpLmNsb3Nlc3QoJy51cGxvYWRfYnV0dG9uJykuZmluZCgnLnVwbG9hZF9idXR0b25fZmllbGQnKS5odG1sKCAkKHRoaXMpLnZhbCgpICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAkLmFwcC5jdXN0b21fcGxhY2Vob2xkZXIgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKE1vZGVybml6ci50b3VjaCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJCgnaW5wdXQsIHRleHRhcmVhJykuZWFjaChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHZhciAkaW5wdXQgPSAkKHRoaXMpLCAkaW5wdXRXcmFwcGVyLCAkcGxhY2Vob2xkZXIsIHBsYWNlaG9sZGVyVGV4dCA9ICRpbnB1dC5hdHRyKCdwbGFjZWhvbGRlcicpO1xuICAgICAgICAgICAgaWYocGxhY2Vob2xkZXJUZXh0KSB7XG4gICAgICAgICAgICAgICAgJGlucHV0V3JhcHBlciA9ICRpbnB1dC5wYXJlbnQoKTtcbiAgICAgICAgICAgICAgICAkcGxhY2Vob2xkZXIgPSAkKCc8ZGl2IGNsYXNzPVwiZGVmYXVsdC1pbnB1dF9fcGxhY2Vob2xkZXJcIiBzdHlsZT1cImxpbmUtaGVpZ2h0OiAnKygkaW5wdXQuaXMoJ3RleHRhcmVhJykgPyAnMzZweCcgOiAoICRpbnB1dFdyYXBwZXIuaW5uZXJIZWlnaHQoKSA9PSAwID8gJzM2JyA6ICRpbnB1dFdyYXBwZXIuaW5uZXJIZWlnaHQoKSApKydweCcpKydcIj4nK3BsYWNlaG9sZGVyVGV4dCsnPC9kaXY+Jyk7XG4gICAgICAgICAgICAgICAgJHBsYWNlaG9sZGVyWyRpbnB1dC52YWwoKS5sZW5ndGggPyAnaGlkZScgOiAnc2hvdyddKCk7XG4gICAgICAgICAgICAgICAgJGlucHV0LmFkZENsYXNzKCdjdXN0b20tcGxhY2Vob2xkZXInKS5hdHRyKCdwbGFjZWhvbGRlcicsICcnKTtcbiAgICAgICAgICAgICAgICAkaW5wdXRXcmFwcGVyLmFwcGVuZCgkcGxhY2Vob2xkZXIpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgXG4gICAgICAgICQoJ2JvZHknKS5vbignYmx1cicsICcuY3VzdG9tLXBsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgICAgICAgICAgaWYoISR0aGlzLnZhbCgpLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICR0aGlzLnBhcmVudCgpLmZpbmQoJy5kZWZhdWx0LWlucHV0X19wbGFjZWhvbGRlcicpLnNob3coKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgICQoJ2JvZHknKS5vbignZm9jdXMnLCAnLmN1c3RvbS1wbGFjZWhvbGRlcicsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJCh0aGlzKS5wYXJlbnQoKS5maW5kKCcuZGVmYXVsdC1pbnB1dF9fcGxhY2Vob2xkZXInKS5oaWRlKCk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgICQoJ2JvZHknKS5vbignY2xpY2snLCAnLmRlZmF1bHQtaW5wdXRfX3BsYWNlaG9sZGVyJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICB2YXIgJHRoaXMgPSAkKHRoaXMpO1xuICAgIFxuICAgICAgICAgICAgJHRoaXMuaGlkZSgpO1xuICAgICAgICAgICAgJHRoaXMucGFyZW50KCkuZmluZCgnLmN1c3RvbS1wbGFjZWhvbGRlcicpLnRyaWdnZXIoJ2ZvY3VzJyk7XG4gICAgICAgIH0pO1xuICAgICAgICAkKCdib2R5Jykub24oJ3NlbGVjdHN0YXJ0JywgJy5kZWZhdWx0LWlucHV0X19wbGFjZWhvbGRlcicsIGZhbHNlKTtcbiAgICB9O1xuXG4gICAgJC5hcHAucnVuKCk7XG59KShqUXVlcnkpOyJdfQ==

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

'use strict';

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
};
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIl9mbnMuanMiXSwibmFtZXMiOlsid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsImNsZWFyVGltZW91dCIsInRpbWVyIiwiYm9keSIsImNsYXNzTGlzdCIsImNvbnRhaW5zIiwiYWRkIiwic2V0VGltZW91dCIsInJlbW92ZSIsIlN0cmluZyIsInByb3RvdHlwZSIsInJlcGxhY2VBbGwiLCJfZiIsIl9yIiwiX2MiLCJvIiwidG9TdHJpbmciLCJyIiwicyIsImIiLCJlIiwidG9Mb3dlckNhc2UiLCJpbmRleE9mIiwic3Vic3RyaW5nIiwibGVuZ3RoIiwiQXJyYXkiLCJzZWFyY2hFbGVtZW50IiwiZnJvbUluZGV4IiwidW5kZWZpbmVkIiwiVHlwZUVycm9yIiwiTWF0aCIsImFicyIsIkluZmluaXR5Il0sIm1hcHBpbmdzIjoiOztBQUFBQSxPQUFPQyxnQkFBUCxDQUF3QixRQUF4QixFQUFrQyxZQUFXO0FBQ3pDQyxlQUFhQyxLQUFiO0FBQ0EsTUFBRyxDQUFDQyxLQUFLQyxTQUFMLENBQWVDLFFBQWYsQ0FBd0IsZUFBeEIsQ0FBSixFQUNBO0FBQ0lGLFNBQUtDLFNBQUwsQ0FBZUUsR0FBZixDQUFtQixlQUFuQjtBQUNIOztBQUVESixVQUFRSyxXQUFXLFlBQVU7QUFDekJKLFNBQUtDLFNBQUwsQ0FBZUksTUFBZixDQUFzQixlQUF0QjtBQUNILEdBRk8sRUFFTCxHQUZLLENBQVI7QUFHSCxDQVZELEVBVUcsS0FWSDs7QUFZQTtBQUNBO0FBQ0E7QUFDQUMsT0FBT0MsU0FBUCxDQUFpQkMsVUFBakIsR0FBOEIsVUFBU0MsRUFBVCxFQUFhQyxFQUFiLEVBQWlCQyxFQUFqQixFQUFvQjtBQUM5QyxNQUFJQyxJQUFJLEtBQUtDLFFBQUwsRUFBUjtBQUNBLE1BQUlDLElBQUksRUFBUjtBQUNBLE1BQUlDLElBQUlILENBQVI7QUFDQSxNQUFJSSxJQUFJLENBQVI7QUFDQSxNQUFJQyxJQUFJLENBQUMsQ0FBVDtBQUNBLE1BQUdOLEVBQUgsRUFBTTtBQUFFRixTQUFLQSxHQUFHUyxXQUFILEVBQUwsQ0FBdUJILElBQUlILEVBQUVNLFdBQUYsRUFBSjtBQUFzQjs7QUFFckQsU0FBTSxDQUFDRCxJQUFFRixFQUFFSSxPQUFGLENBQVVWLEVBQVYsQ0FBSCxJQUFvQixDQUFDLENBQTNCLEVBQ0E7QUFDSUssU0FBS0YsRUFBRVEsU0FBRixDQUFZSixDQUFaLEVBQWVBLElBQUVDLENBQWpCLElBQXNCUCxFQUEzQjtBQUNBSyxRQUFJQSxFQUFFSyxTQUFGLENBQVlILElBQUVSLEdBQUdZLE1BQWpCLEVBQXlCTixFQUFFTSxNQUEzQixDQUFKO0FBQ0FMLFNBQUtDLElBQUVSLEdBQUdZLE1BQVY7QUFDSDs7QUFFRDtBQUNBLE1BQUdOLEVBQUVNLE1BQUYsR0FBUyxDQUFaLEVBQWM7QUFBRVAsU0FBR0YsRUFBRVEsU0FBRixDQUFZUixFQUFFUyxNQUFGLEdBQVNOLEVBQUVNLE1BQXZCLEVBQStCVCxFQUFFUyxNQUFqQyxDQUFIO0FBQThDOztBQUU5RDtBQUNBLFNBQU9QLENBQVA7QUFDSCxDQXBCRDs7QUFzQkEsSUFBSSxDQUFDUSxNQUFNZixTQUFOLENBQWdCWSxPQUFyQixFQUE4QjtBQUMxQkcsUUFBTWYsU0FBTixDQUFnQlksT0FBaEIsR0FBMEIsVUFBVUksYUFBVixFQUF5QkMsU0FBekIsRUFBb0M7QUFDNUQsUUFBSyxTQUFTQyxTQUFULElBQXNCLFNBQVMsSUFBcEMsRUFBMkM7QUFDekMsWUFBTSxJQUFJQyxTQUFKLENBQWUsK0JBQWYsQ0FBTjtBQUNEOztBQUVELFFBQUlMLFNBQVMsS0FBS0EsTUFBTCxLQUFnQixDQUE3QixDQUw0RCxDQUs1Qjs7QUFFaENHLGdCQUFZLENBQUNBLFNBQUQsSUFBYyxDQUExQjs7QUFFQSxRQUFJRyxLQUFLQyxHQUFMLENBQVNKLFNBQVQsTUFBd0JLLFFBQTVCLEVBQXNDO0FBQ3BDTCxrQkFBWSxDQUFaO0FBQ0Q7O0FBRUQsUUFBSUEsWUFBWSxDQUFoQixFQUFtQjtBQUNqQkEsbUJBQWFILE1BQWI7QUFDQSxVQUFJRyxZQUFZLENBQWhCLEVBQW1CO0FBQ2pCQSxvQkFBWSxDQUFaO0FBQ0Q7QUFDRjs7QUFFRCxXQUFNQSxZQUFZSCxNQUFsQixFQUEwQkcsV0FBMUIsRUFBdUM7QUFDckMsVUFBSSxLQUFLQSxTQUFMLE1BQW9CRCxhQUF4QixFQUF1QztBQUNyQyxlQUFPQyxTQUFQO0FBQ0Q7QUFDRjs7QUFFRCxXQUFPLENBQUMsQ0FBUjtBQUNELEdBM0JEO0FBNEJIIiwiZmlsZSI6Il9mbnMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignc2Nyb2xsJywgZnVuY3Rpb24oKSB7XG4gICAgY2xlYXJUaW1lb3V0KHRpbWVyKTtcbiAgICBpZighYm9keS5jbGFzc0xpc3QuY29udGFpbnMoJ2Rpc2FibGUtaG92ZXInKSlcbiAgICB7XG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LmFkZCgnZGlzYWJsZS1ob3ZlcicpXG4gICAgfVxuXG4gICAgdGltZXIgPSBzZXRUaW1lb3V0KGZ1bmN0aW9uKCl7XG4gICAgICAgIGJvZHkuY2xhc3NMaXN0LnJlbW92ZSgnZGlzYWJsZS1ob3ZlcicpXG4gICAgfSwgNTAwKTtcbn0sIGZhbHNlKTtcblxuLy8gRmluZCwgUmVwbGFjZSwgQ2FzZVxuLy8gaS5lIFwiVGVzdCB0byBzZWUgaWYgdGhpcyB3b3Jrcz8gKFllc3xObylcIi5yZXBsYWNlQWxsKCcoWWVzfE5vKScsICdZZXMhJyk7XG4vLyBpLmUuMiBcIlRlc3QgdG8gc2VlIGlmIHRoaXMgd29ya3M/IChZZXN8Tm8pXCIucmVwbGFjZUFsbCgnKHllc3xubyknLCAnWWVzIScsIHRydWUpO1xuU3RyaW5nLnByb3RvdHlwZS5yZXBsYWNlQWxsID0gZnVuY3Rpb24oX2YsIF9yLCBfYyl7IFxuICAgIHZhciBvID0gdGhpcy50b1N0cmluZygpO1xuICAgIHZhciByID0gJyc7XG4gICAgdmFyIHMgPSBvO1xuICAgIHZhciBiID0gMDtcbiAgICB2YXIgZSA9IC0xO1xuICAgIGlmKF9jKXsgX2YgPSBfZi50b0xvd2VyQ2FzZSgpOyBzID0gby50b0xvd2VyQ2FzZSgpOyB9XG5cbiAgICB3aGlsZSgoZT1zLmluZGV4T2YoX2YpKSA+IC0xKVxuICAgIHtcbiAgICAgICAgciArPSBvLnN1YnN0cmluZyhiLCBiK2UpICsgX3I7XG4gICAgICAgIHMgPSBzLnN1YnN0cmluZyhlK19mLmxlbmd0aCwgcy5sZW5ndGgpO1xuICAgICAgICBiICs9IGUrX2YubGVuZ3RoO1xuICAgIH1cblxuICAgIC8vIEFkZCBMZWZ0b3ZlclxuICAgIGlmKHMubGVuZ3RoPjApeyByKz1vLnN1YnN0cmluZyhvLmxlbmd0aC1zLmxlbmd0aCwgby5sZW5ndGgpOyB9XG5cbiAgICAvLyBSZXR1cm4gTmV3IFN0cmluZ1xuICAgIHJldHVybiByO1xufTtcblxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24gKHNlYXJjaEVsZW1lbnQsIGZyb21JbmRleCkge1xuICAgICAgaWYgKCB0aGlzID09PSB1bmRlZmluZWQgfHwgdGhpcyA9PT0gbnVsbCApIHtcbiAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvciggJ1widGhpc1wiIGlzIG51bGwgb3Igbm90IGRlZmluZWQnICk7XG4gICAgICB9XG5cbiAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aCA+Pj4gMDsgLy8gSGFjayB0byBjb252ZXJ0IG9iamVjdC5sZW5ndGggdG8gYSBVSW50MzJcblxuICAgICAgZnJvbUluZGV4ID0gK2Zyb21JbmRleCB8fCAwO1xuXG4gICAgICBpZiAoTWF0aC5hYnMoZnJvbUluZGV4KSA9PT0gSW5maW5pdHkpIHtcbiAgICAgICAgZnJvbUluZGV4ID0gMDtcbiAgICAgIH1cblxuICAgICAgaWYgKGZyb21JbmRleCA8IDApIHtcbiAgICAgICAgZnJvbUluZGV4ICs9IGxlbmd0aDtcbiAgICAgICAgaWYgKGZyb21JbmRleCA8IDApIHtcbiAgICAgICAgICBmcm9tSW5kZXggPSAwO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZvciAoO2Zyb21JbmRleCA8IGxlbmd0aDsgZnJvbUluZGV4KyspIHtcbiAgICAgICAgaWYgKHRoaXNbZnJvbUluZGV4XSA9PT0gc2VhcmNoRWxlbWVudCkge1xuICAgICAgICAgIHJldHVybiBmcm9tSW5kZXg7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgcmV0dXJuIC0xO1xuICAgIH07XG59O1xuIl19
