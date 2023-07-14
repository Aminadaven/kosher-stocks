<script>
    export let header;
</script>

<div class="collapse collapse-arrow border border-base-300 bg-base-200">
    <input type="checkbox" /> 
    <div class="collapse-title text-xl font-medium">
        {header}
    </div>
    <div class="collapse-content"> 
        <slot />
    </div>
  </div>
  