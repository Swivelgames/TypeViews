class DataSourceLink {
	constructor(private host: ViewDataSource, children?: Array<string>) {
		if(!children) return;

		for(var sourceName of children) {
			this.linkDataSource(sourceName);
		}
	}

	linkDataSource(sourceName: string) {
		if(!DataSources.hasOwnProperty(sourceName)) return;

		var Source = DataSources[sourceName];
		var allProps = Source.getAllProperties();

		this.host.setProperty(sourceName, Source);

		(function(sourceName){
			Source.onChange("*", (n, allProps) => {
				this.host.setProperty(sourceName, Source);
			});
		}).call(this, sourceName);
	}
}
