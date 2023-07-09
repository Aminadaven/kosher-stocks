<script>
    export let header;
    let show = false;
    const clicked = () => show = !show;
</script>

<div on:click={clicked} on:keydown={clicked} role="presentation" class="mt-4 py-2 bg-slate-100 rounded-[4rem]">
<h2 class="text-xl text-blue-800 font-bold">
    {header}
</h2>
    <div style:display={show ? '' : 'none'} >
    <slot />
    </div>
</div>
