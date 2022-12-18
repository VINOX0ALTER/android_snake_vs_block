function CPlayer (iXPos, iYPos, oSpriteHead ,oSpriteTail ,oParentContainer){
    
   var _oParentContainer;
   var _oContainer;
   var _oHead;
   var _aTails;
   var _vPos;
   var _oStartPos;
   var _iRadius;
   var _iHalfRadius;
   var _iRadiusQuadro;
   var _vCurForce;
   var _iTailCounter;
   var _oText;
   var _iStepMovement;
   var _oUserData;
   var _oInfoHead;
   var _iOffsetTailY;
   var _bUpdate;
   var _bStopY;
   var _iCounterUpdate;
   var _bMovementDone;
   var _vDir;
   var _bStopXRight;
   var _bStopXLeft;
   var _bUpdateTail;
   var _iXForce;
   
   this.init = function(iXPos, iYPos, oSpriteHead,oSpriteTail, oParentContainer){
       _iTailCounter = LENGTH_START_SNAKE;
       _bMovementDone = false;
       _oParentContainer = oParentContainer;
       _oContainer = new createjs.Container();
       _oContainer.x = iXPos;
       _oContainer.y = iYPos;
       _oParentContainer.addChild(_oContainer);
       _oUserData = {type: PLAYER};
       _oHead = createBitmap(oSpriteHead,oSpriteHead.width,oSpriteHead.height);
       _oHead.regX = oSpriteHead.width/2;
       _oHead.regY = oSpriteHead.height/2;
       _bStopY = false;
       _oText = new createjs.Text(_iTailCounter, "20px "+PRIMARY_FONT,"#FFFFFF");
       _oText.x = 20;
       _oText.y = -30;
       _oInfoHead = {width: oSpriteHead.width, height: oSpriteHead.height, halfWidth: oSpriteHead.width/2, halfHeight: oSpriteHead.height/2};
       _bUpdate = true;
       _iCounterUpdate = 0;
       _aTails = new Array();
       _bUpdateTail = true;
       _iXForce = 0;
       _iOffsetTailY = OFFSET_Y_TAILS;
       for (var i=0;i<NUM_ISTANCES_TAILS-1;i++){
           if (i===0){
                _aTails.push(new CPlayerTail(iXPos, iYPos+(_iOffsetTailY*(i+1)), oSpriteTail,this, _oParentContainer));
            }else{
                _aTails.push(new CPlayerTail(iXPos, iYPos+(_iOffsetTailY*(i+1)), oSpriteTail,_aTails[i-1], _oParentContainer));
            }
                
          if (i>_iTailCounter-2){
              _aTails[i].setVisible(false);
          }
       };
       
       _oContainer.addChild(_oHead,_oText);
       
       _vPos = new CVector2(_oContainer.x,_oContainer.y);
       _oStartPos = {x: iXPos, y: iYPos};
       
       _iRadius = oSpriteHead.width/2;
       _iHalfRadius = _iRadius*0.5;
       _iRadiusQuadro = _iRadius*_iRadius;
       
       _vDir = new CVector2();
       
       _vCurForce = new CVector2(0,0);
   };
   
   this.getX = function(){
      return _oContainer.x; 
   };
   
   this.getY = function(){
       return _oContainer.y;
   };
   
   this.getNumTails = function(){
       return _iTailCounter;
    };
   
   this.setUserData = function(oData){
       _oUserData = oData;
   };
   
   this.getUserData = function(){
      return _oUserData; 
   };
   
   this.addTails = function(iNumberOfTails){
       _iTailCounter += iNumberOfTails;
       this.refreshText();
       this.refreshTails();
   };
   
   this.refreshText = function(){
      _oText.text = _iTailCounter; 
   };
   
   this.getVCurForce = function(){
      return _vCurForce; 
   };
   
   this.getVPos = function(){
      return _vPos; 
   };
   
   this.removeTails = function(){
      if (_iTailCounter===1){
            s_oGame.gameOver(0);
            _oHead.visible = false;
            _oText.alpha = 0;
      }else{
            _iTailCounter--;
            this.refreshText();
            this.refreshTails();
      }
   };
   
   this.refreshTails = function(){
      for (var i=0;i<_aTails.length;i++){
          if (i<_iTailCounter-1){
              _aTails[i].setVisible(true);
          }else{
               _aTails[i].setVisible(false);
          }
      } 
   };
   
   this.unload = function () {
        _oParentContainer.removeChild(_oContainer);
    };

    this.setVisible = function (bVisible) {
        _oContainer.visible = bVisible;
    };

    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };

    this.resetPos = function () {
        _oContainer.x = _oStartPos.x;
        _oContainer.y = _oStartPos.y;
        _vPos.set(_oContainer.x, _oContainer.y);
        _vCurForce.set(0, 0);
    };

    this.getMovement = function(){
       if (_vCurForce.getY()!==0){
           return true;
       }else{
           return false;
       }
    };

    this.setAngle = function (iAngle) {
        _oHead.rotation = iAngle;
    };

    this.getHalfRadius = function(){
        return _iHalfRadius;
    };
    
    this.getLocalPos = function () {
        return s_oScrollStage.localToLocal(_oContainer.x, _oContainer.y, s_oStage);
    };
    
    this.scale = function (fValue) {
        _oContainer.scaleX = fValue;
        _oContainer.scaleY = fValue;
    };

    this.getScale = function () {
        return _oContainer.scaleX;
    };
    
    this.vCurForce = function () {
        return _vCurForce;
    };

    this.getForce = function () {
        return _iXForce;
    };

    this.setPos = function (vPos) {
        _vPos.setV(vPos);
    };

    this.getRadius = function () {
        return _iRadius;
    };

    this.getRadiusQuadro = function () {
        return _iRadiusQuadro;
    };

    this.updateSpritePosition = function () {
        _oContainer.x = _vPos.getX();
        _oContainer.y = _vPos.getY();
    };
    
    this.getBMovementDone = function (){
       return _bMovementDone; 
    };
    
    this.update = function(iDistanceToConsume){
        if (_bUpdate){
            this.updateMovement(iDistanceToConsume);
            this.updateSpritePosition();
            this.updateTails();
        }
    };
    
    this.updateTails = function(){
       for (var i=0;i<_aTails.length;i++){
                _aTails[i].update();
       }
    };
    
    this.setUpdate = function(bVal){
        _bUpdate = bVal;
    };
    
    this.updateMovement = function(iDistanceToConsume){
        var iFixedXStep;
         _iStepMovement = Math.abs(iDistanceToConsume/DISTANCE_PLAYER_FACTOR);
        
            if (_iStepMovement>LIMIT_PLAYER_STEP){
                _iStepMovement = 50;
            }
        
        
        if (iDistanceToConsume>0){
            if (_vPos.getX()+_iStepMovement<CANVAS_WIDTH - (EDGEBOARD_X+2+_oInfoHead.halfWidth)){
                    _vCurForce.add(+_iStepMovement,0);
                    s_oGame.addDistance(-_iStepMovement);
            }else {
                    iFixedXStep = (CANVAS_WIDTH - (EDGEBOARD_X+2+_oInfoHead.halfWidth))-(_vPos.getX());
                    _vCurForce.add(iFixedXStep,0);
                    s_oGame.setDistance(0);
            }
        }else if (iDistanceToConsume<0){
            if (_vPos.getX()-_iStepMovement>EDGEBOARD_X+2+_oInfoHead.halfWidth){
                    _vCurForce.add(-_iStepMovement,0);
                    s_oGame.addDistance(+_iStepMovement);
            }else {
                iFixedXStep = (EDGEBOARD_X+2+_oInfoHead.halfWidth)-(_vPos.getX());
                _vCurForce.add(iFixedXStep,0);
                    s_oGame.setDistance(0);
            }
        }
        
        if (_bStopY){
                _vCurForce.set(_vCurForce.getX(),0);
            }
        
        _iXForce = _vCurForce.getX();
        
        var iXDir;
        var iYDir;
        if (_vCurForce.getX()>0){
            iXDir = 1;
        }else if(_vCurForce.getX()===0){
            iXDir = 0;
        }else{
            iXDir = -1;
        }
        
        if (_vCurForce.getY()>0){
            iYDir = 1;
        }else if(_vCurForce.getY()===0){
            iYDir = 0;
        }else{
            iYDir = -1;
        }
        
        _vDir.set(iXDir,iYDir);
        
        _bStopY = false;
        
        _vCurForce.scalarDivision(PHYSICS_ITERATIONS);
        
        for (var i=0;i<PHYSICS_ITERATIONS;i++){

                _vPos.addV(_vCurForce);
                s_oGame.updateCollision();
        }
        
        _vCurForce.set(0,-PLAYER_SPEED);
        
        _bMovementDone = false;
        
        if (_iCounterUpdate===FRAME_TO_SKIP_PLAYER_AND_TAIL){
            _bMovementDone = true;
            _iCounterUpdate = 0;
        }
        _iCounterUpdate+=STEP_FRAME_TO_SKIP;
        
        _bStopXRight = false;
        _bStopXLeft = false;
        _bUpdateTail = !_bStopY;
    };
   
    
    this.getVDir = function(){
        return _vDir;
    };
    
    this.getStateStopY = function (){
       return _bStopY; 
    };
    
    this.setStopY = function(bVal){
       _bStopY = bVal; 
    };
   
   this.setStopXLeft = function(bVal){
      _bStopXLeft = bVal; 
   };
   
   this.setStopXRight = function(bVal){
      _bStopXRight = bVal; 
   };
   
   this.setUpdateTail = function (bVal){
      _bUpdateTail = bVal; 
   };
   
   this.init(iXPos, iYPos, oSpriteHead ,oSpriteTail ,oParentContainer);
};