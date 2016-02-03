namespace AppViews {
	export class MainView extends View {
		render() {
			return (`
				<main>
					<HeaderView data-title="Page Title"></HeaderView>
					<section>{{children}}</section>
					<FooterView></FooterView>
				</main>
			`);
		}
	}
}
