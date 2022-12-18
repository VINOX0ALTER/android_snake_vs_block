function CGame(oData){
    var _bStartGame;
    var _iScore;
    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _bPaused;
    var _oPlayer;
    var _iPrevXMove;
    var _iDistanceToConsume;
    var _aCollectables;
    var _iLastObjIndex;
    var _oCollisionManager;
    var _aBoxes;
    var _oCurrentBox;
    var _iCounterCollideBoxAnimation;
    var _aWalls;
    var _oPatternManager;
    var _iCounterNewRow;
    var _bInitPattern;
    var _iPrevCameraY;
    var _iMaxCollisionBallDistance;
    var _oTremble;
    var _aFreeBoxes;
    var _aFreeWalls;
    var _aFreeCollectables;
    
    this._init = function(){
        
        setVolume("soundtrack",0.1);
        _bStartGame=true;
        _iScore=0;  
        _iPrevXMove = 0;
        _iDistanceToConsume = 0;
        _aCollectables = new Array();
        _aBoxes = new Array();
        _aWalls = new Array();
        _oCurrentBox = null;
        _iCounterCollideBoxAnimation = 0;
        _iCounterNewRow = 0;
        _bInitPattern = false;
        _iPrevCameraY = 0;
        _oTremble = new CTremble(10,30,5);
        _aFreeBoxes = new Array();
        _aFreeWalls = new Array();
        _aFreeCollectables = new Array();
        
        var oSprite = s_oSpriteLibrary.getSprite('bg_game');
        var oBg = createBitmap(oSprite,oSprite.width,oSprite.height);
        s_oStage.addChild(oBg); //Draws on canvas
        
        s_oScrollStage = new createjs.Container();
        s_oStage.addChild(s_oScrollStage);
        
        var oSprite = s_oSpriteLibrary.getSprite("collectable");
        var iCollectableValue;
        
        
        for (var i = 0; i < NUM_ISTANCES_COLLECTABLES; i++) {
            iCollectableValue = Math.floor(i/5);
            if (iCollectableValue<1){
                iCollectableValue = i;
            }
            var oElement = new CCollectable(-CANVAS_WIDTH,CANVAS_HEIGHT,oSprite,iCollectableValue+1,i,s_oScrollStage);
            _aCollectables.push(oElement);
            _aFreeCollectables.push(oElement);
        }
        
        var oSprite = s_oSpriteLibrary.getSprite("boxes");
        for (var i = 0; i < NUM_ISTANCES_BOXES_AND_WALLS; i++){
           var oElement = new CBox(-CANVAS_WIDTH,CANVAS_HEIGHT,15,oSprite,i,BOX,s_oScrollStage)
            _aBoxes.push(oElement);
            _aFreeBoxes.push(oElement);
        };
        
        var oSprite = s_oSpriteLibrary.getSprite("wall");
        for (var i = 0; i < NUM_ISTANCES_BOXES_AND_WALLS; i++){
           var oElement = new CBox(-CANVAS_WIDTH,CANVAS_HEIGHT,null,oSprite,i,WALL,s_oScrollStage)
            _aWalls.push(oElement);
            _aFreeWalls.push(oElement);
        }
        _oPlayer = new CPlayer(PLAYER_START_X,PLAYER_START_Y,s_oSpriteLibrary.getSprite("ball"),s_oSpriteLibrary.getSprite("ball"),s_oScrollStage);
        _oPlayer.vCurForce().set(0,-10);
        
        _oCollisionManager = new CCollisionManager;
        
        _oPatternManager = new CPatternManager();
        
        _iMaxCollisionBallDistance = (_oPlayer.getRadius()+_aCollectables[0].getRadius())*(_oPlayer.getRadius()+_aCollectables[0].getRadius());
        
        
        var oShape = new createjs.Shape();
        oShape.graphics.beginFill("#000000").drawRect(0,0,CANVAS_WIDTH,CANVAS_HEIGHT);
        oShape.alpha = 0.01;
        s_oStage.addChild(oShape);
        
        oShape.on("mousedown",this.onMouseDown);
        oShape.on("pressmove",this.onPressMove);
        
        _oInterface = new CInterface();
        //_oInterface.refreshScore(_iScore);           
        
        console.log(gradle.getStorage('first_play', '1'));
        s_bFirstPlay = gradle.getStorage('first_play', '1')=='1'?true:false;
        
        if (s_bFirstPlay){
            !s_bFirstPlay;
            gradle.setStorage('first_play', '0');
            new CPanelTutorial();
        }
    };
    
    this.setStartGame = function(bVal){
       _bStartGame = bVal; 
    };
    
    
    this.takeCollectable = function(oCollectable){
        playSound("take_collectable",0.5,false);
        oCollectable.setY(CANVAS_HEIGHT+100);
        _oPlayer.addTails(oCollectable.getValue());
    };
  
    this.onPressMove = function(evt){
       _iDistanceToConsume += Math.round((evt.stageX/s_iScaleFactor)-_iPrevXMove);
       _iPrevXMove = evt.stageX/s_iScaleFactor;
    };
        
        
    this.onMouseDown = function(evt){
        _iPrevXMove = evt.stageX/s_iScaleFactor;
    };
        
    this.loadRow = function(aBoxesInfo,aCollectablesInfo,aWallsInfo){
        var oElement;
        
        if (_aFreeBoxes.length>aBoxesInfo.length){
            for (var i=0;i<aBoxesInfo.length;i++){
                oElement = _aFreeBoxes.pop();
                oElement.setPosition(aBoxesInfo[i].x,aBoxesInfo[i].y);
                oElement.setValue(aBoxesInfo[i].value);
                oElement.setInGame(true);
            }
        }
        
        
          if (_aFreeCollectables.length>aCollectablesInfo.length){  
                for (var i=0;i<aCollectablesInfo.length;i++){
                    oElement = _aFreeCollectables.pop();
                    oElement.setPosition(aCollectablesInfo[i].x,aCollectablesInfo[i].y);
                    oElement.setInGame(true);
                }
            }
            
        
          if (_aFreeWalls.length>aWallsInfo.length){
            for (var i=0;i<aWallsInfo.length;i++){
                oElement = _aFreeWalls.pop();
                oElement.setPosition(aWallsInfo[i].x,aWallsInfo[i].y);
                oElement.setInGame(true);
            }
        }
            
    };
    
    this.getPlayerValue = function(){
       return _oPlayer.getNumTails();
    };
    
     
    
    this.unload = function(){
        _bStartGame = false;
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
        }
        
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
           
    };
    
     
    this.setOutBoxWall = function(oElement){
        
        if (oElement.getType()===BOX){
            _aFreeBoxes.push(oElement);
        }else{
            _aFreeWalls.push(oElement);
        }
        
    };
    
    this.setOutCollectable = function(oCollectable){
        _aFreeCollectables.push(oCollectable);
    };
 
    this.onExit = function(){
        $(s_oMain).trigger("end_session");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
        setVolume("soundtrack",0.4);
    };
    
    this._onExitHelp = function () {
         _bStartGame = true;
    };
    
    this.gameOver = function(iWinner){  
        _bStartGame = false;
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            //createjs.Sound.play("game_over"); //DON'T NEED HERE, ENDPANEL ALREADY HAVE IT
        }

        
        _oEndPanel = CEndPanel(s_oSpriteLibrary.getSprite('msg_box'));
        _oEndPanel.show(_iScore);


                    eventToFire.fireEvent("c2LayoutChange","GameOver");
    };
    
    this.update = function(){
        if (_bStartGame){
            
            if (!_bPaused){

                _oPlayer.update(_iDistanceToConsume);
                    s_oScrollStage.y=-(_oPlayer.getY()-PLAYER_START_Y);
                    
                    if (s_oScrollStage.y>_iPrevCameraY+COUNTER_SPAWN_ROWS_COLS){
                        _oPatternManager.getNewRow();
                        _iPrevCameraY += COUNTER_SPAWN_ROWS_COLS;
                    }
            
        }
    }
    };
    
    this.getYNewRow = function(){
       return s_oStage.localToLocal(0,-ROWS_COLS_OFFSET,s_oScrollStage).y;
    };
    
    this.getYOutRow = function(){
       return s_oStage.localToLocal(0,CANVAS_HEIGHT+ROWS_COLS_OFFSET,s_oScrollStage).y;
    };
    
    this.updateCollision = function(){
       var oBox;
       var oWall;
       var iYCollisionPlayerIntervalUp = _oPlayer.getY()-200;
       var iYCollisionPlayerIntervalDown = _oPlayer.getY()+200;
       
       for (var i=0;i<NUM_ISTANCES_BOXES_AND_WALLS;i++){
           
            oBox = _aBoxes[i];
           if (oBox.getY()<iYCollisionPlayerIntervalDown && oBox.getY()>iYCollisionPlayerIntervalUp){
                if (_oCollisionManager.collidePointInRect(_oPlayer.getX(),_oPlayer.getY(),oBox.getModBounds())){
                    oBox.updateEdgesPos();
                     _oCollisionManager.collideCircleWithEdges(_oPlayer,oBox);
                }
           }
           
           oBox.update();
           
        }
        
        for (var i=0;i<NUM_ISTANCES_BOXES_AND_WALLS;i++){
            oWall = _aWalls[i];
            
            if (oWall.getY()<iYCollisionPlayerIntervalDown && oWall.getY()>iYCollisionPlayerIntervalUp){
           
                if (_oCollisionManager.collidePointInRect(_oPlayer.getX(),_oPlayer.getY(),oWall.getModBounds())){
                    oWall.updateEdgesPos();
                     _oCollisionManager.collideCircleWithEdges(_oPlayer,oWall);
                }
            }
            
            oWall.update();
           
        }
        
        iYCollisionPlayerIntervalUp = _oPlayer.getY()-50;
        iYCollisionPlayerIntervalDown = _oPlayer.getY()+50;
        
        for (var i=0;i<_aCollectables.length;i++){
                if (_aCollectables[i].getY()<iYCollisionPlayerIntervalDown && _aCollectables[i].getY()>iYCollisionPlayerIntervalUp){
                        if (_oCollisionManager.collideCircleWithCircle(_oPlayer.getX(),_oPlayer.getY(),_aCollectables[i].getX(),_aCollectables[i].getY(),_iMaxCollisionBallDistance)){
                            this.takeCollectable(_aCollectables[i]);
                        }
                 }
                 
                 _aCollectables[i].update();
            }
            
            
        
    };
    
     this.onBoxBotCollision = function (oColliderObj){
                //oColliderObj.afterHit();
                _oPlayer.setStopY(true);
                _oPlayer.setUpdateTail(false);
                if (oColliderObj.getType()===BOX){
                    if (_iCounterCollideBoxAnimation===4*PHYSICS_ITERATIONS){
                        _iScore++;
                        _oTremble.startTremble(s_oScrollStage);
                         _oPlayer.removeTails();
                         _oInterface.refreshScore(_iScore);
                         oColliderObj.subtractValue();
                         _iCounterCollideBoxAnimation = 0;
                    }
                    _iCounterCollideBoxAnimation ++;
                }
    };
    
    this.onLateralCollision = function(iSense,vClosestPoint){
        
        _oPlayer.setPos(vClosestPoint);
        _iDistanceToConsume = 0;    
        
        switch (iSense){
            
            case STOPPED_ON_RIGHT: {
                    _oPlayer.setStopXRight(true);
            }break;
            
            case STOPPED_ON_LEFT: {
                   _oPlayer.setStopXLeft(true); 
            }break;
            
        }
    };
   
    
    this.moveBoxUp = function(oBox){
        oBox.setY(this.getYOutRow());
        oBox.setValue(19);
        oBox.setInGame(false);
    };
    
    this.addDistance = function(iDistance){
       _iDistanceToConsume+=iDistance; 
    };
    
    this.setDistance = function(iDistance){
       _iDistanceToConsume = iDistance; 
    };
    
    this.setPause = function(bVal){
        _bPaused = bVal;
    };

    s_oGame=this;
    
    POINTS_TO_LOSE = oData.points_to_lose;
    START_SCORE = oData.starting_points;
    
    AD_SHOW_COUNTER = oData.ad_show_counter;
    
    _oParent=this;
    this._init();
}

var s_oGame;
