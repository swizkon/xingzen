<script>
  import { onMount } from "svelte";

  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleUpsert(event) {
    const payload = {
      name: name,
      ingredients: []
    };

    // /api/Accounts/balance/{accountNumber}/{currency}/{amount}
    return fetch(`/api/accounts/balance/${id}/${currency}/${amount}`, {
      method: "PUT",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((d) => {
        dispatch("append", {
          amount: d,
        });
      });
  }
  
  function getKnownCurrencies() {
    return fetch(`/settings/knownCurrencies`)
      .then((response) => response.json())
      .then((s) => {
        currencies = s;
      });
  }

  onMount(async () => {
    await getKnownCurrencies();
  });

  export let id;
  let amount = 0;
  let currency = "SEK";
  let currencies = [];
</script>

<div>
  <h1>Set funds {currency} <small>({amount})</small></h1>
  <select bind:value={currency}>
		{#each currencies as c}
			<option value={c}>
				{c}
			</option>
		{/each}
	</select>
  
  <input bind:value={amount} type="range" step="100" max="2000" />
  <button on:click={handleUpsert}>OK</button>
</div>
