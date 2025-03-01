// const signInBtn = document.querySelector("#signin")
// const logInBtn = document.querySelector("#login")

// if (signInBtn || logInBtn) {
//     document.querySelector("#signin, #login").addEventListener("click", function (event) {
//         event.preventDefault();

//         let name = document.getElementById("name");
//         let email = document.getElementById("email");
//         let password = document.getElementById("password");
//         let nameError = name.nextElementSibling;
//         let emailError = email.nextElementSibling;
//         let passwordError = password.nextElementSibling;

//         let isValid = true;

//         nameError.textContent = "";
//         emailError.textContent = "";
//         passwordError.textContent = "";

//         if (name.value.trim() === "") {
//             nameError.textContent = "Please Fill Out This Field.";
//             isValid = false;
//         }

//         if (email.value.trim() === "") {
//             emailError.textContent = "Please Fill Out This Field.";
//             isValid = false;
//         } else {
//             let emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
//             if (!emailPattern.test(email.value.trim())) {
//                 emailError.textContent = "Please Enter Valid Email.";
//                 isValid = false;
//             }
//         }
//         if (password.value.trim() === "") {
//             passwordError.textContent = "Please Fill Out This Field.";
//             isValid = false;
//         }
//     });
// }

function getCookie(name) {
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name) {
            return value;
        }
    }
    return null; // Return null if the cookie is not found
}

const user = getCookie('UserId');

if (user) {
    document.querySelector("header .register").classList.add("d_none")
    document.querySelector("header .post_pet, header .logout").classList.remove("d_none")
    document.querySelector("header .logout").classList.remove("d_none")
}

document.querySelector("header .logout").addEventListener("click", ()=>{
    document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "./"
})

// const createOdometer =(el, value)=>{
//     const odometer = new Odometer({
//         el : el,
//         value : 0,
//     })
//     odometer.update(value);
// };

// const adoptedOdometer = document.querySelector(".adopted-odometer ");
// createOdometer(adoptedOdometer, 800);

// const VolOdometer = document.querySelector(".Vol-odometer");
// createOdometer(VolOdometer, 40);

// const expOdometer = document.querySelector(".exp-odometer");
// createOdometer(expOdometer, 22);