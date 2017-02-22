//(function functionName(window, document, $, black, undefined) {

   window.black = {};
   window.black.data = {};
   window.black.playlist = [];
   window.black.finallist = [];
   window.black.player = null;
   window.black.loop = false;
   window.black.time_update_interval = 0;

   window.black.playlistId = localStorage.getItem("playlistId");

   function reorderPlaylist (songid) {
    var temp_list = window.black.playlist.slice();
    var frstlst = temp_list.splice(0,window.black.playlist.indexOf(songid));
    window.black.finallist = temp_list.concat(frstlst);
   }

   function loadYTPlayer () {
    var tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    var firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
   }

   function onPlayerReady () {
    window.black.player.playVideo();
   }

   function updateSongInfo (songid) {
      $.get(
         'https://www.googleapis.com/youtube/v3/videos',{
         part : 'snippet',
         id : songid,
         key: 'AIzaSyC8hlhRBGWzLQAqpKK1OvHtsU_eg56bais'},
         function(videodata) {

            $("#song-title").html("Now playing:<br>" + videodata.items[0].snippet.title);

            // update the channel info to the bottom left
            if($("#channel").attr('data-channelid') !== videodata.items[0].snippet.channelId){
               $('#channel-label').html('<script src="https://apis.google.com/js/platform.js"></script><div class="g-ytsubscribe" id="channel" data-channelid="'+ videodata.items[0].snippet.channelId +'" data-layout="full" data-theme="dark" data-count="default"></div>');
            }
         }
      );
   }

   function onPlayerStateChange (event) {
      if(event.data === 0 || event.data === -1){
         updateSongInfo(window.black.player.getVideoData().video_id);
      }
   }

   // http://stackoverflow.com/questions/22613903/youtube-api-v3-get-list-of-users-videos
   $.get(
      'https://www.googleapis.com/youtube/v3/playlistItems',{
      part : 'snippet',
      maxResults : 20,
      playlistId : window.black.playlistId,
      key: 'AIzaSyC8hlhRBGWzLQAqpKK1OvHtsU_eg56bais'},
      function(data) {
         window.black.data = data;

         for (var i = 0; i < window.black.data.items.length; i++) {

            var snippet = window.black.data.items[i].snippet;
            var thumbnails = window.black.data.items[i].snippet.thumbnails;
            var thumbnail;

            // fill the playlist
            window.black.playlist.push(snippet.resourceId.videoId);

            // get the thumbnail
            if (thumbnails.standard) {
               thumbnail = thumbnails.standard.url;
            }else if (thumbnails.high) {
               thumbnail = thumbnails.high.url;
            }else if (thumbnails.medium) {
               thumbnail = thumbnails.medium.url;
            }else {
               thumbnail = thumbnails.default.url;
            }

            // place the videos into the playlist on the left side
            $('#playlist').append('<div class="hovereffect playSong" data-videoid="' + snippet.resourceId.videoId + '"><img class="img-responsive" src="' + thumbnail + '" alt=""><div class="overlay"><h2>' + snippet.title + '</h2><p><a href="#"></a></p></div></div>');

         }

         loadYTPlayer();

         $('.playSong').click(function (event) {
            var songid = $(this).data('videoid');
            reorderPlaylist(songid);
            window.black.player.loadVideoById(songid);
            window.black.player.loadPlaylist(window.black.finallist.join());
            window.black.player.setLoop(true);
         });

         updateSongInfo(window.black.data.items[0].snippet.resourceId.videoId);

      }
   );

   function onYouTubeIframeAPIReady () {
       var temp_list = window.black.playlist.slice();
       window.black.finallist = temp_list.splice(1);
       window.black.player = new YT.Player('video-placeholder', {
           videoId: window.black.playlist[0],
           playerVars: {
               autoplay:1,
               controls:0,
               color: 'white',
               loop:1,
               playlist: window.black.finallist.join()
           },
           events: {
               'onReady': onPlayerReady,
               'onStateChange': onPlayerStateChange
           }
       });
   }

   $('.nextSong').click(function (event) {
      window.black.player.nextVideo();
   });

   $('.prevSong').click(function (event) {
      window.black.player.previousVideo();
   });

   $('.randomSong').click(function (event) {
      var songid = window.black.playlist[Math.floor(Math.random() * window.black.playlist.length)];
      reorderPlaylist(songid);
      window.black.player.loadVideoById(songid);
      window.black.player.loadPlaylist(window.black.finallist.join());
      window.black.player.setLoop(true);
   });

   $('.playPauseSong').click(function (event) {
      if ($(this.firstChild).hasClass('fa-pause')) {
         window.black.player.pauseVideo();
         $(this.firstChild).removeClass('fa-pause');
         $(this.firstChild).addClass('fa-play');
      }else if ($(this.firstChild).hasClass('fa-play')) {
         window.black.player.playVideo();
         $(this.firstChild).removeClass('fa-play');
         $(this.firstChild).addClass('fa-pause');
      }
   });

   /*$('.loopSong').click(function (event) {
      if ($(this.firstChild).hasClass('fa-spin')) {
         window.black.loop = false;
         $(this.firstChild).removeClass('fa-spin');
      }else {
         window.black.loop = true;
         $(this.firstChild).addClass('fa-spin');
      }
   });*/

//})(window, window.document, window.jQuery, window.black);
