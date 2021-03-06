function openURL(href){

		if(window.scrollY > (document.getElementById('push-conteudo').offsetTop - 100)){

			DW.scroll.goTop();
		}
		var link = href;					 
		$.ajax({															 
			url: link,
			type: 'POST',
			data: {push: 'push'},
			cache: false,
			success: function (result) {
				var resultado = jQuery.parseJSON(result);

				$('#push-conteudo').html(resultado.html);

				if(resultado.metas.title && resultado.metas.title !== ''){
					$('title').text(resultado.metas.title);
				}

				if(resultado.metas.descricao && resultado.metas.descricao !== ''){
					$('meta[name="description"]').attr('content', resultado.metas.descricao);
				}


			}
		});

		window.history.pushState({href: href}, '', href);
}

$(document).ready(function() {

   $(document).on('click', 'a', function () {

   		if($(this)[0].hash == ''){

			openURL($(this).attr("href"));
   		}

			return false;
   });

});

window.ancoraativa = 0;
window.DW = {
	scroll: {
		easeInOutQuart: function(time, from, distance, duration){

			if ((time /= duration / 2) < 1){

				return distance / 2 * time * time * time * time + from;
			}

			return -distance / 2 * ((time -= 2) * time * time * time - 2) + from;
		},
		smoothScrollTo: function(endX, endY, duration = 1000){

			var startY = window.scrollY || window.pageYOffset;
			var distanceY = endY - startY;
			var startTime = new Date().getTime();

			var timer = setInterval(function () {

				var time = new Date().getTime() - startTime;
				var newY = DW.scroll.easeInOutQuart(time, startY, distanceY, duration);

				if (time >= duration || ancoraativa == 3){

					clearInterval(timer);
					ancoraativa = 0;
				}

				window.scroll(0, newY);
			}, 1000 / 60);
		},
		goTop: function(){

			var yorigem = window.scrollY;
			var ydestino = DW.getById('push-conteudo').offsetTop;
			DW.scroll.smoothScrollTo(yorigem, (ydestino - 100), 400);
		},
		init: function(e){

			if(ancoraativa !== 2){

				ancoraativa = 1;

				if(ancoraativa === 1){
					e.preventDefault();
					ancoraativa = 2;
					destino = e.target.hash.replace('#', '');
					var yorigem = DW.positionAtTop(DW.targt(e));
					var ydestino = DW.positionAtTop(DW.getById(destino));
					DW.scroll.smoothScrollTo(yorigem, (ydestino - 100));
				}

			}
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
	positionAtTop: function(el){
		posicao = 0;
		if(el.offsetParent){
			do{
				posicao += el.offsetTop;
			} while (el = el.offsetParent);
		}
		return posicao;
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
	var btn = event.keyCode;
	if(btn === 38 || btn === 40 || btn === 35 || btn === 36 || btn === 34 || btn === 33 || btn === 32){
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