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
  lock: '<rect width="18" height="11" x="3" y="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  logOut: '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/>',
  more: '<circle cx="5" cy="12" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="19" cy="12" r="1.6"/>',
  refresh: '<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16"/><path d="M3 21v-5h5"/><path d="M3 12A9 9 0 0 1 18.5 5.8L21 8"/><path d="M21 3v5h-5"/>',
  tag: '<path d="M20.6 13.2 13.2 20.6a2 2 0 0 1-2.8 0L3 13.2V3h10.2l7.4 7.4a2 2 0 0 1 0 2.8Z"/><circle cx="7.5" cy="7.5" r="1.5"/>',
};

const starterLists = ["Next", "Doing", "Done"];

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
  notice: "",
  error: "",
};

appRoot.addEventListener("submit", handleSubmit);
appRoot.addEventListener("click", handleClick);

init();

async function init() {
  renderLoading();

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    state.error = error.message;
  }

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

  const [boardsResult, appStateResult] = await Promise.all([
    supabase
      .from("boards")
      .select("*")
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase.from("app_state").select("*").maybeSingle(),
  ]);

  throwIfSupabaseError(boardsResult.error);
  throwIfSupabaseError(appStateResult.error);

  state.boards = boardsResult.data || [];
  const activeBoardId = appStateResult.data?.active_board_id;
  state.activeBoard =
    state.boards.find((board) => board.id === activeBoardId) ||
    state.boards[0] ||
    null;

  if (!state.activeBoard) {
    state.lists = [];
    state.cards = [];
    return;
  }

  if (state.activeBoard.id !== activeBoardId) {
    await saveActiveBoard(state.activeBoard.id);
  }

  const [listsResult, cardsResult] = await Promise.all([
    supabase
      .from("lists")
      .select("*")
      .eq("board_id", state.activeBoard.id)
      .eq("archived", false)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
    supabase
      .from("cards")
      .select("*")
      .eq("board_id", state.activeBoard.id)
      .eq("archived", false)
      .is("deleted_at", null)
      .order("sort_order", { ascending: true }),
  ]);

  throwIfSupabaseError(listsResult.error);
  throwIfSupabaseError(cardsResult.error);

  state.lists = listsResult.data || [];
  state.cards = cardsResult.data || [];
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
      sort_order: 0,
    },
    {
      user_id: state.user.id,
      board_id: board.id,
      list_id: doingList?.id || nextList?.id,
      title: "Connect GitHub Pages to Supabase",
      comment: "",
      sort_order: 0,
    },
  ].filter((card) => card.list_id);

  if (starterCards.length) {
    const { error: cardsError } = await supabase.from("cards").insert(starterCards);
    throwIfSupabaseError(cardsError);
  }

  await saveActiveBoard(board.id);

  const { error: settingsError } = await supabase.from("board_backup_settings").insert({
    user_id: state.user.id,
    board_id: board.id,
    enabled: false,
  });
  throwIfSupabaseError(settingsError);
}

async function saveActiveBoard(boardId) {
  const { error } = await supabase.from("app_state").upsert({
    user_id: state.user.id,
    active_board_id: boardId,
    theme: "light",
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
        <p class="auth-note">Sign-in links open the hosted GitHub Pages app.</p>
      </section>
    </main>
  `;
}

function renderApp() {
  const openCount = state.cards.filter((card) => !card.done).length;
  const doneCount = state.cards.filter((card) => card.done).length;
  const boardTitle = state.activeBoard?.title || "DoneZone";

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

        <div class="board-list">
          ${state.boards.map(renderBoardButton).join("")}
        </div>

        <button class="secondary-button wide" type="button" data-action="new-board">
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
            <p>${isSupabaseConfigured() ? "Saved in Supabase" : "Supabase is not connected"} &middot; ${openCount} open &middot; ${doneCount} done</p>
          </div>
          <div class="topbar-actions">
            <button class="action-button" type="button" title="Refresh" data-action="refresh">${svgIcon("refresh")}</button>
            <button class="action-button" type="button" title="Archive completed tasks" data-action="archive-done">${svgIcon("archive")}</button>
            <button class="action-button" type="button" title="Back up board" data-action="backup">${svgIcon("backup")}</button>
            <button class="secondary-button" type="button" data-action="new-list">${svgIcon("add")}New List</button>
            <button class="primary-button" type="button" data-action="new-task">${svgIcon("add")}New Task</button>
          </div>
        </header>

        ${renderStatus()}

        <section class="board-canvas" aria-label="DoneZone board">
          ${
            state.activeBoard
              ? `<div class="lists">${state.lists.map(renderList).join("")}</div>`
              : '<div class="empty-state">Create a board to get started.</div>'
          }
        </section>
      </main>
    </div>
  `;
}

function renderBoardButton(board) {
  const isActive = board.id === state.activeBoard?.id;
  return `
    <button class="board-select ${isActive ? "active" : ""}" type="button" data-action="switch-board" data-board-id="${board.id}">
      <span class="board-name">${escapeHtml(board.title)}</span>
      <span class="board-meta">${isActive ? "Active board" : "Open board"}</span>
    </button>
  `;
}

function renderList(list) {
  const cards = state.cards.filter((card) => card.list_id === list.id);
  const open = cards.filter((card) => !card.done).length;
  const done = cards.length - open;

  return `
    <section class="list-column">
      <header class="list-header">
        <div>
          <h2>${escapeHtml(list.title)}</h2>
          <div class="list-counts">
            <span>${open} open</span>
            <span>${done} done</span>
          </div>
        </div>
        <div class="list-actions">
          <button class="action-button" type="button" title="Add task" data-action="new-task" data-list-id="${list.id}">${svgIcon("add")}</button>
          <button class="action-button" type="button" title="Rename list" data-action="rename-list" data-list-id="${list.id}">${svgIcon("more")}</button>
        </div>
      </header>
      <div class="cards">
        ${
          cards.length
            ? cards.map(renderCard).join("")
            : '<div class="empty-list">No tasks</div>'
        }
      </div>
    </section>
  `;
}

function renderCard(card) {
  return `
    <article class="task-card ${card.done ? "done" : ""}">
      <div class="task-title-row">
        <button class="check-icon" type="button" title="${card.done ? "Mark open" : "Mark done"}" data-action="toggle-card" data-card-id="${card.id}">
          ${svgIcon("check")}
        </button>
        <p>${escapeHtml(card.title)}</p>
        <button class="action-button compact" type="button" title="Archive task" data-action="archive-card" data-card-id="${card.id}">
          ${svgIcon("more")}
        </button>
      </div>
      <div class="tag-pill">${svgIcon("tag")}${card.done ? "Done" : "Task"}</div>
      <div class="due-row">${svgIcon("calendar")}${formatDue(card.due_at)}</div>
    </article>
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
  if (event.target.id !== "magic-link-form") return;
  event.preventDefault();

  const formData = new FormData(event.target);
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

  if (error) {
    state.error = error.message;
  } else {
    state.notice = "Check your email for the DoneZone sign-in link.";
  }

  renderAuth();
}

async function handleClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button || state.busy) return;

  const { action, boardId, listId, cardId } = button.dataset;

  if (action === "sign-out") {
    await supabase.auth.signOut();
    return;
  }

  if (!state.user) return;

  const actions = {
    "archive-card": () => archiveCard(cardId),
    "archive-done": archiveDoneCards,
    backup: backupBoard,
    "new-board": createBoard,
    "new-list": createList,
    "new-task": () => createTask(listId),
    refresh: async () => {},
    "rename-list": () => renameList(listId),
    "switch-board": () => switchBoard(boardId),
    "toggle-card": () => toggleCard(cardId),
  };

  if (actions[action]) {
    await runAction(actions[action]);
  }
}

async function runAction(action) {
  state.busy = true;
  state.error = "";
  state.notice = "";
  render();

  try {
    await action();
    await hydrateData();
  } catch (error) {
    state.error = getErrorMessage(error);
  } finally {
    state.busy = false;
    render();
  }
}

async function createBoard() {
  const title = window.prompt("Board name", "DoneZone");
  if (!title?.trim()) return;

  const sortOrder = getNextSortOrder(state.boards);
  const { data: board, error } = await supabase
    .from("boards")
    .insert({
      user_id: state.user.id,
      title: title.trim(),
      sort_order: sortOrder,
    })
    .select()
    .single();

  throwIfSupabaseError(error);

  const { data: lists, error: listsError } = await supabase
    .from("lists")
    .insert(
      starterLists.map((listTitle, index) => ({
        user_id: state.user.id,
        board_id: board.id,
        title: listTitle,
        sort_order: index,
      })),
    )
    .select();

  throwIfSupabaseError(listsError);

  await saveActiveBoard(board.id);

  const { error: settingsError } = await supabase.from("board_backup_settings").insert({
    user_id: state.user.id,
    board_id: board.id,
    enabled: false,
  });
  throwIfSupabaseError(settingsError);

  if (!lists?.length) {
    state.notice = "Board created without starter lists.";
  }
}

async function switchBoard(boardId) {
  if (!boardId || boardId === state.activeBoard?.id) return;
  await saveActiveBoard(boardId);
}

async function createList() {
  if (!state.activeBoard) return;

  const title = window.prompt("List name", "New List");
  if (!title?.trim()) return;

  const { error } = await supabase.from("lists").insert({
    user_id: state.user.id,
    board_id: state.activeBoard.id,
    title: title.trim(),
    sort_order: getNextSortOrder(state.lists),
  });

  throwIfSupabaseError(error);
  state.notice = "List created.";
}

async function renameList(listId) {
  const list = state.lists.find((item) => item.id === listId);
  if (!list) return;

  const title = window.prompt("Rename list", list.title);
  if (!title?.trim() || title.trim() === list.title) return;

  const { error } = await supabase
    .from("lists")
    .update({ title: title.trim() })
    .eq("id", list.id);

  throwIfSupabaseError(error);
  state.notice = "List renamed.";
}

async function createTask(listId) {
  if (!state.activeBoard) return;

  const targetList =
    state.lists.find((list) => list.id === listId) ||
    state.lists.find((list) => list.title.toLowerCase() !== "done") ||
    state.lists[0];

  if (!targetList) {
    state.notice = "Create a list before adding a task.";
    return;
  }

  const title = window.prompt("Task title", "New task");
  if (!title?.trim()) return;

  const listCards = state.cards.filter((card) => card.list_id === targetList.id);
  const { error } = await supabase.from("cards").insert({
    user_id: state.user.id,
    board_id: state.activeBoard.id,
    list_id: targetList.id,
    title: title.trim(),
    sort_order: getNextSortOrder(listCards),
  });

  throwIfSupabaseError(error);
  state.notice = "Task created.";
}

async function toggleCard(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;

  const nextDone = !card.done;
  const nextList = getToggleDestinationList(nextDone);

  const updates = {
    done: nextDone,
  };

  if (nextList) {
    updates.list_id = nextList.id;
  }

  const { error } = await supabase.from("cards").update(updates).eq("id", card.id);
  throwIfSupabaseError(error);
  state.notice = nextDone ? "Task marked done." : "Task reopened.";
}

async function archiveCard(cardId) {
  const card = state.cards.find((item) => item.id === cardId);
  if (!card) return;

  const confirmed = window.confirm(`Archive "${card.title}"?`);
  if (!confirmed) return;

  const { error } = await supabase
    .from("cards")
    .update({ archived: true })
    .eq("id", card.id);

  throwIfSupabaseError(error);
  state.notice = "Task archived.";
}

async function archiveDoneCards() {
  if (!state.activeBoard) return;

  const doneCount = state.cards.filter((card) => card.done).length;
  if (!doneCount) {
    state.notice = "No completed tasks to archive.";
    return;
  }

  const confirmed = window.confirm(`Archive ${doneCount} completed task${doneCount === 1 ? "" : "s"}?`);
  if (!confirmed) return;

  const { error } = await supabase
    .from("cards")
    .update({ archived: true })
    .eq("board_id", state.activeBoard.id)
    .eq("done", true);

  throwIfSupabaseError(error);
  state.notice = "Completed tasks archived.";
}

async function backupBoard() {
  if (!state.activeBoard) return;

  const snapshot = {
    exported_at: new Date().toISOString(),
    board: state.activeBoard,
    lists: state.lists,
    cards: state.cards,
  };
  const snapshotText = JSON.stringify(snapshot);

  const { error } = await supabase.from("board_backups").insert({
    user_id: state.user.id,
    board_id: state.activeBoard.id,
    board_title: state.activeBoard.title,
    reason: "Manual backup",
    snapshot,
    snapshot_hash: await hashText(snapshotText),
  });

  throwIfSupabaseError(error);
  state.notice = "Board backup saved.";
}

function getToggleDestinationList(nextDone) {
  if (nextDone) {
    return state.lists.find((list) => list.title.toLowerCase() === "done");
  }

  return (
    state.lists.find((list) => list.title.toLowerCase() === "next") ||
    state.lists.find((list) => list.title.toLowerCase() !== "done")
  );
}

function clearWorkspaceState() {
  state.boards = [];
  state.activeBoard = null;
  state.lists = [];
  state.cards = [];
  state.notice = "";
  state.error = "";
}

function getNextSortOrder(items) {
  return items.length
    ? Math.max(...items.map((item) => Number(item.sort_order) || 0)) + 1
    : 0;
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

function formatDue(value) {
  if (!value) return "No due date";

  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function svgIcon(name) {
  return `
    <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      ${icons[name] || ""}
    </svg>
  `;
}
