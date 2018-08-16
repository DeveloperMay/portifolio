window.DW = {
	delay: function (fn, tm) {
		window.setTimeout(function () {
			fn();
		}, tm);
	},
	confirm: function(obj){
		if(obj.message && obj.ok){
			
			var mask = '<div class="DW-confirm"><p class="text-center strong">'+obj.message+'</p><hr /><p class="text-center"><button id="DW-confirm-ok" class="btn btn-site">'+obj.ok+'</button></p></div>';

			if(obj.no !== false){
				var mask = '<div class="DW-confirm"><p class="text-center strong">'+obj.message+'</p><hr /><p class="text-center"><button id="DW-confirm-ok" class="btn btn-site">'+obj.ok+'</button> <button id="DW-confirm-no" class="btn btn-danger">'+obj.no+'</button></p></div>';
			}

			if(DW.getById('DW-confirm')){
				var div = DW.getById('DW-confirm');
				div.innerHTML = mask;
			}else{
				var div = document.createElement('div');
				div.setAttribute('id', 'DW-confirm');
				div.innerHTML = mask;
				document.body.appendChild(div);
			}

			div.classList.remove('hidden');

			if(DW.getById('DW-confirm-ok')){
				DW.getById('DW-confirm-ok').focus();
			}

			DW.evts.add('click', div, function(evts){
				if(div === DW.targt(evts)){
					div.classList.add('hidden');

					/* AJUSTAR ISTO */
					if(obj.okFunction){
						obj.okFunction();
					}
				}
			});

			DW.evts.add('click', DW.getById('DW-confirm-ok'), function(evts){
				div.classList.add('hidden');

				if(obj.okFunction){
					obj.okFunction();
				}
			});

			DW.evts.add('keyup', DW.getById('DW-confirm-ok'), function(evts){

				if(evts.keyCode == 13){
					div.classList.add('hidden');

					if(obj.okFunction){
						obj.okFunction();
					}
				}
			});

			if(obj.noFunction){
				DW.evts.add('click', DW.getById('DW-confirm-no'), function(evts){
					div.classList.add('hidden');
					obj.noFunction();
				});
			}

			DW.evts.add('keyup', DW.getById('DW-confirm-no'), function(evts){
				if(evts.keyCode == 13){
					div.classList.add('hidden');
					obj.noFunction();
				}
			});
		}
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
			DW.evts.add('popstate', window, function(evts){

				if(lockChangePage === true){
					lockChangePageFn(window.location.href);
					return false;
				}

				var host = window.location.protocol+'//'+window.location.host;
				var controler = window.location.href.replace(host, '')+'!popstate';
				xhrfn(controler, function(){
					alert('oi');
				});

			});

			/* CLICK EVENTS */
			DW.evts.add('click', document, function(evts){

				var elemt = DW.targt(evts);

				var expJs = new RegExp('javascript:', 'i');
				var expFTP = new RegExp('ftp:', 'i');
				var expMail = new RegExp('mailto:', 'i');
				var expWhatsapp = new RegExp('whatsapp:', 'i');

				var domain = window.location.hostname;

				if(elemt.parentElement !== null && elemt.nodeName !== 'BUTTON' && elemt.parentElement.nodeName === 'BUTTON'){
					elemt = elemt.parentElement;
				}

				if(elemt.nodeName === 'BUTTON' && elemt.getAttribute('data-href') && elemt.getAttribute('data-href') !== false){

					var hrefDomain = elemt.getAttribute('data-href').replace('http://', '');
					hrefDomain = hrefDomain.replace('https://', '');

					var re = new RegExp('^\/', 'i'); 

					if(re.test(hrefDomain) === true){
						hrefDomain = domain+hrefDomain;
					}

					var urlIn = new RegExp('^'+domain, 'i');

					if(urlIn.test(hrefDomain) === true){
						DW.pushstate.goXHR(elemt.getAttribute('data-href'), xhrfn, lockChangePageFn);
					}else{
						var a = document.createElement('a');
						a.href = elemt.getAttribute('data-href');
						DW.trigger('click', a);
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

								if(urlIn.test(hrefDomain) === true && !elemt.getAttribute('data-href')){

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
										DW.pushstate.goXHR(elemt.href, xhrfn, lockChangePageFn);
									}

								}
							}
						}
					}
				}
			});

			/* beforeunload EVENT  */
			DW.evts.add('beforeunload', window, function(evts){
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

			if(lockChangePage === true){
				lockChangePageFn(controler);
				return false;
			}

			var host = window.location.protocol+'//'+window.location.host;
			var ctrlpage = window.location.href.replace(host, '');
			ctrlpage = ctrlpage.replace(/\?.*$/, '');
			XHRPopStateScroll[ctrlpage] = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;

			xhrfn(controler, function(){
				history.pushState({atual: controler}, '', controler);
			});

		}
	},
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
	ajax: function (options) {
		var XHR;
		var strPost = new Array();
		var r20 = /%20/g;

		if(window.XMLHttpRequest){
			XHR = new XMLHttpRequest();
		}else if(window.ActiveXObject){
			XHR = new ActiveXObject('DWxml2.XMLHTTP');
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

			var form = DW.getById(options.formId);
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