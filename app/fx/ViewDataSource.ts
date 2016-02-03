class ViewDataSource {
	data: Object;
	watchers: Object;

	constructor(data?: Object) {
		this.data = data || {};
		this.watchers = {};
	}

	getAllPropertyNames() {
		return Object.keys(this.data);
	}

	getProperty(name: string) {
		return this.data.hasOwnProperty(name) ? this.data[name] : void 0;
	}

	setProperty(name: string, value: any) {
		this.data[name] = value;
		this.triggerChange(name);
	}

	onChange(name: string, callback: Function) {
		if(!this.watchers.hasOwnProperty(name)) {
			this.watchers[name] = [];
		}

		this.watchers[name].push(callback);

		return true;
	}

	unsetListener(name: string, callback: Function) {
		if(this.watchers.hasOwnProperty(name)) {
			var i, watchers = this.watchers[name];

			while( (i = watchers.indexOf(callback)) > -1 ) {
				watchers.splice(i,1);
			}
		}
	}

	triggerChange(name: string) {
		if(this.watchers.hasOwnProperty(name)) {
			for(var callback of this.watchers[name]) {
				callback(name, this.data[name] || void 0);
			}
		}
	}
}
