import { isSupabaseConfigured } from "./supabaseClient.js";

const appRoot = document.querySelector("#app");

const icons = {
  add: '<path d="M12 5v14M5 12h14"/>',
  archive:
    '<rect width="18" height="4" x="3" y="3" rx="1"/><path d="M5 7v12h14V7"/><path d="M10 12h4"/>',
  backup:
    '<path d="M12 3C7.6 3 4 4.3 4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6c0-1.7-3.6-3-8-3Z"/><path d="M4 6c0 1.7 3.6 3 8 3s8-1.3 8-3"/><path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  calendar:
    '<path d="M8 2v4M16 2v4M3 10h18"/><rect width="18" height="18" x="3" y="4" rx="2"/>',
  check: '<path d="m5 12 4 4L19 6"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  tag: '<path d="M20.6 13.2 13.2 20.6a2 2 0 0 1-2.8 0L3 13.2V3h10.2l7.4 7.4a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
};

const seedBoard = {
  title: "DoneZone",
  lists: [
    {
      title: "Next",
      cards: [
        { title: "Create Supabase project", due: "Step 2", status: "ready", label: "Setup" },
        { title: "Run database schema", due: "Step 2", status: "ready", label: "Backend" },
      ],
    },
    {
      title: "Doing",
      cards: [{ title: "Project scaffold", due: "Complete", status: "done", label: "Frontend" }],
    },
    {
      title: "Done",
      cards: [],
    },
  ],
};

function render() {
  appRoot.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" aria-label="DoneZone navigation">
        <div class="brand">
          <img class="brand-logo" src="public/donezone-logo.svg" alt="" />
          <div>
            <p class="brand-title">DoneZone</p>
            <p class="brand-meta">GitHub Pages + Supabase</p>
          </div>
        </div>
        <button class="board-select active" type="button">
          <span class="board-name">${seedBoard.title}</span>
          <span class="board-meta">New project scaffold</span>
        </button>
      </aside>

      <main class="main">
        <header class="topbar">
          <div>
            <h1>${seedBoard.title}</h1>
            <p>${isSupabaseConfigured() ? "Supabase configuration detected" : "Supabase is not connected yet"}</p>
          </div>
          <div class="topbar-actions">
            <button class="action-button" type="button" title="Archive">${svgIcon("archive")}</button>
            <button class="action-button" type="button" title="Back up board">${svgIcon("backup")}</button>
            <button class="secondary-button" type="button">${svgIcon("add")}New List</button>
            <button class="primary-button" type="button">${svgIcon("add")}New Task</button>
          </div>
        </header>

        <section class="board-canvas" aria-label="DoneZone board">
          <div class="lists">
            ${seedBoard.lists.map(renderList).join("")}
          </div>
        </section>
      </main>
    </div>
  `;
}

function renderList(list) {
  const open = list.cards.filter((card) => card.status !== "done").length;
  const done = list.cards.length - open;
  return `
    <section class="list-column">
      <header class="list-header">
        <div>
          <h2>${list.title}</h2>
          <div class="list-counts">
            <span>${open} open</span>
            <span>${done} done</span>
          </div>
        </div>
        <button class="action-button" type="button" title="List options">${svgIcon("more")}</button>
      </header>
      <div class="cards">
        ${
          list.cards.length
            ? list.cards.map(renderCard).join("")
            : '<div class="empty-list">No tasks</div>'
        }
      </div>
    </section>
  `;
}

function renderCard(card) {
  return `
    <article class="task-card ${card.status === "done" ? "done" : ""}">
      <div class="task-title-row">
        <span class="check-icon">${svgIcon("check")}</span>
        <p>${card.title}</p>
      </div>
      <div class="tag-pill">${svgIcon("tag")}${card.label}</div>
      <div class="due-row">${svgIcon("calendar")}${card.due}</div>
    </article>
  `;
}

function svgIcon(name) {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${icons[name] || ""}
    </svg>
  `;
}

render();
