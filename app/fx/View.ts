class View {
	viewName: string;
	dom: HTMLElement;
	data: ViewDataSource;
	_render: Function;
	_watchers: Array<Function>;
	ViewData: Object;
	_children: Array<View>;
	contentNodes: Array<Object>;
	dataSourceLink: DataSourceLink;

	constructor(private viewElement: HTMLElement, data?: ViewDataSource) {
		this._children = [];
		this._watchers = [];
		this.viewName = this.constructor["name"];

		this.initData(data);
	}

	initData(data?: ViewDataSource){
		this.data = data || new ViewDataSource(this.getInitialData());

		this.data.setProperty("children", Array.prototype.slice.apply(this.viewElement["childNodes"]));

		this.setDataFromAttributes();

		this.setDataFromSources();
	}

	setDataFromAttributes() {
		var viewAttributes = Array.prototype.slice.apply(
			this.viewElement.attributes
		);

		for(var attr of viewAttributes) {
			var attrName = attr.name;
			if(attrName.substr(0,5) == "data-") {
				this.data.setProperty(attrName.substr(5), attr.value);
			}
		}
	}

	setDataFromSources() {
		if(!this["DataSources"] || typeof this["DataSources"] !== "function") return;

		var otherSources = this.DataSources();

		this.dataSourceLink = new DataSourceLink( this.data, otherSources );
	}

	getInitialData() { return {}; }
	DataSources() { return []; }

	setData(newData: Object) {
		for(var key in newData) {
			this.data.setProperty(key, newData[key]);
		}

		return true;
	}

	set render(func: Function) {
		this._render = func;
	}

	get render():Function {
		return (function() {
			var viewElement = this.viewElement,
				parentElement = viewElement.parentElement,

				renderRet = this._render();

			if(typeof renderRet === "string") {
				renderRet = DOM(renderRet);
			}

			this.viewElement = this.dom = parentElement.insertBefore( renderRet, viewElement );

			parentElement.removeChild(viewElement);

			this.bindDataToDom(true);
		}).bind(this);
	}

	render() {
		return document.querySelector('template[data-view="'+this.viewName+'"]')["content"].firstElementChild.cloneNode(true);
	}

	bindDataToDom(unsetAll?: boolean) {
		var dom = this.dom, contentNodes;

		contentNodes = this.contentNodes = this.getContentNodes(dom);

		for(var content of contentNodes) {
			var contentName = (function(content){
				this.data.onChange(content.name, function(name, val){
					if(!val) val = " ";

					if(content.attributeNode
					&&(!content.attributeNode.nodeValue
					|| !content.attributeNode.ownerElement)) {
						this.data.unsetListener(name, arguments.callee);
						return;
					}

					if(typeof val === "string") {
						if(content.node.nodeType === document.TEXT_NODE) {
							content.node.nodeValue = val;
						} else {
							var parent = content.node.parentNode;
							var newNode = document.createTextNode(val);
							parent.replaceChild(newNode, content.node);
							content.node = newNode;
						}
					} else {
						if(val instanceof Array) {
							var docFrag = document.createDocumentFragment();
							for(var elem of val) {
								docFrag.appendChild(elem);
							}
							content.node.parentNode.replaceChild(docFrag, content.node);
							this.data.unsetListener(name, arguments.callee);
							setTimeout( () => this.data.onChange(content.name, () => this.render() ), 10);
						} else {
							var parent = content.node.parentNode;
							parent.replaceChild(val, content.node);
							content.node = val;
						}
					}
				}.bind(this));

				this.data.setProperty(
					content.name,
					this.data.getProperty(content.name)
				);

				return content.name;
			}).call(this, content);
		}

		DOMUtilities.InitAppViews(dom, this._children);
	}

	getContentNodes(dom: HTMLElement, arr?: Array<any>, attributeNode?: Node) {
		if(arr===void 0) arr = [];

		if(dom.nodeType === document.ELEMENT_NODE
		&& dom.attributes
		&& dom.attributes.length > 0) {
			var nodeAttributes = Array.prototype.slice.apply(dom.attributes);

			for(var attribute of nodeAttributes) {
				this.getContentNodes(attribute, arr, attribute);
			}
		}

		if(dom.nodeType===document.TEXT_NODE) {
			this.parseTextNode(dom, arr, attributeNode);
		} else if(dom.childNodes && dom.childNodes.length > 0) {
			var children = Array.prototype.slice.apply(dom.childNodes);
			for(var child of children) {
				this.getContentNodes(child, arr, attributeNode);
			}
		}

		return arr;
	}

	parseTextNode(textNode: Node, arr: Array<any>, attributeNode?: Node) {
		if(textNode.nodeType !== document.TEXT_NODE) return arr;

		var reg = /\{\{[A-Z0-9_\-\.]+\}\}/ig,
			val = textNode.nodeValue,
			split = val.split(reg),
			matches = val.match(reg),
			newNodes = [];

		for(var x=0;x<split.length;x++) {
			if(x > 0) {
				var match = matches[x-1],
					matchLen = match.length,
					matchName = match.substring(2, matchLen - 2),
					matchNode = document.createTextNode(match);

				newNodes.push(matchNode);

				arr.push({
					name: matchName,
					node: matchNode,
					attributeNode: attributeNode || void 0
				});
			}

			newNodes.push( document.createTextNode(split[x]) );
		}

		if(newNodes.length > 0) {
			DOMUtilities.ReplaceNode(textNode, newNodes);
		}

		return arr;
	}
}
