function CMenu(){
    var _oBg;
    var _oButPlay;
    var _oFade;
    var _oAudioToggle;
    var _oCreditsBut;
    var _oButFullscreen;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _pStartPosCredits;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _oLogoMenu;
    var _pStartPosButPlay;
    
    
    this._init = function(){
        s_b2Players = false;
        if (s_oSoundtrack){
            setVolume(s_oSoundtrack,1);
        }
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
        
        

        var oSprite = s_oSpriteLibrary.getSprite('but_play');
        _pStartPosButPlay = {x: CANVAS_WIDTH/2,y: CANVAS_HEIGHT/2+400};
        _oButPlay = new CGfxButton(_pStartPosButPlay.x,_pStartPosButPlay.y,oSprite,s_oStage);
        _oButPlay.addEventListener(ON_MOUSE_DOWN, this._onButPlayRelease, this);
     
        var oSprite = s_oSpriteLibrary.getSprite('but_info');
        _pStartPosCredits = {x: (oSprite.height/2) + 10, y: (oSprite.height/2) + 10};            
        _oCreditsBut = new CGfxButton((CANVAS_WIDTH/2),CANVAS_HEIGHT -240,oSprite, s_oStage);
        _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onCreditsBut, this);
        
       
       oSprite = s_oSpriteLibrary.getSprite("logo_menu");
       
       _oLogoMenu = createBitmap(oSprite,oSprite.width,oSprite.height);
       _oLogoMenu.regX = oSprite.width/2;
       _oLogoMenu.regY = oSprite.height/2;
       _oLogoMenu.x = CANVAS_WIDTH/2;
       _oLogoMenu.y = CANVAS_HEIGHT/2-100;
       s_oStage.addChild(_oLogoMenu);
     
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2+10), y: (oSprite.height/2) + 10};      
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;

        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }

        if (_fRequestFullScreen && !inIframe()){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen")
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:(oSprite.height/2) + 10};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,false, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreen,this);
        }

        _oFade = new createjs.Shape();
        _oFade.graphics.beginFill("black").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        
        s_oStage.addChild(_oFade);
        
        var oParent = this;
        createjs.Tween.get(_oFade).to({alpha:0}, 1000).call(function(){_oFade.visible = false;});  
        
        if(!s_bStorageAvailable){
            new CMsgBox(TEXT_ERR_LS,s_oStage);
        }
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    
    this.update = function(){
       
    };
    
    
    this.unload = function(){
        s_oStage.removeChild(_oLogoMenu);
        _oButPlay.unload(); 
        _oButPlay = null;
        _oFade.visible = false;
        
        _oCreditsBut.unload();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        if (_fRequestFullScreen && !inIframe()){
                _oButFullscreen.unload();
        }
        
        s_oStage.removeChild(_oBg);
        _oBg = null;
        s_oMenu = null;
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButPlay.setPosition(_pStartPosButPlay.x,_pStartPosButPlay.y-iNewY);
        _oCreditsBut.setPosition(_pStartPosCredits.x + iNewX,iNewY + _pStartPosCredits.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && !inIframe()){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onCreditsBut = function(){
		if(!gradle.enableRate){
			new CCreditsPanel();
		}
		else{
			gradle.event('btn_info_event');
		}
        		
    };
    
    this._onFullscreen = function(){
        if(s_bFullscreen) { 
            _fCancelFullScreen.call(window.document);
            s_bFullscreen = false;
        }else{
            _fRequestFullScreen.call(window.document.documentElement);
            s_bFullscreen = true;
        }
        
        sizeHandler();
    };
    
    
this.resetFullscreenBut = function(){
	_oButFullscreen.setActive(s_bFullscreen);
};
    
    this._onButPlayRelease = function(){
        
        this.unload();
        $(s_oMain).trigger("start_session");
        
            s_oMain.gotoGame();
        
        if (isIOS() && (s_oSoundtrack === null||s_oSoundtrack === undefined)){
            if (DISABLE_SOUND_MOBILE === false || s_bMobile === false) {
                s_oSoundtrack = playSound('soundtrack', 0.4, true);
            }
        }
        
    };
	
    s_oMenu = this;
    
    this._init();
}

var s_oMenu = null;