<script>
    import { onMount } from "svelte";
	export let width = 1000;
	export let height = 500;
	export let symbols = [];
    export let divClass = "";
	const widgetSettings = {
		symbols: symbols,
		chartOnly: false,
		width: width,
		height: height,
		locale: 'he_IL',
		colorTheme: 'light',
		autosize: false,
		showVolume: false,
		showMA: false,
		hideDateRanges: false,
		hideMarketStatus: false,
		hideSymbolLogo: false,
		scalePosition: 'right',
		scaleMode: 'Normal',
		fontFamily: '-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif',
		fontSize: '10',
		noTimeScale: false,
		valuesTracking: '1',
		changeMode: 'price-and-percent',
		chartType: 'area',
		maLineColor: '#2962FF',
		maLineWidth: 1,
		maLength: 9,
		lineWidth: 2,
		lineType: 0,
		dateRanges: ['1d|1', '1m|30', '3m|60', '12m|1D', '60m|1W', '120m|1M', 'ytd|1D', 'all|1M']
	};

	let container;
	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js';
		script.type = 'text/javascript';
		script.async = true;
		script.innerHTML = JSON.stringify(widgetSettings);
		container.appendChild(script);
	});
</script>

<div class={`tradingview-widget-container ${divClass}`} bind:this={container}>
	<div class="tradingview-widget-container__widget" />
</div>
