<script>
	export let label;
</script>

<label class="label cursor-pointer">
	<span class="label-text mx-4">{label}</span>
	<input type="checkbox" class="toggle" on:change />
</label>
