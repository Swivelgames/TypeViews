namespace AppViews {
	export class TestView extends View {
		getInitialData() {
			return {
				"text": "foo bar!"
			};
		}

		render() {
			return (`
				<b>{{text}}!! :D {{testing}}</b>
			`);
		}
	}
}
