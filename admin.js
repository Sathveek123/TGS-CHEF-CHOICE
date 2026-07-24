/* ============================================================
   TGS CHEFCHOICE — Admin Dashboard Interactive Logic
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  purgeOldDummyData();
  setupTabNavigation();
  setupSearchFilter();
  setupRefreshAndTestBtns();
  setupQrModal();
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

// Search Filtering
function setupSearchFilter() {
  document.getElementById('adminSearchInput')?.addEventListener('input', () => {
    renderDashboard();
  });
}

// Buttons (Refresh & Clear Admin Data)
function setupRefreshAndTestBtns() {
  document.getElementById('refreshAdminBtn')?.addEventListener('click', () => {
    renderDashboard();
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

  const filtered = records.filter(r => {
    if (!searchQuery) return true;
    return (
      (r.orderId && r.orderId.toLowerCase().includes(searchQuery)) ||
      (r.name && r.name.toLowerCase().includes(searchQuery)) ||
      (r.phone && r.phone.toLowerCase().includes(searchQuery))
    );
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

  // Render Chart
  renderChart(filtered);

  // Render Table
  renderTable(filtered);
}

// Chart Rendering (Chart.js)
function renderChart(data) {
  const ctx = document.getElementById('adminChart')?.getContext('2d');
  if (!ctx) return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  // Generate 7 days labels
  const days = [];
  const counts = [0, 0, 0, 0, 0, 0, 0];
  const revenues = [0, 0, 0, 0, 0, 0, 0];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }));
  }

  data.forEach(r => {
    const rDate = new Date(r.timestamp || Date.now());
    const dayDiff = Math.floor((Date.now() - rDate.getTime()) / (1000 * 60 * 60 * 24));
    if (dayDiff >= 0 && dayDiff < 7) {
      const idx = 6 - dayDiff;
      counts[idx]++;
      if (r.status === 'Confirmed') {
        revenues[idx] += (r.totalAmount || 0);
      }
    }
  });

  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: days,
      datasets: [
        {
          label: 'Order Volume',
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

// Table Rendering
function renderTable(list) {
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
      bodyEl.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:#64748B;">No food orders found.</td></tr>`;
      return;
    }

    list.forEach((row, idx) => {
      const tr = document.createElement('tr');
      
      const itemsCount = row.items ? row.items.reduce((s, i) => s + i.qty, 0) : 0;
      let itemsHtml = `<div>${itemsCount} Items <button class="items-popover-btn" onclick="toggleItemsBox('${row.orderId}')">View Items ▾</button></div>`;
      
      let detailsList = '<div class="items-detail-box" id="box-' + row.orderId + '">';
      if (row.items && row.items.length) {
        row.items.forEach(i => {
          detailsList += `<div>• ${i.qty} × ${i.name} (₹${i.qty * i.price})</div>`;
        });
      }
      detailsList += '</div>';

      const statusBadge = getStatusBadgeHtml(row.status);

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--text-dark);">${row.orderId}</td>
        <td style="font-weight:600;">${escapeHtml(row.name)}</td>
        <td><a href="tel:${row.phone}" style="color:var(--saffron-gold); font-weight:700;">${row.phone}</a></td>
        <td>${itemsHtml}${detailsList}</td>
        <td style="max-width:220px; font-size:0.85rem; color:#475569;">${escapeHtml(row.address)}</td>
        <td style="font-weight:800; color:var(--saffron-gold);">₹${row.totalAmount}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:6px; flex-wrap:wrap;">
            <button class="btn-confirm" onclick="confirmOrder('${row.orderId}')" style="background:#10B981; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">✅ Confirm</button>
            <button onclick="openQrModal(${row.totalAmount})" style="background:#3B82F6; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">📱 UPI QR</button>
            <button onclick="cancelOrder('${row.orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">❌ Cancel</button>
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
      bodyEl.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#64748B;">No table bookings found.</td></tr>`;
      return;
    }

    list.forEach(row => {
      const tr = document.createElement('tr');
      const statusBadge = getStatusBadgeHtml(row.status);

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--text-dark);">${row.orderId}</td>
        <td style="font-weight:600;">${escapeHtml(row.name)}</td>
        <td><a href="tel:${row.phone}" style="color:var(--saffron-gold); font-weight:700;">${row.phone}</a></td>
        <td><span style="background:#FFF8EE; border:1px solid var(--saffron-border); padding:3px 8px; border-radius:12px; font-weight:700;">${escapeHtml(row.guests || '2 Guests')}</span></td>
        <td>${row.date} @ ${row.time || '19:30'}</td>
        <td style="font-size:0.85rem; color:#475569;">${escapeHtml(row.occasion || 'General Dining')} ${row.notes ? '(' + escapeHtml(row.notes) + ')' : ''}</td>
        <td style="font-weight:800; color:var(--saffron-gold);">₹${row.totalAmount || 1000}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button onclick="confirmOrder('${row.orderId}')" style="background:#10B981; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">✅ Confirm</button>
            <button onclick="cancelOrder('${row.orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">❌ Cancel</button>
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
      bodyEl.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:#64748B;">No event bookings found.</td></tr>`;
      return;
    }

    list.forEach(row => {
      const tr = document.createElement('tr');
      const statusBadge = getStatusBadgeHtml(row.status);

      tr.innerHTML = `
        <td style="font-weight:700; color:var(--text-dark);">${row.orderId}</td>
        <td style="font-weight:600;">${escapeHtml(row.name)}</td>
        <td><a href="tel:${row.phone}" style="color:var(--saffron-gold); font-weight:700;">${row.phone}</a></td>
        <td>${row.date}</td>
        <td style="font-weight:700; color:var(--saffron-gold);">${escapeHtml(row.occasion)}</td>
        <td style="font-size:0.85rem; color:#475569;">${escapeHtml(row.notes || 'No extra notes')}</td>
        <td style="font-weight:800; color:var(--saffron-gold);">₹${row.totalAmount || 5000}</td>
        <td>${statusBadge}</td>
        <td>
          <div style="display:flex; gap:6px;">
            <button onclick="confirmOrder('${row.orderId}')" style="background:#10B981; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">✅ Confirm</button>
            <button onclick="openQrModal(500)" style="background:#3B82F6; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">💰 Deposit QR</button>
            <button onclick="cancelOrder('${row.orderId}')" style="background:#EF4444; color:#FFF; border:none; padding:6px 10px; border-radius:6px; font-size:0.78rem; font-weight:700; cursor:pointer;">❌ Cancel</button>
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

// Expandable Items Popover
window.toggleItemsBox = function(id) {
  const box = document.getElementById('box-' + id);
  if (box) {
    box.classList.toggle('show');
  }
};

// Confirm Order Action Handler
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

    const encoded = encodeURIComponent(msg);
    window.open(`https://wa.me/91${phone}?text=${encoded}`, '_blank');
  }
};

// Cancel Order Action Handler
window.cancelOrder = function(orderId) {
  const list = getRecords(activeTab);
  const idx = list.findIndex(r => r.orderId === orderId);
  if (idx !== -1) {
    list[idx].status = 'Cancelled';
    saveRecords(activeTab, list);
    renderDashboard();
  }
};

// Dynamic UPI QR Modal Handler
function setupQrModal() {
  const modal = document.getElementById('qrModal');
  const closeBtn = document.getElementById('closeQrModal');
  const copyBtn = document.getElementById('copyUpiLinkBtn');

  closeBtn?.addEventListener('click', () => {
    modal?.classList.remove('open');
  });

  copyBtn?.addEventListener('click', () => {
    const amountText = document.getElementById('qrAmount')?.textContent.replace(/[^0-9]/g, '') || '0';
    const upiUrl = `upi://pay?pa=tgschefchoice@okicici&pn=TGS%20ChefChoice&am=${amountText}&cu=INR`;
    navigator.clipboard.writeText(upiUrl);
    copyBtn.textContent = '✅ UPI Link Copied!';
    setTimeout(() => copyBtn.textContent = '🔗 Copy UPI Deep-Link', 2000);
  });
}

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
