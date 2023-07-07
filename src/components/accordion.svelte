<script>
    export let header;
    let show = false;
    const clicked = () => show = !show;
</script>

<h3>
    <button on:click={clicked}>
    {header}</button>
</h3>
<div  on:click={clicked} on:keydown={clicked} role="presentation" style:display={show ? '' : 'none'}>
    <slot />
</div>
