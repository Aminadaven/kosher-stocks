<script>
	import dataJson from '$lib/data/data.json';
	import { page } from '$app/stores';
	import Meta from '../../components/meta.svelte';
	import Collapse from '../../components/collapse.svelte';

	const id = $page.params.id;
	const stockRow = dataJson.data[dataJson.index[id]];
	const meta = `מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת | דף חברה ${stockRow.stock.NameHeb}`;
</script>

<Meta title={meta} desc={meta} />

<h1 class="my-5 p-2 text-4xl style4 inline-block">דף חברה {stockRow.stock.NameHeb}</h1>
<div class="mx-auto">
	<Collapse header="מידע כללי">
		<p>
			סמל מניה: <strong>{stockRow.stock['SymbolHeb']}</strong> |
			<strong>{stockRow.stock['SymbolEng']}</strong>
			<br />
			מספר חברה (ח.פ.): {stockRow.stock['CorporateNo']}
			<br />
			סקטור-על: {stockRow.stock['SuperSectorHeb']} סקטור: {stockRow.stock['SectorHeb']} תת-סקטור: {stockRow
				.stock['SubSectorHeb']}
		</p>
	</Collapse>
	<br />

	{#if stockRow.companyDetails}
		<Collapse header="פרטי חברה">
			<p>
				{JSON.stringify(stockRow.companyDetails)}
			</p>
		</Collapse>
		<br />
	{/if}
	{#if stockRow.shareHolders}
		<Collapse header="מחזיקי מניה">
			<p>
				{JSON.stringify(stockRow.shareHolders)}
			</p></Collapse
		>
		<br />
	{/if}
	{#if stockRow.financeData}
		<Collapse header="מידע פיננסי">
			<p>
				{JSON.stringify(stockRow.financeData, null, 4)}
			</p></Collapse
		>
		<br />
	{/if}
	{#if stockRow.reports}
		<Collapse header="דיווחים">
			<p>
				{JSON.stringify(stockRow.reports)}
			</p></Collapse
		>
		<br />
	{/if}
	{#if stockRow.tradeData}
		<Collapse header="מידע מסחר">
			<p>
				{JSON.stringify(stockRow.tradeData)}
			</p></Collapse
		>
		<br />
	{/if}
	{#if stockRow.permits}
		<Collapse header="היתרי העסקה בשבת">
			{#each stockRow.permits as permit}
				<h3>היתר העסקה בשבת</h3>
				<p>
					תקופה: {permit.startDate} - {permit.endDate} | עילה: {permit.cause}
					{permit.subCause} | עובדים: {permit.employeesSum} כוננים: {permit.onCallEmployeesSum}
				</p>
				<br />
			{/each}
		</Collapse>
	{/if}
	{#if stockRow.approvals}
		<Collapse header="היתרי עסקה">
			{#each stockRow.approvals as approval}
				<h3>היתר עסקה {approval.type}</h3>
				<span>
					פירוט: {approval.details}
				</span>
				<span>
					הערות: {approval.comments ?? 'אין'}
				</span>
				<br />
			{/each}</Collapse
		>
	{/if}
</div>
