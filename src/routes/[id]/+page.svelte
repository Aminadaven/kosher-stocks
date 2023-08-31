<script>
	import dataJson from '$lib/data/data.json';
	import iskaApproval from '$lib/assets/iska-approval.png';
	import shabbatPermit from '$lib/assets/shabbat-permit.jpg';
	import maya from '$lib/assets/maya.jpg';
	import { page } from '$app/stores';
	import Meta from '../../components/meta.svelte';
	import { Chart, ArcElement, DoughnutController, Legend, Title, Tooltip } from 'chart.js';
	import { onMount } from 'svelte';
	import Card from '../../components/card.svelte';
	import SymbolOverview from '../../components/trading-view/symbol-overview.svelte';

	Chart.register(ArcElement, DoughnutController, Legend, Title, Tooltip);

	const id = $page.params.id;
	const stockRow = dataJson.data[dataJson.index[id]];
	const meta = `מידע על כשרות ההשקעה במניות ישראליות, ריבית ושבת | דף חברה ${stockRow.stock.NameHeb}`;

	let canvas;

	const chartData = {
		labels: stockRow.shareHolders.map((shareHolder) => shareHolder.HolderName),
		datasets: [
			{
				data: stockRow.shareHolders.map((shareHolder) => shareHolder.Percentage),
				backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
				hoverOffset: 10
			}
		]
	};

	onMount(async () => {
		new Chart(canvas, {
			type: 'doughnut',
			data: chartData,
			options: {
				cutout: '80%',
				responsive: true,
				plugins: {
					legend: {
						display: true,
						labels: {
							color: '#FFF'
						}
					}
				}
			}
		});
	});
</script>

<Meta title={meta} desc={meta} />

<!-- <h1 class="my-5 p-2 text-4xl inline-block">{stockRow.companyDetails.CompanyLongName}</h1> -->

<div class="hero bg-base-200 rounded-3xl my-5">
	<!-- <div class="hero min-h-screen bg-base-200"> -->
	<div class="hero-content text-center">
		<div class="">
			<!-- <div class="max-w-md"> -->
			<h1 class="text-5xl font-bold">
				{#if stockRow.companyDetails.Site}
					<a href="https://{stockRow.companyDetails.Site}" class="link link-hover"
						>{stockRow.companyDetails.CompanyLongName}</a
					>
				{:else}
					{stockRow.companyDetails.CompanyLongName}
				{/if}
			</h1>
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
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">מספר חברה (ח.פ.)</div>
					<div class="stat-value">{stockRow.stock.CorporateNo}</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">סקטור</div>
					<div class="stat-value">
						<!-- {stockRow.stock.SuperSectorHeb}
			<br />
			{stockRow.stock.SectorHeb} <br /> -->
						{stockRow.stock.SubSectorHeb}
					</div>
				</div>

				<div class="stat place-items-center">
					<div class="stat-title">שווי שוק</div>
					<div class="stat-value">{stockRow.companyDetails.MarketValue}</div>
				</div>
			</div>
		</div>
	</div>
</div>

<SymbolOverview
	divClass="my-5"
	width="100%"
	height="400"
	symbols={[[stockRow.companyDetails.CompanyLongName, `TASE:${stockRow.stock.SymbolEng}|12M`]]}
/>

<div class="flex flex-col md:flex-row justify-between content-center">
	<div class="bg-info rounded-2xl h-fit w-fit">
		<a
			href="https://maya.tase.co.il/company/{stockRow.stock.IssueNo}?view=reports"
			class="link link-hover"
			>דוחות באתר מאיה
			<img src={maya} class="rounded-b-2xl" alt="דוחות באתר מאיה" />
		</a>
	</div>
	<br />
	{#if stockRow.approvals}
		<Card>
			<figure class="md:w-fit h-fit md:max-w-[220px]">
				<img src={iskaApproval} alt="היתר עסקה" />
			</figure>
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
		</Card>
		<br />
	{/if}

	{#if stockRow.permits}
		<Card>
			<figure class="md:w-fit h-fit md:max-w-[220px]">
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
		</Card>
		<br />
	{/if}

	{#if stockRow.shareHolders}
		<div class="w-fit mx-auto md:mx-0">
			<h2 class="bg-success rounded-t-xl font-bold text-xl">מחזיקי מניה</h2>
			<canvas bind:this={canvas} />
		</div>
		<br />
	{/if}
</div>
<br />

{#if stockRow.financeData}
	<div class="overflow-y-auto">
		<h2 class="bg-success rounded-t-xl font-bold text-xl">
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
						{stockRow.financeData.CurrentPeriod.IFRS ? ' IFRS' : ''}</th
					>
					<th
						>{stockRow.financeData.PreviousPeriod.Title}
						{stockRow.financeData.PreviousPeriod.IFRS ? ' IFRS' : ''}</th
					>
					<th
						>{stockRow.financeData.PreviousYear.Title}
						{stockRow.financeData.PreviousYear.IFRS ? ' IFRS' : ''}</th
					>
				</tr>
			</thead>
			<tbody class="bg-info">
				{#each stockRow.financeData.AllRows ?? [] as row, index}
					<!-- {console.log(JSON.stringify(row)) || ''} -->
					<tr class="hover">
						{#if row.Code === '0'}
							<td class="font-semibold">{row.Name}</td>
						{:else}
							<td>{row.Name}</td>
						{/if}
						<td>{row.CurrPeriodValue}</td>
						<td>{row.PrevPeriodValue}</td>
						<td>{row.PrevYearValue}</td>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<br />
{/if}
