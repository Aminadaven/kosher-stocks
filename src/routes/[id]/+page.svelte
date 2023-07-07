<script>
	import dataJson from '$lib/data/data.json';
	import { page } from '$app/stores';
	import Accordion from '../../components/accordion.svelte';
	import Meta from '../../components/meta.svelte';

	const id = $page.params.id;
	const stockRow = dataJson.data[dataJson.index[id]];
	const meta = `מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת | דף חברה ${stockRow.stock.NameHeb}`;
</script>

<Meta title={meta} desc={meta} />

<h1 class="py-7 text-3xl title">דף חברה {id}</h1>
<Accordion header="מידע כללי">
	{#each Object.keys(stockRow.stock).filter(name => !name.endsWith("Eng")) as stockProperty}
		<span>
			{stockProperty}:
			{typeof stockRow.stock[stockProperty] === 'string'
				? stockRow.stock[stockProperty]
				: JSON.stringify(stockRow.stock[stockProperty])}
		</span>
		<br />
	{/each}</Accordion
>
{#if stockRow.permits}
	<Accordion header="היתרי העסקה בשבת">
		{#each stockRow.permits as permit}
			{#each Object.keys(permit) as stockProperty}
				<span>
					{stockProperty}: {permit[stockProperty]}
				</span>
				<br />
			{/each}
		{/each}
	</Accordion>
{/if}
{#if stockRow.approvals}
	<Accordion header="היתר עסקה">
		{#each stockRow.approvals as approval}
			{#each Object.keys(approval) as stockProperty}
				<span>
					{stockProperty}: {approval[stockProperty]}
				</span>
				<br />
			{/each}
		{/each}
	</Accordion>
{/if}
