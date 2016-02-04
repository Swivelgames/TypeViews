namespace AppViews {
	export class TestView extends View {
		DataSources() {
			return ["TestData"];
			// Should effectively "link" ViewDataSource objects together
			// Using a onChange("*", f) syntax to watch the external objects
			// Adding an additional "getAllProperties" method to get names
			// and values.
		}

		getInitialData() {
			return {
				"text": "foo bar!"
			};
		}

		render() {
			return (`
				<b>{{text}}!! :D {{TestData.content1}}</b>
			`);
		}
	}
}
