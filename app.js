(() => {
  const TOTAL_SECONDS = 90 * 60;
  const STORAGE_KEY = "pomodoro_tasks";
  const THEME_KEY = "pomodoro_theme";
  const SESSIONS_KEY = "pomodoro_sessions";

  // DOM
  const timerDisplay = document.getElementById("timerDisplay");
  const playBtn = document.getElementById("playBtn");
  const pauseBtn = document.getElementById("pauseBtn");
  const resetBtn = document.getElementById("resetBtn");
  const progressBar = document.getElementById("progressBar");
  const taskForm = document.getElementById("taskForm");
  const taskInput = document.getElementById("taskInput");
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  const themeToggle = document.getElementById("themeToggle");
  const timerCard = document.querySelector(".timer-card");
  const audio = document.getElementById("focusAudio");

  const statsSummary = document.getElementById("statsSummary");
  const sessionList = document.getElementById("sessionList");

  // State
  let secondsLeft = TOTAL_SECONDS;
  let intervalId = null;
  let running = false;

  // ── Theme ─────────────────────────────────────────────

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark") {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  function toggleTheme() {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem(THEME_KEY, "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem(THEME_KEY, "dark");
    }
  }

  themeToggle.addEventListener("click", toggleTheme);
  initTheme();

  // ── Timer ─────────────────────────────────────────────

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }

  function updateDisplay() {
    timerDisplay.textContent = formatTime(secondsLeft);
    const elapsed = TOTAL_SECONDS - secondsLeft;
    progressBar.style.width = `${(elapsed / TOTAL_SECONDS) * 100}%`;
  }

  function tick() {
    if (secondsLeft <= 0) {
      stopTimer();
      onTimerEnd();
      return;
    }
    secondsLeft--;
    updateDisplay();
  }

  function startTimer() {
    if (running) return;
    running = true;
    intervalId = setInterval(tick, 1000);
    playBtn.disabled = true;
    pauseBtn.disabled = false;
    audio.play().catch(() => {});

    // Pulse animation
    playBtn.classList.add("pulse");
    playBtn.addEventListener("animationend", () => playBtn.classList.remove("pulse"), { once: true });
  }

  function pauseTimer() {
    if (!running) return;
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
    audio.pause();
  }

  function stopTimer() {
    running = false;
    clearInterval(intervalId);
    intervalId = null;
    playBtn.disabled = false;
    pauseBtn.disabled = true;
  }

  function resetTimer() {
    stopTimer();
    secondsLeft = TOTAL_SECONDS;
    updateDisplay();
    audio.pause();
    audio.currentTime = 0;
  }

  function onTimerEnd() {
    audio.pause();
    audio.currentTime = 0;

    // Gentle pulse on timer card
    timerCard.classList.add("pulse-end");
    timerCard.addEventListener("animationend", () => timerCard.classList.remove("pulse-end"), { once: true });

    // Notification sound
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = 660;
      gain.gain.value = 0.3;
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (_) {
      // ignore if AudioContext unavailable
    }
    // Record completed session
    const sessions = loadSessions();
    sessions.push({ completedAt: new Date().toISOString() });
    saveSessions(sessions);
    renderStats();

    alert("Time's up! Great focus session.");
  }

  playBtn.addEventListener("click", startTimer);
  pauseBtn.addEventListener("click", pauseTimer);
  resetBtn.addEventListener("click", resetTimer);

  // ── Tasks ─────────────────────────────────────────────

  function loadTasks() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function updateTaskCount() {
    const tasks = loadTasks();
    const done = tasks.filter((t) => t.done).length;
    taskCount.textContent = `${done}/${tasks.length}`;
  }

  function renderTasks(animateLastItem) {
    const tasks = loadTasks();
    taskList.innerHTML = "";
    tasks.forEach((task, index) => {
      const li = document.createElement("li");

      // Animate newly added task (last item)
      if (animateLastItem && index === tasks.length - 1) {
        li.classList.add("slide-in");
      }

      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.className = "task-check";
      cb.checked = task.done;
      cb.addEventListener("change", () => toggleTask(task.id));

      const span = document.createElement("span");
      span.className = "task-text" + (task.done ? " done" : "");
      span.textContent = task.text;

      const del = document.createElement("button");
      del.className = "btn-delete";
      del.textContent = "\u{1F5D1}";
      del.title = "Delete task";
      del.addEventListener("click", () => deleteTask(task.id, li));

      li.append(cb, span, del);
      taskList.appendChild(li);
    });
    updateTaskCount();
  }

  function addTask(text) {
    const tasks = loadTasks();
    tasks.push({ id: Date.now(), text, done: false });
    saveTasks(tasks);
    renderTasks(true);
  }

  function toggleTask(id) {
    const tasks = loadTasks();
    const task = tasks.find((t) => t.id === id);
    if (task) task.done = !task.done;
    saveTasks(tasks);
    renderTasks(false);
  }

  function deleteTask(id, li) {
    li.classList.add("slide-out");
    li.addEventListener("animationend", () => {
      const tasks = loadTasks().filter((t) => t.id !== id);
      saveTasks(tasks);
      renderTasks(false);
    }, { once: true });
  }

  taskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (!text) return;
    addTask(text);
    taskInput.value = "";
  });

  // ── Sessions ────────────────────────────────────────────

  function loadSessions() {
    try {
      return JSON.parse(localStorage.getItem(SESSIONS_KEY)) || [];
    } catch {
      return [];
    }
  }

  function saveSessions(sessions) {
    localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
  }

  function getTodaySessions() {
    const today = new Date().toLocaleDateString();
    return loadSessions().filter((s) =>
      new Date(s.completedAt).toLocaleDateString() === today
    );
  }

  function renderStats() {
    const sessions = getTodaySessions();

    statsSummary.textContent = sessions.length
      ? `${sessions.length} session${sessions.length === 1 ? "" : "s"} completed`
      : "No sessions yet today";

    sessionList.innerHTML = "";
    sessions.forEach((s) => {
      const li = document.createElement("li");

      const time = document.createElement("span");
      time.className = "session-time";
      time.textContent = new Date(s.completedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

      const badge = document.createElement("span");
      badge.className = "session-badge completed";
      badge.textContent = "Completed";

      li.append(time, badge);
      sessionList.appendChild(li);
    });
  }

  // ── Init ──────────────────────────────────────────────

  updateDisplay();
  renderTasks(false);
  renderStats();
})();
