<script>
import { onMount } from "svelte";
import { createEventDispatcher } from 'svelte';

import { Link } from "svelte-routing";

const dispatch = createEventDispatcher();
	
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
	<Link to="/users/{id}">Account balance</Link>
</div>