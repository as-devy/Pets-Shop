

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
    document.querySelector("header .post_pet").classList.remove("d_none")
    document.querySelector("header .logout").classList.remove("d_none")
    document.querySelector("header .notif").classList.remove("d_none")
}

document.querySelector("header .logout").addEventListener("click", () => {
    document.cookie = "UserId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.href = "./login.html"
})

fetch(`http://localhost:400/users/${sessionUserId}`)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data)
        const user = data;
        const notifies = JSON.parse(user.notifications)
        const notifiesLength = notifies.length
        document.querySelector(".notif_length").textContent = notifiesLength;
        if (notifiesLength == 0) {
            document.querySelector("#notif_list .info").classList.remove("d_none")
        } else {
            document.querySelector("#notif_list .info").classList.add("d_none")
            notifies.forEach(notify => {

                if (notify.type == "approval") {
                    let petname;
                    let approvedUserName;
                    fetch(`http://localhost:400/users/${notify.approvedUserId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            const requesterUser = data
                            approvedUserName = requesterUser.username
                            fetch(`http://localhost:400/pet/${notify.approvedPetId}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`HTTP error! Status: ${response.status}`);
                                    }
                                    return response.json();
                                })
                                .then(data => {
                                    const requestedPet = data
                                    petname = requestedPet.name
                                    document.querySelector("#notif_list ul").innerHTML += `<li><a href="./viewPet.html?petId=${notify.approvedPetId}"><b>${approvedUserName}</b> Approved your request on <b>${petname}</b></a></li>`
                                }).catch(error => {
                                    console.error("Error fetching pets:", error);

                                });
                        }).catch(error => {
                            console.error("Error fetching users:", error);
                        });
                } else {
                    let petname;
                    let requesterName;
                    fetch(`http://localhost:400/users/${notify.requestedUserId}`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            return response.json();
                        })
                        .then(data => {
                            const requesterUser = data
                            requesterName = requesterUser.username
                            fetch(`http://localhost:400/pet/${notify.requestedPetId}`)
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
                                    document.querySelector("#notif_list ul").innerHTML += `<li><a href="./viewPet.html?petId=${notify.requestedPetId}"><b>${requesterName}</b> requested your pet <b>${petname}</b></a></li>`
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




// const parent = document.querySelector("header .notif_list");

// let totalHeight = 0;
// const children = Array.from(parent.children);

// children.forEach(child => {
//     const childStyles = window.getComputedStyle(child);
//     const height = child.offsetHeight+12;
//     const marginTop = parseFloat(childStyles.marginTop);
//     const marginBottom = parseFloat(childStyles.marginBottom);

//     totalHeight += height + marginTop + marginBottom;
// });

// parent.style.height = `${totalHeight}px`;

document.querySelector("#notif_btn").addEventListener("click", () => {
    document.querySelector("header .notif_list").classList.toggle("active")
})

document.addEventListener("click", function (event) {
    let notifBtn = document.querySelector("#notif_btn");
    let targetElement = event.target;

    // Check if the clicked element is NOT the notif_btn
    if (notifBtn && !notifBtn.contains(targetElement)) {
        document.querySelector("header .notif_list").classList.remove("active");
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