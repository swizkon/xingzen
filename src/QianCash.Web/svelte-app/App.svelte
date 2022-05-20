<script>
  import { onMount } from "svelte";

  import auth from "./authService";

  import {
    apiData,
    spinners,
    isAuthenticated,
    user,
    user_tasks,
    tasks,
  } from "./data/stores.js";
  import { Router, Link, Route } from "svelte-routing";

  import ImpersonateList from "./Components/ImpersonateList.svelte";

  import UserDetails from "./Components/UserDetails.svelte";

  let auth0Client;

  onMount(async () => {
    auth0Client = await auth.createClient();
    console.log("auth0Client", auth0Client);

    const u = await auth0Client.getUser();
    console.log("auth0Client user", u);

    isAuthenticated.set(await auth0Client.isAuthenticated());
    user.set(u);

    const claims = await auth0Client.getIdTokenClaims();
    // if you need the raw id_token, you can access it
    // using the __raw property
    const id_token = claims && claims.__raw;
    console.log("id_token", id_token);

    // const token = await auth0Client.getTokenSilently();
    // console.log('getTokenSilently', token);

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

  function login() {
    auth.loginWithPopup(auth0Client);
  }

  function logout() {
    auth.logout(auth0Client);
  }

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

  export let name;
  export let url = "";
</script>

<main>
  {#if $isAuthenticated}
    <span class="text-white">&nbsp;&nbsp;{$user.name} ({$user})</span>
  {:else}<span>&nbsp;</span>{/if}
  {#if $isAuthenticated}
    <a class="nav-link" href="/#" on:click={logout}>Log Out</a>
  {:else}
    <a class="nav-link" href="/#" on:click={login}>Log In</a>
  {/if}

  <h1>{name}</h1>

  <Router {url}>
    <nav>
      <Link to="/">Home</Link>
    </nav>
    <div>
      <Route path="users/:id" let:params>
        <UserDetails id={params.id} />
      </Route>
      <Route path="/" component={ImpersonateList} />
    </div>
  </Router> 
<pre>
------------------------------------------------------------------
________        _____        _________________ 
___  __ )______ __  /_______ __  ____/___  __ \
__  __  |_  __ \_  __/_  __ \_  / __  __  /_/ /
_  /_/ / / /_/ // /_  / /_/ // /_/ /  _  ____/ 
/_____/  \____/ \__/  \____/ \____/   /_/      

------------------------------------------------------------------
</pre>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
