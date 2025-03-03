

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

document.querySelector("header .logout").addEventListener("click", () => {
    document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "./login.html"
})

document.querySelector("#notif_btn").addEventListener("click", () => {
    document.querySelector("header .notif_list").classList.toggle("active")
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