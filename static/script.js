document.addEventListener('DOMContentLoaded', () => {
    const liveClock = document.getElementById('liveClock');
    const statusMsg = document.getElementById('statusMsg');
    const taskList = document.getElementById('taskList');
    const addBtn = document.getElementById('addBtn');
    
    let tasks = [];

    // Load Data
    fetch('/get_tasks')
        .then(response => response.json())
        .then(data => {
            tasks = data;
            tasks.forEach(task => renderTask(task));
        })
        .catch(err => console.error("Error loading tasks:", err));

    // Clock
    setInterval(() => {
        const now = new Date();
        liveClock.textContent = now.toLocaleTimeString('en-GB');
        
        const currentTimeStr = now.toTimeString().slice(0, 5); 
        const currentSeconds = now.getSeconds();

        if (currentSeconds === 0) checkAlarms(currentTimeStr);
        updateTaskVisuals(currentTimeStr);
    }, 1000);

    function checkAlarms(timeStr) {
        tasks.forEach(task => {
            if (task.start === timeStr) {
                playAlarm();
                statusMsg.textContent = `Start: ${task.name}`;
            }
            if (task.end === timeStr) {
                playAlarm();
                statusMsg.textContent = `End: ${task.name}`;
            }
        });
    }

    function updateTaskVisuals(timeStr) {
        const taskElements = document.querySelectorAll('.task-item');
        taskElements.forEach(el => {
            const start = el.dataset.start;
            const end = el.dataset.end;
            
            if (timeStr >= start && timeStr < end) {
                el.classList.add('active-now');
                el.querySelector('.task-status').textContent = "Running";
            } else {
                el.classList.remove('active-now');
                el.querySelector('.task-status').textContent = "";
            }
        });
    }

    // Add Task
    addBtn.addEventListener('click', () => {
        const nameVal = document.getElementById('taskName').value;
        const startVal = document.getElementById('startTime').value;
        const endVal = document.getElementById('endTime').value;
        const colorVal = document.getElementById('taskColor').value;

        if (!nameVal || !startVal || !endVal) {
            statusMsg.textContent = "Please fill in Name, Start, and End.";
            return;
        }

        const newTask = {
            name: nameVal,
            start: startVal,
            end: endVal,
            color: colorVal
        };

        fetch('/add_task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newTask)
        })
        .then(response => {
            if (!response.ok) throw new Error("Database Error");
            return response.json();
        })
        .then(data => {
            newTask.id = data.id;
            tasks.push(newTask);
            renderTask(newTask);
            initAudio(); // Prepare sound
            
            document.getElementById('taskName').value = ''; // Clear input
            statusMsg.textContent = `Saved: ${nameVal}`;
        })
        .catch(err => {
            statusMsg.textContent = "Error saving. Did you delete schedule.db?";
            console.error(err);
        });
    });

    function renderTask(task) {
        const div = document.createElement('div');
        div.classList.add('task-item');
        div.dataset.id = task.id;
        div.dataset.start = task.start;
        div.dataset.end = task.end;
        div.style.borderLeftColor = task.color;

        div.innerHTML = `
            <div class="task-info">
                <strong>${task.name}</strong> <span style="font-weight:normal; font-size:0.9em; color:#666">(${task.start} &rarr; ${task.end})</span>
                <span class="task-status"></span>
            </div>
            <button class="delete-btn" onclick="removeTask(${task.id})">Remove</button>
        `;
        taskList.appendChild(div);
    }

    window.removeTask = function(id) {
        fetch('/delete_task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: id })
        })
        .then(() => {
            tasks = tasks.filter(t => t.id !== id);
            const el = document.querySelector(`.task-item[data-id='${id}']`);
            if (el) el.remove();
        });
    };

    let audioCtx;
    function initAudio() { 
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); 
    }
    
    function playAlarm() {
        const audio = new Audio('/static/alarm.mp3');

        audio.play().catch(error => {
            console.error("Audio play failed:", error);
            alert("ALARM! (Check console for audio errors)");
        });
    }
});