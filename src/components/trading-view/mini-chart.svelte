<script>
	import Widget from './widget.svelte';
	export let width = '100%';
	export let height = '100%';
	export let symbol = '';
	export let divClass = '';
	const widgetSettings = {
		symbol,
		width,
		height,
		locale: 'he_IL',
		dateRange: '12M',
		colorTheme: 'light',
		isTransparent: false,
		autosize: false,
		// "largeChartUrl": "http://www.google.com",
		noTimeScale: false,
		chartOnly: false
	};
</script>

<Widget
	{divClass}
	scriptUrl="external-embedding/embed-widget-mini-symbol-overview"
	scriptText={JSON.stringify(widgetSettings)}
/>
