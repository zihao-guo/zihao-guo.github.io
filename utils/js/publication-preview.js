(() => {
   const thumbnails = document.querySelectorAll('.mytable .img-bordered');
   if (!thumbnails.length) return;

   const preview = document.createElement('img');
   preview.className = 'publication-preview';
   preview.alt = '';
   preview.setAttribute('aria-hidden', 'true');
   document.body.appendChild(preview);
   const previewSources = new WeakMap();
   let activeThumbnail = null;

   const hide = () => {
      activeThumbnail = null;
      preview.classList.remove('is-visible');
   };

   const show = (thumbnail) => {
      if (activeThumbnail !== thumbnail) preview.classList.remove('is-visible');
      activeThumbnail = thumbnail;
      const source = previewSources.get(thumbnail) || thumbnail;
      if (!source.naturalWidth) return;
      const margin = 16;
      const frame = 26;
      const viewportWidth = document.documentElement.clientWidth;
      const viewportHeight = window.innerHeight;
      const scale = Math.min(
         (Math.min(680, viewportWidth - margin * 2) - frame) / source.naturalWidth,
         (Math.min(720, viewportHeight * 0.8) - frame) / source.naturalHeight
      );
      const width = source.naturalWidth * scale + frame;
      const height = source.naturalHeight * scale + frame;
      const rect = thumbnail.getBoundingClientRect();
      const left = Math.max(margin, Math.min(rect.left, viewportWidth - width - margin));
      const top = Math.max(margin, Math.min(
         rect.top + (rect.height - height) / 2,
         viewportHeight - height - margin
      ));

      preview.src = source.currentSrc || source.src;
      Object.assign(preview.style, {
         width: `${width}px`, height: `${height}px`,
         left: `${left}px`, top: `${top}px`
      });
      preview.classList.add('is-visible');
   };

   thumbnails.forEach((thumbnail) => {
      if (thumbnail.dataset.previewSrc) {
         const source = new Image();
         previewSources.set(thumbnail, source);
         source.addEventListener('load', () => {
            if (activeThumbnail === thumbnail) show(thumbnail);
         });
         source.addEventListener('error', () => {
            previewSources.delete(thumbnail);
            if (activeThumbnail === thumbnail) show(thumbnail);
         });
         source.src = thumbnail.dataset.previewSrc;
      }
      thumbnail.tabIndex = 0;
      const title = thumbnail.closest('tr').querySelector('b');
      if (title) thumbnail.alt = `Figure for ${title.textContent.trim()}`;
      thumbnail.addEventListener('pointerenter', (event) => {
         if (event.pointerType !== 'touch') show(thumbnail);
      });
      thumbnail.addEventListener('pointerleave', () => {
         if (activeThumbnail === thumbnail) hide();
      });
      thumbnail.addEventListener('focus', () => show(thumbnail));
      thumbnail.addEventListener('blur', hide);
      thumbnail.addEventListener('load', () => {
         if (thumbnail.matches(':hover') || document.activeElement === thumbnail) show(thumbnail);
      });
   });

   window.addEventListener('scroll', hide, { passive: true, capture: true });
   window.addEventListener('resize', hide);
   window.addEventListener('blur', hide);
   document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') hide();
   });
})();
