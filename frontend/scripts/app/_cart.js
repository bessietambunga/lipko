;(function($) {
    $.cart = {
        initRequestClick: function()
        {
            $('body').on('click', '.j-remover-request', function(e){
                e.preventDefault();

                var $remover = $(this).closest('.remover'), product = $(this).data('element'), status = $(this).data('status');

                if (status !== 0)
                {
                    if ($('#cart-product-'+product).length)
                    {
                        $('#cart-product-'+product).fadeOut(function(){
                            $(this).remove();
                        });
                    }

                    console.log(product + ' as ' + status);
                }
                
                setTimeout(function(){
                    $remover.fadeOut(function(){
                        $(this).remove();
                    });
                }, 150);

                return !1;
            });
        },

    	init: function()
    	{
    		$.cart.initBuy();
    		$.cart.initRemove();
    		$.cart.initControll();

            $.cart.initRequestClick();

            $('body').on('click', '.j-cart-remove', function(e){
                e.preventDefault();

                if (!$(this).closest('.list-item-footer').find('.remover').length)
                {
                    var $remover, product = $(this).data('element');

                    $remover = [
                        '<div class="remover">',
                            '<div class="remover__content">',
                                '<div class="remover__title">',
                                    'Действительно удалить?',
                                '</div>',

                                '<div class="remover__buttons">',
                                    '<a href="#" data-element="' + product + '" data-status="1" class="remover__button is-yes j-remover-request">Да</a>',
                                    '<a href="#" data-element="' + product + '" data-status="0" class="remover__button is-no j-remover-request">Нет</a>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ].join(' ');
                    
                    $(this).closest('.list-item-footer').append($remover);
                }
                else
                {
                    var $remover = $(this).closest('.list-item-footer').find('.remover');

                    $remover.fadeOut(function(){
                        $(this).remove();
                    });
                }

                return !1;
            });
    	},

    	initBuy: function()
    	{
    		$('.add-cart-trigger').on('click', function(e){
    			e.preventDefault();
    			$.cart.buyItem( $(this).attr('href').split('-')[1] );
    		});
    	},
    	initControll: function()
    	{
    		$('.increase-cart-trigger').on('click', function(e){
    			e.preventDefault();
    			$.cart.increase( $(this).attr('href').split('-')[1] );
    		});

			$('.decrease-cart-trigger').on('click', function(e){
    			e.preventDefault();
    			$.cart.decrease( $(this).attr('href').split('-')[1] );
    		});
    	},
    	initRemove: function()
    	{
    		$('.remove-cart-trigger').on('click', function(e){
    			e.preventDefault();
    			$.cart.removeItem($(this).attr('href').split('-')[1], this);
    		});
    	},
    	removeItem: function(id, _self_)
		{
			$.post('/ajax/cart/remove/', { item: id }, function(data) {
				if( $('#list-item-'+id).find('.incart').length > 0 )
				{
					$('#list-item-'+id).find('.incart').remove();
				}
				
				if($(_self_).hasClass('list-item-incart'))
				{
					$(_self_).remove();
				}
				else
				{
					$('#incart-item-'+id).html( '<a href="#item-'+id+'" title="Добавить в корзину" class="button-cart add-cart-trigger">Купить кресло</a>' );
					$.cart.initBuy();
				}

		        $.cart.addedItem('Товар удален из корзины.');
			});
		},
		buyItem: function(id)
		{
			var count = 1;
			
			if( $('#count-'+id).length > 0 ) {
				count = parseInt( $('#count-'+id).val() ) ;
			}

			$.post('../cart.json', { item: id, count: count }, function(data) {
				if( $('#cart-count').length > 0 )
				{
					$('#cart-count').html( data.count );
				}
				
				if( $('#cart-price').length > 0 )
				{
					$('#cart-price').html( data.money );
				}
				
				if( $('#count-'+id).length > 0 )
				{
					$('#count-'+id).val(1);
				}

				if( $('#list-item-'+id).find('.incart').length == 0 ) {
					$('#incart-item-'+id).html( '<a href="#item-' + id + '" title="Удалить из корзины" class="button-remove remove-cart-trigger">Кресло в корзине</a>' );

					$.cart.initRemove();
				}

				$.cart.addedItem();
			}, 'JSON');
		},
		addedItem: function(text, large)
		{
		    text = !text ? 'Товар добавлен в корзину.' : text ;
		    large = !large ? false : large ;
		    var timeout = !large ? 1500 : 5000, addclass = !large ? '' : ' adding-large' ;
		    
		    if( $('body').find('#item-added-to-cart').length == 0 ) {
		        $('body').append('<div id="item-added-to-cart" class="showadding' + addclass + '"><div class="adding-inner"><div class="adding-content">' + text + '</div></div></div>');
		        setTimeout(function(){
		            $('body').find('#item-added-to-cart').remove() ;
		        },timeout);
		    }
		    else {
		        setTimeout(function(){
		            $('body').find('#item-added-to-cart').remove() ;
		        },timeout);
		    }
		},
		increase: function(id)
		{
			if( $('#count-'+id).length > 0 ) {
		        var value = parseInt( $('#count-'+id).val() ) ;
		            value = !value ? 0 : value ;
		            
		            value++ ;
		            
		            $('#count-'+id).val( value ) ;
		    }
			
			if($('#cart-table').length > 0)
			{
				$.cart.reTotal(id);
			}
		},
		decrease: function(id)
		{
			if( $('#count-'+id).length > 0 )
			{
				var value = parseInt( $('#count-'+id).val() ) ;
					value = !value ? 1 : value ;
					
					if( value >= 2 ) value-- ;
					else value = 1 ;
					
					$('#count-'+id).val( value ) ;
			}
			
			if($('#cart-table').length > 0)
			{
				$.cart.reTotal(id);
			}
		},
		reTotal: function(id)
		{
			if( $('#count-'+id).length > 0 )
			{
				var count = parseInt( $('#count-'+id).val() );
				
				$.post('/ajax/cart/recount/', { item: id, count: count }, function(data) {
					var price = parseInt( $('#cart-item-price-'+id).html() );
					var total = count * price;

					$('#cart-item-total-'+id).html(total) ;
					$('#cart-total-count').html(data.count);
					$('#cart-total-price').html(data.money);

					if( $('#cart-count').length > 0 )
					{
						$('#cart-count').html( data.count );
					}
					
					if( $('#cart-price').length > 0 )
					{
						$('#cart-price').html( data.money );
					}
				}, 'JSON');
			}
		}
	}

	$.cart.init();
})(jQuery);