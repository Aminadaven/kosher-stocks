<script>
	import '../app.css';
	import { base } from '$app/paths';

	const routes = { 'עמוד ראשי': '/', 'אודות': '/about' };
</script>

<div class="text-center text-sky-400 pb-[50px] px-[15%]">
<nav>
	{#each Object.keys(routes) as route}
		<a href="{base}{routes[route]}" class="p-3"> {route}</a>
	{/each}
</nav>
	<slot />
</div>
