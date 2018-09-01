function openURL(href){

		var link = href;					 
		$.ajax({															 
			url: link,
			type: 'POST',
			data: {push: 'push'},
			cache: false,
			success: function (result) {
				$('#push-conteudo').html(result);
				if(window.scrollY > (document.getElementById('push-conteudo').offsetTop - 100)){

					window.scroll(0, (document.getElementById('push-conteudo').offsetTop - 100));
				}
			}
		});
		window.history.pushState({href: href}, '', href);
}

$(document).ready(function() {

   $(document).on('click', 'a', function () {
	 openURL($(this).attr("href"));
	 return false;
   });  

   window.addEventListener('popstate', function(e){
	  if(e.state)
		openURL(e.state.href);
   }); 

});
window.ancoraativa = 0;
window.DW = {
	smoothScroll: {
		init: function(dutation = 2000){

			var menuItems = document.querySelectorAll('a[href^="#"]');

			function getScrollTopByHref(element) {
			  var id = element.getAttribute('href');
			  return document.querySelector(id).offsetTop;
			}

			function scrollToPosition(to, dutation) {
			  smoothScrollTo(0, to, dutation);
			}

			function scrollToIdOnClick(event) {
				if(ancoraativa == 0 || ancoraativa == 3){
					ancoraativa = 1;
				  event.preventDefault();
				  var to = getScrollTopByHref(event.currentTarget) - 80;
				  scrollToPosition(to, dutation);
				}
			}

			menuItems.forEach(function (item) {
			  item.addEventListener('click', scrollToIdOnClick);
			});

			function smoothScrollTo(endX, endY, duration) {
			  var startX = window.scrollX || window.pageXOffset;
			  var startY = window.scrollY || window.pageYOffset;
			  var distanceX = endX - startX;
			  var distanceY = endY - startY;
			  var startTime = new Date().getTime();

			  duration = typeof duration !== 'undefined' ? duration : 400;

			  var easeInOutQuart = function easeInOutQuart(time, from, distance, duration) {
				if ((time /= duration / 2) < 1){
					return distance / 2 * time * time * time * time + from;
				}

				return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
			  };

			  var timer = setInterval(function () {
				var time = new Date().getTime() - startTime;
				var newX = easeInOutQuart(time, startX, distanceX, duration);
				var newY = easeInOutQuart(time, startY, distanceY, duration);

				if(ancoraativa === 3){
					clearInterval(timer);
				}

				if (time >= duration){
					clearInterval(timer);
					ancoraativa = 0;
				}

				window.scroll(newX, newY);
			  }, 1000 / 60);
			};
		}
	},
	/* ADD EVENTS */
	evts: {
		add: function (evt, el, fn) {
			if(el !== null){
				if(window.addEventListener){
					el.addEventListener(evt, function(evt){
						fn(evt);
					}, true);
				}else{
					el.attachEvent("on"+evt, function(){
						fn(evt);
					});
				}
			}
		}
	},
	trigger: function (ev, el){
		if(document.createEvent){
			evento = document.createEvent('HTMLEvents');
			evento.initEvent(ev, true, true);
			el.dispatchEvent(evento);
		}else{
			evento = document.createEventObject();
			el.fireEvent('on'+ev, evento);
		}
	},
	getById: function(element){
		return document.getElementById(element);
	},
	targt: function (e) {
		e = e.target ? e : window.event;
		return e.target || e.srcElement;
	},
	debounce: function(func, wait, immediate){

		let timeout;
		return function(...args){
			const context = this;
			const later = function(){
				timeout = null;
				if(!immediate) func.apply(context, args);
			};

			const callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if(callNow){
				func.apply(context, args);
			}
		};
	},
	delay: function (fn, tm) {
		window.setTimeout(function () {
			fn();
		}, tm);
	},
	delayPersistent2: (function(fn, ms, label){
		if(typeof(delayPersistent2) === 'undefined'){
			window.delayPersistent2 = {};
		}
		return function(fn, ms, label){
			clearTimeout(delayPersistent2[label]);
			delayPersistent2[label] = setTimeout(fn, ms);
		};
	}())
};

/* PAUSA O SCROLL - SUAVE QUANDO PRESSIONA AS TECLAS, PAGEDOWN, PAGEUP, SETA CIMA E BAIXO */
$(window).on('keydown', function(event){
	var tecla = event.keyCode;
	if(tecla === 40 || tecla === 38 || tecla === 35 || tecla === 36 || tecla === 33 || tecla === 34){
		ancoraativa = 3;
	}
});
/* PAUSA O SCROLL - SUAVE QUANDO O SCROLL DO MOUSE É ACIONADO (usuario tentando usar o scroll) */
$(window).on('wheel', function(){

	ancoraativa = 3;
});

$(window).on('scroll', function(){

	var winScroll = document.body.scrollTop || document.documentElement.scrollTop;
	var height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
	var scrolled = (winScroll / height) * 100;
	$('#box-progress').css('width', scrolled + "%");
});