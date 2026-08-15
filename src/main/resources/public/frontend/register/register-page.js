/**
 * This script defines the registration functionality for the Registration page in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - usernameInput, emailInput, passwordInput, repeatPasswordInput, registerButton
 */
usernameInput = document.getElementById("username-input");
emailInput = document.getElementById("email-input");
passwordInput = document.getElementById("password-input");
repeatPasswordInput = document.getElementById("repeat-password-input");
registerButton = document.getElementById("register-button");


/* 
 * TODO: Ensure the register button calls processRegistration when clicked
 */


/**
 * TODO: Process Registration Function
 * 
 * Requirements:
 * - Retrieve username, email, password, and repeat password from input fields
 * - Validate all fields are filled
 * - Check that password and repeat password match
 * - Create a request body with username, email, and password
 * - Define requestOptions using method POST and proper headers
 * 
 * Fetch Logic:
 * - Send POST request to `${BASE_URL}/register`
 * - If status is 201:
 *      - Redirect user to login page
 * - If status is 409:
 *      - Alert that user/email already exists
 * - Otherwise:
 *      - Alert generic registration error
 * 
 * Error Handling:
 * - Wrap in try/catch
 * - Log error and alert user
 */
async function processRegistration() {
    // Implement registration logic here

    // Example placeholder:
    // const registerBody = { username, email, password };
    usernameText = usernameInput.innerHTML;
    emailText = emailInput.innerHTML;
    pwdText = passwordInput.innerHTML;
    repeatPwdText = repeatPasswordInput.innerHTML;
    if (usernameText.length > 0 && emailText.length > 0 && pwdText.length > 0 && repeatPwdText.length > 0 && pwdText == repeatPwdText) {
        registerBody = {username: usernameText, password: pwdText, email: emailText};
    } else {
        console.log("foobar");
        alert("foobar error?");
        //return;
    }
    const requestOptions = {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "*"
        },
        redirect: "follow",
        referrerPolicy: "no-referrer",
        body: JSON.stringify(registerBody)
    };
    try {
        let response = await fetch(new Request("http://localhost:8081/register"), requestOptions);
        if (response.status == 201) {
            window.location.href("login/login-page.html");
        } else if (response.status == 409) {
            alert("user/email already exists");
        } else {
            alert("generic registration error");
        }
    } catch(e) {
        console.log("foobar");
        alert("foobar error?");
    }

}
