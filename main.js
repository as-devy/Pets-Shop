// HIDE PRELOADER WHEN PAGE FULLY LOADED

window.onload = ()=>{
    document.querySelector(".preloader").classList.add("hide")
}

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

const sessionUserId = getCookie('UserId');

if (sessionUserId) {
    document.querySelector("header .register").classList.add("d_none")
    // document.querySelector("header .post_pet").classList.remove("d_none")
    // document.querySelector("header .logout").classList.remove("d_none")
    document.querySelector("header .notif").classList.remove("d_none")
    document.querySelector("header #user_personal").classList.remove("d_none")
}

document.querySelector("header .logout")?.addEventListener("click", () => {
    document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "./login.html"
})

if (sessionUserId) {
    fetch(`https://pawssafe.ddns.net/users/${sessionUserId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            const user = data;
            document.querySelector("#user_name").innerHTML = `${user.username} 
            ${(user.verification_status == "approved" || user.role == "admin") ? `<i class="fa-solid fa-badge-check"></i>` : ""}`;
            document.querySelector("#user-email").innerHTML = user.email;
            // VERIFIED BUTTON APPERAS WHEN USER IS NOT ADMIN IF ADMIN DASBOARD LINK APPERAS
            if (user.role == "admin"){
                document.querySelector("#get_verify_btn").classList.add("d_none")
                document.querySelector("#dashboard_btn").classList.remove("d_none")
            }
            const notifies = JSON.parse(user.notifications)
            const notifiesLength = notifies.length
            document.querySelector(".notif_length").textContent = notifiesLength;
            if (notifiesLength == 0) {
                document.querySelector("#notif_list .info").classList.remove("d_none")
            } else {
                document.querySelector("#notif_list .info").classList.add("d_none")
                document.querySelector("header #clear_notifis").classList.remove("d_none")

                notifies.forEach(notify => {
                    if (notify.type == "approval") {
                        let petname;
                        let approvedUserName;
                        fetch(`https://pawssafe.ddns.net/users/${notify.ownerUserId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                const requesterUser = data
                                approvedUserName = requesterUser.username
                                fetch(`https://pawssafe.ddns.net/pet/${notify.PetId}`)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error(`HTTP error! Status: ${response.status}`);
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        const requestedPet = data
                                        petname = requestedPet.name
                                        document.querySelector("#notif_list ul").innerHTML += `<li><a href="./viewPet.html?petId=${notify.PetId}"><b>${approvedUserName}</b> Approved your request on <b>${petname}</b></a></li>`
                                    }).catch(error => {
                                        console.error("Error fetching pets:", error);
                                    });
                            }).catch(error => {
                                console.error("Error fetching users:", error);
                            });
                    }

                    if (notify.type == "denied") {
                        let petname;
                        let petOnwerUserName;
                        fetch(`https://pawssafe.ddns.net/users/${notify.ownerUserId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                const requesterUser = data
                                petOnwerUserName = requesterUser.username
                                fetch(`https://pawssafe.ddns.net/pet/${notify.PetId}`)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error(`HTTP error! Status: ${response.status}`);
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        const requestedPet = data
                                        petname = requestedPet.name
                                        document.querySelector("#notif_list ul").innerHTML += `<li><a href="./viewPet.html?petId=${notify.PetId}"><b>${petOnwerUserName}</b> Denied your request on <b>${petname}</b></a></li>`
                                    }).catch(error => {
                                        console.error("Error fetching pets:", error);

                                    });
                            }).catch(error => {
                                console.error("Error fetching users:", error);
                            });
                    }

                    if (notify.type == "approvedRequest"){
                        document.querySelector("#notif_list ul").innerHTML += `<li><a href="./verification.html">Your Verification Request <b>Approved</b></a></li>`
                    }else if (notify.type == "rejectedRequest"){
                        document.querySelector("#notif_list ul").innerHTML += `<li><a href="./verification.html">Your Verification Request <b>Rejected</b></a></li>`
                    }

                    if (notify.requestedUserId) {
                        let petname;
                        let requesterName;
                        console.log(notify)
                        fetch(`https://pawssafe.ddns.net/users/${notify.requestedUserId}`)
                            .then(response => {
                                if (!response.ok) {
                                    throw new Error(`HTTP error! Status: ${response.status}`);
                                }
                                return response.json();
                            })
                            .then(data => {
                                const requesterUser = data
                                requesterName = requesterUser.username
                                console.log("requested pet", notify.requestedPetId)
                                fetch(`https://pawssafe.ddns.net/pet/${notify.requestedPetId}`)
                                    .then(response => {
                                        if (!response.ok) {
                                            throw new Error(`HTTP error! Status: ${response.status}`);
                                        }
                                        return response.json();
                                    })
                                    .then(data => {
                                        const requestedPet = data
                                        petname = requestedPet.name
                                        console.log(petname)
                                        console.log(requesterName)
                                        document.querySelector("#notif_list ul").innerHTML += `<li><a href="./viewPet.html?petId=${notify.requestedPetId}&requesterId=${notify.requestedUserId}"><b>${requesterName}</b> requested your pet <b>${petname}</b></a></li>`
                                    }).catch(error => {
                                        console.error("Error fetching pets:", error);
                                    });
                            }).catch(error => {
                                console.error("Error fetching users:", error);
                            });
                    }
                });
            }
        }).catch(error => {
            console.error("Error fetching users:", error);
        });
}

// ADD CLEAR NOTIFICATIONS FUNCTIONALLITY
document.querySelector("header #clear_notifis").addEventListener("click", () => {
    fetch(`https://pawssafe.ddns.net/users/deleteNotifications/${sessionUserId}`, {
        method: 'DELETE',
    }).then(response => {
        if (response.ok) {
            document.querySelector(".notif_length").textContent = 0;
            document.querySelector("#notif_list ul").innerHTML = "";
            document.querySelector("#notif_list .info").classList.remove("d_none")
        }
    }).catch(error => {
        console.error('Error deleting pet:', error);
    });
})


document.querySelector("#user_personal").addEventListener("click", () => {
    document.querySelector("header .personal_info").classList.toggle("active")
})

document.querySelector("#notif_btn").addEventListener("click", () => {
    document.querySelector("header .notif_list").classList.toggle("active")
})

document.addEventListener("click", function (event) {
    let notifBtn = document.querySelector("#notif_btn");
    let targetElement = event.target;
    const clearBtn = document.querySelector("header #clear_notifis");
    const notfiListEle = document.querySelector("header #notif_list")

    let personalMenuBtn = document.querySelector("#user_personal");
    const personalMenu = document.querySelector(".personal_info");

    // Check if the clicked element is NOT the notif_btn, clear notfis, notifi list
    if (notifBtn && !notifBtn.contains(targetElement) && !clearBtn.contains(targetElement) && !notfiListEle.contains(targetElement)) {
        notfiListEle.classList.remove("active");
    }

    // Check if the clicked element is NOT PERSONAL INFO MENU
    if (personalMenuBtn && !personalMenuBtn.contains(targetElement) && !personalMenu.contains(targetElement)) {
        personalMenu.classList.remove("active");
    }
});

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