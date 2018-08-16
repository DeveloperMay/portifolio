/* VAR TO LOCK CHANGE PAGE */
var lockChangePage = false;

/* VAR TO LOOK EXIT PAGE, CLOSE BROWSER OR CLOSE TAB */
var lockClosePage = false;

var touchEvents = false;

/* EVENTOS DE ESCUTA APENAS UMA VEZ */
var fakescroll;
var fakeresize;

if(Event in window){
	fakescroll = new Event('fakescroll');
	fakeresize = new Event('fakeresize');
}else if(document.createEvent){

	fakescroll = document.createEvent('Event');
	fakescroll.initEvent('fakescroll', true, false);

	fakeresize = document.createEvent('Event');
	fakeresize.initEvent('fakeresize', true, false);
}
window.MS = {
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
	screensizes: function(){

		var orient;

		if(window.screen.mozOrientation){
			orient = window.screen.mozOrientation;
		}else if(window.screen.msOrientation){
			orient = window.screen.msOrientation
		}else if(window.screen.orientation){
			if(window.screen.orientation.type){
				orient = window.screen.orientation.type;
			}else{
				orient = window.screen.orientation;
			}
		}else{
			if(window.screen.height > window.screen.width){
				orient = 'portrait-primary';
			}else{
				orient = 'landscape-primary';
			}
		}

		return {
			'viewWidth': window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth,
			'viewHeight': window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight,
			'pageWidth': document.body.clientWidth || document.body.offsetWidth,
			'pageHeight': document.body.clientHeight || document.body.offsetHeight,
			'resolutionWidth': window.screen.width,
			'resolutionHeight': window.screen.height,
			'orientation': orient,
			'colorDepth': window.screen.colorDepth,
			'pixelDepth': window.screen.pixelDepth
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
	targt: function (e) {
		e = e.target ? e : window.event;
		return e.target || e.srcElement;
	},
	pushstate: {
		init: function(configObj){

			history.scrollRestoration = 'manual';

			var xhrfn = function(){};
			var lockChangePageFn = function(){};
			var lockExitMessage = '';

			if(typeof(configObj.xhrfn) === 'function'){
				xhrfn = configObj.xhrfn;
			}

			if(typeof(configObj.lockChangePageFn) === 'function'){
				lockChangePageFn = configObj.lockChangePageFn;
			}

			if(configObj.lockExitMessage){
				lockExitMessage = configObj.lockExitMessage;
			}

			/* POPSTATE EVENT */
			MS.evts.add('popstate', window, function(evts){

				if(lockChangePage === true){
					lockChangePageFn(evts.location.href);
					return false;
				}

				var host = window.location.protocol+'//'+window.location.host;
				var controler = evts.location.href.replace(host, '');

				xhrfn(controler, function(){});

			});

			/* CLICK EVENTS */
			MS.evts.add('click', document, function(evts){

				var elemt = evts.target;

				var expJs = new RegExp('javascript:', 'i');
				var expFTP = new RegExp('ftp:', 'i');
				var expMail = new RegExp('mailto:', 'i');
				var expWhatsapp = new RegExp('whatsapp:', 'i');

				var domain = jsdominio;

				if(elemt.nodeName !== 'BUTTON' && elemt.parentElement !== null && elemt.parentElement.nodeName === 'BUTTON'){
					elemt = elemt.parentElement;
				}

				if(elemt.nodeName === 'BUTTON' && elemt.getAttribute('data-push') && elemt.getAttribute('data-push') !== false){

					var hrefDomain = elemt.getAttribute('data-push').replace('http://', '');
					hrefDomain = hrefDomain.replace('https://', '');

					var re = new RegExp('^\/', 'i'); 

					if(re.test(hrefDomain) === true){
						hrefDomain = domain+hrefDomain;
					}

					var urlIn = new RegExp('^'+domain, 'i');

					if(urlIn.test(hrefDomain) === true){
						MS.pushstate.goXHR(elemt.getAttribute('data-push'), xhrfn, lockChangePageFn);
					}else{
						var a = document.createElement('a');
						a.href = elemt.getAttribute('data-push');
						MS.trigger('click', a);
					}
				}else{

					var wl = true;
					while(wl === true){

						if(elemt.parentNode !== null && elemt.nodeName !== 'A'){
							elemt = elemt.parentNode;
						}else{
							wl = false;

							if(elemt.href){

								var hrefDomain = elemt.href.replace('http://', '');
								hrefDomain = hrefDomain.replace('https://', '');

								var urlIn = new RegExp('^'+domain, 'i');

								if(urlIn.test(hrefDomain) === true && !elemt.getAttribute('data-push')){

									/* GOXHR*/
									if(expJs.test(elemt.href) === false || 
										expFTP.test(elemt.href) === false || 
										expMail.test(elemt.href) === false || 
										expWhatsapp.test(elemt.href) === false || 
										!elemt.getAttribute('data-href')){

										if(evts.stopPropagation){
											evts.stopPropagation();
										}
										if(evts.preventDefault){
											evts.preventDefault();
										}
										xhrfn(elemt.href, xhrfn, lockChangePageFn);
									}

								}
							}
						}
					}
				}
			});

			/* beforeunload EVENT  */
			window.addEventListener('beforeunload', window, function(evts){
				if(lockClosePage === true){

					evts.cancelBubble = true;

					evts.returnValue = lockExitMessage;

					if(evts.stopPropagation){
						evts.stopPropagation();
					}

					if(evts.preventDefault){
						evts.preventDefault();
					}

					return lockExitMessage;
				}
			});
		},
		goXHR: function(controler, xhrfn, lockChangePageFn){

			if(lockChangePage === true && lockChangePageFn){
				lockChangePageFn(controler);
				return false;
			}

			var host = window.location.protocol+'//'+window.location.host;
			var ctrlpage = window.location.href.replace(host, '');
			ctrlpage = ctrlpage.replace(/\?.*$/, '');
			XHRPopStateScroll[ctrlpage] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

			xhrfn(controler, function(){
				history.pushState({}, '', controler);
			});

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
	delay: function (fn, tm) {
		window.setTimeout(function () {
			fn();
		}, tm);
	},
	ajax: function (options) {
		var XHR;
		var strPost = new Array();
		var r20 = /%20/g;

		if(window.XMLHttpRequest){
			XHR = new XMLHttpRequest();
		}else if(window.ActiveXObject){
			XHR = new ActiveXObject('Msxml2.XMLHTTP');
			if(!XHR){
				XHR = new ActiveXObject('Microsoft.XMLHTTP');
			}
		}else{
			console.warn('This Browser do not support XMLHttpRequest');
			return false;
		}

		if(options.progress){
			XHR.upload.addEventListener('progress', options.progress, false);
		}

		if(options.error){
			XHR.addEventListener('error', options.error, false);
			XHR.addEventListener('abort', options.error, false);
		}

		XHR.open('POST', options.url, true);

		/* AS DATA */
		if(options.data){

			XHR.setRequestHeader("Content-type","application/x-www-form-urlencoded;charset=UTF-8");

			for(x in options.data){
				strPost.push(encodeURIComponent(x)+'='+encodeURIComponent(options.data[x]));
			}

			stPost = strPost.join('&').replace(r20, "+");
			XHR.send(stPost);

		/* AS FORM */
		}else if(options.formId){

			var form = document.getElementById(options.formId);
			var frm = new FormData();

			var inputs = form.getElementsByTagName('input');
			var tInputs = inputs.length;

			for(x = 0; x < tInputs; x++){
				if(inputs[x].getAttribute('name') && !inputs[x].getAttribute('disabled')){

					/* INPUT FILE */
					if(inputs[x].type === 'file'){
						
						var tFiles = inputs[x].files.length;

						if(tFiles > 0){
							for(z = 0; z < tFiles; z++){
								var fle = inputs[x].files[z];
								frm.append(inputs[x].getAttribute('name'), fle);
							}
						}

					/* RADIO AND CHECKBOX */
					}else if(inputs[x].type === 'radio' || inputs[x].type === 'checkbox'){
						if(inputs[x].checked === true){
							frm.append(inputs[x].getAttribute('name'), inputs[x].value);
						}
					/* OTHERS INPUTS FIELDS */
					}else{
						frm.append(inputs[x].getAttribute('name'), inputs[x].value);
					}
				}
			}

			var textareas = form.getElementsByTagName('textarea');
			var tTextareas = textareas.length;

			for(x = 0; x < tTextareas; x++){
				if(textareas[x].getAttribute('name') && !textareas[x].getAttribute('disabled')){
					frm.append(textareas[x].getAttribute('name'), textareas[x].value);
				}
			}

			var selects = form.getElementsByTagName('select');
			var tSelects = selects.length;

			for(x = 0; x < tSelects; x++){
				if(selects[x].getAttribute('name') && !selects[x].getAttribute('disabled')){
					frm.append(selects[x].getAttribute('name'), selects[x].value);
				}
			}

			XHR.send(frm);

		}
		XHR.onreadystatechange = function(){

			if(XHR.readyState === 4 && (XHR.status === 200 || XHR.status === 304)){
				if(typeof(options.dataType) !== 'undefined'){

					if(options.dataType === 'JSON' || options.dataType === 'json'){
						jsonStr = XHR.responseText;
						if(JSON.parse(XHR.responseText)){
							jsonStr = eval("("+XHR.responseText+")");
						}
						if(typeof(options.done) === 'function'){
							options.done(jsonStr);
						}
					}

				}else{
					if (typeof(options.done) === 'function'){
						options.done(XHR.responseText);
					}
				}
			}

			if(XHR.readyState === 4 && XHR.status === 404){
				if(typeof(options.error) === 'function'){
					options.error(XHR);
				}
			}

			if(XHR.readyState === 4 && XHR.status === 500){
				if(typeof(options.error) === 'function'){
					options.error(XHR);
				}
			}
		}

		return XHR;
	}
};