/**
	GRADLE - KNOWLEDGE IS POWER
    ***** PROPRIETARY CODE *****
    @author : gradle (gradlecode@outlook.com)
	@update: 10/09/2019 10:48:00
	@version_name: gradle-logic
	@version_code: v6.0.0
	copyright @2019
	copyright @2019
*/

var gradle = {
    debug : true,
	isMobile : ( /(ipad|iphone|ipod|android|windows phone)/i.test(navigator.userAgent) ),

	//Ads information :
	//===================
    banner            : 'ca-app-pub-3940256099942544/6300978111', //id placement banner
    interstitial      : 'ca-app-pub-3940256099942544/1033173712', //id placement interstitial

    isTesting         : true, //Ads mode testing. set to false for a production mode.
    enableBanner      : true, //Ads enable the banner. set to false to disable the banner.
    bannerAtBottom    : true, //if false the banner will be at top
    overlap           : false,
	disableBackbutton : true,

	hasRewardedAd  : true,  //enable reward ad

	intervalAds    : 1,     //Ads each interval for example each 3 times

    developer_link : 'https://play.google.com/store/search?q=games',

    enableRate     : false,
    rate_link      : 'https://play.google.com/store/apps/details?id=com.company.game',

    theme          : 2,
    
	//Events manager :
	//================
    event: function(ev, msg){ gradle.process(ev, msg);gradle.log(ev);
        switch(ev){
            case 'first_start':   //First start
                //gradle.showInter();
                break;
			case 'onPlayClick':
                //gradle.showInter();
                break;
			case 'onGameOver':
                gradle.checkInterval() && gradle.showInter();
                break;

			case 'onLogoClick':
                //gradle.showInter();
                break;
			case 'onMoreGameClick':
                gradle.more();
                break;
			case 'show_interlevel_ad':
                //gradle.showInter();
                break;
			case 'share_event':
				//gradle.more();
                break;
            case 'btn_info_event':
                gradle.rate();
                break;
        }
    },
	

    log: function(val){
        gradle.debug && console.log( gradle.isMobile && (typeof val === 'object' && val !== null) ? JSON.stringify(val) : val );
    },
	
	hasRewardedAd: function(){
		return true;
	},

	//Ready : /!\ DO NOT CHANGE, ONLY IF YOU ARE AN EXPERT.
	//=========================
    ready: function() {
        console.log('gradle ready ...');
        if(typeof admob !='undefined'){
            if(gradle.isTesting){
                admob.banner.config({
                    id: gradle.banner,
                    isTesting: true,
                    autoShow: true,
                    overlap: gradle.overlap,
                    offsetTopBar: false,
                    bannerAtTop: !gradle.bannerAtBottom
                });

                admob.interstitial.config({
                    id: gradle.interstitial,
                    isTesting: true,
                    autoShow: false,
                });
            }
            else{
                admob.banner.config({
                    id: gradle.banner,
                    autoShow: true,
                    overlap: gradle.overlap,
                    offsetTopBar: false,
                    bannerAtTop: !gradle.bannerAtBottom
                });

                admob.interstitial.config({
                    id: gradle.interstitial,
                    autoShow: false,
                });
            }
        }
        if(gradle.enableBanner && typeof admob!=='undefined'){
            admob.banner.prepare();
        }
        gradle.prepareInter();
         document.addEventListener('admob.banner.events.LOAD_FAIL', function(event) {
           gradle.log(event);
        });

        document.addEventListener('admob.banner.events.LOAD', function(event) {
           gradle.log(event);
        });

        document.addEventListener('admob.interstitial.events.LOAD_FAIL', function(event) {
           gradle.log(event);
        });

        document.addEventListener('admob.interstitial.events.LOAD', function(event) {
           gradle.log(event);
        });

        document.addEventListener('admob.interstitial.events.OPEN', function(event) {
           gradle.log(event);
           admob.banner.hide();
        });
        document.addEventListener('admob.interstitial.events.CLOSE', function(event) {
           gradle.log(event);
           admob.banner.show();
           admob.interstitial.prepare();
        });

		gradle.disableBackbutton && document.addEventListener("backbutton", function() {}, !1);
        document.addEventListener("visibilitychange", gradle.onVisibilityChanged, false);
		document.addEventListener("mozvisibilitychange", gradle.onVisibilityChanged, false);
		document.addEventListener("webkitvisibilitychange", gradle.onVisibilityChanged, false);
		document.addEventListener("msvisibilitychange", gradle.onVisibilityChanged, false);
		gradle.event('first_start');
		
		gradle.isMobile ? gradle.game_start() : gradle.game_ok();
		
		gradle.hideSplash();
    },
	
	game_ok: function(){
		$(window).on('load', function() {
			gradle.game_start();
		});
	},
	
	game_start: function(){
		var oMain = new CMain({ fullscreen:true, check_orientation:true });
								   
							   
		$(oMain).on("start_session", function(evt) {
			if(getParamValue('ctl-arcade') === "true"){
				parent.__ctlArcadeStartSession();
			}
			gradle.event('onPlayClick');
		});
		 
		$(oMain).on("end_session", function(evt) {
		   if(getParamValue('ctl-arcade') === "true"){
			   parent.__ctlArcadeEndSession();
		   }
		   gradle.event('onGameOver');
		});
		
		$(oMain).on("save_score", function(evt,iScore, szMode) {
		   if(getParamValue('ctl-arcade') === "true"){
			   parent.__ctlArcadeSaveScore({score:iScore, mode: szMode});
		   }
		   gradle.event('save_score');
		});

		
		$(oMain).on("show_interlevel_ad", function(evt) {
		   if(getParamValue('ctl-arcade') === "true"){
			   parent.__ctlArcadeShowInterlevelAD();
		   }
		   gradle.event('show_interlevel_ad');
		});
		
		$(oMain).on("share_event", function(evt, iScore) {
		   if(getParamValue('ctl-arcade') === "true"){
			   parent.__ctlArcadeShareEvent({   img: TEXT_SHARE_IMAGE,
												title: TEXT_SHARE_TITLE,
												msg: TEXT_SHARE_MSG1 + iScore + TEXT_SHARE_MSG2,
												msg_share: TEXT_SHARE_SHARE1 + iScore + TEXT_SHARE_SHARE1});
		   }
		   gradle.event('share_event');
		});
		sizeHandler();
		//s_oGame.setPause(true);
		//s_oGame.setPause(false);
	},

    more: function(){
        (gradle.developer_link!=="")&&window.open(gradle.developer_link);
    },

    rate: function(){
        (gradle.developer_link!=="")&&window.open(gradle.rate_link);
    },

    hideSplash: function(){
        setTimeout(function(){
            if(gradle.isMobile){
                cordova.exec(null, null, "SplashScreen", "hide", []);
            }
        },1500);
    },

    process: function(ev, msg){
        switch(ev){
            case 'first_start':   //First start
                cordova.plugins.firebase.analytics.logEvent("button", {param1: "Login"});
                cordova.plugins.firebase.analytics.setCurrentScreen("Main Screen");
                break;
            case 'onPlayClick':
                cordova.plugins.firebase.analytics.setCurrentScreen("Game Screen");
                break;
            case 'onGameOver':
                cordova.plugins.firebase.analytics.setCurrentScreen("Game Over");
                break;
			case 'onLogoClick':
                cordova.plugins.firebase.analytics.logEvent("button", {param1: "Logo"});
                break;
            case 'onMoreGameClick':
                cordova.plugins.firebase.analytics.logEvent("button", {param1: "More Games"});
                break;
            case 'share_event':
                cordova.plugins.firebase.analytics.logEvent("button", {param1: "Share"});
                break;
            case 'btn_info_event':
                cordova.plugins.firebase.analytics.logEvent("button", {param1: "Info"});
                break;
        }
    },

    prepareInter: function(){
        if(!gradle.isMobile || typeof admob=='undefined' || admob==null) return;
        admob.interstitial.prepare();
    },

    showInter: function(){
        if(!gradle.isMobile || typeof admob=='undefined' || admob==null) return;
        admob.interstitial.show();
    },

    run : function(){
        gradle.isMobile ? document.addEventListener('deviceready', gradle.ready, false) :  gradle.ready();
    },
	
	onVisibilityChanged : function(){
		try{
			if (document.hidden || document.mozHidden || document.webkitHidden || document.msHidden){
				s_oGame.setPause(true);
			}else{
				s_oGame.setPause(false);
			}
		}catch(error){}
	},
	
	currentInterval : 0,
	checkInterval: function(){
		return (++gradle.currentInterval==gradle.intervalAds) ? !(gradle.currentInterval=0) : !1;
	},
	
	buildKey : function(key){
        return "gd.4006."+key;
    },

    getStorage: function(key, default_value){
        var value;
        try {
            value = localStorage.getItem(gradle.buildKey(key));
        }
        catch(error){
			return default_value;
        }
		if(value !== undefined && value !=null){
            value = window.atob(value);
        }
		else{
			value = default_value;
		}
        return value;
    },

    setStorage: function(key, value){
        var v = value;
        if(v !== undefined){
            v = window.btoa(v);
        }
        try{
            localStorage.setItem(gradle.buildKey(key), v);
            return value;
        }
        catch(error){
            return undefined;
        }
    }
};

gradle.run();





