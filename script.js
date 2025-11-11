// Fetch latest public repos from GitHub API
const username = "razonksunny";
const projectList = document.getElementById("project-list");

async function loadProjects() {
  try {
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    const repos = await res.json();

    projectList.innerHTML = "";
    repos.forEach(repo => {
      const card = document.createElement("div");
      card.className = "project-card";
      card.innerHTML = `
        <h3>${repo.name}</h3>
        <p>${repo.description || "No description available."}</p>
        <a href="${repo.html_url}" target="_blank">View on GitHub →</a>
      `;
      projectList.appendChild(card);
    });
  } catch (err) {
    projectList.innerHTML = "<p>Failed to load projects.</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadProjects);
