<script>
import { onMount } from "svelte";
import { createEventDispatcher } from 'svelte';

import { Router, Link, Route } from "svelte-routing";

const dispatch = createEventDispatcher();

function deleteMe() {
	dispatch('delete', {
		spinnerId: id
	});
}
	
onMount(async () => {
  console.log('spinner', spinner)
});

export let name;
export let id;
export let spinner;
</script>

<div>
	<hr/>
	<h1>{name} <small>({id})</small></h1>
	
	<Link to="/spinner/{id}">Details</Link>
	<button on:click={deleteMe}>
		Delete
	</button>
</div>