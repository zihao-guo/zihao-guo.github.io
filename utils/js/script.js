(function($) {
    "use strict";

    // Windows load

    $(window).on("load", function() {

        // Site loader 

        $(".loader-inner").fadeOut();
        $(".loader").delay(200).fadeOut("slow");

    });


    // Scroll to

    $(function() {
        $(window).scroll(function() {
            if ($(this).scrollTop() > 100) {
                $('.scroll-to-top').addClass('top');
            } else {
                $('.scroll-to-top').removeClass('top');
            }
        });
    });


    // Scroll to

    $('a.scroll').smoothScroll({
        speed: 800,
        offset: -85
    });



    // Testimonials caroussel

    $(".testimonial-carousel").owlCarousel({

        items: 1,
        itemsDesktop: [1199, 1],
        itemsDesktopSmall: [979, 1],
        itemsTablet: [768, 1],
        itemsTabletSmall: [550, 1],
        itemsMobile: [480, 1],
        autoPlay: true,
        pagination: false,
        mouseDrag: true,
        autoplayTimeout: 1000
    });




    //Popup element

    new VenoBox({
  selector: '.venobox'
});


    //Skills percentage

  $(".percentage").each(function() {
        var width = $(this).text();
        $(this).css("width", width);

    });


    // Filtred portfolio

    $('.filter li a').on("click", function(e) {

        e.preventDefault();
        $(this).addClass('active');
        $(this).parent().siblings().find('a').removeClass('active');

        var filters = $(this).attr('data-filter');
        $(this).closest('.work').find('.item').removeClass('disable');

        if (filters !== 'all') {

            var selected = $(this).closest('.work').find('.item');

            for (var i = 0; i < selected.length; i++) {

                if (!selected.eq(i).hasClass(filters)) {
                    selected.eq(i).addClass('disable');
                }

            }

        }


    });


    // Parallax animated elements


    if ($('.parallax').length > 0) {

        var scene = $('.parallax').get(0);
        var parallax = new Parallax(scene, {
            relativeInput: true,

        });
    }


    	//Skills charts 
		
		$(function() {
		    $('.chart').easyPieChart({
		        animate: 2000,
		        scaleColor: false,
		        lineWidth : 4,
		        trackColor : "white",
		        barColor : "#22d4b5",
		        size : 90
		
		    });
		
		});


       // Mobile menu

		var mainNav= $('.main-nav ul')
		$('.mb-menu').on("click", function(e) {
		    e.preventDefault();
		    mainNav.slideToggle('fast').addClass( "show" );
		});
		
		
		$(window).resize(function(){
		        var w = $(window).width();
		        if(w > 320 && mainNav.is(':hidden')) {
		            mainNav.removeAttr('style');
		            mainNav.removeClass('show');
		        }
		});


        // Custom cursor

		$(document).ready(function(){
		    var coordinateX=+200;
		    var coordinateY=+200;
		    var bottomCursor=document.querySelector('.circle-cursor-bottom');
		    var topCursor=document.querySelector('.circle-cursor-top');


		    function displayCursor(e){
		        document.addEventListener('mousemove',e=>{
		        coordinateX=e.clientX;
		        coordinateY=e.clientY
		    });


		    function animCursor(){
		            topCursor.style.transform=`translate(${coordinateX}px, ${coordinateY}px)`;
		            bottomCursor.style.transform=`translate(${coordinateX}px, ${coordinateY}px)`;
		    requestAnimationFrame(animCursor)};
		    requestAnimationFrame(animCursor)};
		    displayCursor();
		
		});


})(jQuery);



function openModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.style.display = "block";
}

function closeModal(modalId) {
    var modal = document.getElementById(modalId);
    modal.style.display = "none";
}

function closeModalByDot(closeDot) {
    var modal = closeDot.closest('.modal');
    modal.style.display = "none";
}


window.onclick = function(event) {
    const modals = document.getElementsByClassName("modal");
    for (let i = 0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}


// CV download dialog

(function() {
    "use strict";

    function initCvDownloadDialog() {
        var triggers = Array.prototype.slice.call(document.querySelectorAll('.cv-modal-trigger'));

        if (!triggers.length) {
            return;
        }

        var modal = document.createElement('div');
        modal.className = 'cv-download-modal';
        modal.id = 'cv-download-dialog';
        modal.setAttribute('aria-hidden', 'true');
        modal.innerHTML = [
            '<div class="cv-download-modal__backdrop" data-cv-close></div>',
            '<div class="cv-download-modal__panel" role="dialog" aria-modal="true" aria-labelledby="cv-download-title" aria-describedby="cv-download-description" tabindex="-1">',
                '<button class="cv-download-modal__close" type="button" data-cv-close aria-label="Close CV download dialog">',
                    '<span aria-hidden="true">&times;</span>',
                '</button>',
                '<div class="cv-download-modal__icon" aria-hidden="true">',
                    '<i class="fa fa-download"></i>',
                '</div>',
                '<p class="cv-download-modal__eyebrow">Curriculum Vitae</p>',
                '<h2 class="cv-download-modal__title" id="cv-download-title">Download my CV</h2>',
                '<p class="cv-download-modal__description" id="cv-download-description">Download the latest English version of my CV directly to your device.</p>',
                '<div class="cv-download-modal__options">',
                    '<a class="cv-download-option" href="../src/doc/CV/CV_pdf/CV_Zihao_EN.pdf" download="Zihao-Eric-GUO-CV-EN.pdf">',
                        '<span class="cv-download-option__language" aria-hidden="true">EN</span>',
                        '<span class="cv-download-option__copy">',
                            '<strong>English CV</strong>',
                            '<small>Download PDF</small>',
                        '</span>',
                        '<i class="fa fa-download cv-download-option__arrow" aria-hidden="true"></i>',
                    '</a>',
                '</div>',
            '</div>'
        ].join('');

        document.body.appendChild(modal);

        var panel = modal.querySelector('.cv-download-modal__panel');
        var activeTrigger = null;

        function getFocusableElements() {
            return Array.prototype.slice.call(
                modal.querySelectorAll('a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])')
            );
        }

        function openCvDialog(trigger) {
            activeTrigger = trigger;
            activeTrigger.setAttribute('aria-expanded', 'true');
            modal.classList.add('is-open');
            modal.setAttribute('aria-hidden', 'false');
            document.body.classList.add('cv-modal-open');

            window.setTimeout(function() {
                panel.focus();
            }, 30);
        }

        function closeCvDialog() {
            if (!modal.classList.contains('is-open')) {
                return;
            }

            modal.classList.remove('is-open');
            modal.setAttribute('aria-hidden', 'true');
            document.body.classList.remove('cv-modal-open');

            if (activeTrigger) {
                activeTrigger.setAttribute('aria-expanded', 'false');
                activeTrigger.focus();
            }
        }

        triggers.forEach(function(trigger) {
            trigger.setAttribute('aria-expanded', 'false');
            trigger.addEventListener('click', function(event) {
                event.preventDefault();
                openCvDialog(trigger);
            });
        });

        modal.addEventListener('click', function(event) {
            if (event.target.closest('[data-cv-close]')) {
                closeCvDialog();
            }
        });

        document.addEventListener('keydown', function(event) {
            if (!modal.classList.contains('is-open')) {
                return;
            }

            if (event.key === 'Escape') {
                event.preventDefault();
                closeCvDialog();
                return;
            }

            if (event.key !== 'Tab') {
                return;
            }

            var focusableElements = getFocusableElements();
            var firstFocusable = focusableElements[0];
            var lastFocusable = focusableElements[focusableElements.length - 1];

            if (event.shiftKey && (document.activeElement === firstFocusable || document.activeElement === panel)) {
                event.preventDefault();
                lastFocusable.focus();
            } else if (!event.shiftKey && document.activeElement === lastFocusable) {
                event.preventDefault();
                firstFocusable.focus();
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initCvDownloadDialog);
    } else {
        initCvDownloadDialog();
    }
})();
