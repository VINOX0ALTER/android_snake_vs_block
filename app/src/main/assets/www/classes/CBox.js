function CBox (iX,iY,iValue,oSprite,iIndex,iType,oParentContainer){
   
   var _oParentContainer;
   var _oContainer;
   var _aEdges;
   var _oBox;
   var _iValue;
   var _oText;
   var _iIndex;
   var _iType;
   var _oParent = this;
   var _bInGame;
   var _iWidth;
   var _iHeight;
   var _iCurrentFrame;
   var _oModBounds;
   var _iHalfWidth;
   var _iHalfHeight;
   var _bHitted;
   var _iCounterHitAnim;
   var _iCounterChangeColor;
   
    this.init = function (iX,iY,iValue,oSprite,iIndex,oParentContainer){ //here the function of initialization of a box
        _oParentContainer = oParentContainer;
        _oContainer = new createjs.Container();
        _oParentContainer.addChild(_oContainer);
        _iValue = iValue;
        _iIndex = iIndex;
        _iCurrentFrame = 0;
        _bHitted = false;
        _iCounterHitAnim = 0;
        _iCounterChangeColor = 0;
        
        if (_iValue){
        
            var oData = {
                images: [oSprite], // we set images of boxes

                //we define width and height of frames
                frames: {width: BOXES_WIDTH, height: BOXES_HEIGHT, regX: BOXES_WIDTH/2, regY: BOXES_HEIGHT/2}
            };

            var oSpriteSheet = new createjs.SpriteSheet(oData);


            _oBox = createSprite(oSpriteSheet,_iCurrentFrame,BOXES_WIDTH/2,BOXES_HEIGHT/2,BOXES_WIDTH,BOXES_HEIGHT);
            _iWidth = BOXES_WIDTH;
            _iHeight = BOXES_HEIGHT;
            _oBox.stop();
            
        }else{
            
            _oBox = createBitmap(oSprite,oSprite.width,oSprite.height);
            _oBox.regX = oSprite.width/2;
            _oBox.regY = oSprite.height/2;
            _iWidth = oSprite.width;
            _iHeight = oSprite.height;
            
        }
        
        _iHalfWidth = _iWidth*0.5;
        _iHalfHeight = _iHeight*0.5;
        
        _oText = new createjs.Text(_iValue," 60px "+PRIMARY_FONT,"#313133");  //number color in box Moath Bahar..
        _oText.textBaseline = "middle";
        _oText.textAlign = "center";
        _iType = iType;
        
        _oContainer.addChild(_oBox,_oText);
        _oContainer.x = iX;
        _oContainer.y = iY;
        
        _bInGame = false;
        
        _aEdges = new Array();
        
        _aEdges[EDGE_BOT] = new CEdge(-(_iWidth/2),_iHeight/2,_iWidth/2,_iHeight/2,1,s_bDebug,{type: EDGE_BOT, index: _iIndex, value: _iValue, group: _iType},_oContainer);
        _aEdges[EDGE_LEFT] = new CEdge(-(_iWidth/2),-(_iHeight/2-10),-(_iWidth/2),(_iHeight/2-10),1,s_bDebug,{type: EDGE_LEFT,index: _iIndex, group: _iType},_oContainer);
        _aEdges[EDGE_RIGHT] = new CEdge((_iWidth/2),(_iHeight/2-10),(_iWidth/2),-(_iHeight/2-10),1,s_bDebug,{type: EDGE_RIGHT, index: _iIndex, group: _iType},_oContainer);
        
        
    };
    
    this.update = function(){
        if (_bInGame){
            this.checkOutStage();
        }
        
        if (_bHitted){
            if (_iCounterHitAnim>2){
                _bHitted = false;
                this.afterHit();
                _iCounterHitAnim = 0;
            }
            _iCounterHitAnim++;
        }
        
    };
    
    this.updateEdgesPos = function(){
        _aEdges[EDGE_LEFT].getModel().set(_oContainer.x-(_iWidth/2),_oContainer.y-(_iHeight/2-10),_oContainer.x-(_iWidth/2),_oContainer.y+(_iHeight/2-10));
        _aEdges[EDGE_RIGHT].getModel().set(_oContainer.x+(_iWidth/2),_oContainer.y+(_iHeight/2-10),_oContainer.x+(_iWidth/2),_oContainer.y-(_iHeight/2-10));
        _aEdges[EDGE_BOT].getModel().set(_oContainer.x-(_iWidth/2),_oContainer.y+_iHeight/2,_oContainer.x+_iWidth/2,_oContainer.y+_iHeight/2);
    };
    
    this.getModBounds = function(){
        return {x: _oContainer.x, y: _oContainer.y, halfWidth: _iHalfWidth+OFFSET_MOD_BOUNDS, halfHeight: _iHalfHeight+OFFSET_MOD_BOUNDS};
    };
    
    this.checkOutStage = function(){
       if (_oContainer.y>s_oGame.getYOutRow()){
           _bInGame = false;
           s_oGame.setOutBoxWall(this);
       } 
    };
    
    this.getX = function(){
       return _oContainer.x; 
    };
    
    this.getY = function(){
       return _oContainer.y; 
    };
    
    this.setValue = function(iValue){
        if (iValue!==0){
            _iValue = iValue;
        }else{
            _iValue = 1;
        }
       this.refreshText();
       this.autoSetColor();
    };
    
    this.getValue = function(){
        return _iValue;
    };
    
    this.subtractValue = function (){
        playSound("color_"+_iCurrentFrame,1,false);
       if (_iValue===1){
           this.setY(s_oGame.getYOutRow());
           _iValue = 0;
           _bInGame = false;
       }else{
           _iValue--; 
           this.onHit();
          this.refreshText();
       }
    };
    
    this.autoSetColor = function(){
       var iSelectedColor;
       
       if (_iValue<16){
           iSelectedColor = EASIEST_COLOR;
       }else if (_iValue<31){
           iSelectedColor = EASY_COLOR;
       }else if (_iValue<46){
           iSelectedColor = MEDIUM_COLOR;
       }else if(_iValue<61){
            iSelectedColor = MEDIUM_HARD_COLOR;
       }else if (_iValue<76){
           iSelectedColor = HARD_COLOR;
       }else{
           iSelectedColor = HARDEST_COLOR;
        }
        
      // if (iSelectedColor!==_iCurrentFrame){
            _iCurrentFrame = iSelectedColor;
            _oBox.gotoAndStop(_iCurrentFrame);
       //}
       
    };
    
    this.onHit = function(){
        
        _iCurrentFrame+=6;
        _oBox.gotoAndStop(_iCurrentFrame);
        _bHitted = true;
    };
    
    this.afterHit = function(){
       //if (_iCurrentFrame>5){
           _iCurrentFrame-=6;
           _oBox.gotoAndStop(_iCurrentFrame);
           this.autoSetColor();
       //} 
    };
    
    this.getType = function(){
       return _iType; 
    };
    
    this.refreshText = function(){
        _oText.text = _iValue;
    };
    
    this.setY = function(iNewY){
        _oContainer.y = iNewY;
    };
    
    this.getEdges = function(){
       return _aEdges;
    };
    
    this.getStateInGame = function(){
       return _bInGame; 
    };
    
    this.setInGame = function(bVal){
       _bInGame = bVal; 
    };
    
    this.setPosition = function (iX,iY){
       _oContainer.x = iX;
       _oContainer.y = iY;
       this.update();
    };
    
    this.moveYEdges = function(iVal){
        for (var i=0;i<_aEdges.length;i++){
                _aEdges[i].moveY(iVal);
        }
    };
    
    this.moveModelY = function(iVal){
        for (var i=0;i<_aEdges.length;i++){
                _aEdges[i].getModel().moveY(iVal);
        }
    };
    
    this.init(iX,iY,iValue,oSprite,iIndex,oParentContainer);
    
};


