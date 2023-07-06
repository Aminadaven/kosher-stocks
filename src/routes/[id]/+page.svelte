<script>
	import data from '$lib/data/data.json';
	import { page } from '$app/stores';

	const id = $page.params.id;
	const stockRow = data.data[data.index[id]].stock;
</script>
<svelte:head>
	<title>מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת | דף חברה {id}</title>
</svelte:head>

<h1 class="py-7 text-3xl font-bold text-sky-600">דף חברה {id}</h1>
{#each Object.keys(stockRow) as stockProperty}
	<span>
		{stockProperty}: 
		{typeof stockRow[stockProperty] === 'string'
			? stockRow[stockProperty]
			: JSON.stringify(stockRow[stockProperty])}
	</span>
	<br />
{/each}
