/* ============================================================
   TGS CHEFCHOICE — Admin Dashboard Interactive Logic (v2.0)
   Includes: Multi-filtering, CSV export, Order Detail modal, 
   Internal Notes, Top Selling Dishes widget, Regular customer tags,
   and Printable Kitchen Slips.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  purgeOldDummyData();
  setupTabNavigation();
  setupFilters();
  setupButtons();
  setupModals();
  renderDashboard();
});

// Current active tab state: 'food' | 'table' | 'event'
let activeTab = 'food';
let chartInstance = null;

// Purge any previously seeded dummy/fake sample data from LocalStorage
function purgeOldDummyData() {
  ['food', 'table', 'event'].forEach(tab => {
    const key = `tgs_admin_${tab}_orders`;
    const data = localStorage.getItem(key);
    if (data && (data.includes('TGS-260724-5521') || data.includes('TGS-TBL-701') || data.includes('TGS-EVT-901') || data.includes('TGS-TEST-'))) {
      localStorage.removeItem(key);
    }
  });
}

// Tab Switching
function setupTabNavigation() {
  document.querySelectorAll('.admin-nav__item[data-tab]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.admin-nav__item').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      activeTab = btn.dataset.tab;
      renderDashboard();
    });
  });
}

// Search & Filter Events
function setupFilters() {
  document.getElementById('adminSearchInput')?.addEventListener('input', renderDashboard);
  document.getElementById('statusFilter')?.addEventListener('change', renderDashboard);
  document.getElementById('dateFilter')?.addEventListener('change', renderDashboard);
}

// Action Buttons
function setupButtons() {
  document.getElementById('refreshAdminBtn')?.addEventListener('click', renderDashboard);

  document.getElementById('exportCsvBtn')?.addEventListener('click', () => {
    exportToCsv();
  });

  document.getElementById('clearAdminBtn')?.addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all stored admin records for ' + activeTab.toUpperCase() + '?')) {
      localStorage.removeItem(`tgs_admin_${activeTab}_orders`);
      renderDashboard();
    }
  });
}

// Storage Helpers
function getRecords(tab) {
  const key = `tgs_admin_${tab}_orders`;
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch (e) {
    return [];
  }
}

function saveRecords(tab, list) {
  const key = `tgs_admin_${tab}_orders`;
  localStorage.setItem(key, JSON.stringify(list));
}

// Master Render Function
function renderDashboard() {
  const records = getRecords(activeTab);
  const searchQuery = document.getElementById('adminSearchInput')?.value.toLowerCase().trim() || '';
  const statusVal = document.getElementById('statusFilter')?.value || 'all';
  const dateVal = document.getElementById('dateFilter')?.value || 'week';

  // Compute repeat customer map across all food orders
  const customerOrderCounts = {};
  getRecords('food').forEach(r => {
    const p = (r.phone || '').replace(/[^0-9]/g, '');
    if (p) customerOrderCounts[p] = (customerOrderCounts[p] || 0) + 1;
  });

  // Filter records
  const filtered = records.filter(r => {
    // Search match
    if (searchQuery) {
      const matchId = r.orderId && r.orderId.toLowerCase().includes(searchQuery);
      const matchName = r.name && r.name.toLowerCase().includes(searchQuery);
      const matchPhone = r.phone && r.phone.toLowerCase().includes(searchQuery);
      if (!matchId && !matchName && !matchPhone) return false;
    }

    // Status match
    if (statusVal !== 'all' && r.status !== statusVal) {
      return false;
    }

    // Date range match
    if (dateVal !== 'all') {
      const rDate = new Date(r.timestamp || Date.now());
      const now = new Date();
      if (dateVal === 'today') {
        if (rDate.toDateString() !== now.toDateString()) return false;
      } else if (dateVal === 'week') {
        const diffDays = Math.floor((now.getTime() - rDate.getTime()) / (1000 * 3600 * 24));
        if (diffDays > 7) return false;
      } else if (dateVal === 'month') {
        if (rDate.getMonth() !== now.getMonth() || rDate.getFullYear() !== now.getFullYear()) return false;
      }
    }

    return true;
  });

  // Update Header Titles
  const titleEl = document.getElementById('tabTitle');
  const subEl = document.getElementById('tabSubtitle');
  const tableTitle = document.getElementById('tableCardTitle');

  if (activeTab === 'food') {
    titleEl.textContent = '🛒 Food Orders Overview';
    subEl.textContent = 'Track online delivery, takeaway parcels, and dine-in food requests.';
    tableTitle.textContent = '📋 Recent Food Orders';
  } else if (activeTab === 'table') {
    titleEl.textContent = '🪑 Table Reservations Overview';
    subEl.textContent = 'Manage table seatings, guest party sizes, and preferred dining slots.';
    tableTitle.textContent = '📋 Table Booking Requests';
  } else {
    titleEl.textContent = '🎉 Catering & Event Enquiries Overview';
    subEl.textContent = 'Organize bulk party orders, housewarmings, and wedding buffets.';
    tableTitle.textContent = '📋 Event & Function Enquiries';
  }

  // Update Stats Cards
  const totalCount = filtered.length;
  const confirmedList = filtered.filter(r => r.status === 'Confirmed');
  const revenue = confirmedList.reduce((s, r) => s + (r.totalAmount || 0), 0);
  const pendingCount = filtered.filter(r => r.status === 'Pending').length;
  const cancelledCount = filtered.filter(r => r.status === 'Cancelled').length;

  document.getElementById('statTotalCount').textContent = totalCount;
  document.getElementById('statRevenue').textContent = `₹${revenue.toLocaleString('en-IN')}`;
  document.getElementById('statPending').textContent = pendingCount;
  document.getElementById('statCancelled').textContent = cancelledCount;

  document.getElementById('tableCountText').textContent = `Showing ${filtered.length} of ${records.length} records`;

  const dateBadgeMap = { all: 'All Time', today: 'Today', week: 'This Week', month: 'This Month' };
  const badgeEl = document.getElementById('analyticsBadge');
  if (badgeEl) badgeEl.textContent = dateBadgeMap[dateVal] || 'Custom';

  // Render Chart
  renderChart(filtered, dateVal);

  // Render Top-Selling Widget
  renderTopSellingWidget();

  // Render Table
  renderTable(filtered, customerOrderCounts);
}

// Chart Rendering (Chart.js)
function renderChart(data, range) {
  const ctx = document.getElementById('adminChart')?.getContext('2d');
  if (!ctx) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  let labels = [];
  let counts = [];
  let revenues = [];

  if (range === 'today') {
    labels = ['11 AM', '1 PM', '3 PM', '5 PM', '7 PM', '9 PM', '11 PM'];
    counts = [0, 0, 0, 0, 0, 0, 0];
    revenues = [0, 0, 0, 0, 0, 0, 0];

    data.forEach(r => {
      const h = new Date(r.timestamp || Date.now()).getHours();
      let idx = 0;
      if (h >= 11 && h < 13) idx = 0;
      else if (h >= 13 && h < 15) idx = 1;
      else if (h >= 15 && h < 17) idx = 2;
      else if (h >= 17 && h < 19) idx = 3;
      else if (h >= 19 && h < 21) idx = 4;
      else if (h >= 21 && h < 23) idx = 5;
      else idx = 6;

      counts[idx]++;
      if (r.status === 'Confirmed') revenues[idx] += (r.totalAmount || 0);
    });

  } else {
    // Default 7 Days or Month View
    const numDays = range === 'month' ? 30 : 7;
    for (let i = numDays - 1; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      labels.push(d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
      counts.push(0);
      revenues.push(0);
    }

    data.forEach(r => {
      const rDate = new Date(r.timestamp || Date.now());
      const dayDiff = Math.floor((Date.now() - rDate.getTime()) / (1000 * 60 * 60 * 24));
      if (dayDiff >= 0 && dayDiff < numDays) {
        const idx = (numDays - 1) - dayDiff;
        counts[idx]++;
        if (r.status === 'Confirmed') {
          revenues[idx] += (r.totalAmount || 0);
        }
      }
    });
  }

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Order Count',
          data: counts,
          backgroundColor: 'rgba(217, 119, 6, 0.75)',
          borderColor: '#D97706',
          borderWidth: 1.5,
          borderRadius: 6,
          yAxisID: 'y'
        },
        {
          label: 'Revenue (₹)',
          data: revenues,
          type: 'line',
          borderColor: '#10B981',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          fill: true,
          tension: 0.3,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: { mode: 'index', intersect: false },
      scales: {
        y: {
          type: 'linear',
          display: true,
          position: 'left',
          title: { display: true, text: 'Order Count' },
          ticks: { precision: 0 }
        },
        y1: {
          type: 'linear',
          display: true,
          position: 'right',
          title: { display: true, text: 'Revenue (₹)' },
          grid: { drawOnChartArea: false }
        }
      }
    }
  });
}

// Render Top-Selling Items Widget
function renderTopSellingWidget() {
  const container = document.getElementById('topSellingList');
  if (!container) return;

  const foodOrders = getRecords('food');
  const dishMap = {};

  foodOrders.forEach(r => {
    if (r.items && Array.isArray(r.items)) {
      r.items.forEach(item => {
        if (!dishMap[item.name]) {
          dishMap[item.name] = { name: item.name, qty: 0, revenue: 0 };
        }
        dishMap[item.name].qty += item.qty;
        dishMap[item.name].revenue += (item.qty * item.price);
      });
    }
  });

  const sorted = Object.values(dishMap).sort((a, b) => b.qty - a.qty).slice(0, 5);

  if (!sorted.length) {
    container.innerHTML = `<div style="font-size:0.85rem; color:#94A3B8; text-align:center; padding:16px 0;">No sales data available yet.</div>`;
    return;
  }

  container.innerHTML = '';
  sorted.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'top-dish-item';
    el.innerHTML = `
      <div>
        <div style="font-weight:700; color:var(--text-dark);">${idx + 1}. ${escapeHtml(item.name)}</div>
        <div style="font-size:0.75rem; color:#64748B;">₹${item.revenue} Total Sales</div>
      </div>
      <span style="font-weight:800; color:var(--saffron-gold); background:#FFF8EE; padding:3px 8px; border-radius:10px; border:1px solid var(--saffron-border);">
        ${item.qty} Orders
      </span>
    `;
    container.appendChild(el);
  });
}

// Table Rendering
function renderTable(list, customerCounts) {
  const headEl = document.getElementById('adminTableHead');
  const bodyEl = document.getElementById('adminTableBody');
  if (!headEl || !bodyEl) return;

  bodyEl.innerHTML = '';

  if (activeTab === 'food') {
    headEl.innerHTML = `
      <tr>
        <th>Order ID</th>
        <th>Customer Name</th>
        <th>Phone</th>
        <th>Dishes / Items</th>
        <th>Delivery Address</th>
        <th>Total</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    `;

    if (!list.length) {
      bodyEl.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#64748B;">No food orders found matching filter criteria.</td></tr>`;
      return;
    }

    list.forEach((row) => {
      const tr = document.createElement('tr');
      tr.style.cursor = 'pointer';
      
      const phoneDigits = (row.phone || '').replace(/[^0-9]/g, '');
      const isRegular = (customerCounts[phoneDigits] || 0) >= 2;
      const regularTag = isRegular ? `<span class="badge-regular">⭐ Regular</span>` : '';

      const itemsCount = row.items ? row.items.reduce((s, i) => s + i.qty, 0) : 0;
      let itemsHtml = `<div>${itemsCount} Items <button class="items-popover-btn" onclick="openDetailModal('${row.orderId}')">View Details 👁️</button></div>`;
      
      const statusBadge = getStatusBadgeHtml(row.status);

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--text-dark);" onclick="openDetailModal('${row.orderId}')">${row.orderId}</td>
        <td style="font-weight:600;" onclick="openDetailModal('${row.orderId}')">${escapeHtml(row.name)} ${regularTag}</td>
        <td><a href="tel:${row.phone}" style="color:var(--saffron-gold); font-weight:700;">${row.phone}</a></td>
        <td>${itemsHtml}</td>
        <td style="max-width:200px; font-size:0.85rem; color:#475569;" onclick="openDetailModal('${row.orderId}')">${escapeHtml(row.address)}</td>
        <td style="font-weight:800; color:var(--saffron-gold);">₹${row.totalAmount}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:5px; flex-wrap:wrap;">
            <button onclick="confirmOrder('${row.orderId}')" style="background:#10B981; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">✅ Confirm</button>
            <button onclick="openQrModal(${row.totalAmount})" style="background:#3B82F6; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">📱 QR</button>
            <button onclick="cancelOrder('${row.orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">❌ Cancel</button>
          </div>
        </td>
      `;
      bodyEl.appendChild(tr);
    });

  } else if (activeTab === 'table') {
    headEl.innerHTML = `
      <tr>
        <th>Booking ID</th>
        <th>Guest Name</th>
        <th>Phone</th>
        <th>Party Size</th>
        <th>Date &amp; Time</th>
        <th>Occasion / Notes</th>
        <th>Est. Bill</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    `;

    if (!list.length) {
      bodyEl.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#64748B;">No table bookings found matching filter criteria.</td></tr>`;
      return;
    }

    list.forEach(row => {
      const tr = document.createElement('tr');
      const statusBadge = getStatusBadgeHtml(row.status);

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--text-dark);" onclick="openDetailModal('${row.orderId}')">${row.orderId}</td>
        <td style="font-weight:600;" onclick="openDetailModal('${row.orderId}')">${escapeHtml(row.name)}</td>
        <td><a href="tel:${row.phone}" style="color:var(--saffron-gold); font-weight:700;">${row.phone}</a></td>
        <td><span style="background:#FFF8EE; border:1px solid var(--saffron-border); padding:3px 8px; border-radius:12px; font-weight:700;">${escapeHtml(row.guests || '2 Guests')}</span></td>
        <td>${row.date} @ ${row.time || '19:30'}</td>
        <td style="font-size:0.85rem; color:#475569;">${escapeHtml(row.occasion || 'General Dining')}</td>
        <td style="font-weight:800; color:var(--saffron-gold);">₹${row.totalAmount || 1000}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button onclick="confirmOrder('${row.orderId}')" style="background:#10B981; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">✅ Confirm</button>
            <button onclick="cancelOrder('${row.orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">❌ Cancel</button>
          </div>
        </td>
      `;
      bodyEl.appendChild(tr);
    });

  } else {
    headEl.innerHTML = `
      <tr>
        <th>Enquiry ID</th>
        <th>Client Name</th>
        <th>Phone</th>
        <th>Event Date</th>
        <th>Occasion / Size</th>
        <th>Notes / Setup</th>
        <th>Est. Budget</th>
        <th>Status</th>
        <th>Action</th>
      </tr>
    `;

    if (!list.length) {
      bodyEl.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#64748B;">No event bookings found matching filter criteria.</td></tr>`;
      return;
    }

    list.forEach(row => {
      const tr = document.createElement('tr');
      const statusBadge = getStatusBadgeHtml(row.status);

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--text-dark);" onclick="openDetailModal('${row.orderId}')">${row.orderId}</td>
        <td style="font-weight:600;" onclick="openDetailModal('${row.orderId}')">${escapeHtml(row.name)}</td>
        <td><a href="tel:${row.phone}" style="color:var(--saffron-gold); font-weight:700;">${row.phone}</a></td>
        <td>${row.date}</td>
        <td style="font-weight:700; color:var(--saffron-gold);">${escapeHtml(row.occasion)}</td>
        <td style="font-size:0.85rem; color:#475569;">${escapeHtml(row.notes || 'No extra notes')}</td>
        <td style="font-weight:800; color:var(--saffron-gold);">₹${row.totalAmount || 5000}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button onclick="confirmOrder('${row.orderId}')" style="background:#10B981; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">✅ Confirm</button>
            <button onclick="openQrModal(500)" style="background:#3B82F6; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">💰 Deposit QR</button>
            <button onclick="cancelOrder('${row.orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:5px 9px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">❌ Cancel</button>
          </div>
        </td>
      `;
      bodyEl.appendChild(tr);
    });
  }
}

// Status Chips Helper
function getStatusBadgeHtml(status) {
  if (status === 'Confirmed') {
    return `<span class="status-badge status-confirmed">✓ Confirmed</span>`;
  } else if (status === 'Cancelled') {
    return `<span class="status-badge status-cancelled">✕ Cancelled</span>`;
  } else {
    return `<span class="status-badge status-pending">⏳ Pending</span>`;
  }
}

// Full Order Detail Modal Logic
function setupModals() {
  const detailModal = document.getElementById('orderDetailModal');
  const closeDetailBtn = document.getElementById('closeDetailModal');
  closeDetailBtn?.addEventListener('click', () => detailModal?.classList.remove('open'));

  const qrModal = document.getElementById('qrModal');
  const closeQrBtn = document.getElementById('closeQrModal');
  const copyBtn = document.getElementById('copyUpiLinkBtn');

  closeQrBtn?.addEventListener('click', () => qrModal?.classList.remove('open'));

  copyBtn?.addEventListener('click', () => {
    const amountText = document.getElementById('qrAmount')?.textContent.replace(/[^0-9]/g, '') || '0';
    const upiUrl = `upi://pay?pa=tgschefchoice@okicici&pn=TGS%20ChefChoice&am=${amountText}&cu=INR`;
    navigator.clipboard.writeText(upiUrl);
    copyBtn.textContent = '✅ UPI Link Copied!';
    setTimeout(() => copyBtn.textContent = '🔗 Copy UPI Deep-Link', 2000);
  });
}

window.openDetailModal = function(orderId) {
  const list = getRecords(activeTab);
  const row = list.find(r => r.orderId === orderId);
  if (!row) return;

  const modal = document.getElementById('orderDetailModal');
  const titleEl = document.getElementById('detailModalTitle');
  const bodyEl = document.getElementById('detailModalBody');
  const actionsEl = document.getElementById('detailModalActions');

  if (titleEl) titleEl.textContent = `🆔 ${row.orderId} — Order Details`;

  let itemsTableHtml = '';
  if (row.items && Array.isArray(row.items)) {
    itemsTableHtml = `
      <table style="width:100%; border-collapse:collapse; margin-top:12px; font-size:0.88rem;">
        <thead>
          <tr style="background:#FFF8EE; border-bottom:1.5px solid var(--saffron-border);">
            <th style="padding:8px; text-align:left;">Item Name</th>
            <th style="padding:8px; text-align:center;">Qty</th>
            <th style="padding:8px; text-align:right;">Price</th>
            <th style="padding:8px; text-align:right;">Total</th>
          </tr>
        </thead>
        <tbody>
          ${row.items.map(i => `
            <tr style="border-bottom:1px solid #E2E8F0;">
              <td style="padding:8px; font-weight:600;">${escapeHtml(i.name)}</td>
              <td style="padding:8px; text-align:center;">${i.qty}</td>
              <td style="padding:8px; text-align:right;">₹${i.price}</td>
              <td style="padding:8px; text-align:right; font-weight:700;">₹${i.qty * i.price}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  }

  if (bodyEl) {
    bodyEl.innerHTML = `
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:14px; font-size:0.9rem;">
        <div>
          <div style="font-size:0.78rem; color:#64748B; font-weight:700; text-transform:uppercase;">Customer Info</div>
          <div style="font-size:1.1rem; font-weight:800; color:var(--text-dark); margin-top:2px;">${escapeHtml(row.name)}</div>
          <div style="margin-top:4px;"><a href="tel:${row.phone}" style="color:var(--saffron-gold); font-weight:700;">📞 ${row.phone}</a></div>
          <div style="margin-top:4px; color:#64748B; font-size:0.82rem;">Placed: ${new Date(row.timestamp || Date.now()).toLocaleString()}</div>
        </div>

        <div>
          <div style="font-size:0.78rem; color:#64748B; font-weight:700; text-transform:uppercase;">Delivery / Service Info</div>
          <div style="font-weight:700; color:var(--text-dark); margin-top:2px;">${escapeHtml(row.address || 'Counter Pickup')}</div>
          ${row.gpsUrl ? `<div style="margin-top:4px;"><a href="${row.gpsUrl}" target="_blank" style="color:#3B82F6; font-size:0.82rem; font-weight:700;">📍 Open Customer GPS Map Pin 🔗</a></div>` : ''}
        </div>
      </div>

      ${itemsTableHtml}

      <div style="display:flex; justify-content:space-between; align-items:center; margin-top:14px; padding:12px; background:#FFF8EE; border:1px solid var(--saffron-border); border-radius:10px;">
        <span style="font-weight:700; color:var(--text-dark);">Total Order Bill:</span>
        <span style="font-family:var(--font-heading); font-size:1.5rem; font-weight:800; color:var(--saffron-gold);">₹${row.totalAmount}</span>
      </div>

      <div style="margin-top:16px;">
        <label style="font-size:0.82rem; font-weight:700; color:var(--text-dark); display:block; margin-bottom:6px;">📝 Internal Owner Notes / Special Instructions:</label>
        <textarea id="modalOwnerNotesInput" style="width:100%; height:70px; padding:10px; border:1.5px solid #CBD5E1; border-radius:8px; font-size:0.85rem; outline:none;" placeholder="Jot down internal operational notes (e.g. customer requested extra spicy, deliver by 8 PM)...">${escapeHtml(row.internalNotes || '')}</textarea>
        <button onclick="saveOwnerNotes('${row.orderId}')" style="margin-top:6px; background:var(--text-dark); color:#FFF; border:none; padding:6px 14px; border-radius:6px; font-size:0.8rem; font-weight:700; cursor:pointer;">💾 Save Notes</button>
      </div>
    `;
  }

  if (actionsEl) {
    actionsEl.innerHTML = `
      <button onclick="confirmOrder('${row.orderId}')" class="btn btn--gold" style="padding:8px 14px; font-size:0.85rem;">✅ Confirm &amp; WhatsApp</button>
      <button onclick="cancelOrder('${row.orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:8px 14px; border-radius:8px; font-size:0.85rem; font-weight:700; cursor:pointer;">❌ Cancel Order</button>
      <button onclick="openQrModal(${row.totalAmount})" style="background:#3B82F6; color:#FFF; border:none; padding:8px 14px; border-radius:8px; font-size:0.85rem; font-weight:700; cursor:pointer;">📱 UPI Payment QR</button>
      <button onclick="printKitchenTicket('${row.orderId}')" style="background:#64748B; color:#FFF; border:none; padding:8px 14px; border-radius:8px; font-size:0.85rem; font-weight:700; cursor:pointer;">🖨️ Print Kitchen Ticket</button>
    `;
  }

  if (modal) modal.classList.add('open');
};

// Save Internal Owner Notes
window.saveOwnerNotes = function(orderId) {
  const notesVal = document.getElementById('modalOwnerNotesInput')?.value.trim() || '';
  const list = getRecords(activeTab);
  const idx = list.findIndex(r => r.orderId === orderId);
  if (idx !== -1) {
    list[idx].internalNotes = notesVal;
    saveRecords(activeTab, list);
    alert('✅ Internal notes saved successfully!');
    renderDashboard();
  }
};

// Confirm Order Handler with WhatsApp Trigger
window.confirmOrder = function(orderId) {
  const list = getRecords(activeTab);
  const idx = list.findIndex(r => r.orderId === orderId);
  if (idx !== -1) {
    list[idx].status = 'Confirmed';
    saveRecords(activeTab, list);
    renderDashboard();

    const row = list[idx];
    const phone = (row.phone || '').replace(/[^0-9]/g, '');

    let msg = `Namaste! 🙏 Order received & confirmed ✅\n\n`;
    msg += `Order ID: ${row.orderId}\n`;
    msg += `Total: ₹${row.totalAmount}\n`;
    msg += `Prep Time: ~20-25 minutes\n\n`;
    msg += `Pay on delivery/pickup via Cash or UPI. Looking forward to serving you! 🍽️`;

    window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  }
};

// Cancel Order Handler with Optional WhatsApp Cancellation Trigger
window.cancelOrder = function(orderId) {
  const list = getRecords(activeTab);
  const idx = list.findIndex(r => r.orderId === orderId);
  if (idx !== -1) {
    list[idx].status = 'Cancelled';
    saveRecords(activeTab, list);
    renderDashboard();

    const row = list[idx];
    const phone = (row.phone || '').replace(/[^0-9]/g, '');

    if (confirm('Order status updated to Cancelled. Would you like to notify the customer on WhatsApp?')) {
      let msg = `Namaste 🙏 Regarding your order (${row.orderId}) at TGS ChefChoice:\n\n`;
      msg += `Regrettably, we are unable to fulfill your request at this time. Please contact us directly at 9701325292 for assistance. Thank you!`;
      window.open(`https://wa.me/91${phone}?text=${encodeURIComponent(msg)}`, '_blank');
    }
  }
};

// Printable Thermal Kitchen Ticket
window.printKitchenTicket = function(orderId) {
  const list = getRecords(activeTab);
  const row = list.find(r => r.orderId === orderId);
  if (!row) return;

  let existing = document.getElementById('printableTicket');
  if (existing) existing.remove();

  const ticket = document.createElement('div');
  ticket.id = 'printableTicket';

  let itemsListHtml = '';
  if (row.items && Array.isArray(row.items)) {
    itemsListHtml = row.items.map(i => `<div>• ${i.qty} x ${i.name} (Rs.${i.qty * i.price})</div>`).join('');
  }

  ticket.innerHTML = `
    <div style="text-align:center; border-bottom:1px dashed #000; padding-bottom:8px; margin-bottom:8px;">
      <h3 style="margin:0; font-size:16px;">TGS CHEFCHOICE</h3>
      <div>Kasibugga, AP | 9701325292</div>
      <div style="font-weight:bold; font-size:14px; margin-top:4px;">KITCHEN ORDER TICKET</div>
    </div>
    <div><strong>Order ID:</strong> ${row.orderId}</div>
    <div><strong>Date:</strong> ${new Date(row.timestamp || Date.now()).toLocaleString()}</div>
    <div><strong>Customer:</strong> ${escapeHtml(row.name)} (${row.phone})</div>
    <div><strong>Address:</strong> ${escapeHtml(row.address)}</div>
    <div style="border-top:1px dashed #000; margin:8px 0; padding-top:6px;">
      <strong>ITEMS:</strong>
      ${itemsListHtml}
    </div>
    <div style="border-top:1px dashed #000; padding-top:6px; font-weight:bold; font-size:14px;">
      TOTAL BILL: Rs. ${row.totalAmount}
    </div>
    ${row.internalNotes ? `<div style="margin-top:6px; font-size:11px;">* Note: ${escapeHtml(row.internalNotes)}</div>` : ''}
  `;

  document.body.appendChild(ticket);
  window.print();
};

// Export Orders to CSV
function exportToCsv() {
  const records = getRecords(activeTab);
  if (!records.length) {
    alert('No records available to export.');
    return;
  }

  let csvContent = 'data:text/csv;charset=utf-8,';
  csvContent += 'Order ID,Date/Time,Customer Name,Phone,Order Type / Details,Address,Total Amount (INR),Status,Internal Notes\n';

  records.forEach(r => {
    const itemsStr = r.items ? r.items.map(i => `${i.qty}x ${i.name}`).join(' | ') : (r.occasion || 'Booking');
    const row = [
      `"${r.orderId || ''}"`,
      `"${new Date(r.timestamp || Date.now()).toLocaleString()}"`,
      `"${(r.name || '').replace(/"/g, '""')}"`,
      `"${r.phone || ''}"`,
      `"${itemsStr.replace(/"/g, '""')}"`,
      `"${(r.address || '').replace(/"/g, '""')}"`,
      r.totalAmount || 0,
      `"${r.status || 'Pending'}"`,
      `"${(r.internalNotes || '').replace(/"/g, '""')}"`
    ];
    csvContent += row.join(',') + '\n';
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `TGS_ChefChoice_${activeTab.toUpperCase()}_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Dynamic UPI QR Modal Launcher
window.openQrModal = function(amount) {
  const modal = document.getElementById('qrModal');
  const qrImg = document.getElementById('qrImage');
  const amtEl = document.getElementById('qrAmount');

  const upiUrl = `upi://pay?pa=tgschefchoice@okicici&pn=TGS%20ChefChoice&am=${amount}&cu=INR`;
  const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(upiUrl)}`;

  if (qrImg) qrImg.src = qrApiUrl;
  if (amtEl) amtEl.textContent = `₹${amount}`;

  if (modal) modal.classList.add('open');
};

// Helper Utility
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
