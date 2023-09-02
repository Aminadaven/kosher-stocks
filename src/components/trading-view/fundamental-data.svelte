<script>
	import Widget from './widget.svelte';
	export let width = '100%';
	export let height = '100%';
	export let symbol = '';
	export let divClass = '';
	const widgetSettings = {
		colorTheme: 'light',
		isTransparent: false,
		//   "largeChartUrl": "http://www.google.com",
		displayMode: 'adaptive',
		symbol,
		width,
		height,
		locale: 'he_IL'
	};
</script>

<Widget
	{divClass}
	scriptUrl="external-embedding/embed-widget-financials"
	scriptText={JSON.stringify(widgetSettings)}
/>
