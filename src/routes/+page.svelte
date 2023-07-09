<script>
	import data from '$lib/data/data.json';
	import { base } from '$app/paths';
	import viewport from '../actions/useViewportAction';
	import Meta from '../components/meta.svelte';

	export let text = '';
	let permitDisallowed = false,
		approvalRequired = false;
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
		if (approvals.every((approval) => approval['אג"ח וני"ע'] === 'יש אג"ח - לא מאושר'))
			return 'היתר עסקה לא מאושר';
		return approvals.find((approval) => approval['סוג היתר עסקה'] === 'פרטי') ? 'פרטי' : 'כללי';
	};
	$: {
		if (!data.data) stockRows = [];
		// else if (!text) {
		// 	stockRows = Object.values(data.data);
		// }
		else {
			const keysToCheck = [
				'NameHeb',
				'NameEng',
				'SymbolHeb',
				'SymbolEng',
				'CompanyNameHeb',
				'CompanyNameEng'
			];
			const lowerCaseText = text?.toLowerCase() ?? '';
			const searchFilter = (stockRow) =>
				keysToCheck.some((key) => stockRow.stock[key]?.toLowerCase().includes(lowerCaseText));
			const permitFilter = (stockRow) => {
				if (!permitDisallowed) return true;
				const workers = getShabbatWorkersSum(stockRow);
				return workers === 0 || workers === 'אין לחברה היתר העסקת עובדים בשבת';
			};
			const approvalFilter = (stockRow) => {
				if (!approvalRequired) return true;
				const appprovaltype = getIskaApprovaltype(stockRow);
				return ['פרטי', 'כללי'].includes(appprovaltype); // appprovaltype !== 'לא נמצא היתר עסקה לחברה';
			};
			const allFilters = (stockRow) =>
				searchFilter(stockRow) && permitFilter(stockRow) && approvalFilter(stockRow);
			stockRows = Object.values(data.data).filter(allFilters);
		}
		// Apply filtering and sorting when sortColumn changes
		if (sortColumn && sortDirection !== 0) {
			if (sortColumn === 'permits') {
				stockRows = [...stockRows].sort((a, b) => {
					if (sortDirection === 0) return 0;
					if (a === b) return 0;
					if (a === 'אין לחברה היתר העסקת עובדים בשבת') return -1 * sortDirection;
					if (b === 'אין לחברה היתר העסקת עובדים בשבת') return 1 * sortDirection;
					return (getShabbatWorkersSum(a) - getShabbatWorkersSum(b)) * sortDirection;
				});
			} else if (sortColumn === 'approval') {
				stockRows = sortDirection === 1 ? [...stockRows].sort() : [...stockRows].sort().reverse();
			} else {
				stockRows = [...stockRows].sort(
					(a, b) => (a.stock[sortColumn] > b.stock[sortColumn] ? 1 : -1) * sortDirection
				);
			}
		}
		console.log(stockRows.length);
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

<h1 class="pb-7 pt-2 text-4xl font-bold text-neutral-content">פילטר מניות כשרות</h1>
<!-- <div class="w-full flex flex-row"> -->
<span class="flex flex-row justify-between">
	<input
		type="text"
		bind:value={text}
		class="w-[50%] text-center bg-transparent"
		placeholder="הזן שם או סמל מניה בעברית או באנגלית כדי לסנן את התוצאות"
	/>
	<input
		type="checkbox"
		id="permitFilter"
		on:change={() => (permitDisallowed = !permitDisallowed)}
	/>
	<label class="mx-1" for="permitFilter">רק חברות שלא מעסיקות בשבת</label>
	<input
		type="checkbox"
		id="approvalFilter"
		on:change={() => (approvalRequired = !approvalRequired)}
	/>
	<label class="mx-1" for="approvalFilter">רק חברות עם היתר עסקה</label>
</span>
<!-- </div> -->
<div class="max-h-[500px] overflow-y-auto">
	<table class="w-full">
		<!-- <table class="w-full table-fixed"> -->
		<thead class="sticky top-0 bg-base-300">
			<tr>
				<th><button on:click={() => handleHeaderClick('NameHeb')}> שם חברה </button></th>
				<th><button on:click={() => handleHeaderClick('SymbolEng')}> סמל </button></th>
				<th><button on:click={() => handleHeaderClick('SectorHeb')}> סקטור </button></th>
				<th><button on:click={() => handleHeaderClick('permits')}> סך עובדים בשבת </button></th>
				<th><button on:click={() => handleHeaderClick('approval')}> היתר עסקה </button></th>
			</tr>
		</thead>
		<tbody class="bg-info">
			{#each stockRows?.slice(0, position) ?? [] as stockRow, index}
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
					<td>{stockRow.stock.SectorHeb}</td>
					<td>{getShabbatWorkersSum(stockRow)}</td>
					<td>{getIskaApprovaltype(stockRow)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
