<script>
	export let label, short;
</script>

<label class="label cursor-pointer">
	<span class="hidden lg:flex label-text mx-4">{label}</span>
	<span class="lg:hidden label-text mx-2">{short}</span>
	<input type="checkbox" class="toggle" on:change />
</label>
