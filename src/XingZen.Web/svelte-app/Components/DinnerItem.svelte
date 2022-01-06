<script>
import { onMount } from "svelte";
import { createEventDispatcher } from 'svelte';

const dispatch = createEventDispatcher();

function deleteMe() {
	dispatch('delete', {
		dinnerId: dinner.id
	});
}
	
onMount(async () => {
  console.log('dinner', dinner)
});

export let dinner;
</script>

<div>
	<h2>{dinner.name}</h2>
	
	<button on:click={deleteMe}>
		Delete
	</button>
</div>