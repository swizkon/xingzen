<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  import FundsItem from "./FundsItem.svelte";
  import DinnerForm from "./DinnerForm.svelte";

  const dispatch = createEventDispatcher();

  function getDetails() {
    return fetch(`/api/accounts/balance/${id}`)
      .then((response) => response.json())
      .then((s) => {
        balance = s;
      });
  }

  onMount(async () => {
    await getDetails();
  });

  function handleAppend(event) {
    balance = event.detail.amount;
  }
  
  function handleSetBalance(event) {
    console.log(event)
    return fetch(`/api/accounts/balance/${id}/${event.detail.currency}/${event.detail.amount}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((s) => {
        balance = s;
        
      });
  }

  let balance = null;
  $: balances = (balance && balance.balances) || [];

  export let id;
</script>

<div>
  <h1>Balance <small>({id})</small></h1>
  <hr />

  {#each balances as funds}
    <FundsItem
      {funds}
      on:setBalance={handleSetBalance}
    />
  {/each}

  <hr />
  <DinnerForm {id} on:append={handleAppend} />
</div>
