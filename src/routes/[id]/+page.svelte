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

<h1 class="my-5 p-2 text-4xl style4 inline-block">{stockRow.companyDetails.CompanyLongName}</h1>
<div class="mx-auto">
	<Collapse header="מידע כללי">
		<p>
			סמל מניה: <strong>{stockRow.stock.SymbolHeb}</strong> |
			<strong>{stockRow.stock.SymbolEng}</strong>
			<br />
			מספר חברה (ח.פ.): {stockRow.stock.CorporateNo}
			<br />
			סקטור-על: {stockRow.stock.SuperSectorHeb} סקטור: {stockRow.stock.SectorHeb} תת-סקטור: {stockRow
				.stock.SubSectorHeb}
		</p>
	</Collapse>
	<br />

	{#if stockRow.companyDetails}
		<Collapse header="פרטי חברה">
			<p>
				{JSON.stringify(stockRow.companyDetails, null, 4)}
			</p>
		</Collapse>
		<br />
	{/if}
	{#if stockRow.shareHolders}
		<Collapse header="מחזיקי מניה">
			<p>
				{JSON.stringify(stockRow.shareHolders, null, 4)}
			</p></Collapse
		>
		<br />
	{/if}
	{#if stockRow.financeData}
		<Collapse header="מידע פיננסי">
			<!-- <p>
				{JSON.stringify(stockRow.financeData, null, 4)}
			</p> -->
				
<div class="overflow-y-auto">
	<h4 class="">{stockRow.financeData.CurrencyName}</h4>
	<table class="table table-fixed table-xs sm:table-sm md:table-md lg:table-lg table-pin-rows table-pin-cols text-center static">
		<thead>
			<tr>
				<th>שם</th>
				<th>{stockRow.financeData.CurrentPeriod.Title} {stockRow.financeData.CurrentPeriod.IFRS}</th>
				<th>{stockRow.financeData.PreviousPeriod.Title} {stockRow.financeData.PreviousPeriod.IFRS}</th>
				<th>{stockRow.financeData.PreviousYear.Title} {stockRow.financeData.PreviousYear.IFRS}</th>
			</tr>
		</thead>
		<tbody class="bg-info">
			{#each stockRow.financeData.AllRows ?? [] as row, index}
				<tr class="hover">
					<td>{row.Name}</td>
					<td>{row.CurrPeriodValue}</td>
					<td>{row.PrevPeriodValue}</td>
					<td>{row.PrevYearValue}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
		</Collapse>
		<br />
	{/if}
	{#if stockRow.reports}
		<Collapse header="דיווחים">
			<p>
				{JSON.stringify(stockRow.reports, null, 4)}
			</p></Collapse
		>
		<br />
	{/if}
	{#if stockRow.tradeData}
		<Collapse header="מידע מסחר">
			<p>
				{JSON.stringify(stockRow.tradeData, null, 4)}
			</p>
			</Collapse>
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
