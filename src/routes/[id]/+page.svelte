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

<h1 class="my-5 p-2 text-4xl style4 inline-block">דף חברה {stockRow.stock.NameHeb}</h1>
<div class="w-fit mx-auto style3">
<!-- <Accordion header="מידע כללי"> -->
	<h3>מידע כללי</h3>
	<p>
		סמל מניה: <strong>{stockRow.stock['SymbolHeb']}</strong> | <strong>{stockRow.stock['SymbolEng']}</strong>
		<br />
		מספר חברה (ח.פ.): {stockRow.stock['CorporateNo']}
		<br />
		סקטור-על: {stockRow.stock['SuperSectorHeb']} סקטור: {stockRow.stock['SectorHeb']} תת-סקטור: {stockRow.stock['SubSectorHeb']}
		<br />
		מדדים: {stockRow.stock['IndicesListHeb']?.map(index => index.Name)?.join(', ') ?? "החברה לא נכללת באף מדד"}
	</p>
	<br />
<!-- </Accordion> -->
{#if stockRow.permits}
	<!-- <Accordion header="היתרי העסקה בשבת"> -->
		{#each stockRow.permits as permit}
		<h3>היתר העסקה בשבת</h3>
		<p>
			תקופה: {permit['D_HETER_THILA']} - {permit['D_HETER_SIYUM']} | 
			עילה: {permit['ILA_TEUR']} {permit['TAT_ILA']} | 
			עובדים: {permit['SACH_HAKOL_OVDIM']} כוננים: {permit['SACH_HAKOL_KONANIM']}
		</p>
		<br />
		{/each}
	<!-- </Accordion> -->
{/if}
{#if stockRow.approvals}
	<!-- <Accordion header="היתרי עסקה"> -->
		{#each stockRow.approvals as approval}
		<h3>היתר עסקה {approval['סוג היתר עסקה']}</h3>
		<span>
			פירוט: {approval['אג"ח וני"ע']}
		</span>
		<br />
		{/each}
	<!-- </Accordion> -->
{/if}
</div>
