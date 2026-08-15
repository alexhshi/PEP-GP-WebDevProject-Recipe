/**
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
   recipeAdd = document.getElementById("add-recipe-name-input");
   recipeAddInstr = document.getElementById("add-recipe-instructions-input")
   recipeUpdate = document.getElementById("update-recipe-name-input");
   recipeUpdateInstr = document.getElementById("update-recipe-instructions-input");
   recipeDelete = document.getElementById("delete-recipe-name-input");
   recipeListContainer = document.getElementById("recipe-list");

   logoutButton = document.getElementById("logout-button");
   adminLink = document.getElementById("admin-link");

   searchInput = document.getElementById("search-input");

   recipesArray;

    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token") !== null) {
        logoutButton.removeAttribute("hidden");
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") == "true") {
        adminLink.removeAttribute("hidden");
    }

    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */

    /*
     * TODO: On page load, call getRecipes() to populate the list
     */

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        let input = searchInput.innerText

        const requestOptions = {
            //method: "POST", //TODO: self, see if this defaults to get or not
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({name: input})
            //TODO: self, what is "name query?" is it the url path thing or what?
        };
        refreshRecipeList();
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        let inputName = recipeAdd.innerText;
        let inputInstr = recipeAddInstr.innerText;
        
        const requestOptions = {
            method: "POST", 
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({name: inputName, instructions: inputInstr})
            
        };
        try {
            let response = await fetch(new Request(BASE_URL + "/login"), requestOptions);
            //TODO: self, clear which inputs?
            recipeAdd.innerHTML = "";
            recipeAddInstr.innerHTML = "";
            //TODO: self, fetch latest recipes how?
            getRecipes();
            refreshRecipeList();
        } catch (e) {
            alert("foobar");
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        let theName = recipeUpdate.innerText;
        let theInstr = recipeUpdateInstr.innerText;
        if (theName.length <= 0 || theInstr.length <= 0) {
            return;
        }
        getRecipes();
        refreshRecipeList();

        let theId;
        for (let i in recipesArray) {
            if (i.name == theName) {
                theId = i.id;
            }
        }

        const requestOptions = {
            method: "PUT", 
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify({instructions: theInstr})
        };
        try {
            let response = await fetch(new Request(BASE_URL + "/recipes/" + theId), requestOptions);
        } catch (e) {
            alert("foobar");
        }
        recipeUpdate.innerText = "";
        recipeUpdateInstr.innerText = "";
        getRecipes();
        refreshRecipeList();
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        let theName = recipeDelete.innerText;
        if (theName.length <= 0) {
            return;
        }
        getRecipes();
        refreshRecipeList();

        let theId;
        for (let i in recipesArray) {
            if (i.name == theName) {
                theId = i.id;
            }
        }

        const requestOptions = {
            method: "DELETE", 
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            //body: JSON.stringify({instructions: theInstr}) //TODO: hope this commenting out works
        };
        try {
            let response = await fetch(new Request(BASE_URL + "/recipes/" + theId), requestOptions);
            getRecipes();
            refreshRecipeList();
        } catch (e) {
            alert("foobar");
        }
        recipeDelete.innerText = "";
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        const requestOptions = {
            //method: "POST", //TODO: double check that this defaults to get
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            //body: JSON.stringify({name: inputName, instructions: inputInstr}) //TODO: self, hope this works
            
        };
        try {
            let response = await fetch(new Request(BASE_URL + "/recipes"), requestOptions);
            recipesArray = response;
        } catch(e) {

        }
        refreshRecipeList();
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeListContainer.innerHTML = "";
        for (let i in recipesArray) {
            recipeListContainer.appendChild("<li>" + i + "</li>");
        }
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        const requestOptions = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Headers": "*",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            redirect: "follow",
            referrerPolicy: "no-referrer",
            body: JSON.stringify(requestBody)
        };
        try {
            let response = await fetch(new Request(BASE_URL + "/logout"), requestOptions);
            sessionStorage.clear();
            window.location.href("login/login-page.html");
        } catch (e) {
            alert("foobar");
        }
    }

});
