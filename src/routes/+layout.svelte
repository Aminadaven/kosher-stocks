<script>
	import '../app.css';
	import { base } from '$app/paths';

	const routes = {
		'עמוד ראשי': '/',
		אודות: '/about'
		// 'חיפוש מתקדם': '/advanced',
	};
</script>

<nav class="navbar bg-base-300 justify-center top-0">
	{#each Object.keys(routes) as route}
		<a href="{base}{routes[route]}" class="px-5 text-xl link link-hover"> {route}</a>
	{/each}
</nav>
<div class="text-center pb-3 px-0 sm:px-12 md:px-16 lg:px-20 xl:px-24 2xl:px-32">
	<slot />
</div>
