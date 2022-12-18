function CPlayerTail (iXPos, iYPos, oSprite , oPrevTail, oParentContainer){
    
   var _oParentContainer;
   var _vPos;
   var _oUserData;
   var _vPrevPos;
   var _oTail;
   var _oContainer;
   var _bVisible;
   var _bOnMovement;
   var _bMovementDone;
   var _iCounterUpdate;
   var _vCurForce;
   
   this.init = function(iXPos, iYPos, oSprite, oPrevTail ,oParentContainer){
       
       _oParentContainer = oParentContainer;
       _oContainer = new createjs.Container();
       _oParentContainer.addChild(_oContainer);
       _oContainer.x = iXPos;
       _oContainer.y = iYPos;
       _oUserData = {type: TAIL};
       _oTail = createBitmap(oSprite,oSprite.width,oSprite.height);
       _oTail.regX = oSprite.width/2;
       _oTail.regY = oSprite.height/2;
       
       _oContainer.addChild(_oTail);
       
       _vPrevPos = new CVector2(0,0);
       _vPos = new CVector2(_oContainer.x,_oContainer.y);
       _bVisible = true;
       _bOnMovement = false;
       _bMovementDone = false;
       _iCounterUpdate = 0;
   };
   
   this.setUserData = function(oData){
       _oUserData = oData;
   };
   
   this.getUserData = function(){
      return _oUserData; 
   };
   
   this.unload = function () {
        _oParentContainer.removeChild(_oContainer);
    };

    this.setVisible = function (bVisible){
        _oTail.visible = bVisible;
    };

    this.setPosition = function (iXPos, iYPos) {
        _oContainer.x = iXPos;
        _oContainer.y = iYPos;
    };


    this.setAngle = function (iAngle) {
        _oContainer.rotation = iAngle;
    };
    
    this.getLocalPos = function () {
        return _oTail.localToGlobal(0, 0);
    };
    
    this.scale = function (fValue) {
        _oContainer.scaleX = fValue;
        _oContainer.scaleY = fValue;
    };
    
    this.getVPrevPos = function(){
       return _vPrevPos; 
    };

    this.getVPos = function () {
        return _vPos;
    };

    this.setPos = function (vPos) {
        _vPos.setV(vPos);
    };

    this.getBMovementDone = function (){
       // trace("gothcha");
        return _bMovementDone;
    };
    this.update = function(){
        _vPos.subtract(oPrevTail.getVPos());
        _vPos.normalize();
        _vPos.scalarProduct(DIAMETER_PLAYER);
        _vPos.addV(oPrevTail.getVPos());
        _oContainer.x = _vPos.getX();
        _oContainer.y = _vPos.getY();
        //trace(_vPos.getY());
    };
   
   this.init(iXPos, iYPos, oSprite , oPrevTail ,oParentContainer);
};
