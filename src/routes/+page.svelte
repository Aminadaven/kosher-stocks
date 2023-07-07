<script>
	import data from '$lib/data/data.json';
	import { base } from '$app/paths';
	import viewport from '../actions/useViewportAction';
	import Meta from '../components/meta.svelte';

	export let text = '';
	let sortColumn = null;
	let sortDirection = 0; // 0 for unordered, -1 for ascending, 1 for descending
	let stockRows;
	const getShabbatWorkersSum = (stockRow) => {
		const shabbatPermits = stockRow.permits;
		if (!shabbatPermits || shabbatPermits.length == 0) return 'אין לחברה היתר העסקת עובדים בשבת';
		let shabbatWorkersSum = 0;
		for (const permit of shabbatPermits) {
			shabbatWorkersSum += Number(permit?.SACH_HAKOL_OVDIM);
			shabbatWorkersSum += Number(permit?.SACH_HAKOL_KONANIM);
		}
		return shabbatWorkersSum;
	};
	const getIskaApprovaltype = (stockRow) => {
		const approvals = stockRow.approvals;
		if (!approvals || approvals.length == 0) return 'לא נמצא היתר עסקה לחברה';
		return approvals.find((approval) => approval['סוג היתר עסקה'] === 'פרטי') ? 'פרטי' : 'כללי';
	};
	$: {
		if (!data.data) stockRows = [];
		else if (!text) stockRows = Object.values(data.data);
		else {
			const keysToCheck = [
				'NameHeb',
				'NameEng',
				'SymbolHeb',
				'SymbolEng',
				'CompanyNameHeb',
				'CompanyNameEng'
			];
			const lowerCaseText = text.toLowerCase();
			const compareKeyToText = (stockRow) =>
				keysToCheck.some((key) => stockRow.stock[key]?.toLowerCase().includes(lowerCaseText));
			stockRows = Object.values(data.data).filter(compareKeyToText);
		}
		// Apply filtering and sorting when sortColumn changes
		if (sortColumn !== null)
			stockRows = [...stockRows].sort(
				(a, b) => (a.stock[sortColumn] > b.stock[sortColumn] ? 1 : -1) * sortDirection
			);
	}

	// Handle header click event
	const handleHeaderClick = (column) => {
		sortColumn = column;
		if (sortDirection === 0) {
			sortDirection = 1;
		} else if (sortDirection === 1) {
			sortDirection = -1;
		} else {
			sortColumn = null;
			sortDirection = 0;
		}
	};

	const pageSize = 50;
	let position = pageSize;
	const meta = 'מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת';
</script>

<Meta title={meta} desc={meta} />

<h1 class="pb-7 pt-2 text-3xl title">
	מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת
</h1>
<input
	type="text"
	bind:value={text}
	class="w-full custom-border text-center normal"
	placeholder="הזן שם או סמל מניה בעברית או באנגלית כדי לסנן את התוצאות"
/>
<div class="max-h-[500px] overflow-y-auto custom-border">
	<table class="w-full">
		<!-- <table class="w-full table-fixed"> -->
		<thead class="sticky top-0 table-title">
			<tr>
				<th><button on:click={() => handleHeaderClick('NameHeb')}> שם חברה </button></th>
				<th><button on:click={() => handleHeaderClick('SymbolEng')}> סמל </button></th>
				<th><button on:click={() => handleHeaderClick('CorporateNo')}> ח.פ. </button></th>
				<th><button on:click={() => handleHeaderClick('permits')}> סך עובדים בשבת </button></th>
				<th><button on:click={() => handleHeaderClick('approval')}> היתר עסקה </button></th>
			</tr>
		</thead>
		<tbody>
			{#each stockRows.slice(0, position) as stockRow, index}
				{#if index === position - pageSize / 2}
					<tr use:viewport on:enterViewport={() => (position += pageSize)} />
				{/if}
				<tr>
					<td>
						<a href="{base}/{stockRow.stock.CorporateNo}">
							{stockRow.stock.NameHeb}
						</a>
					</td>
					<td>{stockRow.stock.SymbolEng}</td>
					<td>{stockRow.stock.CorporateNo}</td>
					<td>{getShabbatWorkersSum(stockRow)}</td>
					<td>{getIskaApprovaltype(stockRow)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<style lang="postcss">
	table {
		direction: rtl;
	}
</style>
