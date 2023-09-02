<script>
    import { onMount } from "svelte";
    export let divClass = "";
	export let scriptUrl = "";
	export let scriptText = "";

	let container;
	onMount(() => {
		const script = document.createElement('script');
		script.src = `https://s3.tradingview.com/${scriptUrl}.js`;
		script.type = 'text/javascript';
		script.async = true;
		script.innerHTML = scriptText;
		container.appendChild(script);
	});
</script>

<div class="tradingview-widget-container {divClass}" bind:this={container}>
	<div class="tradingview-widget-container__widget" />
</div>
