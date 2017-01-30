(function($) {
    var overlayIsOpen = false,
        overlayResizeTimeout,
        popupIsOpen = false,
        $doc = $(document),
        $win = $(window);

    $.overlay = {
        prop: {
            anim: {
                open: {
                    speed: 300
                },
                close: {
                    speed: 300
                }
            },
            opacity: .7,
            isInit: false,
            $overlay: null,
            $canvas: null
        },
        setWH: function() {
            if(!$.overlay.prop.isInit || !$.overlay.prop.$canvas) {
                return;
            }
            //$.overlay.prop.$overlay.css({width: $.overlay.prop.$canvas.width(), height: $.overlay.prop.$canvas.height()});
            $.overlay.prop.$overlay.css({width: '100%', height: $.overlay.prop.$canvas.height() });
        },
        init: function() {
            if($.overlay.prop.isInit) {
                return;
            }
            $.overlay.prop.$overlay = $('<div class="overlay" style="display: none;"></div>');
            $('body').append($.overlay.prop.$overlay);
            $.overlay.prop.isInit = true;
            $.overlay.setWH();
            
            $.overlay.prop.$overlay.on('click', function() {
                $('body').trigger('overlay.click');
            });

            $win.on('resize', function() {
                if(overlayIsOpen) {
                    clearTimeout(overlayResizeTimeout);
                    overlayResizeTimeout = setTimeout(function() {
                        $.overlay.setWH();
                    }, 100);
                }
            });
        },
        open: function(callback) {
            $.overlay.init();
            $.overlay.prop.$overlay.fadeTo($.overlay.prop.anim.open.speed, $.overlay.prop.opacity, callback);
            overlayIsOpen = true;
        },
        close: function() {
            if(!$.overlay.prop.isInit) {
                return;
            }
            $.overlay.prop.$overlay.fadeOut($.overlay.prop.anim.close.speed);
            overlayIsOpen = false;
        },
        isOpen: function() {
            return !!overlayIsOpen;
        }
    };

    var popupOpenTimeout = null;
    var popup = {
        open: function(selector, isClearErr, isResetForm)
        {
            clearInterval(popupOpenTimeout);
            popupOpenTimeout = setTimeout(function() {
                popup._open(selector, isClearErr, isResetForm);
            }, 200);
        },
        _open: function(selector, isClearErr, isResetForm)
        {
            var $popup = popup._getPopup(selector),
                position,
                animationProp,
                animationSetup,
                height = $popup.outerHeight(),
                wheight = $(window).height(),
                isClearErr = isClearErr || true,
                isResetForm = isResetForm || true;

            if(!$popup || $popup.hasClass('is-open')) { return; }

            if(!!isResetForm && !$popup.hasClass('not-reset')) {
                popup.resetForm($popup);
            }

            if(!!isClearErr) {
                popup.clearErrors($popup);
            }

            animationProp = $popup.attr('data-animation') || 'opacity';
            
            position = popup.getPosition($popup);

            if(animationProp == 'right') {
                animationSetup = {
                    'right': position.right,
                    'opacity': 'show'
                }
                position.right = parseInt($popup.innerWidth())*-1;
            }
            else
            {
                animationSetup = {
                    'opacity': 'show'
                }
            }

            position.display = 'none';

            if( height >= $(window).height() )
            {
                position.position = 'relative';
                position.margin = '50px auto 100px';
                position.left = 'auto !important';
                position.right = 'auto !important';

                $popup.wrap( "<div class='popup-wrapper'></div>");
            }
            
            $popup.css( position );

            popup.closeAll();
            $.overlay.open(function() {
                $popup.animate(animationSetup, 250, function() {
                    $('body').trigger('popup.after_open', $popup);
                }).addClass('is-open');
            });

            $('body').addClass('popup-open');
            $('body').trigger('popup.open', $popup);

            popupIsOpen = true;
        },
        clearErrors: function($popup) {
            $popup.find('.error').removeClass('error');
            $popup.find('.popup-errorList').addClass('hide').empty();
            $popup.find('.hide-on-open').hide();
            $popup.find('.tooltip').remove();
        },
        resetForm: function($popup) {
            var $form = $popup.is('form') ? $popup : $popup.find('form');
            $form.each(function() {
                this.reset();
            });
            $popup.find('.hide').removeClass('hide');
            $popup.find('img').each(function() {
                $img = $(this), $defaultImgSrc = $img.attr('data-default-url');
                if($defaultImgSrc) {
                    $img.attr('src', $defaultImgSrc);
                }
            });
        },
        close: function(isCloseOverlay) {
            $.overlay.close();
        },
        closeAll: function(isCloseOverlay, checkBtnClose) {
            $('body').removeClass('popup-open');
            var $popups = $('body').find('.popup.is-open');

            $popups.unwrap();

            if(!!checkBtnClose && !$popups.find('.popup-btn-close, .btn-close').length) {
                return;
            }

            $popups.animate({opacity: 'hide'}, 250, function() {
                $popups.filter('.temp').remove();
                if(!!isCloseOverlay) {
                    $.overlay.close();
                }
                $('body').trigger('popup.after_close', $popups);
            }).removeClass('is-open');
            popupIsOpen = false;
        },
        rePosition: function(selector) {
            var $popup = popup._getPopup(selector),

                position = popup.getPosition($popup);
            $popup.css(position);
        },
        findRealWrapper: function($popup) {
            var $realWrapper = null;
            $popup.parents().each(function() {
                if($(this).css('position') == 'relative') {
                    $realWrapper = $(this);
                    return false;
                }
            });
            return $realWrapper;
        },
        getPosition: function($popup) {
            var ww = $win.width(),
                wh = $win.height(),
                dw = $doc.width(),
                dh = $doc.height(),
                pw = $popup.outerWidth(),
                ph = $popup.outerHeight(),
                st = $win.scrollTop(),

                left = 0,
                top = 0,
                css = {},

                posType = $popup.attr('data-position'),

                $realWrapper = null;

            if($popup.hasClass('smart-positioning')) {
                $realWrapper = popup.findRealWrapper($popup);
                if($realWrapper) {
                    dw = $realWrapper.innerWidth();
                }
            }


            if(dw >= pw) {
                left = Math.round((dw - pw)/2);
            }
            
            if(wh >= ph) {
                //top = st+Math.round((wh - ph)/2);
                css.position = 'fixed';
                top = '50%';
                css.marginTop = '-' + Math.floor( ph / 2 ) + 'px';
            }
            /*
            else if(dh >= st+ph) {
                top = st;
            }
            */
            else
            {
                top = 60;
                $popup.addClass('popup-long');
                
                var lar = ww / 2 - pw /2 - 35,
                    rar = ww / 2 - pw /2 - 35;

                $popup.find('.popup-arr__prev').css( 'left', lar );
                $popup.find('.popup-arr__next').css( 'right', rar );
            }
            
            css.top = top;

            if(posType == 'right') {
                css.right = 0;
            }
            else {
                css.left = left;
            }

            return css;
        },
        _getPopup: function(selector) {
            var $popup;

            if(typeof(selector) == 'object') {
                return selector;
            }

            $popup = $('#'+selector);
            return $popup.length ? $popup : null;
        }
    };

    $.popup = popup;

    $.initPopups = function() {
        $(document).on('click', '.open-popup', function(e) {
            var selector, isResetForm, isClearError;

            isClearError = !$(this).data('noclear-form');
            isResetForm = !$(this).data('noreset-form');

            e.preventDefault ? e.preventDefault() : e.returnValue = false;

            if($(this).get(0).tagName == 'A') {
                selector = $(this).attr('href');
                popup.open(selector.substr(1), isClearError, isResetForm);
            }
        });

        $(document).on('click', '.popup-btn-close, .btn-close', function(e) {
            e.preventDefault();
            popup.closeAll(true);
        })

        $(document).on('keydown', function(e) {
            if(e.keyCode == 27) {
                popup.closeAll(true, true);
            }
        });

        $(document).on('overlay.click', function() {
            popup.closeAll(true);
        });

        $(document).on('click', '.popup-wrapper', function(e) {
            if( $(e.target).closest('.popup').length == 0 )
            {
                popup.closeAll(true);
            }
        });

        $win.on('resize.popup', function() {
            var $popups;

            if(popupIsOpen) {
                $('body').find('.popup.is-open').each(function() {
                    popup.rePosition($(this));
                });
            }
        });
    };

    $.popup.message = function(title, text, btn) {
        var btn = btn || null;

        var $popup = $(template('tmpl_popup-message', {'title': title, 'text': text, 'btn': btn}));

        $popup.addClass('temp');

        $('body').append($popup);

        popup.open($popup);
    }
    
    $.popup.error = function(title, text) {
        var $popup = $(template('tmpl_popup-error', {'title': title, 'text': text}));

        $popup.addClass('temp');

        $('body').append($popup);

        popup.open($popup);
    }

})(jQuery);