<script>
	import { Toggle } from 'flowbite-svelte';
	export let label, short;
</script>

<div class="hidden lg:flex mx-4">
	<Toggle on:change>
		{label}
	</Toggle>
</div>

<div class="lg:hidden mx-2">
	<Toggle size="small" on:change>
		{short}
	</Toggle>
</div>
