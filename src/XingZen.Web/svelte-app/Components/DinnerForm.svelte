<script>
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  function handleUpsert(event) {
    const payload = {
      name: name,
      ingredients: []
    };

    return fetch(`/api/spinner/${id}/dinners`, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: { "content-type": "application/json" },
    })
      .then((response) => response.json())
      .then((d) => {
        dispatch("append", {
          spinner: d,
        });
      });
  }

  export let name;
  export let id;
</script>

<div>
  <h1>{name} <small>({id})</small></h1>
  <input bind:value={name} />
  <textarea></textarea>
  <button on:click={handleUpsert}>Save</button>
</div>
