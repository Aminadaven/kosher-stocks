<script>
	import dataJson from '$lib/data/data.json';
	import iskaApproval from '$lib/assets/iska-approval.png';
	import shabbatPermit from '$lib/assets/shabbat-permit.jpg';
	import tase from '$lib/assets/tase.png';
	import maya from '$lib/assets/maya.jpg';
	import { page } from '$app/stores';
	import Meta from '../../components/meta.svelte';
	import Collapse from '../../components/collapse.svelte';
	import LineChart from '../../components/line-chart.svelte';
	import Chart from 'chart.js/auto';

	const id = $page.params.id;
	const stockRow = dataJson.data[dataJson.index[id]];
	const meta = `מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת | דף חברה ${stockRow.stock.NameHeb}`;

	let canvas;

	// 	const data = {
	//   labels: [
	//     'Red',
	//     'Blue',
	//     'Yellow'
	//   ],
	//   datasets: [{
	//     label: 'My First Dataset',
	//     data: [300, 50, 100],
	//     backgroundColor: [
	//       'rgb(255, 99, 132)',
	//       'rgb(54, 162, 235)',
	//       'rgb(255, 205, 86)'
	//     ],
	//     hoverOffset: 4
	//   }]
	// };
</script>

<Meta title={meta} desc={meta} />

<!-- <h1 class="my-5 p-2 text-4xl inline-block">{stockRow.companyDetails.CompanyLongName}</h1> -->

<div class="hero bg-base-200 rounded-3xl my-5">
	<!-- <div class="hero min-h-screen bg-base-200"> -->
	<div class="hero-content text-center">
		<div class="">
			<!-- <div class="max-w-md"> -->
			<h1 class="text-5xl font-bold">{stockRow.companyDetails.CompanyLongName}</h1>
			<p class="py-3">
				{stockRow.companyDetails.Description}
				<br />
			</p>
			<div class="stats stats-vertical lg:stats-horizontal shadow py-3">
				<div class="stat place-items-center">
					<div class="stat-title">סמל מניה</div>
					<div class="stat-value">
						<strong>{stockRow.stock.SymbolHeb}</strong> |
						<strong>{stockRow.stock.SymbolEng}</strong>
					</div>
					<!-- <div class="stat-desc">desc</div> -->
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">מספר חברה (ח.פ.)</div>
					<div class="stat-value">{stockRow.stock.CorporateNo}</div>
					<!-- <div class="stat-desc text-secondary">desc</div> -->
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">סקטור</div>
					<div class="stat-value">
						<!-- {stockRow.stock.SuperSectorHeb}
			<br />
			{stockRow.stock.SectorHeb} <br /> -->
						{stockRow.stock.SubSectorHeb}
					</div>
					<!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">שווי שוק</div>
					<div class="stat-value">{stockRow.companyDetails.MarketValue}</div>
					<!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
				</div>

				{#if stockRow.companyDetails.Site}
					<div class="stat place-items-center">
						<div class="stat-title">אתר</div>
						<div class="stat-value">
							<a href={stockRow.companyDetails.Site} class="link link-hover"
								>{stockRow.companyDetails.Site}</a
							>
						</div>
						<!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
					</div>
				{/if}
			</div>
		</div>
	</div>
</div>

<div class="flex flex-row justify-between content-center">
	<a
		href={`https://maya.tase.co.il/company/${stockRow.stock.IssueNo}?view=reports`}
		class="link link-hover bg-info rounded-2xl"
		>דוחות באתר מאיה
		<img src={maya} class="rounded-b-2xl" alt="דוחות באתר מאיה" />
	</a>
	{#if stockRow.approvals}
		<div class="card card-side card-compact w-fit glass">
			<figure><img src={iskaApproval} alt="היתר עסקה" /></figure>
			<div class="card-body">
				{#each stockRow.approvals as approval}
					<h2 class="card-title">היתר עסקה {approval.type}</h2>
					{approval.details}
					{#if approval.comments}
						<div class="justify-end">
							{approval.comments}
						</div>
					{/if}
				{/each}
			</div>
		</div>
		<br />
	{/if}

	{#if stockRow.permits}
		<div class="card card-side card-compact w-fit glass">
			<figure class="w-fit h-full max-w-[220px]">
				<img src={shabbatPermit} alt="היתרי העסקה בשבת" />
			</figure>
			<div class="card-body">
				{#each stockRow.permits as permit}
					<h2 class="card-title">היתר העסקה בשבת</h2>
					<p>
						תקופה: {permit.startDate} - {permit.endDate}
						<br />
						עילה: {permit.cause}
						{permit.subCause}
						<br />
						עובדים: {permit.employeesSum} כוננים: {permit.onCallEmployeesSum}
					</p>
				{/each}
			</div>
		</div>
		<br />
	{/if}
</div>
<br />

<!-- <div class="mx-auto">
	{#if stockRow.shareHolders}
		<Collapse header="מחזיקי מניה">
			<p>
				{JSON.stringify(stockRow.shareHolders, null, 4)}
			</p></Collapse
		>
		<br />
	{/if}
</div> -->

{#if stockRow.shareHolders}
	<h2 class=" bg-success rounded-t-xl font-bold text-xl">מחזיקי מניה</h2>
	<!-- <br /> -->
	<div class="flex flex-row text-center justify-around">
		<!-- <canvas bind:this={canvas} /> -->
		<!-- <LineChart data={stockRow.shareHolders} /> -->
		{#each stockRow.shareHolders as shareHolder}
			<span class="mx-1">
				{shareHolder.HolderName} : {shareHolder.Percentage}%
			</span>
			<!-- <div class="border-8 border-black" style:width={shareHolder.Percentage +"%"}></div>{shareHolder.HolderName} -->
		{/each}
	</div>
	<br />
{/if}

{#if stockRow.financeData}
	<!-- <Collapse header="מידע פיננסי"> -->
	<div class="overflow-y-auto">
		<h2 class=" bg-success rounded-t-xl font-bold text-xl">
			מידע פיננסי ב{stockRow.financeData.CurrencyName}
		</h2>
		<table
			class="table table-fixed table-xs sm:table-sm md:table-md lg:table-lg table-pin-rows table-pin-cols text-center static"
		>
			<thead>
				<tr>
					<th>שם</th>
					<th
						>{stockRow.financeData.CurrentPeriod.Title}
						{stockRow.financeData.CurrentPeriod.IFRS}</th
					>
					<th
						>{stockRow.financeData.PreviousPeriod.Title}
						{stockRow.financeData.PreviousPeriod.IFRS}</th
					>
					<th
						>{stockRow.financeData.PreviousYear.Title}
						{stockRow.financeData.PreviousYear.IFRS}</th
					>
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
	<!-- </Collapse> -->
	<br />
{/if}
