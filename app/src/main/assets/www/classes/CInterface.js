function CInterface(){
    var _oAudioToggle;
    var _oButExit;
    var _oContainer;
    var _oButFullscreen;
    var _oHelpPanel=null;
    var _bMobileInitialized;
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    var _oContainerScore;
    var _pStartPosContainerScore; 
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosFullscreen;
    var _oButHelp;
    var _pStartPosButHelp;
    var _oTextScore;
    var _oTextBestScore;
    var _oScoreContainer;
    var _oScoreContainerStartPos;
    
    this._init = function(){  
        _oContainer = new createjs.Container();
        _bMobileInitialized = false;
        s_oStage.addChild(_oContainer);
        var oExitX; 
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 10, y: (oSprite.height/2) + 10};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite,_oContainer);
        _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
        
        _pStartPosAudio = {x: _pStartPosExit.x-oSprite.width-10,y: _pStartPosExit.y};
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, _oContainer);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);          
        }

        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        oSprite = s_oSpriteLibrary.getSprite("but_help");
        
        if (_oAudioToggle){
           _pStartPosButHelp = {x: _pStartPosAudio.x-(oSprite.width+10),y:_pStartPosAudio.y};
        }else{
            _pStartPosButHelp = {x: _pStartPosAudio.x, y: _pStartPosAudio.y};
        };
        
        
        _oButHelp = new CGfxButton(_pStartPosButHelp.x,_pStartPosButHelp.y,oSprite,_oContainer);
        _oButHelp.addEventListener(ON_MOUSE_UP,function(){new CPanelTutorial();},this);
        
        
        if (_fRequestFullScreen && !inIframe()){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            _pStartPosFullscreen = {x:_pStartPosButHelp.x-(oSprite.width/2+10),y:_pStartPosButHelp.y};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen,_oContainer);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreen,this);
        }
        
        _oScoreContainer = new createjs.Container();
        _oScoreContainerStartPos = {x: EDGEBOARD_X+12,y: 10};
        _oContainer.addChild(_oScoreContainer);
        _oScoreContainer.x = _oScoreContainerStartPos.x;
        _oScoreContainer.y = _oScoreContainerStartPos.y;
        
        oSprite = s_oSpriteLibrary.getSprite("score_icon");
        var oScoreIcon = new createBitmap(oSprite,oSprite.width,oSprite.height);
        _oScoreContainer.addChild(oScoreIcon);
        
        oSprite = s_oSpriteLibrary.getSprite("best_score_icon");
        var oBestScoreIcon = new createBitmap(oSprite,oSprite.width,oSprite.height);
        oBestScoreIcon.y = oSprite.height+10;
        _oScoreContainer.addChild(oBestScoreIcon);
        
        _oTextScore = new createjs.Text(0, "35px "+PRIMARY_FONT,"#FFFFFF");
        _oTextScore.textAlign = "cemter";
        _oTextScore.textBaseline = "middle";
        _oTextScore.x = +oSprite.width+10;
        _oTextScore.y = oSprite.height/2;
        _oScoreContainer.addChild(_oTextScore);
        
        _oTextBestScore = new createjs.Text(0, "35px "+PRIMARY_FONT,"#FFFFFF");
        _oTextBestScore.textAlign = "cemter";
        _oTextBestScore.textBaseline = "middle";
        _oTextBestScore.x = +oSprite.width+10;
        _oTextBestScore.y = oSprite.height+oSprite.height/2;
        _oScoreContainer.addChild(_oTextBestScore);
        
        var iSavedScore = getItem("score_snakeblocks");
        
        if (iSavedScore){
            _oTextBestScore.text = iSavedScore;
        }
        
        
       this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
    };
    
    this.unload = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }

        _oButExit.unload();
        
        s_oStage.removeChild(_oContainer);
        if (_fRequestFullScreen && !inIframe()) {
            _oButFullscreen.unload();
        }        

        s_oInterface = null;
        
    };
    
    this.refreshScore = function(iScore){
       _oTextScore.text = iScore; 
    };
    
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButHelp.setPosition(_pStartPosButHelp.x-iNewX,_pStartPosButHelp.y+iNewY);
        
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }

        if (_fRequestFullScreen && !inIframe()) {
            _oButFullscreen.setPosition(_pStartPosFullscreen.x - iNewX, _pStartPosFullscreen.y + iNewY);
        }
        
    };
    
    this.setOnTop = function(){
       s_oStage.addChildAt(_oContainer,s_oStage.numChildren); 
    };
    
    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        s_oGame.restartGame();
        $(s_oMain).trigger("restart_level", 1);
    };
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    
this.resetFullscreenBut = function(){
	_oButFullscreen.setActive(s_bFullscreen);
};
    
    this._onExit = function(){
        new CAreYouSurePanel(s_oGame.onExit);
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
    
    s_oInterface = this;
    
    this._init();
    
    return this;
}

var s_oInterface = null;