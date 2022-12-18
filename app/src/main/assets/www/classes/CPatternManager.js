function CPatternManager (){
    var _bFirstSpawn;
    var _iCounterSpawn;
    var _iDifficulty;
    
    this.init = function(){
        _bFirstSpawn = false;
        _iCounterSpawn = 18;
        _iDifficulty = 0;
    };
    
    this.getBooleanFirstSpawn = function(){
        return _bFirstSpawn;
    };
    
    this.getNewRow = function(){
         var aBoxesInfo = new Array();
         var aCollectablesInfo = new Array();
         var aWallsInfo = new Array();
         var iRandom;
         var aValues;
         var iPlayerValue;
         var iX;
         var iValue;
         var aRandomValues = new Array; 
        
        iPlayerValue = s_oGame.getPlayerValue();
        
        switch (_iDifficulty){
            
            case 0: { //4 risolvibili
                    
                    aRandomValues[0] = randomIntBetween(1,iPlayerValue-1);
                    aRandomValues[1] = randomIntBetween(1,iPlayerValue-1);
                    aRandomValues[2] = randomIntBetween(1,iPlayerValue-1);
                    aRandomValues[3] = randomIntBetween(iPlayerValue-1,iPlayerValue+5);
                    aRandomValues[4] = randomIntBetween(1,iPlayerValue-1);
                    
            }break
            
            case 1: { //3 risolvibili
                    
                    aRandomValues[0] = randomIntBetween(1,iPlayerValue-1);
                    aRandomValues[1] = randomIntBetween(iPlayerValue-3,iPlayerValue+5);
                    aRandomValues[2] = randomIntBetween(iPlayerValue-2,iPlayerValue+30);
                    aRandomValues[3] = randomIntBetween(1,iPlayerValue-1);
                    aRandomValues[4] = randomIntBetween(1,iPlayerValue-1);
                    
            }break
            
            case 2: { //2 risolvibili
                    
                    aRandomValues[0] = randomIntBetween(1,iPlayerValue-1);
                    aRandomValues[1] = randomIntBetween(iPlayerValue-3,iPlayerValue+5);
                    aRandomValues[2] = randomIntBetween(iPlayerValue-2,iPlayerValue+30);
                    aRandomValues[3] = randomIntBetween(iPlayerValue-1,iPlayerValue+55);
                    aRandomValues[4] = randomIntBetween(1,iPlayerValue-1);
                    
            }break
            
            default: {
                    aRandomValues[0] = randomIntBetween(1,iPlayerValue-1);
                    aRandomValues[1] = randomIntBetween(iPlayerValue-3,iPlayerValue+5);
                    aRandomValues[2] = randomIntBetween(iPlayerValue-2,iPlayerValue+30);
                    aRandomValues[3] = randomIntBetween(iPlayerValue-1,iPlayerValue+55);
                    aRandomValues[4] = randomIntBetween(1,iPlayerValue+35);
            }break
        }
        
        aValues = new Array();
        
        if (_iCounterSpawn===18){
            
            aValues.push(aRandomValues[0]);
            aValues.push(aRandomValues[1]);
            aValues.push(aRandomValues[2]);
            aValues.push(aRandomValues[3]);
            aValues.push(aRandomValues[4]);
            
            this.shuffle(aValues);
            
            for (var i=0;i<ROW_PATTERN_BOXES_2;i++){
                aBoxesInfo.push({x: X_CELL_0+(ROWS_COLS_OFFSET*i), y: s_oGame.getYNewRow(), value: aValues[i]});
            }
            
            _iCounterSpawn = 0; 
            _iDifficulty++;
            
        } else if (_iCounterSpawn%2===0){
            iRandom = randomIntBetween(1,100);
            
            if (iRandom>10){
                iRandom = randomIntBetween(1,100);
                
                if (iRandom>49){
                    iValue = aRandomValues[2];
                    aBoxesInfo.push({x: this.getRandomX(), y: s_oGame.getYNewRow(),value: iValue});
                    
                }else{
                    for (var i=0;i<ROW_PATTERN_BOXES_1;i++){
                        aValues.push(aRandomValues[0]);
                        
                        this.shuffle(aValues);
                        
                        aBoxesInfo.push({x: this.getRandomX(), y: s_oGame.getYNewRow(), value: aValues[i]});
                        
                        if (i===1&&aBoxesInfo[0].x===aBoxesInfo[i].x){
                                aBoxesInfo.splice(i,1);
                                i=0;
                        }
                        
                    }
                }
                
            }
            
            for (var i=0;i<NUM_CELLS_PER_ROWS;i++){
                iX = X_CELL_0+(ROWS_COLS_OFFSET*i);
                
                if (!this.getBusyCell(iX,aBoxesInfo)){
                    iRandom = randomIntBetween(1,100);
                    
                    if (iRandom>89){
                        
                        aCollectablesInfo.push({x: iX, y: s_oGame.getYNewRow()});
                        
                    }
                    
                    
                }
                
            }
            
        }else{
            
            for (var i=0;i<NUM_CELLS_PER_ROWS;i++){
            
                    iRandom = randomIntBetween(1,100);

                    if (iRandom<20){
                        aCollectablesInfo.push({x: X_CELL_0+(ROWS_COLS_OFFSET*i), y: s_oGame.getYNewRow()});
                    }else if (iRandom<40){
                        if (i!==0){
                            aWallsInfo.push({x: X_CELL_0+((ROWS_COLS_OFFSET*i)-WALL_OFFSET),y: s_oGame.getYNewRow()});
                        }
                    }
                    
            }
        }
        
        
        s_oGame.loadRow(aBoxesInfo,aCollectablesInfo,aWallsInfo);
        
        _iCounterSpawn++;
        
       /*var aBoxesInfo = new Array();
       for (var i=0;i<5;i++){
            aBoxesInfo.push({x: X_CELL_0+(ROWS_COLS_OFFSET*i), y: s_oGame.getYNewRow(), value: 1});
       }
       s_oGame.loadRow(aBoxesInfo,[],[]);*/
    };
    
    
    this.getRandomX = function(){
       var iRandom = randomIntBetween(1,100);
       var iX;
       
       if (iRandom<20){
           iX = X_CELL_0;
       }else if (iRandom<40){
           iX = X_CELL_0+ROWS_COLS_OFFSET;
       }else if (iRandom<60){
           iX = X_CELL_0+(ROWS_COLS_OFFSET*2);
       }else if (iRandom<80){
           iX = X_CELL_0+(ROWS_COLS_OFFSET*3);
       }else if (iRandom<=100){
           iX = X_CELL_0+(ROWS_COLS_OFFSET*4);
       }
       
       return iX;
       
    };
    
    this.shuffle = function (aValues){
        var j, x, i;
        for (i = aValues.length; i; i--) {
            j = Math.floor(Math.random() * i);
            x = aValues[i - 1];
            aValues[i - 1] = aValues[j];
            aValues[j] = x;
        } 
    };
    
    this.getBusyCell = function(iXToValute,array){
        var bBusy = false;
        
        for (var i=0;i<array.length;i++){
            if (iXToValute===array[i].x){
                bBusy = true;
            }
        }
        
        return bBusy;
        
    };
    
    
    this.init();
    
};