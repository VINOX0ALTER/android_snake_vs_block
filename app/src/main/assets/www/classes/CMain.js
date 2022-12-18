function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
		s_oStage.preventSelection = false;
        createjs.Touch.enable(s_oStage);
		
	s_bMobile = jQuery.browser.mobile;
        if(s_bMobile === false){
            s_oStage.enableMouseOver(FPS);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.setFPS(FPS);
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();

        //ADD PRELOADER
        _oPreloader = new CPreloader();
		
	
    };
    
    this.preloaderReady = function(){
        
        try{
            saveItem("ls_available","ok");
        }catch(evt){
            // localStorage not defined
            s_bStorageAvailable = false;
        }
        
         s_oMain._loadImages();
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            s_oMain._initSounds();
        }
        _bUpdate = true;
    };
    
    
    this.soundLoaded = function(){
       _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

         if(_iCurResource === RESOURCE_TO_LOAD){
            this._onPreloaderComplete();
         }
    };
    
    this._initSounds = function(){
        var aSoundsInfo = new Array();
        aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        aSoundsInfo.push({path: './sounds/',filename:'press_button',loop:true,volume:1, ingamename: 'press_button'});
        aSoundsInfo.push({path: './sounds/',filename:'take_collectable',loop:true,volume:1, ingamename: 'take_collectable'});
        aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:true,volume:1, ingamename: 'game_over'});
        aSoundsInfo.push({path: './sounds/',filename:'color_0',loop:true,volume:1, ingamename: 'color_0'});
        aSoundsInfo.push({path: './sounds/',filename:'color_1',loop:true,volume:1, ingamename: 'color_1'});
        aSoundsInfo.push({path: './sounds/',filename:'color_2',loop:true,volume:1, ingamename: 'color_2'});
        aSoundsInfo.push({path: './sounds/',filename:'color_3',loop:true,volume:1, ingamename: 'color_3'});
        aSoundsInfo.push({path: './sounds/',filename:'color_4',loop:true,volume:1, ingamename: 'color_4'});
        aSoundsInfo.push({path: './sounds/',filename:'color_5',loop:true,volume:1, ingamename: 'color_5'});
        
        RESOURCE_TO_LOAD += aSoundsInfo.length;
        s_aSounds = new Array();
        for(var i=0; i<aSoundsInfo.length; i++){
            
            s_aSounds[aSoundsInfo[i].ingamename] = new Howl({ 
                                                            src: [aSoundsInfo[i].path+aSoundsInfo[i].filename+'.mp3', aSoundsInfo[i].path+aSoundsInfo[i].filename+'.ogg'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: aSoundsInfo[i].loop, 
                                                            volume: aSoundsInfo[i].volume,
                                                            onload: s_oMain.soundLoaded()
                                                        });
                                   
                                                        
        }
    };

    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this );
        s_oSpriteLibrary.addSprite("but_play","./theme"+gradle.theme+"/but_play.png");
        s_oSpriteLibrary.addSprite("msg_box","./theme"+gradle.theme+"/msg_box.png");
        s_oSpriteLibrary.addSprite("ctl_logo","./theme"+gradle.theme+"/ctl_logo.png");
        s_oSpriteLibrary.addSprite("but_info","./theme"+gradle.theme+"/but_info.png");
        s_oSpriteLibrary.addSprite("but_yes_big","./theme"+gradle.theme+"/but_yes_big.png");
        s_oSpriteLibrary.addSprite("bg_menu","./theme"+gradle.theme+"/bg_menu.jpg"); 
        s_oSpriteLibrary.addSprite("bg_game","./theme"+gradle.theme+"/bg_game.jpg");
        s_oSpriteLibrary.addSprite("but_exit","./theme"+gradle.theme+"/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./theme"+gradle.theme+"/audio_icon.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./theme"+gradle.theme+"/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("ball","./theme"+gradle.theme+"/ball.png");
        s_oSpriteLibrary.addSprite("but_restart","./theme"+gradle.theme+"/but_restart.png");
        s_oSpriteLibrary.addSprite("but_home","./theme"+gradle.theme+"/but_home.png");
        s_oSpriteLibrary.addSprite("but_next","./theme"+gradle.theme+"/but_next.png");
        s_oSpriteLibrary.addSprite("but_no","./theme"+gradle.theme+"/but_no.png");
        s_oSpriteLibrary.addSprite("skip_arrow","./theme"+gradle.theme+"/skip_arrow.png");
        s_oSpriteLibrary.addSprite("skip_arrow_left","./theme"+gradle.theme+"/skip_arrow_left.png");
        s_oSpriteLibrary.addSprite("but_help","./theme"+gradle.theme+"/but_help.png");
        s_oSpriteLibrary.addSprite("logo_menu","./theme"+gradle.theme+"/logo_menu.png");
        s_oSpriteLibrary.addSprite("collectable","./theme"+gradle.theme+"/collectable.png");
        s_oSpriteLibrary.addSprite("boxes","./theme"+gradle.theme+"/boxes.png");
        s_oSpriteLibrary.addSprite("wall","./theme"+gradle.theme+"/wall.png");
        s_oSpriteLibrary.addSprite("hand","./theme"+gradle.theme+"/hand.png");
        s_oSpriteLibrary.addSprite("score_icon","./theme"+gradle.theme+"/icon_score.png");
        s_oSpriteLibrary.addSprite("best_score_icon","./theme"+gradle.theme+"/icon_best_score.png");
        
       
        
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        //console.log("PERC: "+iPerc);
        _oPreloader.refreshLoader(iPerc);
        
        if(_iCurResource === RESOURCE_TO_LOAD){
            this._onPreloaderComplete();
        }
    };
    
    this._onAllImagesLoaded = function(){
        
    };
    
    this._onPreloaderComplete = function(){
        _oPreloader.unload();
            
        if (!isIOS()) {
            s_oSoundtrack = playSound('soundtrack', 0.4, true);
        }
        
        this.gotoMenu();
    };
    
    this.onAllPreloaderImagesLoaded = function(){
        this._loadImages();
    };
    
    this.gotoMenu = function(){
               
        if(typeof(window.ga) != 'undefined'){
            window.ga.trackView('snake_Screen Menu');
        }
                                          eventToFire.fireEvent("c2LayoutChange","gotoMenu");   
        _oMenu = new CMenu();
        _iState = STATE_MENU;
    }; 

    this.gotoGame = function(){
        if(typeof(window.ga) != 'undefined'){
                window.ga.trackView('snake_Screen Game');
            eventToFire.fireEvent("c2LayoutChange","gotoGame");
    }
        _oGame = new CGame(_oData);   						
        _iState = STATE_GAME;
    };
    
    this.gotoSelectPlayers = function(){
         if(typeof(window.ga) != 'undefined'){
                window.ga.trackView('snake_Screen Select player');
            eventToFire.fireEvent("c2LayoutChange","gotoSelectPlayers");                
}
       new CSelectPlayers(); 
    };
    
    this.gotoLevelMenu = function(){
                if(typeof(window.ga) != 'undefined'){
                        window.ga.trackView('snake_Screen level menu');
                    }
       new CLevelMenu();
       _iState = STATE_LEVEL_SELECTION;
                   eventToFire.fireEvent("c2LayoutChange","gotoLevelMenu");       
    };
    
    this.gotoSelectMode = function(){
                if(typeof(window.ga) != 'undefined'){
                window.ga.trackView('snake_Screen select Menu');
            }
       new CSelectMode(); 
                          eventToFire.fireEvent("c2LayoutChange","gotoSelectMode");       
    };
    
    this.gotoHelp = function(){
                if(typeof(window.ga) != 'undefined'){
                        window.ga.trackView('snake_Screen help');
                    }
        _oHelp = new CHelp();
        _iState = STATE_HELP;
                                  eventToFire.fireEvent("c2LayoutChange","gotoHelp");   
    };
	
    this.stopUpdate = function(){
         _bUpdate = false;
         createjs.Ticker.paused = true;
         $("#block_game").css("display","block");
         Howler.mute(true);
    };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");
        if(s_bAudioActive){
             Howler.mute(false);
        }
    };
    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
                
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        if (_iState === STATE_MENU){
            _oMenu.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    if (oData.points_to_win>20){
        POINTS_TO_WIN = 20;
    }else{
        POINTS_TO_WIN = oData.points_to_win;
    }
    OCCURRENCES_LARGE_BONUS = oData.large_bonus_occurrences;
    OCCURRENCES_SHORT_MALUS = oData.short_malus_occurrences;
    OCCURRENCES_SUPER_SHOTS = oData.super_shots_occurrences;
    OCCURRENCES_DOUBLE_BALLS = oData.double_balls_occurrences;
    OCCURRENCES_CRAZY_BALL = oData.crazy_ball_occurrences;
    _oData = oData;
    
    this.initContainer();
}
var s_bMobile;
var s_bAudioActive = true;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_bFullscreen = false;
var s_bStorageAvailable = true;
var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oSoundtrack;
var s_oCanvas;
var s_aSounds;
var s_oScrollStage;
