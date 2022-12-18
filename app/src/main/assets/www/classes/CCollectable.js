function CCollectable (iXPos, iYPos, oSprite, iValue, iIndex ,oParentContainer){
   
   var _oParentContainer;
   var _oContainer;
   var _oCollectable;
   var _iValue;
   var _vPos;
   var _oStartPos;
   var _iRadius;
   var _iHalfRadius;
   var _iRadiusQuadro;
   var _vCurForce;
   var _oText;
   var _oUserData;
   var _iIndex;
   var _bInGame;
   var _iType;
   
   this.init = function(iXPos, iYPos, oSprite, iValue, iIndex ,oParentContainer){
       
       _iValue = iValue;
       _iIndex = iIndex;
       _oParentContainer = oParentContainer;
       _oContainer = new createjs.Container();
       _oContainer.x = iXPos;
       _oContainer.y = iYPos;
       _oParentContainer.addChild(_oContainer);
       _oUserData = {type: COLLECTABLE, value: _iValue, index: iIndex};
       _oCollectable = createBitmap(oSprite,oSprite.width,oSprite.height);
       _oCollectable.regX = oSprite.width/2;
       _oCollectable.regY = oSprite.height/2;
       _oText = new createjs.Text(_iValue, "20px "+PRIMARY_FONT,"#FFFFFF");
       _oText.textBaseline = "middle";
       _oText.textAlign = "center";
       _oText.y = -20;
       _oText.x = +20;
       _bInGame = false; 
       
       _oContainer.addChild(_oCollectable,_oText);
       
       
       _vPos = new CVector2(_oContainer.x,_oContainer.y);
       _oStartPos = {x: iXPos, y: iYPos};
       
       _iRadius = oSprite.width/2;
       _iHalfRadius = _iRadius*0.5;
       _iRadiusQuadro = _iRadius*_iRadius;
       
       _vCurForce = new CVector2(0,0);
       
   };
   
   this.getX = function(){
       return _oContainer.x;
   };
   
   this.getY = function(){
       return _oContainer.y;
   };
   
   this.setUserData = function(oData){
      _oUserData = oData; 
   };
   
   this.getUserData = function(){
      return _oUserData; 
   };
   
   this.setY = function(iY){
       _oContainer.y = iY;
       _vPos.set(_vPos.getX(),iY);
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

    this.setAngle = function (iAngle) {
        _oCollectable.rotation = iAngle;
    };

    this.getHalfRadius = function(){
        return _iHalfRadius;
    };
    
    this.getLocalPos = function () {
        return _oCollectable.localToGlobal(0, 0);
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

    this.vPos = function () {
        return _vPos;
    };

    this.setPos = function (vPos) {
        _vPos.setV(vPos);
    };

    this.getRadius = function () {
        return _iRadius;
    };

    this.getValue = function(){
        return _iValue;
    };

    this.getRadiusQuadro = function () {
        return _iRadiusQuadro;
    };
    
    this.update = function(){
       if (_bInGame){
           //_oContainer.y-= 32;
            this.checkOutStage();
        } 
    };
    
    this.checkOutStage = function(){
       if (_oContainer.y>s_oGame.getYOutRow()){
           _bInGame = false;
           s_oGame.setOutCollectable(this);
       } 
    };
    
    this.getStateInGame = function(){
       return _bInGame; 
    };
    
    this.setInGame = function(bVal){
       _bInGame = bVal; 
    };
   
   this.init(iXPos, iYPos, oSprite, iValue, iIndex, oParentContainer);
   
}