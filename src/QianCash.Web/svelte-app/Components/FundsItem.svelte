<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function decreaseBalance() {
    dispatch("setBalance", {
      currency: funds.currency,
      amount: funds.amount - 100,
    });
  }

  function increaseBalance() {
    dispatch("setBalance", {
      currency: funds.currency,
      amount: funds.amount + 100,
    });
  }

  onMount(async () => {
    console.log("funds", funds);
  });

  export let funds;
</script>

<div>
  <h2>{funds.amount} <small>{funds.currency}</small></h2>

  <button on:click={decreaseBalance}> - </button>100
  <button on:click={increaseBalance}> + </button>
</div>
