import {
  getAuthRedirectTo,
  isSupabaseConfigured,
  supabase,
} from "./supabaseClient.js";

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
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  copy: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
  edit:
    '<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  moon: '<path d="M21 14.5A8.5 8.5 0 0 1 9.5 3a7 7 0 1 0 11.5 11.5Z"/><path d="M17 3v4M19 5h-4"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  move: '<path d="M5 9l-3 3 3 3"/><path d="M9 5l3-3 3 3"/><path d="M15 19l-3 3-3-3"/><path d="M19 9l3 3-3 3"/><path d="M2 12h20"/><path d="M12 2v20"/>',
  play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.5 5.8L21 8"/><path d="M21 3v5h-5"/>',
  restore: '<path d="M3 12a9 9 0 1 0 3-6.7"/><path d="M3 3v6h6"/>',
  settings:
    '<path d="M12 15.5A3.5 3.5 0 1 0 12 8a3.5 3.5 0 0 0 0 7.5Z"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1A2 2 0 1 1 4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.3 7A2 2 0 1 1 7.1 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1A2 2 0 1 1 19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.1a2 2 0 1 1 0 4H21a1.7 1.7 0 0 0-1.6 1Z"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  tag: '<path d="M20.6 13.2 13.2 20.6a2 2 0 0 1-2.8 0L3 13.2V3h10.2l7.4 7.4a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
  trash:
    '<path d="M3 6h18"/><path d="M8 6V4h8v2"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>',
  unlock:
    '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.5-2.2"/>',
};

const starterLists = ["Next", "Doing", "Done"];
const defaultTags = [
  { name: "Task", color: "#b45309" },
  { name: "Follow-up", color: "#2563eb" },
  { name: "Important", color: "#b91c1c" },
];

const state = {
  loading: true,
  busy: false,
  authSending: false,
  session: null,
  user: null,
  boards: [],
  activeBoard: null,
  lists: [],
  cards: [],
  tags: [],
  cardTags: [],
  backups: [],
  backupSettings: null,
  showArchived: false,
  theme: loadThemePreference(),
  demo: false,
  modal: null,
  drag: null,
  notice: "",
  error: "",
};

applyTheme();

appRoot.addEventListener("submit", handleSubmit);
appRoot.addEventListener("click", handleClick);
appRoot.addEventListener("change", handleChange);
appRoot.addEventListener("dragstart", handleDragStart);
appRoot.addEventListener("dragend", handleDragEnd);
appRoot.addEventListener("dragover", handleDragOver);
appRoot.addEventListener("dragleave", handleDragLeave);
appRoot.addEventListener("drop", handleDrop);

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && state.modal) {
    closeModal();
  }
});
document.addEventListener("click", handleDocumentClick);
document.addEventListener("toggle", handleMenuToggle, true);

init();

async function init() {
  renderLoading();

  const { data, error } = await supabase.auth.getSession();
  if (error) state.error = error.message;

  state.session = data?.session || null;
  state.user = state.session?.user || null;

  if (state.user) {
    await hydrateData();
  }

  state.loading = false;
  render();

  supabase.auth.onAuthStateChange(async (_event, session) => {
    state.session = session;
    state.user = session?.user || null;
    state.error = "";

    if (state.user) {
      state.loading = true;
      render();
      await hydrateData();
      state.loading = false;
    } else {
      clearWorkspaceState();
    }

    render();
  });
}

async function hydrateData() {
  await ensureStarterData();
  await ensureDefaultTags();

  const [boardsResult, appStateResult, tagsResult] = await Promise.all([
    supabase
      .from("boards")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("app_state").select("*").maybeSingle(),
    supabase
      .from("tags")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  throwIfSupabaseError(boardsResult.error);
  throwIfSupabaseError(appStateResult.error);
  throwIfSupabaseError(tagsResult.error);

  state.boards = boardsResult.data || [];
  if (await repairDuplicateBoardTitles()) {
    return hydrateData();
  }

  state.theme = normalizeTheme(appStateResult.data?.theme || state.theme);
  saveThemePreference(state.theme);
  applyTheme();

  state.tags = tagsResult.data || [];

  const activeBoardId = appStateResult.data?.active_board_id;
  state.activeBoard =
    state.boards.find((board) => board.id === activeBoardId) ||
    state.boards[0] ||
    null;

  if (!state.activeBoard) {
    state.lists = [];
    state.cards = [];
    state.cardTags = [];
    state.backups = [];
    state.backupSettings = null;
    return;
  }

  if (state.activeBoard.id !== activeBoardId) {
    await saveActiveBoard(state.activeBoard.id);
  }

  const [listsResult, cardsResult, cardTagsResult, backupsResult, settingsResult] =
    await Promise.all([
      supabase
        .from("lists")
        .select("*")
        .eq("board_id", state.activeBoard.id)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase
        .from("cards")
        .select("*")
        .eq("board_id", state.activeBoard.id)
        .is("deleted_at", null)
        .order("sort_order", { ascending: true }),
      supabase.from("card_tags").select("*").is("deleted_at", null),
      supabase
        .from("board_backups")
        .select("*")
        .eq("board_id", state.activeBoard.id)
        .is("deleted_at", null)
        .order("created_at", { ascending: false }),
      supabase
        .from("board_backup_settings")
        .select("*")
        .eq("board_id", state.activeBoard.id)
        .maybeSingle(),
    ]);

  throwIfSupabaseError(listsResult.error);
  throwIfSupabaseError(cardsResult.error);
  throwIfSupabaseError(cardTagsResult.error);
  throwIfSupabaseError(backupsResult.error);
  throwIfSupabaseError(settingsResult.error);

  state.lists = listsResult.data || [];
  if (await repairDuplicateListTitles()) {
    return hydrateData();
  }

  state.cards = cardsResult.data || [];
  const visibleCardIds = new Set(state.cards.map((card) => card.id));
  state.cardTags = (cardTagsResult.data || []).filter((row) => visibleCardIds.has(row.card_id));
  state.backups = backupsResult.data || [];
  state.backupSettings = settingsResult.data || defaultBackupSettings(state.activeBoard.id);
}

async function ensureStarterData() {
  if (!state.user) return;

  const { data: existingBoards, error } = await supabase
    .from("boards")
    .select("id")
    .limit(1);

  throwIfSupabaseError(error);
  if (existingBoards?.length) return;

  const { data: board, error: boardError } = await supabase
    .from("boards")
    .insert({
      user_id: state.user.id,
      title: "DoneZone",
      sort_order: 0,
    })
    .select()
    .single();

  throwIfSupabaseError(boardError);

  const { data: lists, error: listsError } = await supabase
    .from("lists")
    .insert(
      starterLists.map((title, index) => ({
        user_id: state.user.id,
        board_id: board.id,
        title,
        sort_order: index,
      })),
    )
    .select();

  throwIfSupabaseError(listsError);

  const listByTitle = new Map((lists || []).map((list) => [list.title, list]));
  const nextList = listByTitle.get("Next");
  const doingList = listByTitle.get("Doing");

  const starterCards = [
    {
      user_id: state.user.id,
      board_id: board.id,
      list_id: nextList?.id,
      title: "Add your first DoneZone task",
      comment: "",
      due_at: null,
      sort_order: 0,
    },
    {
      user_id: state.user.id,
      board_id: board.id,
      list_id: doingList?.id || nextList?.id,
      title: "Connect GitHub Pages to Supabase",
      comment: "",
      due_at: null,
      sort_order: 0,
    },
  ].filter((card) => card.list_id);

  if (starterCards.length) {
    const { error: cardsError } = await supabase.from("cards").insert(starterCards);
    throwIfSupabaseError(cardsError);
  }

  await saveActiveBoard(board.id);
  await saveBackupSettings(defaultBackupSettings(board.id));
}

async function ensureDefaultTags() {
  if (!state.user) return;

  const { data: existingTags, error } = await supabase
    .from("tags")
    .select("id")
    .limit(1);

  throwIfSupabaseError(error);
  if (existingTags?.length) return;

  const { error: insertError } = await supabase.from("tags").insert(
    defaultTags.map((tag, index) => ({
      user_id: state.user.id,
      name: tag.name,
      color: tag.color,
      sort_order: index,
    })),
  );

  throwIfSupabaseError(insertError);
}

async function saveActiveBoard(boardId) {
  if (state.demo) {
    state.activeBoard = state.boards.find((board) => board.id === boardId) || state.activeBoard;
    return;
  }

  const { error } = await supabase.from("app_state").upsert({
    user_id: state.user.id,
    active_board_id: boardId,
    theme: state.theme,
  });

  throwIfSupabaseError(error);
}

function render() {
  if (state.loading) {
    renderLoading();
    return;
  }

  if (!state.session) {
    renderAuth();
    return;
  }

  renderApp();
}

function renderLoading() {
  appRoot.innerHTML = `
    <main class="auth-screen">
      <section class="auth-panel" aria-live="polite">
        <img class="auth-logo" src="public/donezone-logo.svg" alt="" />
        <h1>DoneZone</h1>
        <p>Loading your workspace...</p>
        <p class="auth-note auth-credit">Built by Khizer</p>
      </section>
    </main>
  `;
}

function renderAuth() {
  appRoot.innerHTML = `
    <main class="auth-screen">
      <section class="auth-panel">
        <img class="auth-logo" src="public/donezone-logo.svg" alt="" />
        <h1>DoneZone</h1>
        <p>Sign in with your email to open your task board.</p>
        ${renderStatus()}
        <form id="magic-link-form" class="auth-form">
          <label for="email">Email</label>
          <input id="email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required />
          <button class="primary-button wide" type="submit" ${state.authSending ? "disabled" : ""}>
            ${state.authSending ? "Sending..." : "Send sign-in link"}
          </button>
        </form>
        <button class="secondary-button wide" type="button" data-action="enter-demo">
          ${svgIcon("play")}Try Demo Mode
        </button>
        <p class="auth-note">Sign-in links open the hosted GitHub Pages app.</p>
        <p class="auth-note auth-credit">Built by Khizer</p>
      </section>
    </main>
  `;
}

function renderApp() {
  const totals = getBoardTotals();
  const boardTitle = state.activeBoard?.title || "DoneZone";
  const activeLists = state.lists.filter((list) => !list.archived);

  appRoot.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" aria-label="DoneZone navigation">
        <div class="brand">
          <img class="brand-logo" src="public/donezone-logo.svg" alt="" />
          <div>
            <p class="brand-title">DoneZone</p>
            <p class="brand-meta">Built by Khizer</p>
          </div>
        </div>

        <div class="board-list">
          ${state.boards.map(renderBoardRow).join("")}
        </div>

        <button class="secondary-button wide" type="button" data-action="open-board-form">
          ${svgIcon("add")}New Board
        </button>

        <div class="sidebar-footer">
          <p>${escapeHtml(state.user?.email || "")}</p>
          <button class="secondary-button wide" type="button" data-action="sign-out">
            ${svgIcon("logOut")}Sign Out
          </button>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <div>
            <h1>${escapeHtml(boardTitle)}</h1>
            <p>${state.demo ? "Demo mode - changes stay in this browser" : isSupabaseConfigured() ? "Saved in Supabase" : "Supabase is not connected"} &middot; ${activeLists.length} lists &middot; ${totals.open} open &middot; ${totals.done} done &middot; ${totals.archived} archived</p>
          </div>
          <div class="topbar-actions">
            <button class="action-button" type="button" title="Refresh" data-action="refresh">${svgIcon("refresh")}</button>
            <button class="action-button ${state.showArchived ? "active" : ""}" type="button" title="${state.showArchived ? "Hide archived" : "Show archived"}" data-action="toggle-archived">${svgIcon("archive")}</button>
            <button class="action-button" type="button" title="${state.theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}" data-action="toggle-theme">${svgIcon(state.theme === "dark" ? "sun" : "moon")}</button>
            <details class="menu-wrap board-menu">
              <summary class="action-button menu-trigger" title="Board options" aria-label="Board options">${svgIcon("more")}</summary>
              <div class="options-menu">
                <button class="menu-item" type="button" data-action="open-board-form" data-board-id="${state.activeBoard?.id || ""}">${svgIcon("edit")}Edit Board</button>
                <button class="menu-item" type="button" data-action="open-labels">${svgIcon("tag")}Manage Labels</button>
                <button class="menu-item" type="button" data-action="backup">${svgIcon("backup")}Back Up Board</button>
                <button class="menu-item" type="button" data-action="open-restore">${svgIcon("restore")}Restore Backup</button>
                <button class="menu-item" type="button" data-action="open-backup-settings">${svgIcon("settings")}Automatic Backup Settings</button>
                <button class="menu-item danger" type="button" data-action="confirm-delete-board" data-board-id="${state.activeBoard?.id || ""}">${svgIcon("trash")}Delete Board</button>
              </div>
            </details>
            <button class="secondary-button" type="button" data-action="open-list-form">${svgIcon("add")}New List</button>
            <button class="primary-button" type="button" data-action="open-card-form">${svgIcon("add")}New Task</button>
          </div>
        </header>

        ${renderStatus()}

        <section class="board-canvas" aria-label="DoneZone board">
          ${
            state.activeBoard
              ? `<div class="lists">${activeLists.map(renderList).join("")}${state.showArchived ? renderArchivedColumn() : ""}</div>`
              : '<div class="empty-state">Create a board to get started.</div>'
          }
        </section>
      </main>
      ${renderModal()}
    </div>
  `;
}

function renderBoardRow(board) {
  const isActive = board.id === state.activeBoard?.id;
  return `
    <div class="board-row">
      <button class="board-select ${isActive ? "active" : ""}" type="button" data-action="switch-board" data-board-id="${board.id}">
        <span class="board-name">${escapeHtml(board.title)}</span>
        <span class="board-meta">${isActive ? "Active board" : "Open board"}</span>
      </button>
      <details class="menu-wrap compact-menu">
        <summary class="action-button compact" title="Board options" aria-label="Board options">${svgIcon("more")}</summary>
        <div class="options-menu">
          <button class="menu-item" type="button" data-action="open-board-form" data-board-id="${board.id}">${svgIcon("edit")}Edit</button>
          <button class="menu-item" type="button" data-action="switch-board" data-board-id="${board.id}">${svgIcon("move")}Open</button>
          <button class="menu-item danger" type="button" data-action="confirm-delete-board" data-board-id="${board.id}">${svgIcon("trash")}Delete</button>
        </div>
      </details>
    </div>
  `;
}

function renderList(list) {
  const cards = getCardsForList(list.id).filter((card) => !card.archived);
  const open = cards.filter((card) => !card.done).length;
  const done = cards.length - open;
  const lockAction = list.locked ? "unlock-list" : "lock-list";
  const lockLabel = list.locked ? "Unlock List" : "Lock List";

  return `
    <section class="list-column ${list.locked ? "locked" : ""}" data-list-id="${list.id}" data-list-locked="${list.locked}">
      <header class="list-header" draggable="${list.locked ? "false" : "true"}" data-drag-type="list" data-list-id="${list.id}">
        <div>
          <h2>${escapeHtml(list.title)}${list.locked ? `<span class="list-lock-badge">${svgIcon("lock")}</span>` : ""}</h2>
          <div class="list-counts">
            <span>${open} open</span>
            <span>${done} done</span>
          </div>
        </div>
        <div class="list-actions">
          <button class="action-button" type="button" title="Add task" data-action="open-card-form" data-list-id="${list.id}" ${list.locked ? "disabled" : ""}>${svgIcon("add")}</button>
          <details class="menu-wrap">
            <summary class="action-button menu-trigger" title="List options" aria-label="List options">${svgIcon("more")}</summary>
            <div class="options-menu">
              <button class="menu-item" type="button" data-action="open-list-form" data-list-id="${list.id}">${svgIcon("edit")}Edit</button>
              <button class="menu-item" type="button" data-action="duplicate-list-empty" data-list-id="${list.id}">${svgIcon("copy")}Duplicate List</button>
              <button class="menu-item" type="button" data-action="duplicate-list-with-cards" data-list-id="${list.id}">${svgIcon("copy")}Duplicate List with Tasks</button>
              <button class="menu-item" type="button" data-action="${lockAction}" data-list-id="${list.id}">${svgIcon(list.locked ? "unlock" : "lock")}${lockLabel}</button>
              <button class="menu-item" type="button" data-action="archive-list" data-list-id="${list.id}">${svgIcon("archive")}Archive List</button>
              <button class="menu-item danger" type="button" data-action="confirm-delete-list" data-list-id="${list.id}">${svgIcon("trash")}Delete</button>
            </div>
          </details>
        </div>
      </header>
      <div class="cards" data-drop-list="${list.id}">
        ${cards.map((card) => renderCard(list, card)).join("")}
        ${renderAddTaskCard(list)}
      </div>
    </section>
  `;
}

function renderAddTaskCard(list) {
  return `
    <button class="add-task-card" type="button" data-action="open-card-form" data-list-id="${list.id}" ${list.locked ? "disabled" : ""}>
      ${svgIcon("add")}Create New Task
    </button>
  `;
}

function renderArchivedColumn() {
  const archivedLists = state.lists.filter((list) => list.archived);
  const archivedCards = state.cards.filter((card) => card.archived && !getListById(card.list_id)?.archived);
  return `
    <section class="list-column archived-column" data-list-id="archived">
      <header class="list-header">
        <div>
          <h2>Archived</h2>
          <div class="list-counts">
            <span>${archivedCards.length} tasks</span>
            <span>${archivedLists.length} lists</span>
          </div>
        </div>
      </header>
      <div class="cards">
        ${
          archivedLists.length || archivedCards.length
            ? `
              ${archivedLists.map(renderArchivedList).join("")}
              ${archivedCards.map((card) => renderCard(getListById(card.list_id) || { id: card.list_id, title: "Archived" }, card, { archivedView: true })).join("")}
            `
            : '<div class="empty-list">No archived tasks or lists</div>'
        }
      </div>
    </section>
  `;
}

function renderArchivedList(list) {
  const cards = getCardsForList(list.id);
  return `
    <div class="archived-group">
      <div class="archived-heading">
        <strong>${escapeHtml(list.title)}</strong>
        <button class="secondary-button compact-button" type="button" data-action="restore-list" data-list-id="${list.id}">${svgIcon("restore")}Restore List</button>
      </div>
      ${cards.length ? cards.map((card) => renderCard(list, card, { archivedView: true, listArchived: true })).join("") : '<div class="empty-list">Archived list has no tasks</div>'}
    </div>
  `;
}

function renderCard(list, card, options = {}) {
  const tags = getTagsForCard(card.id);
  const isArchived = Boolean(card.archived || options.archivedView || options.listArchived);
  return `
    <article class="task-card ${card.done ? "done" : ""} ${isArchived ? "archived" : ""}" ${isArchived || list.locked ? "" : 'draggable="true"'} data-drag-type="card" data-card-id="${card.id}" data-list-id="${list.id}">
      <div class="task-title-row">
        <button class="check-icon ${card.done ? "checked" : ""}" type="button" title="${card.done ? "Mark open" : "Mark done"}" data-action="toggle-card" data-card-id="${card.id}">
          ${card.done ? svgIcon("check") : ""}
        </button>
        <button class="task-title-button" type="button" data-action="open-card-form" data-card-id="${card.id}" data-list-id="${list.id}">
          ${escapeHtml(card.title)}
        </button>
        <details class="menu-wrap card-menu">
          <summary class="action-button compact menu-trigger" title="Task options" aria-label="Task options">${svgIcon("more")}</summary>
          <div class="options-menu">
            <button class="menu-item" type="button" data-action="open-card-form" data-card-id="${card.id}" data-list-id="${list.id}">${svgIcon("edit")}Edit Task</button>
            <button class="menu-item" type="button" data-action="duplicate-card" data-card-id="${card.id}">${svgIcon("copy")}Duplicate Card</button>
            <button class="menu-item" type="button" data-action="open-copy-card" data-card-id="${card.id}">${svgIcon("copy")}Copy To</button>
            <button class="menu-item" type="button" data-action="open-move-card" data-card-id="${card.id}">${svgIcon("move")}Move To</button>
            <button class="menu-item" type="button" data-action="toggle-archive-card" data-card-id="${card.id}">${svgIcon("archive")}${card.archived ? "Restore Task" : "Archive Task"}</button>
            <button class="menu-item danger" type="button" data-action="confirm-delete-card" data-card-id="${card.id}">${svgIcon("trash")}Delete</button>
          </div>
        </details>
      </div>
      ${tags.length ? `<div class="tag-row">${tags.map(renderTagPill).join("")}</div>` : ""}
      ${card.comment ? `<p class="comment-preview">${escapeHtml(card.comment)}</p>` : ""}
      <div class="due-row">${svgIcon("calendar")}${formatDue(card.due_at)}${options.archivedView ? ` · From ${escapeHtml(list.title)}` : ""}</div>
    </article>
  `;
}

function renderTagPill(tag) {
  return `<span class="tag-pill" style="--tag-color: ${escapeAttribute(tag.color || "#b45309")}">${svgIcon("tag")}${escapeHtml(tag.name)}</span>`;
}

function renderModal() {
  if (!state.modal) return "";

  if (state.modal.type === "board-form") return renderBoardModal();
  if (state.modal.type === "list-form") return renderListModal();
  if (state.modal.type === "card-form") return renderCardModal();
  if (state.modal.type === "labels") return renderLabelsModal();
  if (state.modal.type === "transfer-card") return renderTransferModal();
  if (state.modal.type === "restore") return renderRestoreModal();
  if (state.modal.type === "backup-settings") return renderBackupSettingsModal();
  if (state.modal.type === "confirm") return renderConfirmModal();
  return "";
}

function renderBoardModal() {
  const board = state.boards.find((item) => item.id === state.modal.boardId);
  const title = board?.title || "";
  return renderDialog(
    board ? "Edit Board" : "New Board",
    `
      <form class="dialog-form" data-form="board">
        <input type="hidden" name="boardId" value="${escapeAttribute(board?.id || "")}" />
        <label class="field">
          <span>Board name</span>
          <input class="text-input" name="title" type="text" value="${escapeAttribute(title)}" maxlength="80" required autofocus />
        </label>
        <div class="dialog-actions">
          <button class="ghost-button" type="button" data-action="close-modal">${svgIcon("close")}Cancel</button>
          <button class="primary-button" type="submit">${svgIcon("check")}Save</button>
        </div>
      </form>
    `,
  );
}

function renderListModal() {
  const list = state.lists.find((item) => item.id === state.modal.listId);
  const title = list?.title || "";
  return renderDialog(
    list ? "Edit List" : "New List",
    `
      <form class="dialog-form" data-form="list">
        <input type="hidden" name="listId" value="${escapeAttribute(list?.id || "")}" />
        <label class="field">
          <span>List name</span>
          <input class="text-input" name="title" type="text" value="${escapeAttribute(title)}" maxlength="80" required autofocus />
        </label>
        <div class="dialog-actions">
          <button class="ghost-button" type="button" data-action="close-modal">${svgIcon("close")}Cancel</button>
          <button class="primary-button" type="submit">${svgIcon("check")}Save</button>
        </div>
      </form>
    `,
  );
}

function renderCardModal() {
  const card = state.cards.find((item) => item.id === state.modal.cardId);
  const listId = state.modal.listId || card?.list_id || firstWritableList()?.id || "";
  const selectedTagIds = new Set(card ? getTagIdsForCard(card.id) : state.tags[0] ? [state.tags[0].id] : []);
  const writableLists = state.lists.filter((list) => !list.archived);

  return renderDialog(
    card ? "Edit Task" : "New Task",
    `
      <form class="dialog-form" data-form="card">
        <input type="hidden" name="cardId" value="${escapeAttribute(card?.id || "")}" />
        <label class="field">
          <span>Task title</span>
          <input class="text-input" name="title" type="text" value="${escapeAttribute(card?.title || "")}" maxlength="120" required autofocus />
        </label>
        <label class="field">
          <span>List</span>
          <select class="text-input" name="listId" required>
            ${writableLists.map((list) => `
              <option value="${list.id}" ${list.id === listId ? "selected" : ""} ${list.locked && list.id !== card?.list_id ? "disabled" : ""}>${escapeHtml(list.title)}${list.locked ? " (Locked)" : ""}</option>
            `).join("")}
          </select>
        </label>
        <label class="field">
          <span>Due date and time</span>
          <input class="text-input" name="dueAt" type="datetime-local" value="${escapeAttribute(toDateTimeLocal(card?.due_at))}" />
        </label>
        <label class="field">
          <span>Comment</span>
          <textarea class="textarea-input" name="comment" rows="4" maxlength="1200" placeholder="Add notes, links, or context">${escapeHtml(card?.comment || "")}</textarea>
        </label>
        <label class="check-row">
          <input name="done" type="checkbox" ${card?.done ? "checked" : ""} />
          <span>Done</span>
        </label>
        <fieldset class="tag-picker">
          <div class="tag-picker-header">
            <span class="tag-picker-title">Labels</span>
            <button class="ghost-button compact-button" type="button" data-action="open-labels">${svgIcon("tag")}Manage Labels</button>
          </div>
          <div class="tag-options">
            ${
              state.tags.length
                ? state.tags.map((tag) => `
                  <label class="tag-choice" style="--tag-color: ${escapeAttribute(tag.color)}">
                    <input name="tagIds" type="checkbox" value="${tag.id}" ${selectedTagIds.has(tag.id) ? "checked" : ""} />
                    <span>${escapeHtml(tag.name)}</span>
                  </label>
                `).join("")
                : '<p class="dialog-copy">Create a label to tag this task.</p>'
            }
          </div>
        </fieldset>
        <div class="dialog-actions">
          <button class="ghost-button" type="button" data-action="close-modal">${svgIcon("close")}Cancel</button>
          <button class="primary-button" type="submit">${svgIcon("check")}Save</button>
        </div>
      </form>
    `,
    "wide-dialog",
  );
}

function renderLabelsModal() {
  return renderDialog(
    "Manage Labels",
    `
      <form class="label-create-form" data-form="label-create">
        <label class="field">
          <span>New label</span>
          <input class="text-input" name="name" type="text" maxlength="40" placeholder="Label name" required autofocus />
        </label>
        <label class="field color-field">
          <span>Color</span>
          <input class="color-input" name="color" type="color" value="#2563eb" aria-label="New label color" />
        </label>
        <button class="primary-button" type="submit">${svgIcon("add")}Add Label</button>
      </form>
      <div class="label-manager-list">
        ${
          state.tags.length
            ? state.tags.map(renderLabelRow).join("")
            : '<div class="empty-list">No labels yet</div>'
        }
      </div>
    `,
    "wide-dialog",
  );
}

function renderLabelRow(tag) {
  return `
    <form class="label-row" data-form="label-update">
      <input type="hidden" name="tagId" value="${tag.id}" />
      <div class="label-row-preview" style="--tag-color: ${escapeAttribute(tag.color)}">
        ${renderTagPill(tag)}
      </div>
      <label class="field label-name-field">
        <span>Name</span>
        <input class="text-input" name="name" type="text" value="${escapeAttribute(tag.name)}" maxlength="40" required />
      </label>
      <label class="field color-field">
        <span>Color</span>
        <input class="color-input" name="color" type="color" value="${escapeAttribute(normalizeColor(tag.color, "#2563eb"))}" aria-label="${escapeAttribute(tag.name)} color" />
      </label>
      <div class="label-row-actions">
        <button class="secondary-button compact-button" type="submit">${svgIcon("check")}Save</button>
        <button class="ghost-button compact-button danger-text" type="button" data-action="confirm-delete-label" data-tag-id="${tag.id}">${svgIcon("trash")}Delete</button>
      </div>
    </form>
  `;
}

function renderTransferModal() {
  const card = state.cards.find((item) => item.id === state.modal.cardId);
  const modeLabel = state.modal.mode === "copy" ? "Copy" : "Move";
  const lists = state.lists.filter((list) => !list.archived && list.id !== card?.list_id);

  return renderDialog(
    `${modeLabel} Task To`,
    `
      <p class="dialog-copy">Choose a destination list for "${escapeHtml(card?.title || "this task")}".</p>
      <div class="transfer-list">
        ${
          lists.length
            ? lists.map((list) => `
              <button class="transfer-row" type="button" data-action="transfer-card" data-list-id="${list.id}" ${list.locked ? "disabled" : ""}>
                <span>${escapeHtml(list.title)}${list.locked ? " (Locked)" : ""}</span>
                <small>${getCardsForList(list.id).filter((item) => !item.archived).length} tasks</small>
              </button>
            `).join("")
            : '<div class="empty-list">Create another list before copying or moving this task.</div>'
        }
      </div>
    `,
  );
}

function renderRestoreModal() {
  return renderDialog(
    "Restore Backup",
    `
      <p class="dialog-copy">Restore "${escapeHtml(state.activeBoard?.title || "this board")}" to a saved state. A safety backup is created first.</p>
      <div class="backup-list">
        ${
          state.backups.length
            ? state.backups.map((backup) => `
              <div class="backup-row">
                <div class="backup-row-copy">
                  <strong>${escapeHtml(formatDateTime(backup.created_at))}</strong>
                  <span>${escapeHtml(backup.reason || "Board backup")} · ${describeSnapshot(backup.snapshot)}</span>
                </div>
                <button class="secondary-button compact-button" type="button" data-action="restore-backup" data-backup-id="${backup.id}">${svgIcon("restore")}Restore</button>
              </div>
            `).join("")
            : '<div class="empty-list">No backups yet</div>'
        }
      </div>
    `,
    "wide-dialog",
  );
}

function renderBackupSettingsModal() {
  const settings = state.backupSettings || defaultBackupSettings(state.activeBoard?.id);
  return renderDialog(
    "Automatic Backup Settings",
    `
      <form class="dialog-form" data-form="backup-settings">
        <label class="check-row">
          <input name="enabled" type="checkbox" ${settings.enabled ? "checked" : ""} />
          <span>Automatically back up this board</span>
        </label>
        <label class="field">
          <span>Recurrence</span>
          <select class="text-input" name="frequency">
            ${["daily", "interval", "weekly", "monthly"].map((value) => `
              <option value="${value}" ${settings.frequency === value ? "selected" : ""}>${capitalize(value)}</option>
            `).join("")}
          </select>
        </label>
        <div class="settings-grid">
          <label class="field">
            <span>Every X days</span>
            <input class="text-input" name="intervalDays" type="number" min="1" max="365" value="${settings.interval_days || 7}" />
          </label>
          <label class="field">
            <span>Day of week</span>
            <select class="text-input" name="dayOfWeek">
              ${["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((label, index) => `
                <option value="${index}" ${Number(settings.day_of_week) === index ? "selected" : ""}>${label}</option>
              `).join("")}
            </select>
          </label>
          <label class="field">
            <span>Day of month</span>
            <input class="text-input" name="dayOfMonth" type="number" min="1" max="31" value="${settings.day_of_month || 1}" />
          </label>
        </div>
        <p class="dialog-copy">Last automatic backup: ${escapeHtml(settings.last_auto_backup_at ? formatDateTime(settings.last_auto_backup_at) : "Never")}</p>
        <div class="dialog-actions">
          <button class="ghost-button" type="button" data-action="close-modal">${svgIcon("close")}Cancel</button>
          <button class="primary-button" type="submit">${svgIcon("check")}Save</button>
        </div>
      </form>
    `,
  );
}

function renderConfirmModal() {
  return renderDialog(
    state.modal.title,
    `
      <p class="dialog-copy">${escapeHtml(state.modal.copy)}</p>
      <div class="dialog-actions">
        <button class="ghost-button" type="button" data-action="close-modal">${svgIcon("close")}Cancel</button>
        <button class="danger-button" type="button" data-action="run-confirm">${svgIcon("trash")}${escapeHtml(state.modal.confirmLabel || "Delete")}</button>
      </div>
    `,
  );
}

function renderDialog(title, body, extraClass = "") {
  return `
    <div class="dialog-backdrop" role="presentation" data-action="modal-backdrop">
      <section class="dialog ${extraClass}" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
        <header class="dialog-header">
          <h2 class="dialog-title" id="dialog-title">${escapeHtml(title)}</h2>
          <button class="action-button" type="button" data-action="close-modal" title="Close" aria-label="Close">${svgIcon("close")}</button>
        </header>
        <div class="dialog-body">${body}</div>
      </section>
    </div>
  `;
}

function renderStatus() {
  if (!state.notice && !state.error && !state.busy) return "";

  return `
    <div class="status-stack" aria-live="polite">
      ${state.busy ? '<div class="status-banner">Saving...</div>' : ""}
      ${state.notice ? `<div class="status-banner success">${escapeHtml(state.notice)}</div>` : ""}
      ${state.error ? `<div class="status-banner error">${escapeHtml(state.error)}</div>` : ""}
    </div>
  `;
}

async function handleSubmit(event) {
  if (event.target.id === "magic-link-form") {
    event.preventDefault();
    await sendMagicLink(event.target);
    return;
  }

  const form = event.target.closest("[data-form]");
  if (!form || state.busy) return;

  event.preventDefault();
  const formType = form.dataset.form;
  const formData = new FormData(form);

  const actions = {
    "backup-settings": () => submitBackupSettings(formData),
    board: () => submitBoardForm(formData),
    card: () => submitCardForm(formData),
    "label-create": () => submitLabelCreate(formData),
    "label-update": () => submitLabelUpdate(formData),
    list: () => submitListForm(formData),
  };

  if (actions[formType]) {
    await runAction(actions[formType]);
  }
}

async function handleClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || state.busy) return;

  const action = button.dataset.action;

  if (action === "modal-backdrop" && event.target !== button) return;

  if (action === "enter-demo") {
    enterDemoMode();
    return;
  }

  if (action === "sign-out") {
    if (state.demo) {
      exitDemoMode();
      return;
    }
    await supabase.auth.signOut();
    return;
  }

  if (action === "close-modal" || action === "modal-backdrop") {
    closeModal();
    return;
  }

  if (!state.user) return;

  const openActions = {
    "open-backup-settings": () => openModal({ type: "backup-settings" }),
    "open-board-form": () => openModal({ type: "board-form", boardId: button.dataset.boardId || null }),
    "open-card-form": () => openModal({ type: "card-form", cardId: button.dataset.cardId || null, listId: button.dataset.listId || null }),
    "open-copy-card": () => openTransferModal("copy", button.dataset.cardId),
    "open-labels": () => openModal({ type: "labels" }),
    "open-list-form": () => openModal({ type: "list-form", listId: button.dataset.listId || null }),
    "open-move-card": () => openTransferModal("move", button.dataset.cardId),
    "open-restore": () => openModal({ type: "restore" }),
  };

  if (openActions[action]) {
    openActions[action]();
    return;
  }

  const confirmActions = {
    "confirm-delete-board": () => confirmDeleteBoard(button.dataset.boardId),
    "confirm-delete-card": () => confirmDeleteCard(button.dataset.cardId),
    "confirm-delete-label": () => confirmDeleteLabel(button.dataset.tagId),
    "confirm-delete-list": () => confirmDeleteList(button.dataset.listId),
  };

  if (confirmActions[action]) {
    confirmActions[action]();
    return;
  }

  if (action === "run-confirm") {
    await runAction(async () => {
      if (typeof state.modal?.run === "function") await state.modal.run();
      closeModal(false);
    });
    return;
  }

  const dataActions = {
    "archive-list": () => archiveList(button.dataset.listId),
    backup: backupBoard,
    "duplicate-card": () => duplicateCard(button.dataset.cardId),
    "duplicate-list-empty": () => duplicateList(button.dataset.listId, { includeCards: false }),
    "duplicate-list-with-cards": () => duplicateList(button.dataset.listId, { includeCards: true }),
    "lock-list": () => setListLocked(button.dataset.listId, true),
    refresh: async () => {},
    "restore-backup": () => restoreBackup(button.dataset.backupId),
    "restore-list": () => setListArchived(button.dataset.listId, false),
    "switch-board": () => switchBoard(button.dataset.boardId),
    "toggle-archive-card": () => toggleArchiveCard(button.dataset.cardId),
    "toggle-archived": async () => {
      state.showArchived = !state.showArchived;
    },
    "toggle-card": () => toggleCard(button.dataset.cardId),
    "toggle-theme": toggleTheme,
    "transfer-card": () => transferCard(button.dataset.listId),
    "unlock-list": () => setListLocked(button.dataset.listId, false),
  };

  if (dataActions[action]) {
    await runAction(dataActions[action]);
  }
}

function handleChange(event) {
  if (event.target.matches('input[name="done"][data-card-id]')) {
    runAction(() => toggleCard(event.target.dataset.cardId));
  }
}

function handleDocumentClick(event) {
  if (!event.target.closest("details.menu-wrap")) {
    closeOpenMenus();
  }
}

function handleMenuToggle(event) {
  const menu = event.target;
  if (!menu.matches?.("details.menu-wrap[open]")) return;
  document.querySelectorAll("details.menu-wrap[open]").forEach((openMenu) => {
    if (openMenu !== menu) openMenu.removeAttribute("open");
  });
}

function closeOpenMenus() {
  document.querySelectorAll("details.menu-wrap[open]").forEach((menu) => {
    menu.removeAttribute("open");
  });
}

async function sendMagicLink(form) {
  const formData = new FormData(form);
  const email = String(formData.get("email") || "").trim();
  if (!email) return;

  state.authSending = true;
  state.notice = "";
  state.error = "";
  renderAuth();

  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: getAuthRedirectTo(),
      shouldCreateUser: true,
    },
  });

  state.authSending = false;
  state.notice = error ? "" : "Check your email for the DoneZone sign-in link.";
  state.error = error?.message || "";
  renderAuth();
}

function enterDemoMode() {
  const userId = "demo-user";
  const boardId = "demo-board";
  const nextListId = "demo-list-next";
  const doingListId = "demo-list-doing";
  const doneListId = "demo-list-done";
  const taskTagId = "demo-tag-task";
  const focusTagId = "demo-tag-focus";
  const launchTagId = "demo-tag-launch";

  state.demo = true;
  state.loading = false;
  state.session = { user: { id: userId, email: "demo@donezone.app" } };
  state.user = state.session.user;
  state.boards = [
    {
      id: boardId,
      user_id: userId,
      title: "DoneZone Demo",
      sort_order: 0,
    },
  ];
  state.activeBoard = state.boards[0];
  state.lists = [
    {
      id: nextListId,
      user_id: userId,
      board_id: boardId,
      title: "Next",
      archived: false,
      locked: false,
      sort_order: 0,
    },
    {
      id: doingListId,
      user_id: userId,
      board_id: boardId,
      title: "Doing",
      archived: false,
      locked: false,
      sort_order: 1,
    },
    {
      id: doneListId,
      user_id: userId,
      board_id: boardId,
      title: "Done",
      archived: false,
      locked: false,
      sort_order: 2,
    },
  ];
  state.cards = [
    {
      id: "demo-card-1",
      user_id: userId,
      board_id: boardId,
      list_id: nextListId,
      title: "Plan your first DoneZone board",
      comment: "Try opening this task, editing labels, or dragging it to another list.",
      due_at: null,
      done: false,
      archived: false,
      sort_order: 0,
    },
    {
      id: "demo-card-2",
      user_id: userId,
      board_id: boardId,
      list_id: nextListId,
      title: "Create labels for priorities",
      comment: "",
      due_at: null,
      done: false,
      archived: false,
      sort_order: 1,
    },
    {
      id: "demo-card-3",
      user_id: userId,
      board_id: boardId,
      list_id: doingListId,
      title: "Move cards by dragging anywhere into a list",
      comment: "",
      due_at: null,
      done: false,
      archived: false,
      sort_order: 0,
    },
  ];
  state.tags = [
    { id: taskTagId, user_id: userId, name: "Task", color: "#b45309", sort_order: 0 },
    { id: focusTagId, user_id: userId, name: "Focus", color: "#2563eb", sort_order: 1 },
    { id: launchTagId, user_id: userId, name: "Launch", color: "#16a34a", sort_order: 2 },
  ];
  state.cardTags = [
    { user_id: userId, card_id: "demo-card-1", tag_id: taskTagId, sort_order: 0 },
    { user_id: userId, card_id: "demo-card-2", tag_id: focusTagId, sort_order: 0 },
    { user_id: userId, card_id: "demo-card-3", tag_id: launchTagId, sort_order: 0 },
  ];
  state.backups = [];
  state.backupSettings = defaultBackupSettings(boardId);
  state.showArchived = false;
  state.modal = null;
  state.notice = "Demo mode enabled. Changes stay in this browser.";
  state.error = "";
  render();
}

function exitDemoMode() {
  state.demo = false;
  clearWorkspaceState();
  state.session = null;
  state.user = null;
  state.notice = "";
  state.error = "";
  renderAuth();
}

async function runAction(action) {
  state.busy = true;
  state.error = "";
  state.notice = "";
  render();

  try {
    await action();
    if (!state.demo) {
      await hydrateData();
    }
  } catch (error) {
    state.error = getErrorMessage(error);
  } finally {
    state.busy = false;
    render();
  }
}

async function submitBoardForm(formData) {
  const boardId = String(formData.get("boardId") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("Board name is required.");
  if (hasDuplicateBoardTitle(title, boardId)) {
    throw new Error(`A board named "${title}" already exists.`);
  }

  if (state.demo) {
    if (boardId) {
      const board = state.boards.find((item) => item.id === boardId);
      if (!board) throw new Error("Board not found.");
      board.title = title;
      state.notice = "Board renamed.";
    } else {
      const newBoard = {
        id: demoId("board"),
        user_id: state.user.id,
        title,
        sort_order: getNextSortOrder(state.boards),
      };
      state.boards.push(newBoard);
      state.activeBoard = newBoard;
      starterLists.forEach((listTitle, index) => {
        state.lists.push({
          id: demoId("list"),
          user_id: state.user.id,
          board_id: newBoard.id,
          title: listTitle,
          archived: false,
          locked: false,
          sort_order: index,
        });
      });
      state.notice = "Board created.";
    }
    closeModal(false);
    return;
  }

  if (boardId) {
    const { error } = await supabase.from("boards").update({ title }).eq("id", boardId);
    throwIfSupabaseError(error);
    state.notice = "Board renamed.";
  } else {
    const { data: board, error } = await supabase
      .from("boards")
      .insert({
        user_id: state.user.id,
        title,
        sort_order: getNextSortOrder(state.boards),
      })
      .select()
      .single();

    throwIfSupabaseError(error);

    const { error: listError } = await supabase.from("lists").insert(
      starterLists.map((listTitle, index) => ({
        user_id: state.user.id,
        board_id: board.id,
        title: listTitle,
        sort_order: index,
      })),
    );
    throwIfSupabaseError(listError);
    await saveActiveBoard(board.id);
    await saveBackupSettings(defaultBackupSettings(board.id));
    state.notice = "Board created.";
  }

  closeModal(false);
}

async function submitListForm(formData) {
  if (!state.activeBoard) return;

  const listId = String(formData.get("listId") || "");
  const title = String(formData.get("title") || "").trim();
  if (!title) throw new Error("List name is required.");
  if (hasDuplicateListTitle(title, listId)) {
    throw new Error(`A list named "${title}" already exists on this board.`);
  }

  await backupBoard("Before list change", { quiet: true });

  if (state.demo) {
    if (listId) {
      const list = getListById(listId);
      if (!list) throw new Error("List not found.");
      list.title = title;
      state.notice = "List renamed.";
    } else {
      state.lists.push({
        id: demoId("list"),
        user_id: state.user.id,
        board_id: state.activeBoard.id,
        title,
        archived: false,
        locked: false,
        sort_order: getNextSortOrder(state.lists),
      });
      state.notice = "List created.";
    }
    closeModal(false);
    return;
  }

  if (listId) {
    const { error } = await supabase.from("lists").update({ title }).eq("id", listId);
    throwIfSupabaseError(error);
    state.notice = "List renamed.";
  } else {
    const { error } = await supabase.from("lists").insert({
      user_id: state.user.id,
      board_id: state.activeBoard.id,
      title,
      sort_order: getNextSortOrder(state.lists),
    });
    throwIfSupabaseError(error);
    state.notice = "List created.";
  }

  closeModal(false);
}

async function submitCardForm(formData) {
  if (!state.activeBoard) return;

  const cardId = String(formData.get("cardId") || "");
  const title = String(formData.get("title") || "").trim();
  const listId = String(formData.get("listId") || "");
  const list = getListById(listId);
  if (!title) throw new Error("Task title is required.");
  if (!list) throw new Error("Choose a list for this task.");
  if (list.locked && !cardId) throw new Error("Unlock the list before adding a task.");

  await backupBoard(cardId ? "Before task edit" : "Before task creation", { quiet: true });

  const cardPayload = {
    title,
    list_id: listId,
    comment: String(formData.get("comment") || "").trim(),
    due_at: normalizeDueValue(formData.get("dueAt")),
    done: formData.get("done") === "on",
  };

  if (state.demo) {
    let savedCardId = cardId;
    if (cardId) {
      const existingCard = state.cards.find((card) => card.id === cardId);
      if (!existingCard) throw new Error("Task not found.");
      Object.assign(existingCard, {
        title: cardPayload.title,
        comment: cardPayload.comment,
        due_at: cardPayload.due_at,
        done: cardPayload.done,
      });
      if (existingCard.list_id !== listId) {
        await moveCardToList(cardId, listId);
      }
      state.notice = "Task updated.";
    } else {
      savedCardId = demoId("card");
      state.cards.push({
        ...cardPayload,
        id: savedCardId,
        user_id: state.user.id,
        board_id: state.activeBoard.id,
        archived: false,
        sort_order: getNextSortOrder(getCardsForList(listId)),
      });
      state.notice = "Task created.";
    }

    await replaceCardTags(savedCardId, formData.getAll("tagIds"));
    closeModal(false);
    return;
  }

  let savedCardId = cardId;
  if (cardId) {
    const existingCard = state.cards.find((card) => card.id === cardId);
    if (!existingCard) throw new Error("Task not found.");

    const { list_id: _listId, ...detailsPayload } = cardPayload;
    const { data, error } = await supabase
      .from("cards")
      .update(detailsPayload)
      .eq("id", cardId)
      .eq("board_id", state.activeBoard.id)
      .eq("user_id", state.user.id)
      .select("id")
      .maybeSingle();
    throwIfSupabaseError(error);
    if (!data?.id) throw new Error("DoneZone could not update that task.");
    if (existingCard.list_id !== listId) {
      await moveCardToList(cardId, listId);
    }
    state.notice = "Task updated.";
  } else {
    const { data, error } = await supabase
      .from("cards")
      .insert({
        ...cardPayload,
        user_id: state.user.id,
        board_id: state.activeBoard.id,
        sort_order: getNextSortOrder(getCardsForList(listId)),
      })
      .select()
      .single();
    throwIfSupabaseError(error);
    savedCardId = data.id;
    state.notice = "Task created.";
  }

  await replaceCardTags(savedCardId, formData.getAll("tagIds"));
  closeModal(false);
}

async function submitLabelCreate(formData) {
  const name = String(formData.get("name") || "").trim();
  const color = normalizeColor(formData.get("color"), "#2563eb");
  if (!name) throw new Error("Label name is required.");
  if (hasDuplicateTagName(name)) {
    throw new Error(`A label named "${name}" already exists.`);
  }

  if (state.demo) {
    state.tags.push({
      id: demoId("tag"),
      user_id: state.user.id,
      name,
      color,
      sort_order: getNextSortOrder(state.tags),
    });
    state.notice = "Label created.";
    return;
  }

  const { data, error } = await supabase
    .from("tags")
    .insert({
      user_id: state.user.id,
      name,
      color,
      sort_order: getNextSortOrder(state.tags),
    })
    .select("id")
    .single();

  throwIfSupabaseError(error);
  if (!data?.id) throw new Error("DoneZone could not create that label.");
  state.notice = "Label created.";
}

async function submitLabelUpdate(formData) {
  const tagId = String(formData.get("tagId") || "");
  const tag = state.tags.find((item) => item.id === tagId);
  const name = String(formData.get("name") || "").trim();
  const color = normalizeColor(formData.get("color"), tag?.color || "#2563eb");
  if (!tag) throw new Error("Label not found.");
  if (!name) throw new Error("Label name is required.");
  if (hasDuplicateTagName(name, tagId)) {
    throw new Error(`A label named "${name}" already exists.`);
  }

  if (state.demo) {
    Object.assign(tag, { name, color });
    state.notice = "Label updated.";
    return;
  }

  const { data, error } = await supabase
    .from("tags")
    .update({ name, color })
    .eq("id", tagId)
    .eq("user_id", state.user.id)
    .select("id")
    .maybeSingle();

  throwIfSupabaseError(error);
  if (!data?.id) throw new Error("DoneZone could not update that label.");
  state.notice = "Label updated.";
}

async function submitBackupSettings(formData) {
  await saveBackupSettings({
    board_id: state.activeBoard.id,
    user_id: state.user.id,
    enabled: formData.get("enabled") === "on",
    frequency: String(formData.get("frequency") || "weekly"),
    interval_days: clampNumber(formData.get("intervalDays"), 1, 365, 7),
    day_of_week: clampNumber(formData.get("dayOfWeek"), 0, 6, 1),
    day_of_month: clampNumber(formData.get("dayOfMonth"), 1, 31, 1),
    last_auto_backup_at: state.backupSettings?.last_auto_backup_at || null,
  });
  state.notice = "Backup settings saved.";
  closeModal(false);
}

async function saveBackupSettings(settings) {
  if (state.demo) {
    state.backupSettings = { ...settings };
    return;
  }

  const { error } = await supabase.from("board_backup_settings").upsert(settings);
  throwIfSupabaseError(error);
}

async function switchBoard(boardId) {
  if (!boardId || boardId === state.activeBoard?.id) return;
  state.showArchived = false;
  await saveActiveBoard(boardId);
}

async function toggleTheme() {
  state.theme = state.theme === "dark" ? "light" : "dark";
  saveThemePreference(state.theme);
  applyTheme();

  if (state.demo) {
    state.notice = state.theme === "dark" ? "Dark mode enabled." : "Light mode enabled.";
    return;
  }

  const { error } = await supabase.from("app_state").upsert({
    user_id: state.user.id,
    active_board_id: state.activeBoard?.id || null,
    theme: state.theme,
  });

  throwIfSupabaseError(error);
  state.notice = state.theme === "dark" ? "Dark mode enabled." : "Light mode enabled.";
}

async function toggleCard(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;

  await backupBoard("Before task completion change", { quiet: true });
  if (state.demo) {
    card.done = !card.done;
    state.notice = card.done ? "Task marked done." : "Task reopened.";
    return;
  }

  const { error } = await supabase
    .from("cards")
    .update({ done: !card.done })
    .eq("id", card.id);
  throwIfSupabaseError(error);
  state.notice = card.done ? "Task reopened." : "Task marked done.";
}

async function toggleArchiveCard(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;

  await backupBoard("Before task archive change", { quiet: true });
  if (state.demo) {
    card.archived = !card.archived;
    state.notice = card.archived ? "Task archived." : "Task restored.";
    return;
  }

  const { error } = await supabase
    .from("cards")
    .update({ archived: !card.archived })
    .eq("id", card.id);
  throwIfSupabaseError(error);
  state.notice = card.archived ? "Task restored." : "Task archived.";
}

async function duplicateCard(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;

  await backupBoard("Before task duplication", { quiet: true });
  if (state.demo) {
    const newCardId = demoId("card");
    state.cards.push({
      ...card,
      id: newCardId,
      title: duplicateTitle(card.title, getCardsForList(card.list_id).map((item) => item.title)),
      archived: false,
      sort_order: getNextSortOrder(getCardsForList(card.list_id)),
    });
    await replaceCardTags(newCardId, getTagIdsForCard(card.id));
    state.notice = "Task duplicated.";
    return;
  }

  const { data, error } = await supabase
    .from("cards")
    .insert({
      user_id: state.user.id,
      board_id: state.activeBoard.id,
      list_id: card.list_id,
      title: duplicateTitle(card.title, getCardsForList(card.list_id).map((item) => item.title)),
      comment: card.comment || "",
      due_at: card.due_at,
      done: card.done,
      archived: false,
      sort_order: getNextSortOrder(getCardsForList(card.list_id)),
    })
    .select()
    .single();

  throwIfSupabaseError(error);
  await replaceCardTags(data.id, getTagIdsForCard(card.id));
  state.notice = "Task duplicated.";
}

async function transferCard(targetListId) {
  const modal = state.modal;
  const card = state.cards.find((item) => item.id === modal?.cardId);
  const targetList = getListById(targetListId);
  if (!modal || !card || !targetList || targetList.locked) return;

  await backupBoard(modal.mode === "copy" ? "Before task copy" : "Before task move", { quiet: true });

  if (modal.mode === "copy") {
    if (state.demo) {
      const newCardId = demoId("card");
      state.cards.push({
        ...card,
        id: newCardId,
        list_id: targetList.id,
        title: duplicateTitle(card.title, getCardsForList(targetList.id).map((item) => item.title)),
        archived: false,
        sort_order: getNextSortOrder(getCardsForList(targetList.id)),
      });
      await replaceCardTags(newCardId, getTagIdsForCard(card.id));
      state.notice = "Task copied.";
      closeModal(false);
      return;
    }

    const { data, error } = await supabase
      .from("cards")
      .insert({
        user_id: state.user.id,
        board_id: state.activeBoard.id,
        list_id: targetList.id,
        title: duplicateTitle(card.title, getCardsForList(targetList.id).map((item) => item.title)),
        comment: card.comment || "",
        due_at: card.due_at,
        done: card.done,
        archived: false,
        sort_order: getNextSortOrder(getCardsForList(targetList.id)),
      })
      .select()
      .single();
    throwIfSupabaseError(error);
    await replaceCardTags(data.id, getTagIdsForCard(card.id));
    state.notice = "Task copied.";
  } else {
    await moveCardToList(card.id, targetList.id);
    state.notice = "Task moved.";
  }

  closeModal(false);
}

async function duplicateList(listId, options) {
  const sourceList = getListById(listId);
  if (!sourceList || !state.activeBoard) return;

  await backupBoard(options.includeCards ? "Before duplicating list with tasks" : "Before list duplication", { quiet: true });
  if (state.demo) {
    const newList = {
      ...sourceList,
      id: demoId("list"),
      title: duplicateTitle(sourceList.title, state.lists.map((list) => list.title)),
      archived: false,
      locked: false,
      sort_order: sourceList.sort_order + 1,
    };
    state.lists.push(newList);

    if (options.includeCards) {
      const sourceCards = getCardsForList(sourceList.id);
      sourceCards.forEach((card, index) => {
        const newCardId = demoId("card");
        state.cards.push({
          ...card,
          id: newCardId,
          list_id: newList.id,
          sort_order: index,
        });
        state.cardTags
          .filter((row) => row.card_id === card.id)
          .forEach((row) => {
            state.cardTags.push({
              ...row,
              card_id: newCardId,
            });
          });
      });
    }

    state.notice = options.includeCards ? "List duplicated with tasks." : "List duplicated.";
    return;
  }

  const { data: newList, error } = await supabase
    .from("lists")
    .insert({
      user_id: state.user.id,
      board_id: state.activeBoard.id,
      title: duplicateTitle(sourceList.title, state.lists.map((list) => list.title)),
      archived: false,
      locked: false,
      sort_order: sourceList.sort_order + 1,
    })
    .select()
    .single();
  throwIfSupabaseError(error);

  if (options.includeCards) {
    const sourceCards = getCardsForList(sourceList.id);
    for (const [index, card] of sourceCards.entries()) {
      const { data: newCard, error: cardError } = await supabase
        .from("cards")
        .insert({
          user_id: state.user.id,
          board_id: state.activeBoard.id,
          list_id: newList.id,
          title: card.title,
          comment: card.comment || "",
          due_at: card.due_at,
          done: card.done,
          archived: card.archived,
          sort_order: index,
        })
        .select()
        .single();
      throwIfSupabaseError(cardError);
      await replaceCardTags(newCard.id, getTagIdsForCard(card.id));
    }
  }

  state.notice = options.includeCards ? "List duplicated with tasks." : "List duplicated.";
}

async function setListLocked(listId, locked) {
  const list = getListById(listId);
  if (!list) return;

  await backupBoard(locked ? "Before locking list" : "Before unlocking list", { quiet: true });
  if (state.demo) {
    list.locked = locked;
    state.notice = locked ? "List locked." : "List unlocked.";
    return;
  }

  const { error } = await supabase.from("lists").update({ locked }).eq("id", listId);
  throwIfSupabaseError(error);
  state.notice = locked ? "List locked." : "List unlocked.";
}

async function archiveList(listId) {
  await setListArchived(listId, true);
}

async function setListArchived(listId, archived) {
  const list = getListById(listId);
  if (!list) return;

  await backupBoard(archived ? "Before list archive" : "Before list restore", { quiet: true });
  if (state.demo) {
    list.archived = archived;
    state.notice = archived ? "List archived." : "List restored.";
    return;
  }

  const { error } = await supabase.from("lists").update({ archived }).eq("id", listId);
  throwIfSupabaseError(error);
  state.notice = archived ? "List archived." : "List restored.";
}

async function deleteBoard(boardId) {
  const board = state.boards.find((item) => item.id === boardId);
  if (!board) return;
  await backupBoard("Before board deletion", { quiet: true, force: true });
  if (state.demo) {
    state.boards = state.boards.filter((item) => item.id !== boardId);
    state.lists = state.lists.filter((item) => item.board_id !== boardId);
    state.cards = state.cards.filter((item) => item.board_id !== boardId);
    const cardIds = new Set(state.cards.map((card) => card.id));
    state.cardTags = state.cardTags.filter((row) => cardIds.has(row.card_id));
    state.activeBoard = state.boards[0] || null;
    state.notice = "Board deleted.";
    return;
  }

  const { error } = await supabase.from("boards").delete().eq("id", boardId);
  throwIfSupabaseError(error);

  const nextBoard = state.boards.find((item) => item.id !== boardId);
  if (nextBoard) await saveActiveBoard(nextBoard.id);
  state.notice = "Board deleted.";
}

async function deleteList(listId) {
  const list = getListById(listId);
  if (!list) return;
  await backupBoard("Before list deletion", { quiet: true, force: true });
  if (state.demo) {
    const removedCardIds = new Set(getCardsForList(listId).map((card) => card.id));
    state.lists = state.lists.filter((item) => item.id !== listId);
    state.cards = state.cards.filter((card) => card.list_id !== listId);
    state.cardTags = state.cardTags.filter((row) => !removedCardIds.has(row.card_id));
    state.notice = "List deleted.";
    return;
  }

  const { error } = await supabase.from("lists").delete().eq("id", listId);
  throwIfSupabaseError(error);
  state.notice = "List deleted.";
}

async function deleteCard(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;
  await backupBoard("Before task deletion", { quiet: true, force: true });
  if (state.demo) {
    state.cards = state.cards.filter((item) => item.id !== cardId);
    state.cardTags = state.cardTags.filter((row) => row.card_id !== cardId);
    state.notice = "Task deleted.";
    return;
  }

  const { error } = await supabase.from("cards").delete().eq("id", cardId);
  throwIfSupabaseError(error);
  state.notice = "Task deleted.";
}

async function deleteLabel(tagId) {
  const tag = state.tags.find((item) => item.id === tagId);
  if (!tag) return;

  await backupBoard("Before label deletion", { quiet: true, force: true });
  if (state.demo) {
    state.cardTags = state.cardTags.filter((row) => row.tag_id !== tag.id);
    state.tags = state.tags.filter((item) => item.id !== tag.id);
    state.notice = "Label deleted.";
    return;
  }

  const { error: cardTagError } = await supabase
    .from("card_tags")
    .delete()
    .eq("tag_id", tag.id)
    .eq("user_id", state.user.id);
  throwIfSupabaseError(cardTagError);

  const { data, error } = await supabase
    .from("tags")
    .delete()
    .eq("id", tag.id)
    .eq("user_id", state.user.id)
    .select("id")
    .maybeSingle();

  throwIfSupabaseError(error);
  if (!data?.id) throw new Error("DoneZone could not delete that label.");
  state.notice = "Label deleted.";
}

async function backupBoard(reason = "Manual backup", options = {}) {
  if (!state.activeBoard) return;

  const snapshot = {
    exported_at: new Date().toISOString(),
    board: state.activeBoard,
    lists: state.lists,
    cards: state.cards,
    tags: state.tags,
    cardTags: state.cardTags,
  };

  if (state.demo) {
    state.backups.unshift({
      id: demoId("backup"),
      user_id: state.user.id,
      board_id: state.activeBoard.id,
      board_title: state.activeBoard.title,
      reason,
      snapshot: JSON.parse(JSON.stringify(snapshot)),
      snapshot_hash: `demo:${Date.now()}`,
      created_at: new Date().toISOString(),
    });
    if (!options.quiet) state.notice = "Board backup saved.";
    return;
  }

  const snapshotText = JSON.stringify(snapshot);
  const hash = await hashText(snapshotText);

  if (!options.force && state.backups[0]?.snapshot_hash === hash) {
    if (!options.quiet) state.notice = "No board changes since latest backup.";
    return;
  }

  const { error } = await supabase.from("board_backups").insert({
    user_id: state.user.id,
    board_id: state.activeBoard.id,
    board_title: state.activeBoard.title,
    reason,
    snapshot,
    snapshot_hash: hash,
  });

  throwIfSupabaseError(error);
  if (!options.quiet) state.notice = "Board backup saved.";
}

async function restoreBackup(backupId) {
  const backup = state.backups.find((item) => item.id === backupId);
  if (!backup || !state.activeBoard) return;

  await backupBoard("Before restore", { quiet: true, force: true });

  const snapshot = backup.snapshot || {};
  const lists = Array.isArray(snapshot.lists) ? snapshot.lists : [];
  const cards = Array.isArray(snapshot.cards) ? snapshot.cards : [];
  const cardTags = Array.isArray(snapshot.cardTags) ? snapshot.cardTags : [];
  const title = snapshot.board?.title || state.activeBoard.title;

  if (state.demo) {
    state.activeBoard.title = title;
    state.boards = state.boards.map((board) =>
      board.id === state.activeBoard.id ? { ...board, title } : board,
    );
    state.lists = lists.map((list, index) => ({
      ...list,
      user_id: state.user.id,
      board_id: state.activeBoard.id,
      title: list.title || `List ${index + 1}`,
      archived: Boolean(list.archived),
      locked: Boolean(list.locked),
      sort_order: Number(list.sort_order) || index,
    }));
    state.cards = cards.map((card, index) => ({
      ...card,
      user_id: state.user.id,
      board_id: state.activeBoard.id,
      title: card.title || `Task ${index + 1}`,
      comment: card.comment || "",
      due_at: card.due_at || null,
      done: Boolean(card.done),
      archived: Boolean(card.archived),
      sort_order: Number(card.sort_order) || index,
    }));
    const validCardIds = new Set(state.cards.map((card) => card.id));
    const validTagIds = new Set(state.tags.map((tag) => tag.id));
    state.cardTags = cardTags
      .filter((row) => validCardIds.has(row.card_id) && validTagIds.has(row.tag_id))
      .map((row, index) => ({
        ...row,
        user_id: state.user.id,
        sort_order: Number(row.sort_order) || index,
      }));
    closeModal(false);
    state.notice = "Board restored from backup.";
    return;
  }

  const { error: deleteCardsError } = await supabase
    .from("cards")
    .delete()
    .eq("board_id", state.activeBoard.id);
  throwIfSupabaseError(deleteCardsError);

  const { error: deleteListsError } = await supabase
    .from("lists")
    .delete()
    .eq("board_id", state.activeBoard.id);
  throwIfSupabaseError(deleteListsError);

  const { error: boardError } = await supabase
    .from("boards")
    .update({ title })
    .eq("id", state.activeBoard.id);
  throwIfSupabaseError(boardError);

  if (lists.length) {
    const { error: listError } = await supabase.from("lists").insert(
      lists.map((list, index) => ({
        id: list.id,
        user_id: state.user.id,
        board_id: state.activeBoard.id,
        title: list.title || `List ${index + 1}`,
        archived: Boolean(list.archived),
        locked: Boolean(list.locked),
        sort_order: Number(list.sort_order) || index,
      })),
    );
    throwIfSupabaseError(listError);
  }

  if (cards.length) {
    const restoredListIds = new Set(lists.map((list) => list.id));
    const { error: cardError } = await supabase.from("cards").insert(
      cards
        .filter((card) => restoredListIds.has(card.list_id))
        .map((card, index) => ({
          id: card.id,
          user_id: state.user.id,
          board_id: state.activeBoard.id,
          list_id: card.list_id,
          title: card.title || `Task ${index + 1}`,
          comment: card.comment || "",
          due_at: card.due_at || null,
          done: Boolean(card.done),
          archived: Boolean(card.archived),
          sort_order: Number(card.sort_order) || index,
        })),
    );
    throwIfSupabaseError(cardError);
  }

  if (cardTags.length) {
    const validCardIds = new Set(cards.map((card) => card.id));
    const validTagIds = new Set(state.tags.map((tag) => tag.id));
    const restoredTags = cardTags.filter((row) => validCardIds.has(row.card_id) && validTagIds.has(row.tag_id));
    if (restoredTags.length) {
      const { error: tagError } = await supabase.from("card_tags").insert(
        restoredTags.map((row, index) => ({
          user_id: state.user.id,
          card_id: row.card_id,
          tag_id: row.tag_id,
          sort_order: Number(row.sort_order) || index,
        })),
      );
      throwIfSupabaseError(tagError);
    }
  }

  closeModal(false);
  state.notice = "Board restored from backup.";
}

async function replaceCardTags(cardId, tagIds) {
  const normalizedTagIds = [...new Set(tagIds.map(String).filter(Boolean))];
  if (state.demo) {
    state.cardTags = state.cardTags.filter((row) => row.card_id !== cardId);
    state.cardTags.push(
      ...normalizedTagIds.map((tagId, index) => ({
        user_id: state.user.id,
        card_id: cardId,
        tag_id: tagId,
        sort_order: index,
      })),
    );
    return;
  }

  const { error: deleteError } = await supabase.from("card_tags").delete().eq("card_id", cardId);
  throwIfSupabaseError(deleteError);

  if (!normalizedTagIds.length) return;

  const { error: insertError } = await supabase.from("card_tags").insert(
    normalizedTagIds.map((tagId, index) => ({
      user_id: state.user.id,
      card_id: cardId,
      tag_id: tagId,
      sort_order: index,
    })),
  );
  throwIfSupabaseError(insertError);
}

async function updateListOrder(orderedLists) {
  if (state.demo) {
    orderedLists.forEach((orderedList, index) => {
      const list = state.lists.find((item) => item.id === orderedList.id);
      if (list) list.sort_order = index;
    });
    return;
  }

  const results = await Promise.all(
    orderedLists.map((list, index) =>
      supabase.from("lists").update({ sort_order: index }).eq("id", list.id),
    ),
  );
  results.forEach((result) => throwIfSupabaseError(result.error));
}

async function updateCardOrder(listId, orderedCards) {
  if (state.demo) {
    orderedCards.forEach((orderedCard, index) => {
      const card = state.cards.find((item) => item.id === orderedCard.id);
      if (card) {
        card.list_id = listId;
        card.sort_order = index;
        card.archived = false;
      }
    });
    return;
  }

  const results = await Promise.all(
    orderedCards.map((card, index) =>
      supabase
        .from("cards")
        .update({ list_id: listId, sort_order: index, archived: false })
        .eq("id", card.id)
        .eq("board_id", state.activeBoard.id)
        .eq("user_id", state.user.id)
        .select("id")
        .maybeSingle(),
    ),
  );
  results.forEach((result) => {
    throwIfSupabaseError(result.error);
    if (!result.data?.id) {
      throw new Error("DoneZone could not update one of the task positions.");
    }
  });
}

async function moveCardToList(cardId, targetListId, options = {}) {
  const card = state.cards.find((item) => item.id === cardId);
  const targetList = getListById(targetListId);
  if (!card) throw new Error("Task not found.");
  if (!targetList) throw new Error("Destination list not found.");
  if (targetList.locked) throw new Error(`Unlock "${targetList.title}" before moving tasks into it.`);

  const sourceListId = card.list_id;
  const sourceCards = getCardsForList(sourceListId).filter((item) => !item.archived && item.id !== card.id);
  const targetCards = getCardsForList(targetList.id).filter((item) => !item.archived && item.id !== card.id);

  let insertIndex = targetCards.length;
  if (options.targetCardId && options.targetCardId !== card.id) {
    const targetIndex = targetCards.findIndex((item) => item.id === options.targetCardId);
    if (targetIndex >= 0) insertIndex = targetIndex + (options.insertAfter ? 1 : 0);
  }

  const boundedIndex = Math.max(0, Math.min(insertIndex, targetCards.length));
  targetCards.splice(boundedIndex, 0, { ...card, list_id: targetList.id, archived: false });

  if (sourceListId === targetList.id) {
    await updateCardOrder(targetList.id, targetCards);
  } else {
    await updateCardOrder(sourceListId, sourceCards);
    await updateCardOrder(targetList.id, targetCards);
  }

  const { data, error } = await supabase
    .from("cards")
    .select("id, list_id")
    .eq("id", card.id)
    .eq("list_id", targetList.id)
    .eq("user_id", state.user.id)
    .maybeSingle();

  throwIfSupabaseError(error);
  if (!data?.id) {
    throw new Error("DoneZone could not verify that the task moved. Please refresh and try again.");
  }
}

function handleDragStart(event) {
  const card = event.target.closest('[data-drag-type="card"]');
  if (card) {
    state.drag = {
      type: "card",
      cardId: card.dataset.cardId,
      fromListId: card.dataset.listId,
    };
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", card.dataset.cardId);
    card.classList.add("dragging");
    return;
  }

  const header = event.target.closest('[data-drag-type="list"]');
  const list = header?.closest(".list-column");
  if (!header || !list || list.dataset.listLocked === "true") {
    event.preventDefault();
    return;
  }
  if (event.target.closest("button, summary, details, input, textarea, select, a")) {
    event.preventDefault();
    return;
  }

  state.drag = {
    type: "list",
    listId: list.dataset.listId,
  };
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("text/plain", list.dataset.listId);
  list.classList.add("list-dragging");
}

function handleDragEnd() {
  state.drag = null;
  document.querySelectorAll(".dragging, .drag-over, .list-dragging, .list-drag-over, .list-drag-after").forEach((item) => {
    item.classList.remove("dragging", "drag-over", "list-dragging", "list-drag-over", "list-drag-after");
  });
}

function handleDragOver(event) {
  if (!state.drag) return;

  if (state.drag.type === "list") {
    const list = event.target.closest(".list-column");
    if (!list || list.dataset.listId === state.drag.listId || list.dataset.listId === "archived" || list.dataset.listLocked === "true") return;
    event.preventDefault();
    const bounds = list.getBoundingClientRect();
    list.classList.add("list-drag-over");
    list.classList.toggle("list-drag-after", event.clientX > bounds.left + bounds.width / 2);
    return;
  }

  const dropColumn = event.target.closest(".list-column");
  const targetList = dropColumn ? getListById(dropColumn.dataset.listId) : null;
  if (!dropColumn || dropColumn.dataset.listId === "archived" || targetList?.locked) return;

  event.preventDefault();
  dropColumn.classList.add("drag-over");
}

function handleDragLeave(event) {
  const list = event.target.closest(".list-column");
  if (list && !list.contains(event.relatedTarget)) {
    list.classList.remove("drag-over", "list-drag-over", "list-drag-after");
  }
}

async function handleDrop(event) {
  if (!state.drag) return;

  if (state.drag.type === "list") {
    const targetColumn = event.target.closest(".list-column");
    if (!targetColumn || targetColumn.dataset.listId === "archived") return;

    event.preventDefault();
    const draggedListId = state.drag.listId;
    const targetListId = targetColumn.dataset.listId;
    const insertAfter = targetColumn.classList.contains("list-drag-after");
    await runAction(async () => {
      await backupBoard("Before list reorder", { quiet: true });
      const activeLists = state.lists.filter((list) => !list.archived);
      const dragged = activeLists.find((list) => list.id === draggedListId);
      const target = activeLists.find((list) => list.id === targetListId);
      if (!dragged || !target || dragged.id === target.id || dragged.locked || target.locked) return;

      const next = activeLists.filter((list) => list.id !== dragged.id);
      let index = next.findIndex((list) => list.id === target.id);
      if (insertAfter) index += 1;
      next.splice(index, 0, dragged);
      await updateListOrder(next);
      state.notice = "List reordered.";
    });
    return;
  }

  const dropColumn = event.target.closest(".list-column");
  if (!dropColumn || dropColumn.dataset.listId === "archived") return;

  event.preventDefault();
  const draggedCardId = state.drag.cardId;
  const targetListId = dropColumn.dataset.listId;
  const targetCard = event.target.closest("[data-card-id]");
  const targetCardId = targetCard?.dataset.cardId || null;
  let insertAfter = false;
  if (targetCard) {
    const bounds = targetCard.getBoundingClientRect();
    insertAfter = event.clientY > bounds.top + bounds.height / 2;
  }

  await runAction(async () => {
    const targetList = getListById(targetListId);
    const card = state.cards.find((item) => item.id === draggedCardId);
    if (!targetList || !card || targetList.locked) return;
    if (targetCardId === card.id) return;

    await backupBoard("Before task move", { quiet: true });
    await moveCardToList(card.id, targetList.id, { targetCardId, insertAfter });
    state.notice = "Task moved.";
  });
}

function openModal(modal) {
  state.error = "";
  state.notice = "";
  state.modal = modal;
  render();
}

function openTransferModal(mode, cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;
  openModal({ type: "transfer-card", mode, cardId });
}

function closeModal(shouldRender = true) {
  state.modal = null;
  if (shouldRender) render();
}

function confirmDeleteBoard(boardId) {
  const board = state.boards.find((item) => item.id === boardId);
  if (!board) return;
  openModal({
    type: "confirm",
    title: "Delete Board",
    copy: `Delete "${board.title}" and all of its lists and tasks?`,
    confirmLabel: "Delete Board",
    run: () => deleteBoard(board.id),
  });
}

function confirmDeleteList(listId) {
  const list = getListById(listId);
  if (!list) return;
  const count = getCardsForList(listId).length;
  openModal({
    type: "confirm",
    title: "Delete List",
    copy: `Delete "${list.title}" and its ${count} task${count === 1 ? "" : "s"}?`,
    confirmLabel: "Delete List",
    run: () => deleteList(list.id),
  });
}

function confirmDeleteCard(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;
  openModal({
    type: "confirm",
    title: "Delete Task",
    copy: `Delete "${card.title}"?`,
    confirmLabel: "Delete Task",
    run: () => deleteCard(card.id),
  });
}

function confirmDeleteLabel(tagId) {
  const tag = state.tags.find((item) => item.id === tagId);
  if (!tag) return;
  openModal({
    type: "confirm",
    title: "Delete Label",
    copy: `Delete "${tag.name}" and remove it from every task?`,
    confirmLabel: "Delete Label",
    run: () => deleteLabel(tag.id),
  });
}

function clearWorkspaceState() {
  state.boards = [];
  state.activeBoard = null;
  state.lists = [];
  state.cards = [];
  state.tags = [];
  state.cardTags = [];
  state.backups = [];
  state.backupSettings = null;
  state.showArchived = false;
  state.modal = null;
  state.notice = "";
  state.error = "";
}

async function repairDuplicateBoardTitles() {
  const seen = new Set();
  const updates = [];
  for (const board of state.boards) {
    const key = normalizeTitle(board.title);
    if (!seen.has(key)) {
      seen.add(key);
      continue;
    }
    const title = makeUniquePlainTitle(board.title, [...seen]);
    seen.add(normalizeTitle(title));
    updates.push(supabase.from("boards").update({ title }).eq("id", board.id));
  }
  const results = await Promise.all(updates);
  results.forEach((result) => throwIfSupabaseError(result.error));
  return updates.length > 0;
}

async function repairDuplicateListTitles() {
  const seen = new Set();
  const updates = [];
  for (const list of state.lists) {
    if (list.archived) continue;
    const key = normalizeTitle(list.title);
    if (!seen.has(key)) {
      seen.add(key);
      continue;
    }
    const title = makeUniquePlainTitle(list.title, [...seen]);
    seen.add(normalizeTitle(title));
    updates.push(supabase.from("lists").update({ title }).eq("id", list.id));
  }
  const results = await Promise.all(updates);
  results.forEach((result) => throwIfSupabaseError(result.error));
  return updates.length > 0;
}

function hasDuplicateBoardTitle(title, excludingId = "") {
  const key = normalizeTitle(title);
  return state.boards.some((board) => board.id !== excludingId && normalizeTitle(board.title) === key);
}

function hasDuplicateListTitle(title, excludingId = "") {
  const key = normalizeTitle(title);
  return state.lists.some((list) => !list.archived && list.id !== excludingId && normalizeTitle(list.title) === key);
}

function hasDuplicateTagName(name, excludingId = "") {
  const key = normalizeTitle(name);
  return state.tags.some((tag) => tag.id !== excludingId && normalizeTitle(tag.name) === key);
}

function getListById(listId) {
  return state.lists.find((list) => list.id === listId) || null;
}

function firstWritableList() {
  return state.lists.find((list) => !list.archived && !list.locked) || state.lists.find((list) => !list.archived) || null;
}

function getCardsForList(listId) {
  return state.cards
    .filter((card) => card.list_id === listId)
    .sort((left, right) => Number(left.sort_order) - Number(right.sort_order));
}

function getTagIdsForCard(cardId) {
  return state.cardTags
    .filter((row) => row.card_id === cardId)
    .sort((left, right) => Number(left.sort_order) - Number(right.sort_order))
    .map((row) => row.tag_id);
}

function getTagsForCard(cardId) {
  const tagIds = new Set(getTagIdsForCard(cardId));
  return state.tags.filter((tag) => tagIds.has(tag.id));
}

function getBoardTotals() {
  return state.cards.reduce(
    (totals, card) => {
      if (card.archived) totals.archived += 1;
      else if (card.done) totals.done += 1;
      else totals.open += 1;
      return totals;
    },
    {
      open: 0,
      done: 0,
      archived: state.lists.filter((list) => list.archived).length,
    },
  );
}

function defaultBackupSettings(boardId) {
  return {
    board_id: boardId,
    user_id: state.user?.id,
    enabled: false,
    frequency: "weekly",
    interval_days: 7,
    day_of_week: 1,
    day_of_month: 1,
    last_auto_backup_at: null,
  };
}

function getNextSortOrder(items) {
  return items.length
    ? Math.max(...items.map((item) => Number(item.sort_order) || 0)) + 1
    : 0;
}

function duplicateTitle(title, existingTitles) {
  const baseTitle = stripDuplicatePrefix(title || "Untitled");
  const pattern = new RegExp(`^Duplicate (\\d+): ${escapeRegExp(baseTitle)}$`);
  const nextNumber =
    existingTitles.reduce((maxNumber, item) => {
      const match = String(item).match(pattern);
      return match ? Math.max(maxNumber, Number(match[1])) : maxNumber;
    }, 0) + 1;
  return `Duplicate ${nextNumber}: ${baseTitle}`;
}

function stripDuplicatePrefix(title) {
  return String(title || "Untitled").replace(/^Duplicate \d+:\s*/, "");
}

function makeUniquePlainTitle(title, normalizedExistingTitles) {
  const base = String(title || "Untitled").trim() || "Untitled";
  let suffix = 2;
  let candidate = `${base} ${suffix}`;
  while (normalizedExistingTitles.includes(normalizeTitle(candidate))) {
    suffix += 1;
    candidate = `${base} ${suffix}`;
  }
  return candidate;
}

function normalizeTitle(title) {
  return String(title || "").trim().replace(/\s+/g, " ").toLowerCase();
}

function normalizeColor(value, fallback) {
  const color = String(value || "").trim();
  return /^#[0-9a-f]{6}$/i.test(color) ? color : fallback;
}

function normalizeTheme(value) {
  return value === "dark" ? "dark" : "light";
}

function loadThemePreference() {
  try {
    return normalizeTheme(localStorage.getItem("donezone-theme") || "light");
  } catch (_error) {
    return "light";
  }
}

function saveThemePreference(theme) {
  try {
    localStorage.setItem("donezone-theme", normalizeTheme(theme));
  } catch (_error) {
    // Ignore storage failures; Supabase persistence still handles signed-in users.
  }
}

function applyTheme() {
  const theme = normalizeTheme(state.theme);
  document.documentElement.dataset.theme = theme;
  document.body.dataset.theme = theme;
}

function normalizeDueValue(value) {
  const raw = String(value || "");
  if (!raw) return null;
  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date.toISOString();
}

function toDateTimeLocal(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (number) => String(number).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

function formatDue(value) {
  if (!value) return "No due date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No due date";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatDateTime(value) {
  if (!value) return "Unknown";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Unknown";
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function describeSnapshot(snapshot) {
  const listCount = Array.isArray(snapshot?.lists) ? snapshot.lists.length : 0;
  const taskCount = Array.isArray(snapshot?.cards) ? snapshot.cards.length : 0;
  return `${listCount} lists · ${taskCount} tasks`;
}

function clampNumber(value, min, max, fallback) {
  const number = Number(value);
  if (!Number.isFinite(number)) return fallback;
  return Math.max(min, Math.min(max, Math.round(number)));
}

function capitalize(value) {
  return String(value || "").charAt(0).toUpperCase() + String(value || "").slice(1);
}

function throwIfSupabaseError(error) {
  if (error) throw error;
}

function getErrorMessage(error) {
  return error?.message || "Something went wrong. Please try again.";
}

async function hashText(value) {
  if (!window.crypto?.subtle) {
    return `length:${value.length}`;
  }

  const encoded = new TextEncoder().encode(value);
  const digest = await window.crypto.subtle.digest("SHA-256", encoded);

  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value);
}

function svgIcon(name) {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-lin
