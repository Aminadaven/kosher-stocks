<script>
	import data from '$lib/data/data.json';
	import { base } from '$app/paths';
	import viewport from '../actions/useViewportAction';
	import Meta from '../components/meta.svelte';
	import ToggleFilter from '../components/toggle-filter.svelte';
	// import SingleTicker from '../components/trading-view/single-ticker.svelte';
	import alasql from 'alasql';

	let text = '';
	let permitDisallowed = false,
		approvalRequired = false;
	let sortColumn = null;
	let sortDirection = 0; // 0 for unordered, -1 for ascending, 1 for descending

	// Handle header click event
	const handleHeaderClick = (column) => {
		sortColumn = column;
		sortDirection++;
		if (sortDirection >= 2) sortDirection = -1;
	};

	const pageSize = 50;
	let position = pageSize;
	let sectors = [...new Set(data.data.map((row) => row.stock.SectorHeb))].sort();
	sectors.unshift('הכל');
	let sector;
	let stockRows;
	const getShabbatWorkersSum = (stockRow) => {
		const shabbatPermits = stockRow.permits;
		if (!shabbatPermits || shabbatPermits.length == 0) return 'אין לחברה היתר העסקת עובדים בשבת';
		let shabbatWorkersSum = 0;
		for (const permit of shabbatPermits) {
			shabbatWorkersSum += Number(permit?.employeesSum);
			shabbatWorkersSum += Number(permit?.onCallEmployeesSum);
		}
		return shabbatWorkersSum;
	};
	const getIskaApprovaltype = (stockRow) => {
		const approvals = stockRow.approvals;
		if (!approvals || approvals.length == 0) return 'לא נמצא היתר עסקה לחברה';
		if (approvals.every((approval) => approval.details === 'יש אג"ח - לא מאושר'))
			return 'היתר עסקה לא מאושר';
		return approvals.find((approval) => approval.type === 'פרטי') ? 'פרטי' : 'כללי';
	};

	$: {
		if (text.startsWith('SQL: ')) {
			// console.log(alasql('select * from ?', [data.data]));
			try {
				stockRows = alasql(`select * from ? where ${text.substring(5)}`, [data.data]);
				break $;
			} catch (error) {}
		}
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
			keysToCheck.some((key) => stockRow.stock[key]?.toLowerCase().trim().includes(lowerCaseText));
		const permitFilter = (stockRow) => {
			if (!permitDisallowed) return true;
			const workers = getShabbatWorkersSum(stockRow);
			return workers === 0 || workers === 'אין לחברה היתר העסקת עובדים בשבת';
		};
		const approvalFilter = (stockRow) => {
			if (!approvalRequired) return true;
			const appprovaltype = getIskaApprovaltype(stockRow);
			// return ['פרטי', 'כללי'].includes(appprovaltype);
			return appprovaltype !== 'לא נמצא היתר עסקה לחברה';
		};
		const sectorFilter = (stockRow) =>
			!sector || sector === 'הכל' || stockRow.stock.SectorHeb === sector;
		const allFilters = (stockRow) =>
			searchFilter(stockRow) &&
			permitFilter(stockRow) &&
			approvalFilter(stockRow) &&
			sectorFilter(stockRow);
		stockRows = Object.values(data.data).filter(allFilters);

		if (!sortColumn) break $;
		// Apply filtering and sorting when sortColumn changes
		if (sortColumn === 'permits') {
			stockRows = stockRows.sort((a, b) => {
				if (sortDirection === 0) return 0;
				const aSum = getShabbatWorkersSum(a);
				const bSum = getShabbatWorkersSum(b);
				if (aSum === bSum) return 0;
				if (aSum === 'אין לחברה היתר העסקת עובדים בשבת') return -1 * sortDirection;
				if (bSum === 'אין לחברה היתר העסקת עובדים בשבת') return 1 * sortDirection;
				return (aSum > bSum ? 1 : -1) * sortDirection;
			});
		} else if (sortColumn === 'approval') {
			stockRows = stockRows.sort((a, b) => {
				if (sortDirection === 0) return 0;
				const aSum = getIskaApprovaltype(a);
				const bSum = getIskaApprovaltype(b);
				if (aSum === bSum) return 0;
				return (aSum > bSum ? 1 : -1) * sortDirection;
			});
		} else if (sortColumn === 'MarketValue') {
			stockRows = stockRows.sort(
				(a, b) => (a.companyDetails.MarketValue - b.companyDetails.MarketValue) * sortDirection
			);
		} else {
			stockRows = stockRows.sort(
				(a, b) => (a.stock[sortColumn] > b.stock[sortColumn] ? 1 : -1) * sortDirection
			);
		}
	}

	const meta = 'מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת';
</script>

<Meta title={meta} desc={meta} />

<h1 class="pb-7 pt-2 text-4xl font-bold text-neutral-content">פילטר מניות כשרות</h1>

<span class="flex flex-row justify-between flex-wrap md:flex-nowrap">
	<input
		type="text"
		bind:value={text}
		class="input input-bordered text-center bg-transparent w-1/2 md:w-1/3"
		placeholder="חיפוש"
	/>

	<select
		bind:value={sector}
		id="sectorSelect"
		class="select select-bordered w-5/12 lg:w-1/3 xl:w-1/5 ml-2 mr-2"
	>
		<option disabled selected value="">סקטור</option>
		{#each sectors as sector}
			<option value={sector}>{sector}</option>
		{/each}
	</select>

	<ToggleFilter
		short="העסקה בשבת"
		label="רק חברות שלא מעסיקות בשבת"
		on:change={() => (permitDisallowed = !permitDisallowed)}
	/>

	<ToggleFilter
		short="היתר עסקה"
		label="רק חברות עם היתר עסקה"
		on:change={() => (approvalRequired = !approvalRequired)}
	/>
</span>

<div class="max-h-[520px] overflow-auto">
	<table
		class="table table-zebra table-fixed table-xs sm:table-sm md:table-md lg:table-lg table-pin-rows text-center static"
	>
		<thead>
			<tr>
				<th><button on:click={() => handleHeaderClick('NameHeb')}> שם חברה </button></th>
				<th><button on:click={() => handleHeaderClick('SymbolEng')}> סמל </button></th>
				<th><button on:click={() => handleHeaderClick('SectorHeb')}> סקטור </button></th>
				<th><button on:click={() => handleHeaderClick('MarketValue')}> שווי שוק</button></th>
				<th><button on:click={() => handleHeaderClick('permits')}> סך עובדים בשבת </button></th>
				<th><button on:click={() => handleHeaderClick('approval')}> היתר עסקה </button></th>
			</tr>
		</thead>
		<tbody class="bg-info">
			{#each stockRows?.slice(0, position) ?? [] as stockRow, index}
				{#if index === position - pageSize / 2}
					<tr use:viewport on:enterViewport={() => (position += pageSize)} />
				{/if}
				<tr class="hover border-hidden">
					<td><a href="{base}/{stockRow.stock.CorporateNo}">{stockRow.stock.NameHeb}</a></td>
					<td>{stockRow.stock.SymbolEng}</td>
					<td>{stockRow.stock.SectorHeb}</td>
					<td>{stockRow.companyDetails.MarketValue}</td>
					<td>{getShabbatWorkersSum(stockRow)}</td>
					<td>{getIskaApprovaltype(stockRow)}</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
