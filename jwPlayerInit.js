;(function ( $) {

	"use strict";


  // Create the defaults once
  var pluginName = "setupPlayer",
    defaults = {
      poster: "value",
      file: '',
      sources: [],
      title: ''
    };

  // The actual plugin constructor
  function Plugin ( element, options ) {
    this.element = element;
    this.settings = $.extend( {}, defaults, options );
    this._name = pluginName;
    this.init();
  }

  // Avoid Plugin.prototype conflicts
  $.extend(Plugin.prototype, {
    init: function () {
      // check whatelement is
      var config = this.settings;
      if (this.element.tagName === 'video') {
        config = $.extend( {}, config, this.getConfigFromVideo(this.element));
      } else if (config.sources.length < 1) {
        config = $.extend( {}, config, this.getConfigFromData(this.element));
      }

      this.setupPlayer(config);

    },
    getConfigFromVideo: function(element) {
      var sourceList = element.getElementsByTagName('source');
			var sources = [];

			for (var i = 0; i < sourceList.length; i++) {
				var source = sourceList[i];
				sources.push({ 'file' : source.src});
			}

			var file = sources[0].file;
			var title = sources[0].file.slice(sources[0].file.lastIndexOf('/') + 1, sources[0].file.lastIndexOf('.'));
			var poster = this.element.poster;

			return {
				sources: sources,
				file: file,
				title: title,
				poster: poster
			};
    },
    getConfigFromData: function(element) {
      var $element = $(element);
      var sources = $element.data('sources').split(',');
      var sourceArray = [];

      for (var i = 0; i < sources.length; i++) {
        sourceArray.push({
          'file' : sources[i]
        });
      }

      return {
        sources: sourceArray,
        file: sourceArray[0],
        title: $element.data('title'),
        poster: $element.data('poster')
      }
    },
    setupPlayer: function(config) {
      var timeThen = Date.now();
			var firstPlay = true;
			var self = this;

			jwplayer(self.element.id).setup({
        width: '100%',
        image: config.poster,
        aspectratio: '16:9',
        sources: config.sources,
        skin: 'five',
				events: {
			  	onBufferChange: function(cb) {
			    	var bufferTime = jwplayer(self.element.id).getBuffer();

			      if (bufferTime === 100) {
			        var timeNow = Date.now();
							_gaq.push([
			          '_trackEvent',
			          'Videos',
			          'Buffer Time',
			          config.title,
								((timeNow - timeThen) / 1000)
			        ]);
			      }
					},
					onReady: function(cb) {
						window.addEventListener('beforeunload', function(event) {
							var bufferTime = jwplayer(self.element.id).getBuffer();

							if (bufferTime !== 100) {
								var timeNow = Date.now();
								_gaq.push([
				          '_trackEvent',
				          'Videos',
				          'Buffer Time on Exit',
				          config.title,
									((timeNow - timeThen) / 1000)
				        ]);
							}
						});
					},
					onPlay: function(cb) {
						if (cb.oldstate === "BUFFERING" && firstPlay) {
							_gaq.push([
								'_trackEvent',
								'Videos',
								'Play',
								config.title,
							]);
							firstPlay = false;
						} else if (cb.oldstate === "PAUSED") {
							_gaq.push([
								'_trackEvent',
								'Videos',
								'Resume',
								config.title,
							]);
						}
					},
					onPause: function(cb) {
						var duration = jwplayer(self.element.id).getDuration();
						var position = jwplayer(self.element.id).getPosition();
						var time = position / duration;

						if (time > 0.75) {
							_gaq.push([
								'_trackEvent',
								'Videos',
								'Paused in: Fourth Quarter',
								config.title,
							]);
						} else if (time > 0.50) {
							_gaq.push([
								'_trackEvent',
								'Videos',
								'Paused in: Third Quarter',
								config.title,
							]);
						} else if (time > 0.25) {
							_gaq.push([
								'_trackEvent',
								'Videos',
								'Paused in: Second Quarter',
								config.title,
							]);
						} else {
							_gaq.push([
								'_trackEvent',
								'Videos',
								'Paused in: First Quarter',
								config.title,
							]);
						}

					},
					onComplete: function(cb) {
						_gaq.push([
							'_trackEvent',
							'Videos',
							'Complete',
							config.title,
						]);
					}
				}
	    });
    }
  });

  $.fn[ pluginName ] = function ( options ) {

    return this.each(function() {
      if ( !$.data( this, "plugin_" + pluginName ) ) {
        $.data( this, "plugin_" + pluginName, new Plugin( this, options ) );
      }
    });
  };

  $(window).on('load', function () {
    $('[data-jwplayer], video').each(function (index) {
      if (this.id === '') this.id = 'jwplayer' + i;
      $(this).setupPlayer();
    });
  });

})(jQuery);
