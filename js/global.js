/* ==========================================================================
GLOBAL.JS
Global JavaScript functions, events, and actions used throughout the website.
========================================================================== */
function submenu_focus() {
	 $(".sub li a").focus(function(){
	    $('.sub').css('left', 0)
	});
	 $(".sub li a").blur(function(){
	    $('.sub').css('left', "")
	});
}

var mobile_view = false;

function default_menu() {
	if (mobile_view === false) {
		$('nav').removeClass('show_menu');
		$('nav .top_menu:hidden').show();
		$('nav .show_submenu').removeClass('show_submenu');
		$('nav .sub:visible').hide();
	} else {
		$('nav .top_menu:visible').hide();
	}
}

var resize_window_addl = null;

function resize_window() {
	var width = find_screen_width();
	var current_mobile_view = mobile_view;;

	if (width <= 800) {
		mobile_view = true;
	} else {
		mobile_view = false;
	}

	// If view has changed
	if (current_mobile_view != mobile_view) {
		current_mobile_view = mobile_view;
		default_menu();
	}

	if (typeof(resize_window_addl) == 'function') {
		resize_window_addl(width);
	}
}

function find_screen_width() {
	var width = $(window).width();

	// <= IE8 (backward-compatibility mode)
	if (document.body && document.body.offsetWidth) {
		width = document.body.offsetWidth;
	}

	// <= IE8 (standards mode)
	if (document.compatMode == 'CSS1Compat' && document.documentElement && document.documentElement.offsetWidth) {
		width = document.documentElement.offsetWidth;
	}

	// Other browsers
	if (window.innerWidth) {
		width = window.innerWidth;
	}

	return width;
}

function toggle_menu() {
	var nav = $('nav');

	if (nav.is('.show_menu')) {
		nav.removeClass('show_menu');
		$('.top_menu', nav).slideUp(200);
	} else {
		nav.addClass('show_menu');
		$('.top_menu', nav).slideDown(200);
	}
}

function toggle_submenu(el) {
	var parent = el.parents('li');
	var submenu = $('.sub', parent);

	if (parent.is('.show_submenu')) {
		parent.removeClass('show_submenu');
		submenu.slideUp(200);
	} else {
		parent.addClass('show_submenu');
		submenu.slideDown('200');
	}
}

var custom_list_filter_settings;

/**
 * Filter a list of items by category or another identifying attribute. Function can
 * accept custom settings as an argument, or will utilize the global object
 * custom_list_filter_settings (can be set for individual pages as needed).
 *
 * @param object custom_settings. Settings object to merge with base settings
 *
 * @return null
 */
var list_filter = function(custom_settings) {
	var settings = {
		viewSelector: '.viewer',	//filter element to click on
		viewDataAttr: 'category',	//filter element data- attribute
		containSelector: '.viewer_items',	//list container element
		containDataAttr: 'category',	//list container data- attribute
		itemSelector: '.item',	//individual item element in list container
		allValue: 'all',	//value of the typical "View All" filter
		activeClass: 'active',	//CSS class for highlighting active filter element
		useHash: false	//enable use of URL hash
	};

	// Merge in global custom_list_filter_settings object
	if (typeof(custom_list_filter_settings) == 'object') {
		$.extend(settings, custom_list_filter_settings);
	}

	// Merge in function-specific custom_settings object
	if (typeof(custom_settings) == 'object') {
		$.extend(settings, custom_settings);
	}

	// Check for container element
	var contain_el = $(settings.containSelector);
	if (contain_el.length === 0) {
		return;
	}

	// Load active category, if available
	if (settings.useHash === true) {
		var hash_pos = document.location.hash.length;
		var hash_active = false;

		if (hash_pos > 0) {
			var active_category = window.location.hash.substring(1);
			var active_el = $(settings.viewSelector).filter('[data-' + settings.viewDataAttr + '="' + active_category + '"], #' + active_category);
			if (active_el.length > 0) {
				hash_active = true;
				list_filter_show(active_el, contain_el, settings);
			}
		}

		if (hash_active === false) {
			var first_el = $(settings.viewSelector).filter(':first');
			list_filter_show(first_el, contain_el, settings);
		}
	}

	// Click event on filter elements
	$(settings.viewSelector).click(function(event) {
		event.preventDefault();
		list_filter_show($(this), contain_el, settings);
	});
}

/**
 * Show a specified category based on the element clicked. Event binded by the above
 * list_filter() function.
 *
 * @param object el jQuery element of clicked object
 * @param object contain_el jQuery element of container
 * @param object settings Settings object
 *
 * @return null
 */
var list_filter_show = function(el, contain_el, settings) {
	var category = el.data(settings.viewDataAttr);

	if (typeof(category) == 'undefined' || category === null || category.length === 0) {
		category = el.prop('id');
	}

	if (typeof(category) == 'string' || typeof(category) == 'number') {
		if (category == settings.allValue) {
			$(settings.itemSelector, contain_el).show();
		} else {
			$(settings.itemSelector, contain_el).hide();
			$(settings.itemSelector, contain_el).filter('[data-' + settings.containDataAttr + '="' + category + '"], .' + category).show();
		}

		$(settings.viewSelector + '.' + settings.activeClass).removeClass(settings.activeClass);
		el.addClass(settings.activeClass);

		if (settings.useHash === true) {
			list_filter_hash(category);
		}
	}
}

/**
 * Update the current page's URL with a hash matching the specified category.
 *
 * @param string category Category to apply to URL hash
 *
 * @return null
 */
var list_filter_hash = function(category) {
	document.location.hash = '#' + category;
}

function init_videos() {
	// Bind events on list links
		$('.video_list a').on('click', function(event) {
			if ($(this).hasClass('active')) {
				event.preventDefault();
				$(this).removeClass('active');
			}
			else {
				event.preventDefault();
				$('.active').removeClass('active');
				$(this).addClass('active');
			}
		});

		$('#vid_1').on('click', function() {
			$.ajax({url: "./videos/vid1.html", dataType: "html",
				success: function(result) {
				$(".video").html(result);
			}});
		});

		$('#vid_2').on('click', function() {
			$.ajax({url: "./videos/vid2.html", dataType: "html",
				success: function(result) {
				$(".video").html(result);
			}});
		});

		$('#vid_3').on('click', function() {
			$.ajax({url: "./videos/vid3.html", dataType: "html",
				success: function(result) {
				$(".video").html(result);
			}});
		});
}

function init_slideshow() {
	$('.thumbnail').on('click', function(event) {
		event.preventDefault();
		$('.large_slides img').fadeOut(400, function() {
			$('.large_slides img').fadeIn(400);
		});
	});
}




$(document).ready(function() {
	// Resize window events
	resize_window();
	$(window).resize(function() {
		resize_window();
	});

	// Toggle menu capability - Hide/show main menu
	$('.menu').click(function() {
		toggle_menu();
	});

	// Hide/show submenu
	$('.submenu').click(function() {
		toggle_submenu($(this));
	});

	// FAQ show/hide
	var faq_id;
    $('.answer').hide();
    
    $('.question_link').click(function() {
    	faq_id = $(this).data('question');
    	
    	$('.answer:visible:not([data-answer="' + faq_id + '"])').slideUp();
    	$('.answer[data-answer="' + faq_id + '"]').slideDown();
    });

	// Start list filter
		list_filter();

	// Videos
		init_videos();

	// Photo Gallery
		init_slideshow();

		submenu_focus();
});