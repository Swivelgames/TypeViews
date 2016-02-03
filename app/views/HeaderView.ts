namespace AppViews {
	export class HeaderView extends View {
		getInitialData() {
			return {
				"title": "This is the page's title!"
			};
		}

		render() {
			return (`
				<header>
					<h1>{{title}}</h1>
				</header>
			`);
		}
	}
}
