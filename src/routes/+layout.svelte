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

<div class="text-center pb-[50px] px-[15%]">
	<nav class="pt-5 sticky top-0 style2">
		{#each Object.keys(routes) as route}
			<a href="{base}{routes[route]}" class="px-5"> {route}</a>
		{/each}
	</nav>
	<slot />
</div>
<footer class="footer sticky bottom-3 p-3 bg-neutral text-neutral-content">
	{#each indicesData as indexData}
		{indexData.IndexName}
		<span class={indexData.IsAdditional ? 'text-success' : 'text-error'}>
			{indexData.LastRate} {indexData.Change}%</span
		>
		<div class="divider lg:divider-horizontal" />
	{/each}
</footer>
