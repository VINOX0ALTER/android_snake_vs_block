function CEndPanel(oSpriteBg){ // this is the End panel
    
    var _oBg;
    var _oGroup;
    
    var _oMsgTextBack;
    var _oMsgText;
    var _oScoreTextBack;
    var _oScoreText;
    var _iScore;
    var _oButRestart;
    var _oButHome;
    var _szEndSound;
    
    this._init = function(oSpriteBg,iWinner){ //function init of page game over
        /*
        s_oGame.unload();
        s_oMain.gotoMenu();
        return;
        */
        s_oGame.setPause(true); // <--- we set pause for the game

        //create a rectangle :
        var oShape = new createjs.Shape();
        oShape.graphics.beginFill("#000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        oShape.alpha = 0.01;
        oShape.on("mousedown",this.onMouseDown,this);

        //add image
        _oBg = createBitmap(oSpriteBg);
        var oBgInfo = _oBg.getBounds();
        _oBg.regX = oBgInfo.width/2;
        _oBg.regY = oBgInfo.height/2;
        _oBg.x = CANVAS_WIDTH/2;
        _oBg.y = CANVAS_HEIGHT/2;

        //add text
        _oMsgText = new createjs.Text(""," 50px "+PRIMARY_FONT, "#ffffff");
        _oMsgText.x = CANVAS_WIDTH/2;
        _oMsgText.y = (CANVAS_HEIGHT/2)-68;
        _oMsgText.textAlign = "center";
        _oMsgText.textBaseline = "alphabetic";
        _oMsgText.lineWidth = 550;
        
        _oScoreText = new createjs.Text(""," 40px "+PRIMARY_FONT, "#ffffff");
        _oScoreText.x = CANVAS_WIDTH/2;
        _oScoreText.y = (CANVAS_HEIGHT/2) + 68;
        _oScoreText.textAlign = "center";
        _oScoreText.textBaseline = "alphabetic";
        _oScoreText.lineWidth = 550;
        

        _oGroup = new createjs.Container();
        _oGroup.alpha = 0;
        _oGroup.visible=false;
        
        
        _oGroup.addChild(oShape,_oBg, _oScoreTextBack,_oScoreText,_oMsgTextBack,_oMsgText);


        //add button restart:
        s_oStage.addChild(_oGroup);
        var oSprite = s_oSpriteLibrary.getSprite("but_restart");
        _oButRestart = new CGfxButton(CANVAS_WIDTH/2+100,CANVAS_HEIGHT/2+195,oSprite,_oGroup);

        //add button home:
        oSprite = s_oSpriteLibrary.getSprite("but_home");
        _oButHome = new CGfxButton(CANVAS_WIDTH/2-100,CANVAS_HEIGHT/2+195,oSprite,_oGroup);

    };
    
    this.unload = function(){
        
    };
    
    this.onMouseDown = function(){
        /*s_oGame.unload();
        s_oMain.gotoMenu();*/
    };
    
    this._initListener = function(){
        _oButHome.addEventListener(ON_MOUSE_DOWN,this._onExit,this);
        _oButRestart.addEventListener(ON_MOUSE_DOWN,this._onRestart, this);
    };
    
    this.show = function(iScore){

        var szImg = "200x200.jpg";
            var szTitle = "Congratulations!";
            var szMsg = "You collected <strong>" + _iScore + " points</strong>!<br><br>Share your score with your friends!";
            var szMsgShare = "My score is " + _iScore + " points! Can you do better?";        
            $(s_oMain).trigger("share_event",_iScore, szImg, szTitle, szMsg, szMsgShare);
        
        playSound("game_over",1,false);
        _iScore = iScore;
        
        
        _oMsgText.text = TEXT_GAMEOVER;
        _oScoreText.text = TEXT_SCORE+_iScore;
        
        var iSavedScore = getItem("score_snakeblocks");
        
        if (!iSavedScore){
            iSavedScore = 0;
        }
        
        if (iSavedScore<_iScore){
            saveItem("score_snakeblocks",_iScore);
            _oMsgText.text = TEXT_GAMEOVER_2;
            $(s_oMain).trigger("save_score",_iScore); 
        }
        
        _oGroup.visible = true;
        
        var oParent = this;
        createjs.Tween.get(_oGroup).to({alpha:1 }, 500).call(function() {oParent._initListener();});
        
            $(s_oMain).trigger("show_interlevel_ad");
            $(s_oMain).trigger("end_session");
    };
    
    this._onExit = function(){
        
        _oGroup.off("mousedown",this._onExit);
        s_oStage.removeChild(_oGroup);
        
        
        
        s_oGame.unload();
        s_oMain.gotoMenu();
    };
    
    this._onRestart = function(){
       s_oGame.unload();
       s_oMain.gotoGame();
       s_oStage.removeChild(_oGroup);
        
       
    };
    
    this._init(oSpriteBg);
    
    return this;
}
