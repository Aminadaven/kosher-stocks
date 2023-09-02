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

<!-- <label class="label cursor-pointer">
	<span class="hidden lg:flex label-text mx-4">{label}</span>
	<span class="lg:hidden label-text mx-2">{short}</span>
	<input type="checkbox" class="toggle" on:change />
</label> -->
