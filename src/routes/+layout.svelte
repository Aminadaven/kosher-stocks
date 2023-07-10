<script>
	import '../app.css';
	import { base } from '$app/paths';
	import { onMount } from 'svelte';

	const routes = { 'עמוד ראשי': '/', אודות: '/about' };

	let indicesData = [];
	const fetchData = async () => {
		const response = await fetch('https://mayaapi.tase.co.il/api/Index/Indices', {
			headers: {
				accept: 'application/json, text/plain, */*',
				'accept-language': 'he-IL',
				'x-maya-with': 'allow',
				Referer: 'https://maya.tase.co.il/'
			}
		});
		if (!response.ok) return;
		indicesData = await response.json();
	};
	onMount(fetchData);
</script>

<nav class="navbar bg-base-300 justify-center top-0">
	{#each Object.keys(routes) as route}
		<a href="{base}{routes[route]}" class="px-5 text-xl link link-hover"> {route}</a>
	{/each}
</nav>
<div class="text-center pb-12 px-0 sm:px-16 2xl:px-72">
	<slot />
</div>
<footer class="hidden md:grid items-center footer justify-center bottom-0 p-3 bg-neutral text-neutral-content join">
	{indicesData[0]?.TradeDate}
	{indicesData[0]?.TradeTime}
	<div class="divider md:divider-horizontal" />
	{#each indicesData as indexData}
		{indexData.IndexName}
		<span class={'join-item' + (indexData?.Change >= 0 ? 'text-success-content' : 'text-error')}>
			{indexData.LastRate} {indexData?.Change ?? 0}%</span
		>
	{/each}
</footer>
