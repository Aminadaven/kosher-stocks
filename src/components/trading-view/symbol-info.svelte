<script>
	import Widget from './widget.svelte';
	export let width = '100%';
	export let symbol = '';
	export let divClass = '';
	const widgetSettings = {
		symbol,
		width,
		locale: 'he_IL',
		colorTheme: 'light',
		isTransparent: false
		//   "largeChartUrl": "http://www.google.com"
	};
</script>

<Widget
	{divClass}
	scriptUrl="external-embedding/embed-widget-symbol-info"
	scriptText={JSON.stringify(widgetSettings)}
/>
