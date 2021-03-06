<?php
/*
{
	"AUTHOR":"Matheus Maydana",
	"CREATED_DATA": "14/08/2018",
	"MODEL": "Layout",
	"LAST EDIT": "18/08/2018",
	"VERSION":"0.0.2"
}
*/


/**
**
** @see o Layout precisa ser formato .HTML ou confirgurar no arquivo Setting.php 
**
**/

class Model_Layout extends Model_View{

	public function setLayout($st_view){

		try{

			if(file_exists(DIR_CLASS.DIR.SUBDOMINIO.'/Layout/'.$st_view.EXTENSAO_VISAO)){

				$this->st_view = $st_view;
			}

		}catch(PDOException $e){

			/**
			** ERRO, LAYOUT NÃO ENCONTRADO
			**/
			new de('layout não encontrado');
		}
	}

	public function Layout($metas){

		try{

			$layout = LAYOUT;

			/* COLOCAR CACHE NOS ARQUIVOS STATICOS QUANDO NÃO ESTÁ EM PRODUÇÃO */
			$cache = '';
			$random = mt_rand(10000, 99999);

			if(DEV !== true){
				$cache = '?cache='.$random;
			}

			$mustache = array(
				'{{static}}' 		=> URL_STATIC,
				'{{header}}' 		=> $this->_headerHTML($metas),
				'{{cache}}' 		=> $cache,
				'{{lang}}'			=> $this->_url
			);

			$layout = str_replace(array_keys($mustache), array_values($mustache), file_get_contents(DIR_CLASS.DIR.'Layout/'.$layout.EXTENSAO_VISAO));
			return $layout;

		}catch(PDOException $e){

			new de('nada de layout');
			/**
			** ERRO, ARQUIVO LAYOUT NÃO ENCONTRADO
			**/
		} 
	}

	private function _headerHTML($metas){

		$url = $this->url;
		
		$noscript = '<noscript><meta  http-equiv="refresh"  content="1; URL=/noscript"  /></noscript>';
		if(isset($url[1]) and $url[1] == 'noscript'){

			$noscript = '';
		}

		$meta_title = $metas['title'] ?? 'DevWeb';

		$header = <<<php
<title>{$meta_title}</title>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, height=device-height, user-scalable=yes, initial-scale=1" />
<meta name="msapplication-tap-highlight" content="no" />
<meta name="format-detection" content="telephone=no" />
<meta name="description" content="">
<meta  name="robots" content="index, no-follow" />
{$noscript}
<meta name="msapplication-tap-highlight" content="no"/>
<meta name="apple-mobile-web-app-title" content="Maydana System"/>
<meta name="application-name" content="Maydana System"/>
<meta name="msapplication-TileImage" content="/img/caveira.png"/>
<meta name="msapplication-TileColor" content="#e8e6e8"/>
<meta name="theme-color" content="#1c5f8e"/>
<meta name="author" content="Matheus Maydana" />
<link rel="manifest" href="/manifest.json"/>
<link rel="shortcut icon" href="/img/site/caveira.png" type="image/x-icon">
<link rel="icon" href="/img/site/caveira.png" type="image/x-icon">
<script defer src="/js/MS.min.js{{cache}}"></script>
<script defer src="/js/site.min.js{{cache}}"></script>
<style>
html,body,div,span,applet,object,iframe,h1,h2,h3,h4,h5,h6,p,blockquote,pre,a,abbr,acronym,address,big,cite,code,del,dfn,em,img,ins,kbd,q,s,samp,small,strike,strong,sub,sup,tt,var,b,u,i,center,dl,dt,dd,ol,ul,li,fieldset,form,label,legend,table,caption,tbody,tfoot,thead,tr,th,td,article,aside,canvas,details,embed,figure,figcaption,footer,header,hgroup,menu,nav,output,ruby,section,summary,time,mark,audio,video{margin:0;padding:0;border:0;font-size:100%;font:inherit;vertical-align:baseline}article,aside,details,figcaption,figure,footer,header,hgroup,menu,nav,section{display:block}button{padding:10px;cursor:pointer;outline:none;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box}body{line-height:1;font-family:monospace;background-color:#eaeaea;font-size:14px;cursor:url("/img/site/cursor.png"),auto}ol,ul{list-style:none}blockquote,q{quotes:none}p{line-height:1.5em}blockquote:before,blockquote:after,q:before,q:after{content:'';content:none}table{border-collapse:collapse;border-spacing:0}.btn-net{background-color:rgba(0,0,0,0);border:none}nav{display:block;width:100%;text-align:center;position:absolute;top:0}nav .header-box{display:inline-block;margin:auto;width:100%}nav .header-box .header-a{display:inline-block;width:60%;text-align:left;padding-left:20px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box;font-size:14px;font-weight:300;color:#b7b7b7}nav .header-box .header-b{display:inline-block;width:40%}nav .header-box .header-b button i{font-size:14px;font-weight:300;color:#b7b7b7}nav .nv-box{position:relative;background-color:#ffffff}nav .nav-box{margin:auto;max-width:980px;background-color:#e6e6e6;-webkit-box-shadow:0px 3px 10px 2px rgba(0,0,0,0.5);-moz-box-shadow:0px 3px 10px 2px rgba(0,0,0,0.5);box-shadow:0px 3px 10px 2px rgba(0,0,0,0.5);border-radius:0 0 10px 10px;-moz-border-radius:0 0 10px 10px;-ms-border-radius:0 0 10px 10px;-webkit-border-radius:0 0 10px 10px;-o-border-radius:0 0 10px 10px;z-index:2}nav .nav-fix{position:fixed;width:100%;max-width:100%;top:0;background:black;-webkit-animation:animation_msg 0.5s 1;-moz-animation:animation_msg 0.5s 1;-o-animation:animation_msg 0.5s 1;-ms-animation:animation_msg 0.5s 1;animation:animation_msg 0.5s 1}nav .nav-fix a{color:#ffffff}nav .nav-menu{width:33.3%;display:inline-block;padding:20px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box}@-webkit-keyframes animation_msg{0%{top:-30px;opacity:0.4}100%{opacity:0.6}}@-moz-keyframes animation_msg{0%{top:-30px;opacity:0.4}100%{opacity:0.6}}@keyframes animation_msg{0%{top:-30px;opacity:0.4}100%{opacity:0.6}}header{display:block;width:100%;height:70vh;background-image:url("/img/site/02.png");background-size:cover}#push-conteudo{display:block;position:relative;margin:auto;min-height:70vh;max-width:980px;padding:40px;background-color:#ffffff;margin-top:-50px;-webkit-box-shadow:0px 3px 10px 2px rgba(0,0,0,0.3);-moz-box-shadow:0px 3px 10px 2px rgba(0,0,0,0.3);box-shadow:0px 3px 10px 2px rgba(0,0,0,0.3);border-radius:10px;-moz-border-radius:10px;-ms-border-radius:10px;-webkit-border-radius:10px;-o-border-radius:10px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box}.footer{display:flex;width:100%;padding:40px;margin:auto;background-color:#07475E;margin-top:-50px;min-height:250px;height:30vh;color:#ffffff;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;-ms-box-sizing:border-box;-o-box-sizing:border-box}.footer .foo-txt{margin:auto}

</style>
php;

		return $header;
	}


	protected function _navi(){

		return '';
	}
}