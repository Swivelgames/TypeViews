class Eventful {
	_listeners: Object;

	constructor(){
		this._listeners = {};
	}

	on(name: string, func: Function) {
		if(!this._listeners.hasOwnProperty(name)) {
			this._listeners[name] = [func];
			return;
		}
		this._listeners[name].push(func);
	}

	trigger(name: string, payload: any) {
		if(!this._listeners.hasOwnProperty(name)) return;

		var listeners = this._listeners[name];
		for(var func of listeners) {
			func.call(this, name, payload);
		}
	}

	off(name: string, func: Function) {
		var i;
		if(!this._listeners.hasOwnProperty(name)) return;
		if((i = this._listeners[name].indexOf(func)) < 0) return;
		this._listeners[name].splice(i,1);
	}
}
