<script>
	import data from '$lib/data/data.json';
	import { base } from '$app/paths';
	import alasql from 'alasql';
	import Meta from '../../components/meta.svelte';

	const meta = 'מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת | חיפוש מתקדם ';

	let query = '';
	let stockRows = [{}];

	$: {
		try {
			stockRows = alasql(query, [data?.data]);
		} catch (error) {}
	}
</script>

<Meta title={meta} desc={meta} />

<h1 class="pb-7 pt-2 text-4xl font-bold text-neutral-content">פילטר מתקדם מניות כשרות</h1>
<ul class="text-left">
    {#each Object.keys(data?.data[0] ?? {}) ?? [] as category}
    <li>
        <strong>{category}: </strong>
        <!-- <ol> -->
        {#each Object.keys(data?.data[0][category]) ?? [] as column, index}
            <!-- <li> -->
                {column}, 
				{#if index % 5 === 0}
					<br />
				{/if}
            <!-- </li> -->
        {/each}
        <!-- </ol> -->
    </li>
    {/each}
</ul>
<input
	type="text"
	bind:value={query}
	class="w-full input input-bordered text-center bg-transparent"
	placeholder="חיפוש מתקדם"
/>
<div class="max-h-[520px] overflow-auto">
	<table
		class="table table-fixed table-xs sm:table-sm md:table-md lg:table-lg table-pin-rows text-center static"
	>
		<thead>
			<tr>
                {#each Object.keys(stockRows[0]) as title}
                    <th>{title}</th>
                {/each}
			</tr>
		</thead>
		<tbody class="bg-info">
			{#each stockRows ?? [] as stockRow}
				<tr
					on:click={() => (window.location = `${base}/${stockRow.stock.CorporateNo}`)}
					class="hover cursor-pointer"
				>
                {#each Object.values(stockRow) as value}
                    <td>{value}</td>
                {/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>
