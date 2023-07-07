<script>
    export let title, desc;
</script>

<svelte:head>
	<title>
        {title}
    </title>
	<meta name="description" content={desc} />
</svelte:head>
