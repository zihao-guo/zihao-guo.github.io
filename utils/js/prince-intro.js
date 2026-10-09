document.addEventListener('DOMContentLoaded', function () {
   var intro = document.getElementById('princeIntro');
   var image = document.getElementById('princeWalkImage');
   var stage = document.getElementById('princeStage');
   var dialogue = document.getElementById('princeDialogue');
   var play = document.getElementById('princePlaySnake');
   var game = document.getElementById('princeSnakeGame');
   if (!intro || !image || !stage || !dialogue || !play || !game) return;
   var observer;
   var dialogueTimer;
   var pendingLoad;
   var visit = 0;

   function beginIntro() {
      var currentVisit = visit;
      function showCharacter() {
         if (currentVisit !== visit) return;
         pendingLoad = null;
         // Force a fresh animation even when the page came from browser history.
         stage.classList.remove('is-started');
         void stage.offsetWidth;
         stage.classList.add('is-started');
         dialogueTimer = setTimeout(function () {
            if (currentVisit === visit) dialogue.hidden = false;
         }, 5100);
      }
      if (image.complete && image.naturalWidth) showCharacter();
      else {
         pendingLoad = showCharacter;
         image.addEventListener('load', pendingLoad, { once: true });
      }
   }

   function stopIntro() {
      visit += 1;
      clearTimeout(dialogueTimer);
      if (observer) observer.disconnect();
      if (pendingLoad) image.removeEventListener('load', pendingLoad);
      pendingLoad = null;
      stage.classList.remove('is-started');
   }

   function resetIntro() {
      stopIntro();
      intro.hidden = false;
      game.hidden = true;
      dialogue.hidden = true;
      if ('IntersectionObserver' in window) {
         observer = new IntersectionObserver(function (entries) {
            if (entries.some(function (entry) {
               return entry.isIntersecting && entry.intersectionRatio >= 0.5;
            })) {
               observer.disconnect();
               beginIntro();
            }
         }, { threshold: 0.5 });
         observer.observe(stage);
      } else {
         beginIntro();
      }
   }

   resetIntro();
   window.addEventListener('pageshow', function (event) {
      if (event.persisted) resetIntro();
   });
   window.addEventListener('pagehide', function () {
      stopIntro();
      var pause = document.getElementById('snakePauseBtn');
      if (pause && !pause.disabled && pause.getAttribute('aria-pressed') === 'false') {
         pause.click();
      }
   });

   play.addEventListener('click', function () {
      intro.hidden = true;
      game.hidden = false;
      var start = document.getElementById('snakeStartBtn');
      if (start) start.focus();
      game.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
   });

   var keepBrowsing = document.getElementById('snakeContinueBtn');
   if (keepBrowsing) {
      keepBrowsing.addEventListener('click', function () {
         game.hidden = true;
         intro.hidden = false;
         dialogue.hidden = false;
         play.focus();
         intro.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      });
   }
});
