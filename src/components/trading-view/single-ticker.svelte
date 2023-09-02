<script>
	import Widget from './widget.svelte';
	export let width = '100%';
	export let symbol = '';
	export let url = '/';
	export let divClass = '';
	const widgetSettings = {
		symbol,
		width,
		colorTheme: 'light',
		isTransparent: true,
		locale: 'he_IL',
		largeChartUrl: url
	};
</script>

<Widget
	{divClass}
	scriptUrl="external-embedding/embed-widget-single-quote"
	scriptText={JSON.stringify(widgetSettings)}
/>
