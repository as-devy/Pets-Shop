const { spawn } = require("child_process");

const tests = [
  { method: "GET", url: "http://localhost:3000/users/1" },
  { method: "GET", url: "http://localhost:3000/allPets" },
  { method: "GET", url: "http://localhost:3000/pet/1" },
  { method: "DELETE", url: "http://localhost:3000/pet/1" },

  {
    method: "POST",
    url: "http://localhost:3000/addUser",
    body: JSON.stringify({ name: "John", email: "john@example.com", password: "123456" }),
  },
  {
    method: "POST",
    url: "http://localhost:3000/loginUser",
    body: JSON.stringify({ email: "john@example.com", password: "123456" }),
  },
  {
    method: "POST",
    url: "http://localhost:3000/addPet",
    body: JSON.stringify({ name: "Buddy", type: "Dog", age: 3 }),
  },
  {
    method: "POST",
    url: "http://localhost:3000/addPetRequest/1",
    body: JSON.stringify({ userId: 1, message: "Interested in adopting." }),
  },
  {
    method: "PUT",
    url: "http://localhost:3000/updateRequest/1",
    body: JSON.stringify({ status: "approved" }),
  },
  {
    method: "POST",
    url: "http://localhost:3000/users/addrequestedPet/1",
    body: JSON.stringify({ petId: 2 }),
  },
  {
    method: "POST",
    url: "http://localhost:3000/users/addNotification/1",
    body: JSON.stringify({ message: "You have a new request." }),
  },
  {
    method: "DELETE",
    url: "http://localhost:3000/users/deleteNotifications/1",
  },
  {
    method: "POST",
    url: "http://localhost:3000/sendEmail",
    body: JSON.stringify({ to: "someone@example.com", subject: "Hello", text: "Testing email" }),
  },
  {
    method: "POST",
    url: "http://localhost:3000/sendVerification",
    body: JSON.stringify({ userId: 1, document: "doc_url" }),
  },
  {
    method: "GET",
    url: "http://localhost:3000/getVerifications",
  },
  {
    method: "PUT",
    url: "http://localhost:3000/updateVerificationStatus",
    body: JSON.stringify({ id: 1, status: "verified" }),
  },
];

tests.forEach(({ method, url, body }) => {
  const base = `autocannon -m ${method} -d 5 -c 10`;
  const headers = body ? `-H "Content-Type: application/json"` : "";
  const bodyPart = body ? `-b '${body}'` : "";

  const command = `${base} ${headers} ${bodyPart} ${url}`;

  console.log(`\n⏱️ Running Test: ${method} ${url}`);

  const autocannon = spawn(command, { shell: true });

  autocannon.stdout.on("data", (data) => {
    console.log(`Output: ${data}`);
  });

  autocannon.stderr.on("data", (data) => {
    console.error(`Error: ${data}`);
  });

  autocannon.on("close", (code) => {
    if (code === 0) {
      console.log(`✅ Test Completed for ${method} ${url}`);
    } else {
      console.error(`❌ Test Failed for ${method} ${url}`);
    }
  });
});
