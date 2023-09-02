<script>
	import { Chart, ArcElement, DoughnutController, Legend, Title, Tooltip } from 'chart.js';
	import { onMount } from 'svelte';

	Chart.register(ArcElement, DoughnutController, Legend, Title, Tooltip);

	export let shareHolders = [];
	const labels = [];
	const percentages = [];
	shareHolders.forEach((shareHolder) => {
		labels.push(shareHolder.HolderName);
		percentages.push(shareHolder.Percentage);
	});

	let canvas;

	const data = {
		labels,
		datasets: [
			{
				data: percentages,
				backgroundColor: ['rgb(255, 99, 132)', 'rgb(54, 162, 235)', 'rgb(255, 205, 86)'],
				hoverOffset: 10
			}
		]
	};

	const config = {
		type: 'doughnut',
		data,
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
	};

	onMount(async () => new Chart(canvas, config));
</script>

<canvas bind:this={canvas} />
