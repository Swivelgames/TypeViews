namespace AppViews {
	export class FooterView extends View {
		getInitialData() {
			return {
				"company": "Joseph Dalrymple"
			};
		}

		render() {
			return (`
				<footer>
					Copyright &copy; 2015 {{company}}
				</footer>
			`);
		}
	}
}
