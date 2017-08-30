/*! Magnific Popup - v1.1.0 - 2016-02-20 * http://dimsemenov.com/plugins/magnific-popup/ * Copyright (c) 2016 Dmitry Semenov; */ ;(function(factory){if(typeof define==='function'&&define.amd){define(['jquery'],factory);}else if(typeof exports==='object'){factory(require('jquery'));}else{factory(window.jQuery||window.Zepto);}}(function($){var CLOSE_EVENT='Close',BEFORE_CLOSE_EVENT='BeforeClose',AFTER_CLOSE_EVENT='AfterClose',BEFORE_APPEND_EVENT='BeforeAppend',MARKUP_PARSE_EVENT='MarkupParse',OPEN_EVENT='Open',CHANGE_EVENT='Change',NS='mfp',EVENT_NS='.'+NS,READY_CLASS='mfp-ready',REMOVING_CLASS='mfp-removing',PREVENT_CLOSE_CLASS='mfp-prevent-close';var mfp,MagnificPopup=function(){},_isJQ=!!(window.jQuery),_prevStatus,_window=$(window),_document,_prevContentType,_wrapClasses,_currPopupType;var _mfpOn=function(name,f){mfp.ev.on(NS+name+EVENT_NS,f);},_getEl=function(className,appendTo,html,raw){var el=document.createElement('div');el.className='mfp-'+className;if(html){el.innerHTML=html;} if(!raw){el=$(el);if(appendTo){el.appendTo(appendTo);}}else if(appendTo){appendTo.appendChild(el);} return el;},_mfpTrigger=function(e,data){mfp.ev.triggerHandler(NS+e,data);if(mfp.st.callbacks){e=e.charAt(0).toLowerCase()+e.slice(1);if(mfp.st.callbacks[e]){mfp.st.callbacks[e].apply(mfp,$.isArray(data)?data:[data]);}}},_getCloseBtn=function(type){if(type!==_currPopupType||!mfp.currTemplate.closeBtn){mfp.currTemplate.closeBtn=$(mfp.st.closeMarkup.replace('%title%',mfp.st.tClose));_currPopupType=type;} return mfp.currTemplate.closeBtn;},_checkInstance=function(){if(!$.magnificPopup.instance){mfp=new MagnificPopup();mfp.init();$.magnificPopup.instance=mfp;}},supportsTransitions=function(){var s=document.createElement('p').style,v=['ms','O','Moz','Webkit'];if(s['transition']!==undefined){return true;} while(v.length){if(v.pop()+'Transition'in s){return true;}} return false;};MagnificPopup.prototype={constructor:MagnificPopup,init:function(){var appVersion=navigator.appVersion;mfp.isLowIE=mfp.isIE8=document.all&&!document.addEventListener;mfp.isAndroid=(/android/gi).test(appVersion);mfp.isIOS=(/iphone|ipad|ipod/gi).test(appVersion);mfp.supportsTransition=supportsTransitions();mfp.probablyMobile=(mfp.isAndroid||mfp.isIOS||/(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent));_document=$(document);mfp.popupsCache={};},open:function(data){var i;if(data.isObj===false){mfp.items=data.items.toArray();mfp.index=0;var items=data.items,item;for(i=0;i<items.length;i++){item=items[i];if(item.parsed){item=item.el[0];} if(item===data.el[0]){mfp.index=i;break;}}}else{mfp.items=$.isArray(data.items)?data.items:[data.items];mfp.index=data.index||0;} if(mfp.isOpen){mfp.updateItemHTML();return;} mfp.types=[];_wrapClasses='';if(data.mainEl&&data.mainEl.length){mfp.ev=data.mainEl.eq(0);}else{mfp.ev=_document;} if(data.key){if(!mfp.popupsCache[data.key]){mfp.popupsCache[data.key]={};} mfp.currTemplate=mfp.popupsCache[data.key];}else{mfp.currTemplate={};} mfp.st=$.extend(true,{},$.magnificPopup.defaults,data);mfp.fixedContentPos=mfp.st.fixedContentPos==='auto'?!mfp.probablyMobile:mfp.st.fixedContentPos;if(mfp.st.modal){mfp.st.closeOnContentClick=false;mfp.st.closeOnBgClick=false;mfp.st.showCloseBtn=false;mfp.st.enableEscapeKey=false;} if(!mfp.bgOverlay){mfp.bgOverlay=_getEl('bg').on('click'+EVENT_NS,function(){mfp.close();});mfp.wrap=_getEl('wrap').attr('tabindex',-1).on('click'+EVENT_NS,function(e){if(mfp._checkIfClose(e.target)){mfp.close();}});mfp.container=_getEl('container',mfp.wrap);} mfp.contentContainer=_getEl('content');if(mfp.st.preloader){mfp.preloader=_getEl('preloader',mfp.container,mfp.st.tLoading);} var modules=$.magnificPopup.modules;for(i=0;i<modules.length;i++){var n=modules[i];n=n.charAt(0).toUpperCase()+n.slice(1);mfp['init'+n].call(mfp);} _mfpTrigger('BeforeOpen');if(mfp.st.showCloseBtn){if(!mfp.st.closeBtnInside){mfp.wrap.append(_getCloseBtn());}else{_mfpOn(MARKUP_PARSE_EVENT,function(e,template,values,item){values.close_replaceWith=_getCloseBtn(item.type);});_wrapClasses+=' mfp-close-btn-in';}} if(mfp.st.alignTop){_wrapClasses+=' mfp-align-top';} if(mfp.fixedContentPos){mfp.wrap.css({overflow:mfp.st.overflowY,overflowX:'hidden',overflowY:mfp.st.overflowY});}else{mfp.wrap.css({top:_window.scrollTop(),position:'absolute'});} if(mfp.st.fixedBgPos===false||(mfp.st.fixedBgPos==='auto'&&!mfp.fixedContentPos)){mfp.bgOverlay.css({height:_document.height(),position:'absolute'});} if(mfp.st.enableEscapeKey){_document.on('keyup'+EVENT_NS,function(e){if(e.keyCode===27){mfp.close();}});} _window.on('resize'+EVENT_NS,function(){mfp.updateSize();});if(!mfp.st.closeOnContentClick){_wrapClasses+=' mfp-auto-cursor';} if(_wrapClasses) mfp.wrap.addClass(_wrapClasses);var windowHeight=mfp.wH=_window.height();var windowStyles={};if(mfp.fixedContentPos){if(mfp._hasScrollBar(windowHeight)){var s=mfp._getScrollbarSize();if(s){}}} if(mfp.fixedContentPos){if(!mfp.isIE7){}else{$('body, html').css('overflow','hidden');}} var classesToadd=mfp.st.mainClass;if(mfp.isIE7){classesToadd+=' mfp-ie7';} if(classesToadd){mfp._addClassToMFP(classesToadd);} mfp.updateItemHTML();_mfpTrigger('BuildControls');$('html').css(windowStyles);mfp.bgOverlay.add(mfp.wrap).prependTo(mfp.st.prependTo||$(document.body));mfp._lastFocusedEl=document.activeElement;setTimeout(function(){if(mfp.content){mfp._addClassToMFP(READY_CLASS);mfp._setFocus();}else{mfp.bgOverlay.addClass(READY_CLASS);} _document.on('focusin'+EVENT_NS,mfp._onFocusIn);},16);mfp.isOpen=true;mfp.updateSize(windowHeight);_mfpTrigger(OPEN_EVENT);return data;},close:function(){if(!mfp.isOpen)return;_mfpTrigger(BEFORE_CLOSE_EVENT);mfp.isOpen=false;if(mfp.st.removalDelay&&!mfp.isLowIE&&mfp.supportsTransition){mfp._addClassToMFP(REMOVING_CLASS);setTimeout(function(){mfp._close();},mfp.st.removalDelay);}else{mfp._close();}},_close:function(){_mfpTrigger(CLOSE_EVENT);var classesToRemove=REMOVING_CLASS+' '+READY_CLASS+' ';mfp.bgOverlay.detach();mfp.wrap.detach();mfp.container.empty();if(mfp.st.mainClass){classesToRemove+=mfp.st.mainClass+' ';} mfp._removeClassFromMFP(classesToRemove);if(mfp.fixedContentPos){var windowStyles={marginRight:''};if(mfp.isIE7){$('body, html').css('overflow','');}else{windowStyles.overflow='';} $('html').css(windowStyles);} _document.off('keyup'+EVENT_NS+' focusin'+EVENT_NS);mfp.ev.off(EVENT_NS);mfp.wrap.attr('class','mfp-wrap').removeAttr('style');mfp.bgOverlay.attr('class','mfp-bg');mfp.container.attr('class','mfp-container');if(mfp.st.showCloseBtn&&(!mfp.st.closeBtnInside||mfp.currTemplate[mfp.currItem.type]===true)){if(mfp.currTemplate.closeBtn) mfp.currTemplate.closeBtn.detach();} if(mfp.st.autoFocusLast&&mfp._lastFocusedEl){$(mfp._lastFocusedEl).focus();} mfp.currItem=null;mfp.content=null;mfp.currTemplate=null;mfp.prevHeight=0;_mfpTrigger(AFTER_CLOSE_EVENT);},updateSize:function(winHeight){if(mfp.isIOS){var zoomLevel=document.documentElement.clientWidth/window.innerWidth;var height=window.innerHeight*zoomLevel;mfp.wrap.css('height',height);mfp.wH=height;}else{mfp.wH=winHeight||_window.height();} if(!mfp.fixedContentPos){mfp.wrap.css('height',mfp.wH);} _mfpTrigger('Resize');},updateItemHTML:function(){var item=mfp.items[mfp.index];mfp.contentContainer.detach();if(mfp.content) mfp.content.detach();if(!item.parsed){item=mfp.parseEl(mfp.index);} var type=item.type;_mfpTrigger('BeforeChange',[mfp.currItem?mfp.currItem.type:'',type]);mfp.currItem=item;if(!mfp.currTemplate[type]){var markup=mfp.st[type]?mfp.st[type].markup:false;_mfpTrigger('FirstMarkupParse',markup);if(markup){mfp.currTemplate[type]=$(markup);}else{mfp.currTemplate[type]=true;}} if(_prevContentType&&_prevContentType!==item.type){mfp.container.removeClass('mfp-'+_prevContentType+'-holder');} var newContent=mfp['get'+type.charAt(0).toUpperCase()+type.slice(1)](item,mfp.currTemplate[type]);mfp.appendContent(newContent,type);item.preloaded=true;_mfpTrigger(CHANGE_EVENT,item);_prevContentType=item.type;mfp.container.prepend(mfp.contentContainer);_mfpTrigger('AfterChange');},appendContent:function(newContent,type){mfp.content=newContent;if(newContent){if(mfp.st.showCloseBtn&&mfp.st.closeBtnInside&&mfp.currTemplate[type]===true){if(!mfp.content.find('.mfp-close').length){mfp.content.append(_getCloseBtn());}}else{mfp.content=newContent;}}else{mfp.content='';} _mfpTrigger(BEFORE_APPEND_EVENT);mfp.container.addClass('mfp-'+type+'-holder');mfp.contentContainer.append(mfp.content);},parseEl:function(index){var item=mfp.items[index],type;if(item.tagName){item={el:$(item)};}else{type=item.type;item={data:item,src:item.src};} if(item.el){var types=mfp.types;for(var i=0;i<types.length;i++){if(item.el.hasClass('mfp-'+types[i])){type=types[i];break;}} item.src=item.el.attr('data-mfp-src');if(!item.src){item.src=item.el.attr('href');}} item.type=type||mfp.st.type||'inline';item.index=index;item.parsed=true;mfp.items[index]=item;_mfpTrigger('ElementParse',item);return mfp.items[index];},addGroup:function(el,options){var eHandler=function(e){e.mfpEl=this;mfp._openClick(e,el,options);};if(!options){options={};} var eName='click.magnificPopup';options.mainEl=el;if(options.items){options.isObj=true;el.off(eName).on(eName,eHandler);}else{options.isObj=false;if(options.delegate){el.off(eName).on(eName,options.delegate,eHandler);}else{options.items=el;el.off(eName).on(eName,eHandler);}}},_openClick:function(e,el,options){var midClick=options.midClick!==undefined?options.midClick:$.magnificPopup.defaults.midClick;if(!midClick&&(e.which===2||e.ctrlKey||e.metaKey||e.altKey||e.shiftKey)){return;} var disableOn=options.disableOn!==undefined?options.disableOn:$.magnificPopup.defaults.disableOn;if(disableOn){if($.isFunction(disableOn)){if(!disableOn.call(mfp)){return true;}}else{if(_window.width()<disableOn){return true;}}} if(e.type){e.preventDefault();if(mfp.isOpen){e.stopPropagation();}} options.el=$(e.mfpEl);if(options.delegate){options.items=el.find(options.delegate);} mfp.open(options);},updateStatus:function(status,text){if(mfp.preloader){if(_prevStatus!==status){mfp.container.removeClass('mfp-s-'+_prevStatus);} if(!text&&status==='loading'){text=mfp.st.tLoading;} var data={status:status,text:text};_mfpTrigger('UpdateStatus',data);status=data.status;text=data.text;mfp.preloader.html(text);mfp.preloader.find('a').on('click',function(e){e.stopImmediatePropagation();});mfp.container.addClass('mfp-s-'+status);_prevStatus=status;}},_checkIfClose:function(target){if($(target).hasClass(PREVENT_CLOSE_CLASS)){return;} var closeOnContent=mfp.st.closeOnContentClick;var closeOnBg=mfp.st.closeOnBgClick;if(closeOnContent&&closeOnBg){return true;}else{if(!mfp.content||$(target).hasClass('mfp-close')||(mfp.preloader&&target===mfp.preloader[0])){return true;} if((target!==mfp.content[0]&&!$.contains(mfp.content[0],target))){if(closeOnBg){if($.contains(document,target)){return true;}}}else if(closeOnContent){return true;}} return false;},_addClassToMFP:function(cName){mfp.bgOverlay.addClass(cName);mfp.wrap.addClass(cName);},_removeClassFromMFP:function(cName){this.bgOverlay.removeClass(cName);mfp.wrap.removeClass(cName);},_hasScrollBar:function(winHeight){return((mfp.isIE7?_document.height():document.body.scrollHeight)>(winHeight||_window.height()));},_setFocus:function(){(mfp.st.focus?mfp.content.find(mfp.st.focus).eq(0):mfp.wrap).focus();},_onFocusIn:function(e){if(e.target!==mfp.wrap[0]&&!$.contains(mfp.wrap[0],e.target)){mfp._setFocus();return false;}},_parseMarkup:function(template,values,item){var arr;if(item.data){values=$.extend(item.data,values);} _mfpTrigger(MARKUP_PARSE_EVENT,[template,values,item]);$.each(values,function(key,value){if(value===undefined||value===false){return true;} arr=key.split('_');if(arr.length>1){var el=template.find(EVENT_NS+'-'+arr[0]);if(el.length>0){var attr=arr[1];if(attr==='replaceWith'){if(el[0]!==value[0]){el.replaceWith(value);}}else if(attr==='img'){if(el.is('img')){el.attr('src',value);}else{el.replaceWith($('<img>').attr('src',value).attr('class',el.attr('class')));}}else{el.attr(arr[1],value);}}}else{template.find(EVENT_NS+'-'+key).html(value);}});},_getScrollbarSize:function(){if(mfp.scrollbarSize===undefined){var scrollDiv=document.createElement("div");scrollDiv.style.cssText='width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;';document.body.appendChild(scrollDiv);mfp.scrollbarSize=scrollDiv.offsetWidth-scrollDiv.clientWidth;document.body.removeChild(scrollDiv);} return mfp.scrollbarSize;}};$.magnificPopup={instance:null,proto:MagnificPopup.prototype,modules:[],open:function(options,index){_checkInstance();if(!options){options={};}else{options=$.extend(true,{},options);} options.isObj=true;options.index=index||0;return this.instance.open(options);},close:function(){return $.magnificPopup.instance&&$.magnificPopup.instance.close();},registerModule:function(name,module){if(module.options){$.magnificPopup.defaults[name]=module.options;} $.extend(this.proto,module.proto);this.modules.push(name);},defaults:{disableOn:0,key:null,midClick:false,mainClass:'',preloader:true,focus:'',closeOnContentClick:false,closeOnBgClick:true,closeBtnInside:true,showCloseBtn:true,enableEscapeKey:true,modal:false,alignTop:false,removalDelay:0,prependTo:null,fixedContentPos:'auto',fixedBgPos:'auto',overflowY:'auto',closeMarkup:'<button title="%title%" type="button" class="mfp-close">&#215;</button>',tClose:'Close (Esc)',tLoading:'Loading...',autoFocusLast:true}};$.fn.magnificPopup=function(options){_checkInstance();var jqEl=$(this);if(typeof options==="string"){if(options==='open'){var items,itemOpts=_isJQ?jqEl.data('magnificPopup'):jqEl[0].magnificPopup,index=parseInt(arguments[1],10)||0;if(itemOpts.items){items=itemOpts.items[index];}else{items=jqEl;if(itemOpts.delegate){items=items.find(itemOpts.delegate);} items=items.eq(index);} mfp._openClick({mfpEl:items},jqEl,itemOpts);}else{if(mfp.isOpen) mfp[options].apply(mfp,Array.prototype.slice.call(arguments,1));}}else{options=$.extend(true,{},options);if(_isJQ){jqEl.data('magnificPopup',options);}else{jqEl[0].magnificPopup=options;} mfp.addGroup(jqEl,options);} return jqEl;};var INLINE_NS='inline',_hiddenClass,_inlinePlaceholder,_lastInlineElement,_putInlineElementsBack=function(){if(_lastInlineElement){_inlinePlaceholder.after(_lastInlineElement.addClass(_hiddenClass)).detach();_lastInlineElement=null;}};$.magnificPopup.registerModule(INLINE_NS,{options:{hiddenClass:'hide',markup:'',tNotFound:'Content not found'},proto:{initInline:function(){mfp.types.push(INLINE_NS);_mfpOn(CLOSE_EVENT+'.'+INLINE_NS,function(){_putInlineElementsBack();});},getInline:function(item,template){_putInlineElementsBack();if(item.src){var inlineSt=mfp.st.inline,el=$(item.src);if(el.length){var parent=el[0].parentNode;if(parent&&parent.tagName){if(!_inlinePlaceholder){_hiddenClass=inlineSt.hiddenClass;_inlinePlaceholder=_getEl(_hiddenClass);_hiddenClass='mfp-'+_hiddenClass;} _lastInlineElement=el.after(_inlinePlaceholder).detach().removeClass(_hiddenClass);} mfp.updateStatus('ready');}else{mfp.updateStatus('error',inlineSt.tNotFound);el=$('<div>');} item.inlineElement=el;return el;} mfp.updateStatus('ready');mfp._parseMarkup(template,{},item);return template;}}});var hasMozTransform,getHasMozTransform=function(){if(hasMozTransform===undefined){hasMozTransform=document.createElement('p').style.MozTransform!==undefined;} return hasMozTransform;};$.magnificPopup.registerModule('zoom',{options:{enabled:false,easing:'ease-in-out',duration:300,opener:function(element){return element.is('img')?element:element.find('img');}},proto:{initZoom:function(){var zoomSt=mfp.st.zoom,ns='.zoom',image;if(!zoomSt.enabled||!mfp.supportsTransition){return;} var duration=zoomSt.duration,getElToAnimate=function(image){var newImg=image.clone().removeAttr('style').removeAttr('class').addClass('mfp-animated-image'),transition='all '+(zoomSt.duration/1000)+'s '+zoomSt.easing,cssObj={position:'fixed',zIndex:9999,left:0,top:0,'-webkit-backface-visibility':'hidden'},t='transition';cssObj['-webkit-'+t]=cssObj['-moz-'+t]=cssObj['-o-'+t]=cssObj[t]=transition;newImg.css(cssObj);return newImg;},showMainContent=function(){mfp.content.css('visibility','visible');},openTimeout,animatedImg;_mfpOn('BuildControls'+ns,function(){if(mfp._allowZoom()){clearTimeout(openTimeout);mfp.content.css('visibility','hidden');image=mfp._getItemToZoom();if(!image){showMainContent();return;} animatedImg=getElToAnimate(image);animatedImg.css(mfp._getOffset());mfp.wrap.append(animatedImg);openTimeout=setTimeout(function(){animatedImg.css(mfp._getOffset(true));openTimeout=setTimeout(function(){showMainContent();setTimeout(function(){animatedImg.remove();image=animatedImg=null;_mfpTrigger('ZoomAnimationEnded');},16);},duration);},16);}});_mfpOn(BEFORE_CLOSE_EVENT+ns,function(){if(mfp._allowZoom()){clearTimeout(openTimeout);mfp.st.removalDelay=duration;if(!image){image=mfp._getItemToZoom();if(!image){return;} animatedImg=getElToAnimate(image);} animatedImg.css(mfp._getOffset(true));mfp.wrap.append(animatedImg);mfp.content.css('visibility','hidden');setTimeout(function(){animatedImg.css(mfp._getOffset());},16);}});_mfpOn(CLOSE_EVENT+ns,function(){if(mfp._allowZoom()){showMainContent();if(animatedImg){animatedImg.remove();} image=null;}});},_allowZoom:function(){return mfp.currItem.type==='image';},_getItemToZoom:function(){if(mfp.currItem.hasSize){return mfp.currItem.img;}else{return false;}},_getOffset:function(isLarge){var el;if(isLarge){el=mfp.currItem.img;}else{el=mfp.st.zoom.opener(mfp.currItem.el||mfp.currItem);} var offset=el.offset();var paddingTop=parseInt(el.css('padding-top'),10);var paddingBottom=parseInt(el.css('padding-bottom'),10);offset.top-=($(window).scrollTop()-paddingTop);var obj={width:el.width(),height:(_isJQ?el.innerHeight():el[0].offsetHeight)-paddingBottom-paddingTop};if(getHasMozTransform()){obj['-moz-transform']=obj['transform']='translate('+offset.left+'px,'+offset.top+'px)';}else{obj.left=offset.left;obj.top=offset.top;} return obj;}}});_checkInstance();}));