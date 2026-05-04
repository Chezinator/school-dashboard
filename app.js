// ============================================================================
// SchoolBase - Vanilla JS Dashboard
// ============================================================================

let appData = null;
let currentWeekIndex = 0;

// ============================================================================
// DATA LOADING
// ============================================================================

async function loadData() {
  try {
    const response = await fetch('./weeklyReport.json');
    if (!response.ok) throw new Error(`Failed to load data: ${response.status}`);
    appData = await response.json();
    render();
  } catch (err) {
    console.error('Error loading data:', err);
    document.getElementById('app').innerHTML = `
      <div class="error">
        <h2>Error Loading Dashboard</h2>
        <p>${err.message}</p>
        <button onclick="location.reload()">Reload Page</button>
      </div>
    `;
  }
}

// ============================================================================
// RENDERING
// ============================================================================

function render() {
  if (!appData) return;
  
  const container = document.getElementById('app');
  container.innerHTML = renderApp();
  attachEventListeners();
}

function renderApp() {
  const week = appData.weeks[currentWeekIndex];
  const meta = appData.meta;
  const kids = appData.kids;
  
  if (!week) {
    return '<div class="error"><h2>No data available</h2></div>';
  }
  
  return `
    <div class="container">
      ${renderHeader(meta)}
      ${renderWeekSelector()}
      <div class="tabs" id="tabs">
        ${['Home', 'Calendar', 'Lunch', 'Teacher Updates', 'Homework'].map((name, idx) => `
          <button class="tab ${idx === 0 ? 'active' : ''}" data-tab="${idx}">${name}</button>
        `).join('')}
      </div>
      <div class="content" id="content">
        ${renderHome(week, kids)}
      </div>
    </div>
  `;
}

function renderHeader(meta) {
  return `
    <div class="header">
      <h1>SchoolBase</h1>
      <p>${meta.schoolName} • ${meta.familyName} Family</p>
    </div>
  `;
}

function renderWeekSelector() {
  const week = appData.weeks[currentWeekIndex];
  const canGoNewer = currentWeekIndex > 0;
  const canGoOlder = currentWeekIndex < appData.weeks.length - 1;
  
  return `
    <div class="week-selector">
      <button id="btn-newer" ${!canGoNewer ? 'disabled' : ''}>← Newer</button>
      <span class="week-label">${week.weekLabel}</span>
      <button id="btn-older" ${!canGoOlder ? 'disabled' : ''}>Older →</button>
    </div>
  `;
}

// ============================================================================
// TAB: HOME
// ============================================================================

function renderHome(week, kids) {
  return `
    <div>
      ${renderActionItems(week)}
      ${renderImportantDates(week)}
      ${renderTeacherComms(week, kids)}
      ${renderWeather(week)}
    </div>
  `;
}

function renderActionItems(week) {
  const items = week.actionItems || [];
  if (!items.length) return '';
  
  return `
    <div class="card">
      <div class="card-title text-teal">⚠️ Action Items</div>
      <div class="card-subtitle">${items.length} items</div>
      ${items.map(item => `
        <div class="item">
          <div class="item-title">${item.title || 'Untitled'}</div>
          <div class="item-meta">
            Due: ${item.dueDate || 'TBD'} • ${item.category || 'general'}
          </div>
          ${item.description ? `<p style="margin-top:0.5rem; font-size:0.9rem">${item.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderImportantDates(week) {
  const dates = week.importantDates || [];
  if (!dates.length) return '';
  
  return `
    <div class="card">
      <div class="card-title text-sage">📅 Important Dates</div>
      ${dates.map(date => `
        <div class="item">
          <div class="item-title">${date.title || 'Event'}</div>
          <div class="item-meta">${date.date || 'TBD'}</div>
          ${date.description ? `<p style="margin-top:0.5rem; font-size:0.9rem">${date.description}</p>` : ''}
        </div>
      `).join('')}
    </div>
  `;
}

function renderTeacherComms(week, kids) {
  const comms = week.teacherComms || [];
  if (!comms.length) return '';
  
  return `
    <div class="card">
      <div class="card-title text-teal">👩‍🏫 Teacher Updates</div>
      <div class="card-subtitle">Latest emails from teachers</div>
      ${comms.map(comm => `
        <div style="margin-bottom: 1rem; padding-bottom: 1rem; border-bottom: 1px solid var(--color-border)">
          <div class="item-title">${comm.teacher || 'Unknown'}</div>
          <div class="item-meta">Student: ${comm.kidId || 'TBD'}</div>
          ${(comm.messages || []).map((msg, idx) => `
            <div style="margin-top: 0.5rem; padding: 0.5rem; background: var(--color-bg); border-radius: 0.25rem; font-size: 0.9rem">
              <strong>${msg.subject || 'Message'}</strong>
              <div style="margin-top: 0.25rem; color: var(--color-muted)">${msg.summary || msg.text || ''}</div>
              ${msg.date ? `<div style="margin-top: 0.25rem; font-size: 0.8rem; color: var(--color-muted)">${msg.date}</div>` : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

function renderWeather(week) {
  const weather = week.weatherForecast || [];
  if (!weather.length) return '';
  
  return `
    <div class="card">
      <div class="card-title text-amber">🌤️ Weather</div>
      ${weather.map(day => `
        <div class="item">
          <div class="item-title">${day.date || 'TBD'}</div>
          <div class="item-meta">${day.condition || 'Unknown'} • High: ${day.high || '—'}° Low: ${day.low || '—'}°</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// TAB: CALENDAR
// ============================================================================

function renderCalendar(week) {
  const dates = week.importantDates || [];
  if (!dates.length) return '<div class="card"><p>No events this week</p></div>';
  
  return `
    <div class="card">
      <div class="card-title">Calendar View</div>
      ${dates.map(date => `
        <div class="item">
          <div class="item-title">${date.title}</div>
          <div class="item-meta">${date.date}</div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// TAB: LUNCH
// ============================================================================

function renderLunch(week) {
  const menu = week.lunchMenu || [];
  if (!menu.length) return '<div class="card"><p>No lunch menu available</p></div>';
  
  return `
    <div>
      ${menu.map(day => `
        <div class="card">
          <div class="card-title text-coral">${day.date || 'Day'}</div>
          <div style="font-size: 0.95rem; line-height: 1.6">
            ${day.items?.join('<br>') || day.menu || 'No menu data'}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// TAB: HOMEWORK
// ============================================================================

function renderHomework(week, kids) {
  const homework = week.homework || [];
  if (!homework.length) return '<div class="card"><p>No assignments this week</p></div>';
  
  return `
    <div>
      ${homework.map(hw => `
        <div class="card">
          <div class="card-title">${hw.kidId || 'Student'}</div>
          ${(hw.assignments || []).map(asn => `
            <div class="item">
              <div class="item-title">${asn.title || 'Assignment'}</div>
              <div class="item-meta">Due: ${asn.dueDate || 'TBD'} • Subject: ${asn.subject || 'TBD'}</div>
              ${asn.description ? `<p style="margin-top:0.5rem; font-size:0.9rem">${asn.description}</p>` : ''}
            </div>
          `).join('')}
        </div>
      `).join('')}
    </div>
  `;
}

// ============================================================================
// EVENT LISTENERS
// ============================================================================

function attachEventListeners() {
  // Tab clicks
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => switchTab(parseInt(tab.dataset.tab)));
  });
  
  // Week navigation
  const btnNewer = document.getElementById('btn-newer');
  const btnOlder = document.getElementById('btn-older');
  if (btnNewer) btnNewer.addEventListener('click', goNewer);
  if (btnOlder) btnOlder.addEventListener('click', goOlder);
}

function switchTab(tabIndex) {
  const week = appData.weeks[currentWeekIndex];
  const kids = appData.kids;
  const tabs = ['home', 'calendar', 'lunch', 'homework', 'teacher'];
  const tabNames = ['Home', 'Calendar', 'Lunch', 'Teacher Updates', 'Homework'];
  
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', i === tabIndex);
  });
  
  let content = '';
  switch (tabIndex) {
    case 0:
      content = renderHome(week, kids);
      break;
    case 1:
      content = renderCalendar(week);
      break;
    case 2:
      content = renderLunch(week);
      break;
    case 3:
      content = renderTeacherComms(week, kids);
      break;
    case 4:
      content = renderHomework(week, kids);
      break;
  }
  
  const contentDiv = document.getElementById('content');
  if (contentDiv) contentDiv.innerHTML = content;
}

function goNewer() {
  if (currentWeekIndex > 0) {
    currentWeekIndex--;
    render();
  }
}

function goOlder() {
  if (currentWeekIndex < appData.weeks.length - 1) {
    currentWeekIndex++;
    render();
  }
}

// ============================================================================
// BOOTSTRAP
// ============================================================================

document.addEventListener('DOMContentLoaded', loadData);
