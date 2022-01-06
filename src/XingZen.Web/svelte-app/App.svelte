<script>
  import { onMount } from "svelte";
  
  import auth from "./authService";

  import { apiData, spinners, isAuthenticated, user, user_tasks, tasks } from "./data/stores.js";
  import { Router, Link, Route } from "svelte-routing";

  import SpinnerList from "./Components/SpinnerList.svelte";

  import SpinnerDetails from "./Components/SpinnerDetails.svelte";

  let auth0Client;

  onMount(async () => {
    auth0Client = await auth.createClient();
        console.log('auth0Client', auth0Client);

    isAuthenticated.set(await auth0Client.isAuthenticated());
    user.set(await auth0Client.getUser());

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
  <h1>Hello {name}!</h1>
  {#if $isAuthenticated}
  <span class="text-white">&nbsp;&nbsp;{$user.name} ({$user.email})</span>
  {:else}<span>&nbsp;</span>{/if}
  {#if $isAuthenticated}
  <li class="nav-item">
    <a class="nav-link" href="/#" on:click="{logout}">Log Out</a>
  </li>
  {:else}
  <li class="nav-item">
    <a class="nav-link" href="/#" on:click="{login}">Log In</a>
  </li>
  {/if}


  <Router {url}>
    <nav>
      <Link to="/">Home</Link>
    </nav>
    <div>
      <Route path="spinner/:id" let:params>
        <SpinnerDetails id={params.id} />
      </Route>
      <!-- <Route path="spinner/:id" component={SpinnerDetails} /> -->
      <Route path="/" component={SpinnerList} />
    </div>
  </Router>
</main>

<style>
  main {
    text-align: center;
    padding: 1em;
    max-width: 240px;
    margin: 0 auto;
  }
  /*
  h1 {
    color: #ff3e00;
    text-transform: uppercase;
    font-size: 4em;
    font-weight: 100;
    text-shadow: 3px 3px 0em #000;
  }  */

  @media (min-width: 640px) {
    main {
      max-width: none;
    }
  }
</style>
