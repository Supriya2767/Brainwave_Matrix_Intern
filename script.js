const planner = document.getElementById('planner');
const datePicker = document.getElementById('datePicker');
const exportBtn = document.getElementById('exportBtn');

const workHours = [
  "09 AM", "10 AM", "11 AM", "12 PM", "01 PM", "02 PM",
  "03 PM", "04 PM", "05 PM"
];

const getHourInt = (label) => {
  let [hour, period] = label.split(' ');
  hour = parseInt(hour);
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;
  return hour;
};

const getSelectedDate = () => {
  return datePicker.value || new Date().toISOString().slice(0, 10);
};

const buildPlanner = () => {
  planner.innerHTML = '';
  const selectedDate = getSelectedDate();
  const currentHour = new Date().getHours();

  workHours.forEach((label, index) => {
    const hourInt = getHourInt(label);
    const storageKey = `${selectedDate}-task-${index}`;
    const savedTask = localStorage.getItem(storageKey) || "";

    const timeBlock = document.createElement('div');
    timeBlock.className = 'time-block';

    const hourDiv = document.createElement('div');
    hourDiv.className = 'hour';
    hourDiv.textContent = label;

    const taskInput = document.createElement('input');
    taskInput.className = 'task';
    taskInput.value = savedTask;
    taskInput.id = storageKey;

    if (hourInt < currentHour) {
      taskInput.classList.add('past');
    } else if (hourInt === currentHour) {
      taskInput.classList.add('present');
    } else {
      taskInput.classList.add('future');
    }

    const saveBtn = document.createElement('button');
    saveBtn.className = 'save-btn';
    saveBtn.textContent = 'save';
    saveBtn.onclick = () => {
      localStorage.setItem(storageKey, taskInput.value);
      alert('Task saved!');
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.textContent = 'Delete';
    deleteBtn.onclick = () => {
      taskInput.value = "";
      localStorage.removeItem(storageKey);
    };

    timeBlock.appendChild(hourDiv);
    timeBlock.appendChild(taskInput);
    timeBlock.appendChild(saveBtn);
    timeBlock.appendChild(deleteBtn);
    planner.appendChild(timeBlock);
  });
};

datePicker.addEventListener('change', buildPlanner);
exportBtn.addEventListener('click', () => {
  const selectedDate = getSelectedDate();
  const tasks = {};
  workHours.forEach((_, index) => {
    const key = `${selectedDate}-task-${index}`;
    const value = localStorage.getItem(key);
    if (value) {
      tasks[`Hour ${workHours[index]}`] = value;
    }
  });

  const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Tasks-${selectedDate}.json`;
  a.click();
  URL.revokeObjectURL(url);
});

window.onload = () => {
  datePicker.value = new Date().toISOString().slice(0, 10);
  buildPlanner();
};
