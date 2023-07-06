<script>
	import '../app.css';

	const routes = { 'עמוד ראשי': '/', 'אודות': '/about' };
</script>

<div class="text-center text-sky-400 pb-[50px] px-[15%]">
<nav>
	{#each Object.keys(routes) as route}
		<a href={routes[route]} class="p-3"> {route}</a>
	{/each}
</nav>
	<slot />
</div>
