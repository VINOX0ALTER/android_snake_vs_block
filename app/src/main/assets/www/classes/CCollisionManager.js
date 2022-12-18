function CCollisionManager (){
    
    this.init = function(){
        
    };
    
    this.collideCircleWithCircle = function(iX1,iY1,iX2,iY2,iMaxDistance){
        var distance = distanceBetween2PointsV2(iX1, iY1, iX2, iY2);
        if (distance < iMaxDistance){
            return true;
        }else {
            return false;
        }
        
    };
    
    this.collideCircleWithEdges = function(oBall,oBox){
        
        var aEdge = oBox.getEdges();
        
           for (var i=0;i<aEdge.length;i++){
                var oInfo = collideEdgeWithCircle(aEdge[i].getModel(),oBall.getVPos(),oBall.getRadius() );
                
                if ( !oInfo ){
                    continue
                }
                    
                    oInfo.closest_point.add(-oBall.getVDir().getX()*oBall.getRadius()*1.001,0);
                    
                    switch (aEdge[i].getUserData().type){
                        
                        case EDGE_BOT:{
                              s_oGame.onBoxBotCollision(oBox);  
                        }break;

                        case EDGE_LEFT:{
                               s_oGame.onLateralCollision(STOPPED_ON_RIGHT,oInfo.closest_point); 
                        }break;

                        case EDGE_RIGHT:{
                               s_oGame.onLateralCollision(STOPPED_ON_LEFT,oInfo.closest_point); 
                        }break;
                        
                    }
                    break;
                }
        };

this.collidePointInRect = function (pX,pY,oRectBounds){
    
       if (pX > oRectBounds.x-oRectBounds.halfWidth && 
           pX < oRectBounds.x+oRectBounds.halfWidth &&
           //pY > oRectBounds.y-oRectBounds.halfHeight &&
           pY < oRectBounds.y+oRectBounds.halfHeight){
         return true;
    }else{
        return false;
    } 
    
};
    
    
    
    
    
    
    /*this.collideCircleWithEdges = function(oCircle,aEdges){
        var oEdge;
        var oPt;
        var iDist;
            for (var i=0;i<aEdges.length;i++){
                oEdge = aEdges[i].getModel();	
                
                var vAFix = new CVector2();
                var vBFix = new CVector2();
                vAFix.setV(oEdge.getPointA());
                vBFix.setV(oEdge.getPointB());

                var v1 = new CVector2();
                v1.setV(oCircle.getVPos());
                v1.subtract(oEdge.getPointA());
                var v2 = new CVector2();	
                v2.setV(oEdge.getPointB());
                v2.subtract(oEdge.getPointA());
                v2.normalize();

                var t = dotProductV2(v2,v1);

                 v2.scalarProduct(t);
                 v2.addV(oEdge.getPointA());
                 oPt = v2;
                
                if ( t >= distanceV2(oEdge.getPointA(),oEdge.getPointB()) ){
                    oPt = vBFix;
                }
                
                if ( t <= 0){
                    oPt = vAFix;
                }

                iDist = Math.sqrt( ( (oPt.getX() - oCircle.getVPos().getX())*(oPt.getX() - oCircle.getVPos().getX()) ) + ( (oPt.getY() - oCircle.getVPos().getY())*(oPt.getY() - oCircle.getVPos().getY()) ) );
                trace(iDist);
                if (oCircle.getRadius()>iDist){
                    
                    trace("COLLISIONE");
                    
                }
            }
        };*/
    
    this.init();
    
};