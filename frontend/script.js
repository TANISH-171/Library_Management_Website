if (!localStorage.getItem("token")) {
  window.location.href = "login.html";
}

document.getElementById("book-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;

  await fetch("http://localhost:3000/api/books", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ title, author }),
  });

  document.getElementById("title").value = "";
  document.getElementById("author").value = "";
  loadBooks();
});

document.getElementById("search").addEventListener("input", (e) => {
  loadBooks(e.target.value);
});

document.getElementById("logout-btn").addEventListener("click", () => {
  localStorage.removeItem("token");
  alert("You have been logged out.");
  window.location.href = "login.html";
});

async function loadBooks(query = "") {
  const res = await fetch("http://localhost:3000/api/books?search=" + query);
  const books = await res.json();
  const list = document.getElementById("book-list");
  list.innerHTML = "";
  books.forEach((book) => {
    const li = document.createElement("li");
    li.textContent = `${book.title} by ${book.author}`;
    list.appendChild(li);
  });
}

loadBooks();
