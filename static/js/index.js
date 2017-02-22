(function functionName(window, document, $, undefined) {

   $('.chooseMood').click(function() {
         $('.mood-modal').removeClass('slide-down');
         $('.mood-modal').addClass('slide-up');
   });

   $('.close-modal').click(function() {
         $('.mood-modal').addClass('slide-down');
         $('.mood-modal').removeClass('slide-up');
   });

   $('.carousel').carousel({interval: 15000});

   $('.choosePlaylist').click(function (event) {
      window.localStorage.setItem("playlistId",$(this).data('id'));
      window.location.href = "player.html";
   });


})(window, window.document, window.jQuery);
