const userInfo = document.getElementById("user-info");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

sendBtn.addEventListener("click", main);

function sendHttpRequest(url, method, data) {
  return fetch(url, {
    method: method,
    body: JSON.stringify(data),
    headers: data ? { "Content-type": "application/json" } : {},
  }).then((res) => {
    if (!res.ok && res.status >= 500) {
      throw new Error("Error!");
    }
    return res.json();
  });
}

function main() {
  const user = userInput.value;

  sendHttpRequest(`https://api.github.com/users/${user}`)
    .then((data) => {
      userInfo.innerHTML = "";

      const aside = document.createElement("aside");
      aside.classList.add("user-details");
      aside.innerHTML = `
        <div class="user-details__header">
          <img src="${data.avatar_url}" alt="${data.login}" class="user-details__image" />
          <h2 class="user-details__title">${data.login}</h2>
        </div>
        <div class="user-details__content">
          <p class="user-details__text"><strong>Name:</strong> ${data.name}</p>
          <p class="user-details__text"><strong>Location:</strong> ${data.location}</p>
          <p class="user-details__text"><strong>Followers:</strong> ${data.followers}</p>
          <p class="user-details__text"><strong>Following:</strong> ${data.following}</p>
        </div>
      `;

      userInfo.appendChild(aside);

      sendHttpRequest(`https://api.github.com/users/${user}/repos`)
        .then((repos) => {
          let output = `<section class="user-repos"><h1 class="user-repos__title">${repos[0].owner.login}'s repos</h1>`;
          output += repos
            .map((repo) => {
              return `
                <article class="user-repos__repo">
                  <div class="user-repos__repo-content">
                    <h2 class="user-repos__repo-title">
                      ${repo.name}
                      <span class="user-repos__repo-title-badge">${
                        repo.language
                      }</span>
                    </h2>
                    <p class="user-repos__repo-description">Description: ${
                      repo.description ? repo.description : "No description"
                    }</p>
                    <div class="user-repos__repo-link-wrapper">
                      <a href="${
                        repo.html_url
                      }" class="user-repos__repo-link" target="_blank">Go to repo</a>
                    </div>
                  </div>
                  <div class="user-repos__repo-timestamps">
                    <p class="user-repos__repo-timestamps-text"><strong>Created At:</strong> ${
                      repo.created_at.split("T")[0]
                    }</p>
                    <p class="user-repos__repo-timestamps-text"><strong>Updated At:</strong> ${
                      repo.updated_at.split("T")[0]
                    }</p>
                    <p class="user-repos__repo-timestamps-text"><strong>Forks:</strong> ${
                      repo.forks
                    }</p>
                    <p class="user-repos__repo-timestamps-text"><strong>Watchers:</strong> ${
                      repo.watchers
                    }</p>
                  </div>
                </article>
              `;
            })
            .join("");
          output += `<\section>`;
          userInfo.innerHTML += output;
        })
        .catch(console.log);
    })
    .catch(console.log);
}
