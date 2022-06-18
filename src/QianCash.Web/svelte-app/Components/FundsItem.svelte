<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function decreaseBalance() {
    dispatch("setBalance", {
      currency: asset.currency,
      amount: asset.amount - 100,
    });
  }

  function increaseBalance() {
    dispatch("setBalance", {
      currency: asset.currency,
      amount: asset.amount + 100,
    });
  }

  onMount(async () => {
    console.log("asset", asset);
  });

  export let asset;
</script>

<div>
  <h2>{asset.amount} <small>{asset.currency}</small></h2>

  <button on:click={decreaseBalance}> - </button>100
  <button on:click={increaseBalance}> + </button>
</div>
