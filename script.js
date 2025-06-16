const form = document.getElementById('resultForm');
const table = document.getElementById('resultTable');
const resetBtn = document.getElementById('resetBtn');

const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYED_SCRIPT_ID/exec'; // Replace with your Apps Script URL

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());
  const method = data.rowId ? 'PUT' : 'POST';

  const payload = { ...data };
  delete payload.rowId;

  const res = await fetch(API_URL, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...payload, rowId: data.rowId }),
  });

  const result = await res.json();
  alert(result.message);
  form.reset();
  loadData();
});

resetBtn.addEventListener('click', () => {
  form.reset();
  document.getElementById('rowId').value = '';
});

async function loadData() {
  const res = await fetch(API_URL);
  const data = await res.json();

  table.innerHTML = '';
  data.forEach((row, index) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="border p-2">${row.studentId}</td>
      <td class="border p-2">${row.bangla}</td>
      <td class="border p-2">${row.english}</td>
      <td class="border p-2">${row.math}</td>
      <td class="border p-2">${row.social}</td>
      <td class="border p-2">${row.arabic}</td>
      <td class="border p-2">${row.history}</td>
      <td class="border p-2">${row.quran}</td>
      <td class="border p-2">${row.hadith}</td>
      <td class="border p-2">${row.fiqh}</td>
      <td class="border p-2">${row.mantiq}</td>
      <td class="border p-2 flex flex-col gap-2">
        <button onclick='editRow(${JSON.stringify({ ...row, rowId: row.rowId })})' class="bg-blue-500 text-white px-2 py-1 rounded">Edit</button>
        <button onclick='deleteRow("${row.rowId}")' class="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
      </td>
    `;
    table.appendChild(tr);
  });
}

function editRow(data) {
  for (const key in data) {
    if (document.getElementById(key)) {
      document.getElementById(key).value = data[key];
    }
  }
}

async function deleteRow(rowId) {
  if (!confirm("Are you sure you want to delete this entry?")) return;
  const res = await fetch(API_URL, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rowId }),
  });
  const result = await res.json();
  alert(result.message);
  loadData();
}

// Initial load
loadData();
