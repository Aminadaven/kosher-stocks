<script>
	import '../app.css';
	import { base } from '$app/paths';
	
	const routes = { 'עמוד ראשי': '/', 'אודות': '/about' };
</script>

<body class="normal">
<div class="text-center pb-[50px] px-[15%]">
<nav class="pt-5 sticky top-0 table-title">
	{#each Object.keys(routes) as route}
		<a href="{base}{routes[route]}" class="px-5"> {route}</a>
	{/each}
</nav>
	<slot />
</div>
</body>
