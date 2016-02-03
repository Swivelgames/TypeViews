namespace DOMUtilities {
	export function InitAppViews(dom: Node, tracker?: Array<View>) {
		var childElems = Array.prototype.slice.apply(dom["children"]);

		for(var child of childElems) {
			var View = Object.keys(AppViews).filter(
				(v) => v.toUpperCase() === child.tagName
			).pop();

			if(!View) {
				if(child["children"] instanceof HTMLCollection) {
					DOMUtilities.InitAppViews(child, tracker);
				}
				continue;
			}

			var viewInstance = new AppViews[View](child); //, DataSources ? DataSources[View] || void 0 : void 0);
			viewInstance.render();
			ViewInstances.push(viewInstance);
			tracker && tracker.push(viewInstance);
		}
	}

	export function ReplaceNode(oldNode: Node, newNodes: Array<Node>) {
		oldNode.nodeValue = newNodes[0].nodeValue;

		var nextNode = oldNode;

		for(var x=1;x<newNodes.length;x++) {
			DOMUtilities.AddAfter(nextNode, newNodes[x]);
			nextNode = newNodes[x];
		}

		return newNodes;
	}

	export function AddAfter(node: Node, newNode: Node){
		node.parentNode.insertBefore(newNode, node.nextSibling);
	}

	export function AddBefore(node: Node, newNode: Node) {
		node.parentNode.insertBefore(newNode, node);
	}
}
function DOM(domStr: string) {
	var temp = document.createElement("div");
	temp.innerHTML = domStr;
	return temp.children[0];
}
