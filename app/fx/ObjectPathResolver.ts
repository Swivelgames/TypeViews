class ObjectPathResolver {
	constructor(private obj: Object, private createIf?: boolean){}

	getRaw() { return this.obj };

	get(path: string, ignoreDsInstStop?: boolean) {
		return this.resolvePath(path, void 0, void 0, ignoreDsInstStop === void 0 ? true : !ignoreDsInstStop);
	}

	set(path: string, val: any) {
		var obj = this.resolvePath(path);
		return (obj.owner[ obj.key ] = val);
	}

	resolvePath(path: string, progress?: Object, originalPath?: string, stopOnDSinstance?: boolean) {
		if(!progress) progress = this.obj;
		if(!originalPath) originalPath = path;

		if(typeof progress !== "object" || (stopOnDSinstance && progress instanceof ViewDataSource)) return {
			"fullpath": originalPath,
			"key": path,
			"owner": progress,
			"value": void 0
		};

		if(path.indexOf('.') < 0) return {
			"fullpath": originalPath,
			"key": path,
			"owner": progress,
			"value": progress[path]
		};

		var pathParts = path.split(/\./);
		path = pathParts.reverse().pop();

		if(this.createIf===true && progress[path] === void 0) {
			progress[path] = {};
		}

		return this.resolvePath(
			pathParts.reverse().join('.'),
			progress[path],
			originalPath,
			stopOnDSinstance
		);
	}
}
