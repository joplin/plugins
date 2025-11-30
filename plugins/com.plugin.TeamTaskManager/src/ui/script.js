let teams = JSON.parse(localStorage.getItem('teams')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let currentTeamMembers = [];

function saveData() {
  localStorage.setItem('teams', JSON.stringify(teams));
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/* -------------------------
   ADD MEMBER TO TEAM
-------------------------- */
document.getElementById('add-member-btn').addEventListener('click', () => {
  const name = document.getElementById('member-name').value.trim();
  if (name && !currentTeamMembers.includes(name)) {
    currentTeamMembers.push(name);
    document.getElementById('member-name').value = '';
    updateMembersPreview();
  }
});

function updateMembersPreview() {
  const box = document.getElementById('team-members-preview');
  if (!currentTeamMembers.length) {
    box.innerHTML = '<div style="color:#888">No members added yet</div>';
    return;
  }
  box.innerHTML = currentTeamMembers
    .map(m => `<span class="member-tag">${m} <span onclick="removeMember('${m}')" style="cursor:pointer;color:#f44336;margin-left:5px;">×</span></span>`)
    .join('');
}

function removeMember(name) {
  currentTeamMembers = currentTeamMembers.filter(m => m !== name);
  updateMembersPreview();
}

/* -------------------------
   NAVIGATION
-------------------------- */
const navButtons = document.querySelectorAll("nav button");
const sections = {
  dashboard: document.getElementById("dashboard"),
  teams: document.getElementById("teams"),
  tasks: document.getElementById("tasks"),
};

navButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.id.replace("nav-", "");
    showSection(target);
  });
});

function showSection(sec) {
  Object.values(sections).forEach(s => s.classList.add("hidden"));
  sections[sec].classList.remove("hidden");

  navButtons.forEach(b => b.classList.remove("active"));
  document.getElementById(`nav-${sec}`).classList.add("active");

  if (sec === "dashboard") renderDashboard();
  if (sec === "teams") renderTeams();
  if (sec === "tasks") renderTaskForm();
}

/* -------------------------
   CREATE TEAM
-------------------------- */
document.getElementById("create-team-form").addEventListener("submit", e => {
  e.preventDefault();

  const name = document.getElementById("team-name").value.trim();
  if (!name) return alert(" Enter name");
  if (currentTeamMembers.length === 0) return alert(" Add members");
  if (teams.some(t => t.name === name)) return alert(" Team exists");

  const newTeam = {
    id: Date.now(),
    name,
    members: [...currentTeamMembers],
    created: new Date().toISOString(),
  };

  teams.push(newTeam);
  saveData();

  document.getElementById("team-name").value = "";
  currentTeamMembers = [];
  updateMembersPreview();

  renderTeams();
  renderDashboard();
  renderTaskForm();
  renderTasksByTeam();

  alert(` Team "${name}" created!`);
});

/* -------------------------
   DELETE TEAM
-------------------------- */
window.deleteTeam = function (teamId) {
  const team = teams.find(t => t.id === teamId);
  if (!team) return;

  if (!confirm(`Delete team "${team.name}"?\nAll tasks for this team will be removed.`)) return;

  teams = teams.filter(t => t.id !== teamId);
  tasks = tasks.filter(task => task.teamId !== teamId);

  saveData();
  renderTeams();
  renderDashboard();
  renderTaskForm();
  renderTasksByTeam();
};

/* -------------------------
   RENDER TEAMS LIST
-------------------------- */
function renderTeams() {
  const box = document.getElementById("teams-list");

  if (!teams.length) {
    box.innerHTML = '<div class="empty">Create your first team 🎉</div>';
    return;
  }

  box.innerHTML = teams
    .map(
      t => `
      <div class="card">
        <h4>${t.name}</h4>

        <div class="team-members">
          <strong>Members (${t.members.length}):</strong>
          ${t.members.map(m => `<span class="member-tag">${m}</span>`).join("")}
        </div>

        <button onclick="deleteTeam(${t.id})" 
                style="background:#ff6b6b;margin-top:10px;width:120px;">
          🗑 Delete Team
        </button>
      </div>`
    )
    .join("");
}

/* -------------------------
   TASK FORM UPDATE
-------------------------- */
function renderTaskForm() {
  const teamSelect = document.getElementById("task-team");
  teamSelect.innerHTML =
    '<option value="">Select a team</option>' +
    teams.map(t => `<option value="${t.id}">${t.name}</option>`).join("");

  const memberSelect = document.getElementById("task-assignee");
  memberSelect.innerHTML = '<option value="">Select team member</option>';

  teamSelect.onchange = () => {
    const team = teams.find(t => t.id == teamSelect.value);
    memberSelect.innerHTML =
      '<option value="">Select team member</option>' +
      team.members.map(m => `<option>${m}</option>`).join("");
  };
}

/* -------------------------
   CREATE TASK
-------------------------- */
document.getElementById("create-task-form").addEventListener("submit", e => {
  e.preventDefault();

  const teamId = parseInt(document.getElementById("task-team").value);
  const title = document.getElementById("task-title").value.trim();
  const desc = document.getElementById("task-desc").value.trim();
  const assignee = document.getElementById("task-assignee").value;
  const deadline = document.getElementById("task-deadline").value;

  const newTask = {
    id: Date.now(),
    teamId,
    title,
    description: desc,
    assignee,
    deadline,
    status: "todo",
  };

  tasks.push(newTask);
  saveData();

  renderDashboard();
  renderTasksByTeam();
  renderTaskForm();

  alert(` Task "${title}" created!`);
  e.target.reset();
});

/* -------------------------
   DASHBOARD
-------------------------- */
function renderDashboard() {
  const teamBox = document.getElementById("dashboard-teams");

  if (!teams.length) {
    teamBox.innerHTML = '<div class="empty">No teams yet</div>';
  } else {
    teamBox.innerHTML = teams
      .map(t => {
        const count = tasks.filter(x => x.teamId === t.id).length;
        return `
          <div class="card dashboard-team-card">
            <div>
              <strong>${t.name}</strong>
              <div class="team-members-list">
                ${t.members.slice(0, 3).map(m => `<span class="member-tag">${m}</span>`).join("")}
                ${t.members.length > 3 ? `+${t.members.length - 3} more` : ""}
              </div>
            </div>

            <div style="text-align:right;">
              <div>${count} tasks</div>

              <button onclick="deleteTeam(${t.id})"
                      style="background:red;margin-top:10px;padding:6px 12px;font-size:12px;border-radius:6px;">
                🗑 Delete
              </button>
            </div>
          </div>`;
      })
      .join("");
  }

  const statusGroups = { todo: [], inprogress: [], completed: [] };

  tasks.forEach(task => {
    const team = teams.find(t => t.id === task.teamId);
    task.teamName = team ? team.name : "Unknown";
    statusGroups[task.status].push(task);
  });

  document.getElementById("todo-count").textContent = statusGroups.todo.length;
  document.getElementById("progress-count").textContent = statusGroups.inprogress.length;
  document.getElementById("done-count").textContent = statusGroups.completed.length;

  ["todo", "inprogress", "completed"].forEach(status => {
    document.getElementById(`tasks-${status}`).innerHTML =
      statusGroups[status].length
        ? statusGroups[status]
            .map(
              t => `
          <div class="card status-${status}">
            <h4>${t.title}</h4>
            <p>${t.description}</p>
            <div>
              <span class="badge team">${t.teamName}</span>
              <span class="badge member">${t.assignee}</span>
              <span class="badge deadline">${new Date(t.deadline).toLocaleDateString()}</span>
            </div>
            <div class="task-status">
              <select onchange="updateTaskStatus(${t.id}, this.value)">
                <option value="todo" ${t.status === "todo" ? "selected" : ""}>☐ To Do</option>
                <option value="inprogress" ${t.status === "inprogress" ? "selected" : ""}>◐ In Progress</option>
                <option value="completed" ${t.status === "completed" ? "selected" : ""}>✔ Completed</option>
              </select>
            </div>
          </div>`
            )
            .join("")
        : '<div class="empty">No tasks</div>';
  });
}

window.updateTaskStatus = function (taskId, status) {
  const task = tasks.find(t => t.id === taskId);
  task.status = status;
  saveData();
  renderDashboard();
  renderTasksByTeam();
};

/* -------------------------
   TASKS BY TEAM
-------------------------- */
function renderTasksByTeam() {
  const box = document.getElementById("tasks-by-team");

  if (!teams.length) {
    box.innerHTML = '<div class="empty">Create a team first</div>';
    return;
  }

  box.innerHTML = teams
    .map(t => {
      const teamTasks = tasks.filter(x => x.teamId === t.id);
      return `
        <div class="card">
          <h4>${t.name} (${teamTasks.length} tasks)</h4>
          ${
            teamTasks.length
              ? teamTasks
                  .map(
                    x => `
              <div style="padding:10px;background:#f8f9fa;margin:10px 0;border-left:4px solid #4ecdc4;">
                <strong>${x.title}</strong> → ${x.assignee}
              </div>`
                  )
                  .join("")
              : "<div>No tasks yet</div>"
          }
        </div>`;
    })
    .join("");
}
/* -------------------------
  INIT
-------------------------- */
renderDashboard();
renderTeams();
renderTaskForm();
renderTasksByTeam();