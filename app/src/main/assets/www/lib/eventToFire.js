(function(){
	var eventToFire = {};

	eventToFire.events = {};
	eventToFire.registerEvent = function(eventName, callback, staticArgs){
		if(typeof(eventName) != 'string') return false;
		if(typeof(callback) != 'function' && typeof(callback) != 'string') return false;
		if(typeof(this.events[eventName]) == 'undefined')	this.events[eventName] = [];
		this.events[eventName].push({"func":callback, "staticArgs":staticArgs});
		return true;
	}
	eventToFire.fireEvent = function(eventName,args){
		if(typeof(eventName) != 'string') return false;
		if(typeof(this.events[eventName]) == 'undefined') return false;
		for(var i =0; i < this.events[eventName].length;i++){
				this.events[eventName][i]["func"](args, this.events[eventName][i]["staticArgs"]);
		}
		return true;
	}
	eventToFire.getAllEvent = function(){
		return this.events;
	}

	window.eventToFire = eventToFire;
}())


//compatibility playzool/shell
function registerEvent(eventName, callback, args){
	eventToFire.registerEvent(eventName, callback, args);
}
function fireEvent(eventName,args){
	eventToFire.fireEvent(eventName,args);
}
