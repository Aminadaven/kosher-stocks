<script>
	import Widget from './widget.svelte';
	export let width = '100%';
	export let symbol = '';
	export let divClass = '';
	const widgetSettings = {
		symbol,
		width,
		colorTheme: 'light',
		isTransparent: false,
		locale: 'he_IL'
		//   "largeChartUrl": "http://www.google.com"
	};
</script>

<Widget
	{divClass}
	scriptUrl="external-embedding/embed-widget-single-quote"
	scriptText={JSON.stringify(widgetSettings)}
/>
