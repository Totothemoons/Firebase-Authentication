// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, GoogleAuthProvider, signInWithPopup} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-auth.js";
const firebaseConfig = {
  apiKey: "AIzaSyC6JnUw7OhzTtf3X168SD7wxL__1qOPyJ0",
  authDomain: "basicfirebase-8dfc9.firebaseapp.com",
  projectId: "basicfirebase-8dfc9",
  storageBucket: "basicfirebase-8dfc9.firebasestorage.app",
  messagingSenderId: "730859594592",
  appId: "1:730859594592:web:3df7c9385e1623d9617405",
  measurementId: "G-BJ4RPXZ3YL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.languageCode = 'en';
const provider = new GoogleAuthProvider();


const form = document.getElementById("registerForm");
const formArea = document.getElementById("form-area");
const errorText = document.getElementById("Error-Text");
const profile = document.getElementById("profile");
const welcome = document.getElementById("welcome");
const logout = document.getElementById("Logout");
const LoginForm = document.getElementById("loginForm");
const ErrorLoginText = document.getElementById("Error-Login");
const googleLogin = document.getElementById('google-login-btn');

// Register User
form.addEventListener("submit", async(e) => {
    e.preventDefault();
    const email = form.email.value;
    const password = form.password.value;
    const data = await registerUser(email, password);
    console.log(data.user.accessToken);
    console.log(data.user.email);
});

async function registerUser(email, password) {
    try{
        errorText.innerHTML = "";
        const user = await createUserWithEmailAndPassword(auth, email, password);
        alert("User Created Successfully");
        return user;
    }
    catch(err){
        console.log(err.code);
        if(err.code === "auth/invalid-email"){
            errorText.innerHTML = `<p style ="color: red;">Invalid Email</p>`;
        }
        else if(err.code === "auth/weak-password"){ 
            errorText.innerHTML = `<p style ="color: red;">Password should be at least 6 characters</p>`;
        }
        else if(err.code === "auth/email-already-in-use"){
            errorText.innerHTML = `<p style ="color: red;">Email Already In Use</p>`;
        }
        else if(err.code === "auth/too-many-requests"){
            errorText.innerHTML = `<p style ="color: red;">Too Many Requests</p>`;
        }
        else{
            errorText.innerHTML = `<p style ="color: red;">${err.message.slice(10,)}</p>`;
        }
    }
}

onAuthStateChanged(auth, (user) => { // ข้อมูล user ตอบกลับมา

    // after login
    if(user){
        profile.style.display = "block";
        formArea.style.display = "none";
        welcome.innerHTML = `<h3>Welcome ${user.email}</h3>`;
        console.log(user.accessToken);
    }
    else{
        profile.style.display = "none";
        formArea.style.display = "block";
    }
});
// Logout User
logout.addEventListener("click", (e) => {
    signOut(auth).then( () => {
        alert("Logout Successfully");
    }).catch((err) => {
        alert(err.message);
    });
});
// google sign in

googleLogin.addEventListener('click', function() {
    signInWithPopup(auth, provider)
    .then((result) => {
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    console.log(user);
    // window.location.href = "./src/logged.html";


  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log(errorMessage);


    // // The email of the user's account used.
    // const email = error.customData.email;
    // // The AuthCredential type that was used.
    // const credential = GoogleAuthProvider.credentialFromError(error);
    // // ...
  });
});


// Login User
LoginForm.addEventListener("submit", async(e) => {
    e.preventDefault();
    const email = LoginForm.email.value;
    const password = LoginForm.password.value;
    const data = await loginUser(email, password);
    console.log(data.user.accessToken);
});

async function loginUser(email, password) {
    try{
        ErrorLoginText.innerHTML = "";
        const loginUser = await signInWithEmailAndPassword(auth, email, password);
        alert("Login Successfully");
        return loginUser;
        // console.log(loginUser.user.accessToken);
    }
    catch(err){
        console.log(err.code);
        if(err.code === "auth/user-not-found"){
            ErrorLoginText.innerHTML = `<p style ="color: red;">User Not Found</p>`;
        }
        else if(err.code === "auth/invalid-credential"){
            ErrorLoginText.innerHTML = `<p style ="color: red;">Something went wrong</p>`;
        }        
        else{
            ErrorLoginText.innerHTML = `<p style ="color: red;">${err.message.slice(10,)}</p>`;
        }
    }
}

