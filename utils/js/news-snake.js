document.addEventListener('DOMContentLoaded', function () {
   var canvas = document.getElementById('newsSnakeCanvas');
   if (!canvas || !canvas.getContext) {
      return;
   }

   var ctx = canvas.getContext('2d');
   var tileSize = 20;
   var tilesX = Math.floor(canvas.width / tileSize);
   var tilesY = Math.floor(canvas.height / tileSize);
   var snake = [{ x: Math.floor(tilesX / 2), y: Math.floor(tilesY / 2) }];
   var snakeLength = 4;
   var velocity = { x: 1, y: 0 };
   var food = spawnFood();
   var loopInterval = 140;
   var unlockedIndex = -1;
   var nextIndex = 0;
   var headlineEl = document.getElementById('snakeHeadline');
   var nextEl = document.getElementById('snakeNext');
   var controlButtons = document.querySelectorAll('.snake-btn-dir[data-direction]');
   var modalEl = document.getElementById('snakeModal');
   var modalCloseButton = document.getElementById('snakeModalClose');
   var pauseButton = document.getElementById('snakePauseBtn');
   var continueButton = document.getElementById('snakeContinueBtn');
   var startButton = document.getElementById('snakeStartBtn');
   var gamePaused = true;
   var gameStarted = false;

   var newsItems = [
      {
         date: 'Sep 2025',
         description: 'One paper is accepted by {link}.',
         linkLabel: 'Nature Methods',
         linkUrl: 'https://www.nature.com/nmeth/',
      },
      {
         date: 'Mar 2025',
         description: 'One paper is accepted by {link}.',
         linkLabel: 'Lion19',
         linkUrl: 'https://lion19.org/',
      },
      {
         date: 'Apr 2024',
         description: 'One paper is accepted by {link}.',
         linkLabel: 'Biomimetics',
         linkUrl: 'https://www.mdpi.com/journal/biomimetics',
      },
      {
         date: 'Oct 2022',
         description: 'One paper is accepted by {link}.',
         linkLabel: 'ACM EITCE 2022',
         linkUrl: 'https://dl.acm.org/doi/proceedings/10.1145/3573428',
      },
   ];

   function formatNews(item) {
      if (!item) return '';
      if (item.linkUrl && item.description.indexOf('{link}') > -1) {
         var anchor = '<a href="' + item.linkUrl + '" target="_blank" rel="noopener noreferrer">' + item.linkLabel + '</a>';
         return item.description.replace('{link}', anchor);
      }
      return item.description;
   }

   function updateGuideText() {
      if (headlineEl) {
         if (unlockedIndex >= 0) {
            var unlocked = newsItems[unlockedIndex];
            headlineEl.innerHTML = 'Unlocked: ' + unlocked.date + ' — ' + formatNews(unlocked);
         } else {
            headlineEl.textContent = gameStarted ? 'Catch an apple to reveal the first headline.' : 'Press Start to begin the challenge.';
         }
      }
      if (nextEl) {
         if (!gameStarted) {
            nextEl.textContent = 'Press Start to begin unlocking headlines.';
         } else if (nextIndex < newsItems.length) {
            var nextItem = newsItems[nextIndex];
            nextEl.innerHTML = 'Next: ' + nextItem.date + ' — ' + formatNews(nextItem);
         } else {
            nextEl.textContent = 'All headlines unlocked. Tap Play again to restart.';
         }
      }
   }

   function spawnFood() {
      var position;
      do {
         position = {
            x: Math.floor(Math.random() * tilesX),
            y: Math.floor(Math.random() * tilesY),
         };
      } while (snake.some(function (segment) {
         return segment.x === position.x && segment.y === position.y;
      }));
      return position;
   }

   function resetGame() {
      snake = [{ x: Math.floor(tilesX / 2), y: Math.floor(tilesY / 2) }];
      snakeLength = 4;
      velocity = { x: 1, y: 0 };
      food = spawnFood();
   }

   function resetProgress() {
      unlockedIndex = -1;
      nextIndex = 0;
      updateGuideText();
   }

   function draw() {
      ctx.fillStyle = '#f4fffd';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      drawApple(food);

      ctx.fillStyle = '#16da9d';
      snake.forEach(function (segment, segmentIndex) {
         var sizeAdjustment = segmentIndex === 0 ? 0 : 2;
         ctx.fillRect(
            segment.x * tileSize,
            segment.y * tileSize,
            tileSize - sizeAdjustment,
            tileSize - sizeAdjustment
         );
      });
   }

   function drawApple(position) {
      var centerX = position.x * tileSize + tileSize / 2;
      var centerY = position.y * tileSize + tileSize / 2;
      var radius = (tileSize / 2) - 2;
      ctx.save();
      ctx.fillStyle = '#e74c3c';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c0392b';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.strokeStyle = '#4a2f1b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(centerX, centerY - radius);
      ctx.lineTo(centerX, centerY - radius - 6);
      ctx.stroke();
      ctx.fillStyle = '#2ecc71';
      ctx.beginPath();
      ctx.ellipse(centerX + 4, centerY - radius - 4, 4, 2, Math.PI / 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
   }

   function update() {
      if (gamePaused) {
         return;
      }
      var head = {
         x: snake[0].x + velocity.x,
         y: snake[0].y + velocity.y,
      };

      if (head.x < 0) head.x = tilesX - 1;
      if (head.x >= tilesX) head.x = 0;
      if (head.y < 0) head.y = tilesY - 1;
      if (head.y >= tilesY) head.y = 0;

      if (snake.some(function (segment) {
         return segment.x === head.x && segment.y === head.y;
      })) {
         resetGame();
         resetProgress();
         draw();
         return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
         snakeLength += 1;
         if (nextIndex < newsItems.length) {
            unlockedIndex = nextIndex;
            nextIndex += 1;
            updateGuideText();
            if (nextIndex >= newsItems.length) {
               handleCompletion();
            }
         }
         food = spawnFood();
      }

      while (snake.length > snakeLength) {
         snake.pop();
      }

      draw();
   }

   document.addEventListener('keydown', function (event) {
      switch (event.key) {
         case 'ArrowUp':
            setDirection('up');
            break;
         case 'ArrowDown':
            setDirection('down');
            break;
         case 'ArrowLeft':
            setDirection('left');
            break;
         case 'ArrowRight':
            setDirection('right');
            break;
         default:
            break;
      }
   });

   function setDirection(direction) {
      if (!direction) return;
      var newVelocity;
      switch (direction) {
         case 'up':
            if (velocity.y === 1) return;
            newVelocity = { x: 0, y: -1 };
            break;
         case 'down':
            if (velocity.y === -1) return;
            newVelocity = { x: 0, y: 1 };
            break;
         case 'left':
            if (velocity.x === 1) return;
            newVelocity = { x: -1, y: 0 };
            break;
         case 'right':
            if (velocity.x === -1) return;
            newVelocity = { x: 1, y: 0 };
            break;
         default:
            break;
      }
      if (newVelocity) {
         velocity = newVelocity;
      }
   }

   Array.prototype.forEach.call(controlButtons, function (button) {
      button.addEventListener('click', function () {
         var dir = button.getAttribute('data-direction');
         setDirection(dir);
      });
   });

   function togglePause() {
      if (!gameStarted) return;
      gamePaused = !gamePaused;
      updateControlStates();
   }

   if (pauseButton) {
      pauseButton.addEventListener('click', togglePause);
   }

   if (startButton) {
      startButton.addEventListener('click', function () {
         gameStarted = true;
         gamePaused = false;
         hideModal();
         resetGame();
         resetProgress();
         updateGuideText();
         updateControlStates();
      });
   }

   function updateControlStates() {
      if (pauseButton) {
         pauseButton.disabled = !gameStarted;
         pauseButton.setAttribute('aria-pressed', gamePaused ? 'true' : 'false');
         pauseButton.textContent = gamePaused ? 'Resume' : 'Pause';
      }
      if (startButton) {
         startButton.textContent = gameStarted ? 'Restart' : 'Start';
      }
   }

   function handleCompletion() {
      gamePaused = true;
      updateControlStates();
      if (nextEl) {
         nextEl.textContent = 'All headlines unlocked. Tap Play again to restart.';
      }
      if (modalEl) {
         modalEl.classList.add('is-visible');
         modalEl.setAttribute('aria-hidden', 'false');
      }
   }

   function hideModal() {
      if (modalEl) {
         modalEl.classList.remove('is-visible');
         modalEl.setAttribute('aria-hidden', 'true');
      }
   }

   if (modalCloseButton) {
      modalCloseButton.addEventListener('click', function () {
         hideModal();
         resetGame();
         resetProgress();
         gamePaused = false;
         updateGuideText();
         updateControlStates();
      });
   }

   if (continueButton) {
      continueButton.addEventListener('click', function () {
         hideModal();
         gamePaused = true;
         updateControlStates();
      });
   }

   updateGuideText();
   draw();
   updateControlStates();
   setInterval(update, loopInterval);
});
