class ViewDataSource extends Eventful {
	data: ObjectPathResolver;

	constructor(data?: Object) {
		super();

		this.data = new ObjectPathResolver(data || {}, true);
	}

	getAllPropertyNames() {
		return Object.keys(this.data["obj"]);
	}

	getAllProperties(hostObj?: Object) {
		if(JSON.stringify(hostObj) === "{}") return hostObj;

		var dataObj = hostObj || this.data["obj"];
		var ret = {};

		for(var key in dataObj) {
			var keyVal = dataObj[key];
			if(typeof keyVal === "object") {
				ret[key] = this.getAllProperties(keyVal);
			} else {
				ret[key] = keyVal;
			}
		}

		return ret;
	}

	getProperty(name: string) {
		var ret = this.data.get(name);
		if(ret.owner instanceof ViewDataSource) {
			return ret.owner.getProperty( ret.key );
		}
		if(ret.value instanceof Array) return ret.value.slice().map( (v) => !(v instanceof Array) && typeof v === "object" ? this.getAllProperties(v) : v );
		if(typeof ret.value === "object") return this.getAllProperties(ret.value);
		return ret.value;
	}

	setProperty(name: string, value: any) {
		if(name.indexOf(".") > -1) {
			var root = name.split(".").reverse().pop();
			var raw = this.data.getRaw();
			if(raw.hasOwnProperty(root)
			&& raw[root] instanceof ViewDataSource) {
				raw[root].setProperty( name.substr(name.indexOf(".") + 1), value );
				return;
			}
		}

		this.data.set(name, value);
		this.triggerChange( name );
	}

	onChange(name: string, callback: Function) {
		if(name.indexOf(".") > -1) {
			var root = name.split(".").reverse().pop();
			var raw = this.data.getRaw();
			if(raw.hasOwnProperty(root)
			&& raw[root] instanceof ViewDataSource) {
				this.on( root, (source, host) => {
					return callback( name, raw[root].getProperty(
						name.substr(name.indexOf(".") + 1)
					));
				});
			}
		}
		this.on(name, callback);
	}

	triggerChange(name: string) {
		this.trigger(name, this.data.get(name, true).value );
		this.trigger("*", this.getAllProperties() );
	}

	unsetListener(name: string, callback: Function) {
		this.off(name, callback);
	}

	getNamespaceStringRoot(ns: string) { return ns.split(".").reverse().pop() }
}
