(function functionName(window, document, $, undefined) {

   $(document).ready( function() {
      $('#playlist').niceScroll({styler:'fb', scrollspeed: 150, mousescrollstep: 100, cursorcolor:'#FFF', cursorwidth: '8', cursorborderradius: '5px', spacebarenabled:false, cursorborder: '', zindex: '1000'});
      $('#moodModal').niceScroll({styler:'fb', scrollspeed: 150, mousescrollstep: 100, cursorcolor:'#FFF', cursorwidth: '8', cursorborderradius: '5px', spacebarenabled:false, cursorborder: '', zindex: '100000'});
   });

   $('#menu-btn').click(function(){
      $('.responsive-menu').toggleClass('expand');
      $('#menu-btn').toggleClass('is-active');
   });

})(window, window.document, window.jQuery);
