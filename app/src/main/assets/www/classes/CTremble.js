function CTremble(iDuration, iFrequency, iStrength){
    var _bTremble;
    var _bAlternateTremble;
    
    var _iIdInterval;
    var _iCurTrembleIndex;
    
    var _oStartPos;
    var _oParent;
    var _iDuration;
    var _iStrength;
    var _oCurrentElement;
    var _iMultiplier;
    
    this.init = function(iDuration, iFrequency, iStrength){
        _bTremble = false;
        _bAlternateTremble = false;
        _iDuration = iDuration;
        _iStrength = iStrength;
    };
    
    this.startTremble = function(oElement){
        if (_bTremble){
            return false;
        }
            _iMultiplier = 1;
            _oCurrentElement = oElement;
            _iCurTrembleIndex = 0;
            _oStartPos = {x:_oCurrentElement.x, y: _oCurrentElement.y};
            _bTremble = true;
            _iIdInterval = setInterval(function(){_oParent._tremble();},iFrequency);
    };
    
    this._tremble = function(){
        _bAlternateTremble = !_bAlternateTremble;
        
        if(_bAlternateTremble){
            var iSignX = Math.random();
            var iNumberX = _iStrength;
            var iDirX;
            if(iSignX < 0.5){
                iDirX = - iNumberX;             
            } else {
                iDirX = iNumberX;
            }
            var iSignY = Math.random();
            var iNumberY = iStrength;
           
            var iDirY;
            if(iSignY < 0.5){
                iDirY = - iNumberY;             
            } else {
                iDirY = iNumberY;
            }
            
            _iCurTrembleIndex++;
            
            _iMultiplier = _iCurTrembleIndex/iDuration;
            
            _oCurrentElement.x = _oStartPos.x+iDirX*(1-_iMultiplier);
            _oCurrentElement.y = _oStartPos.y+iDirY*(1-_iMultiplier);

        } else {
            _oCurrentElement.x = _oStartPos.x;
            _oCurrentElement.y = _oStartPos.y;

        }
        
        if(_iCurTrembleIndex === _iDuration){
           this.stopTremble();
        }
    };
    
    
    this.stopTremble = function(){
        clearInterval(_iIdInterval);
        _iCurTrembleIndex = 0;
        _bTremble = false;
        _oCurrentElement.x = _oStartPos.x;
        _oCurrentElement.y = _oStartPos.y;
    };
    
    this.isActive = function(){
        return _bTremble;
    };
    
    _oParent = this;
    this.init(iDuration, iFrequency, iStrength);
}

