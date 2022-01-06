import { writable, derived } from 'svelte/store'

/** Store for your data. 
This assumes the data you're pulling back will be an array.
If it's going to be an object, default this to an empty object.
**/
export const apiData = writable([])

/** Data transformation.
For our use case, we only care about the drink names, not the other information.
Here, we'll create a derived store to hold the drink names.
**/
export const spinners = derived(apiData, ($apiData) => {
  console.log($apiData)
  if ($apiData) {
    return $apiData
  }
  return []
})

export const isAuthenticated = writable(false)
export const user = writable({})
export const popupOpen = writable(false)
export const error = writable()

export const tasks = writable([])

export const user_tasks = derived([tasks, user], ([$tasks, $user]) => {
  let logged_in_user_tasks = []

  if ($user && $user.email) {
    logged_in_user_tasks = $tasks.filter((task) => task.user === $user.email)
  }

  return logged_in_user_tasks
})