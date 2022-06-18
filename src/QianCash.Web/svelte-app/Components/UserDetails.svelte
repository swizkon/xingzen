<script>
  import { onMount } from "svelte";
  import { createEventDispatcher } from "svelte";

  import FundsItem from "./FundsItem.svelte";
  import DepositForm from "./DepositForm.svelte";

  const dispatch = createEventDispatcher();

  function getDetails() {
    return fetch(`/api/accounts/balance/${id}`)
      .then((response) => response.json())
      .then((s) => {
        accountBalance = s;
      });
  }

  onMount(async () => {
    await getDetails();
  });

  function handleAppend(event) {
    accountBalance = event.detail.amount;
  }
  
  function handleSetBalance(event) {
    console.log(event)
    return fetch(`/api/accounts/balance/${id}/${event.detail.currency}/${event.detail.amount}`, {
      method: "PUT",
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((s) => {
        accountBalance = s;
        
      });
  }

  let accountBalance = null;
  $: assets = (accountBalance && accountBalance.assets) || [];

  export let id;
</script>

<div>
  <h1>Balance <small>({id})</small></h1>
  <hr />

  {#each assets as asset}
    <FundsItem
      {asset}
      on:setBalance={handleSetBalance}
    />
  {/each}

  <hr />
  <DepositForm {id} on:append={handleAppend} />
</div>
