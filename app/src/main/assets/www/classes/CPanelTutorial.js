function CPanelTutorial (bFirstPlay){
    
    var _oContainer;
    var _oPanel;
    var _oButNext;
    var _oButBack;
    var _oButSkip;
    var _iCurrentPage;
    var _oContainerPage;
    var _iLastPag;
    var _oParent = this;
    var _bEndlessTween;
    
    this.init = function () {
        s_bFirstPlay = false;
        s_oGame.setPause(true);
        _iLastPag = 2;
        var oSprite;
        var shape = new createjs.Shape();
        shape.graphics.beginFill("#000000").drawRect(-(CANVAS_WIDTH/2),-(CANVAS_HEIGHT/2),CANVAS_WIDTH,CANVAS_HEIGHT);
        shape.alpha = 0.7;
        shape.on("mousedown",this.onOver,this);
        _oContainerPage = new createjs.Container();
        _iCurrentPage = 0;
        _oContainer = new createjs.Container();
        _oContainer.x = CANVAS_WIDTH/2;
        _oContainer.y = CANVAS_HEIGHT/2;
        _oContainer.addChild(shape);
        _oContainer.alpha = 0;
        oSprite = s_oSpriteLibrary.getSprite("msg_box");
        _oPanel = new createBitmap(oSprite);
        _oPanel.regX = oSprite.width/2;
        _oPanel.regY = oSprite.height/2;
        _oPanel.alpha = 0.8;
        _oContainer.addChild(_oPanel);
        s_oStage.addChild(_oContainer);
        oSprite = s_oSpriteLibrary.getSprite("skip_arrow");
        _oButNext = new CGfxButton(350,0,oSprite,_oContainer);
        _oButNext.addEventListener(ON_MOUSE_DOWN,this.onButNext,this);
        oSprite = s_oSpriteLibrary.getSprite("skip_arrow_left");
        _oButBack = new CGfxButton(-350,0,oSprite,_oContainer);
        _oButBack.addEventListener(ON_MOUSE_DOWN,this.onButBack,this);
        _oButSkip = new CGfxButton(0,_oContainer.getBounds().height/2,s_oSpriteLibrary.getSprite("but_next"),_oContainer);
        _oButSkip.addEventListener(ON_MOUSE_DOWN,this.onButSkip,this);
        this.loadPage(_iCurrentPage);
        new createjs.Tween.get(_oContainer).to({alpha: 1},500);
        
    };
    
    this.loadPage = function (iPage){
        var oText;
        var oSprite;
        var oImage0;
        var oImage1;
        var oImage2;
        var oImage3;
        var oText1;
        var oText2;
        switch (iPage){
            
            
            case 0: 
                oText = new createjs.Text(TEXT_TUTORIAL_1," 31px "+PRIMARY_FONT,"#ffffff");
                oText.lineWidth = 500;
                oText.y = -150;
                oText.textAlign = "center";
                oSprite = s_oSpriteLibrary.getSprite("hand");
                _bEndlessTween = true;
                oImage0 = createBitmap(oSprite,oSprite.width,oSprite.height);
                oImage0.regX = oSprite.width/2;
                oImage0.regY = oSprite.height/2;
                oImage0.x = 0;
                oImage0.y = 20;
                this.oTweenHand(oImage0);
                _oContainerPage.addChild(oText,oImage0);
                _oContainer.addChild(_oContainerPage);
                break;
                
            case 1:
                
                    oText = new createjs.Text(TEXT_TUTORIAL_2," 31px "+PRIMARY_FONT,"#ffffff");
                    oText.lineWidth = 500;
                    oText.y = -155;
                    oText.textAlign = "center";
                    _oContainerPage.addChild(oText); 
                    break;
                
            case 2:
                _bEndlessTween = false;
                oText = new createjs.Text(TEXT_TUTORIAL_3," 31px "+PRIMARY_FONT,"#ffffff");
                oText.lineWidth = 500;
                oText.y = -80;
                oText.textAlign = "center";
                
                _oContainerPage.addChild(oText);
                break;
         }
    };
    
    this.oTweenHand = function(oBitmap){
        var oStartPos = {x: oBitmap.x, y: oBitmap.y};
        if (_bEndlessTween){
            new createjs.Tween.get(oBitmap)
                    .to({x: oBitmap.x+200},800)
                    .to({x: oStartPos.x},800)
                    .to({x: oBitmap.x-200},800)
                    .to({x: oStartPos.x},800)
                    .wait(1500)
                    .call(function(){
                        _oParent.oTweenHand(oBitmap);
                    });
        }
    };
    
    this.onButNext = function(){
        if (_iCurrentPage===_iLastPag){
          _iCurrentPage= 0;  
        }else{
            _iCurrentPage++;
        }
            _oContainerPage.removeAllChildren();
            this.loadPage(_iCurrentPage);
    };
    
    this.onButBack = function(){
        if (_iCurrentPage===0){
            _iCurrentPage = _iLastPag;
        }else{
            _iCurrentPage--;
        }
       _oContainerPage.removeAllChildren();
       this.loadPage(_iCurrentPage);
    };
    
    this.onButSkip = function(){
        new createjs.Tween.get(_oContainer).to({alpha: 0},500).call(function(){
            s_oStage.removeChild(_oContainer);
            s_oGame.setPause(false);
        });
    };
    
    this.onOver = function(){
        
    };
    
    this.init();
}