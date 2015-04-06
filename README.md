# jwPlayerInit

A convenience script for those of us who use jwPlayer. The script does a couple things

1) Converts native HTML5 videos to jwPlayer instances.

2) Converts elements with the data-attribute jwplayer to jwPlayer instances

3) Sets up a Google Analytics events structure for videos; all the defaults plus
- Buffering Time
- Buffer on Exit (in case the visitor exits before video is done buffering)
- Pause by Quarters (as opposed to a single pause event)

4) Setups up a jQuery method for any other initialization needed in case you don't want to use data-attributes

# Setup

The script targets elements that either have the data attribute jwplayer or a native video element, i.e.

    <div>
      data-jwplayer="true"
      data-title="something"
      data-sources="something.webm, something.mp4"
      data-poster="someroute.jpg">
    </div>

Or

    <video preload="none" poster="someroute.jpg">
      <source type="video/webm" src="something.webm" />
      <source type="video/mp4" src="something.mp4" />
    </video>

Or

    <div id="player"></div>
    <script>
      $('#player').setupPlayer({
        title: 'Something',
        sources: [
          {
            'file' : 'something.webm'
          },
          {
            'file' : 'something.mp4'
          }
        ],
        poster: 'someroute.jpg'
      })
    </script>
