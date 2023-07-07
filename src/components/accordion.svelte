<script>
    export let header;
    let show = false;
    const clicked = () => show = !show;
</script>

<h2 class="pt-5 text-xl title">
    <button on:click={clicked}>
    {header}</button>
</h2>
<div on:click={clicked} on:keydown={clicked} role="presentation" style:display={show ? '' : 'none'}>
    <slot />
</div>
