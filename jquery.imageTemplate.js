/*
 * jquery.imageTemplate
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * @author: willemdewit
 * @author: dvdmeer 
 * 
 * @Requires: jquery-ui-draggable, jquery-ui-resizable
 */
(function($) {
	var methods = {
		init : function(options) {
			var defaults = {
				width : 100,
				height : 132,
				keepRatio : false,
				onInit : function() {},
				onSelectionChange : function() {},
				onSelectionStart : function() {},
				onSelectionEnd : function() {}
			};
			var options = $.extend(defaults, options);
			return this.each(function() {
				var $this = $(this), data = $this.data('imageTemplate');

				// If the plugin hasn't been initialized yet
				if (!data) {
					$this.get(0).onload = function() {
						var overlayWidth, overlayHeight, overlayOutlineOffset;
						if (options.width > options.height) {
							overlayWidth = options.width - options.height;
							overlayHeight = 0;
							overlayOutlineOffset = options.height / 2;
						} else {
							overlayWidth = 0;
							overlayHeight = options.height - options.width;
							overlayOutlineOffset = options.width / 2;
						}
	
						var $imageTemplateWrapper = $('<div></div>')
								.addClass('imageTemplate_wrapper'), 
							$imageTemplateOverlay = $('<div></div>')
								.addClass('imageTemplate_overlay')
								.css({
									width : overlayWidth,
									height : overlayHeight,
									top : '50%',
									left : '50%',
									marginLeft : (overlayWidth / 2) * -1,
									marginTop : (overlayHeight / 2) * -1,
									outlineOffset : overlayOutlineOffset + 'px'
								})
								.appendTo($imageTemplateWrapper),
							originalImageWidth = $this.width(), 
							originalImageHeight = $this.height();
						var imageTemplateWrapperWidth = (2 * originalImageWidth) - options.width, 
							imageTemplateWrapperHeight = (2 * originalImageHeight) - options.height, 
								draggableOptions = {
								drag : function(e, ui) {
									options.onSelectionChange($imageTemplateSubject,$this.imageTemplate('getSelection'));
								},
								start : function(e, ui) {
									options.onSelectionStart($imageTemplateSubject,$this.imageTemplate('getSelection'));
								},
								stop : function(e, ui) {
									options.onSelectionEnd($imageTemplateSubject,$this.imageTemplate('getSelection'));
								}
							}, 
							resizableOptions = {
								handles: 'ne,se,sw,nw',
								resize : function(e, ui) {
									options.onSelectionChange($imageTemplateSubject,$this.imageTemplate('getSelection'));
								},
								start : function(e, ui) {
									options.onSelectionStart($imageTemplateSubject,$this.imageTemplate('getSelection'));
								},
								stop : function(e, ui) {
									options.onSelectionEnd($imageTemplateSubject,$this.imageTemplate('getSelection'));
								}
							}, 
							$image = $('<div></div>')
								.css({
									background : 'url(' + $this.attr('src')	+ ') 50% no-repeat',
									width : originalImageWidth,
									height : originalImageHeight,
									backgroundSize : '100% 100%'
								});
	
						if (options.keepRatio) 
							resizableOptions.aspectRatio = originalImageWidth / originalImageHeight;
	
						$imageTemplateWrapper.insertBefore($this);
						$this.replaceWith($image);
						$imageTemplateSubject = $image
							.appendTo($imageTemplateWrapper)
							.addClass('imageTemplate_subject')
							.draggable(draggableOptions)
							.resizable(resizableOptions);
						$imageTemplateWrapper.css({
							width : imageTemplateWrapperWidth,
							height : imageTemplateWrapperHeight
						});
						$imageTemplateSubject.css({
							top : (imageTemplateWrapperHeight / 2) - (originalImageHeight / 2),
							left : (imageTemplateWrapperWidth / 2) - (originalImageWidth / 2)
						});
						$this.data('imageTemplate', {
							target : $this,
							imageTemplateWrapper : $imageTemplateWrapper,
							imageTemplateSubject : $imageTemplateSubject,
							imageTemplateOverlay : $imageTemplateOverlay,
							options : options,
							originalImageWidth : originalImageWidth,
							originalImageHeight : originalImageHeight
						});
						options.onInit($imageTemplateSubject, $this.imageTemplate('getSelection'));
					};
				} else {
					return $this;
				}
			});
		},
		destroy : function() {
			return this.each(function() {
				var $this = $(this), data = $this.data('imageTemplate');
				data.imageTemplateWrapper.replaceWith($this);
				$this.removeData('imageTemplate');
			});
		},
		getSelection : function() {
			var $this = $(this), 
				data = $this.data('imageTemplate');
			if (!data) return $this;
			var $imageTemplateWrapper = data.imageTemplateWrapper, 
				$imageTemplateSubject = data.imageTemplateSubject, 
				options = data.options, 
				overlayPosition = {
					left : ($imageTemplateWrapper.width() / 2) - (options.width / 2),
					top : ($imageTemplateWrapper.height() / 2) - (options.height / 2)
				};
			var subjectPosition = $imageTemplateSubject.position(), 
				selectionObj = {
					width : options.width,
					height : options.height
				}, 
				scaleX = data.originalImageWidth / $imageTemplateSubject.width(), 
				scaleY = data.originalImageHeight / $imageTemplateSubject.height();
			selectionObj.x1 = overlayPosition.left - subjectPosition.left;
			selectionObj.y1 = overlayPosition.top - subjectPosition.top;
			selectionObj.x2 = Math.round(selectionObj.x1 + (options.width * scaleX));
			selectionObj.y2 = Math.round(selectionObj.y1 + (options.height * scaleY));
			return selectionObj;
		},
		setSelection: function(selection) {
			console.log('TODO: implement');
		},
		update: function() {
			return this.each(function() {
				var $this = $(this), data = $this.data('imageTemplate');
				$this.imageTemplate('destroy');
				$this.init();
			});
		}
	};

	$.fn.imageTemplate = function(method) {
		if (methods[method]) {
			return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
		} else if (typeof method === 'object' || !method) {
			return methods.init.apply(this, arguments);
		} else {
			$.error('Method ' + method + ' does not exist on jQuery.imageTemplate');
		}
	};
})(jQuery);