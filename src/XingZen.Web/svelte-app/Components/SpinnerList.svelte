<script>
  import { onMount } from "svelte";
  import { apiData, spinners } from "../data/stores.js";

  import SpinnerItem from "../Components/SpinnerItem.svelte";
  import SpinnerForm from "../Components/SpinnerForm.svelte";

  onMount(async () => {
    fetch("/api/spinner")
      .then((response) => response.json())
      .then((data) => {
        apiData.set(data);
      })
      .catch((error) => {
        console.log(error);
        return [];
      });
  });

  function handleDelete(event) {
    var state = $spinners.filter((s) => s.id !== event.detail.spinnerId);
    apiData.set(state);

    return fetch(`/api/spinner/${event.detail.spinnerId}`, {
      method: "DELETE",
    }).then((response) => response.json());
  }

  function handleAppend(event) {
    console.log(event.detail.spinner);
    var state = $spinners.concat([event.detail.spinner]);
    apiData.set(state);
  }
</script>

  <h2>Spinners:</h2>
  {#each $spinners as spinner}
    <SpinnerItem
      {spinner}
      name={spinner.name}
      id={spinner.id}
      on:delete={handleDelete}
    />
  {/each}

  <hr />
  <SpinnerForm on:append={handleAppend} />

<style>

</style>
