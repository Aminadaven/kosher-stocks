<script>
    export let data;
  </script>
  
  <div id="chart" class="relative h-64 border-2 border-gray-300">
    <div class="absolute bottom-1/2 w-full h-0.5 bg-gray-300"></div>
    {#each data as item}
      <div class="absolute w-4 h-4 rounded-full bg-red-500 left-[calc({item.Percentage}%-2px)] bottom-1/2 transform -translate-x-1/2"></div>
      <div class="absolute bottom-[-20px] transform -translate-x-1/2 left-[calc({item.Percentage}%-2px)]">Label {item.HolderName / 10}</div>
    {/each}
  </div>
  