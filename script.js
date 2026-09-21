// ===============================
// DAILY PLANNER JAVASCRIPT
// ===============================


// Get elements from HTML
const dateInput = document.getElementById("date");
const todoList = document.getElementById("todo-list");
const addTaskButton = document.getElementById("add-task");
const notes = document.getElementById("notes");


// ===============================
// SET TODAY'S DATE
// ===============================

const today = new Date();

const todayString = today.toISOString().split("T")[0];

dateInput.value = todayString;


// ===============================
// CREATE STORAGE KEY
// ===============================

function getStorageKey() {

    return "dailyPlanner_" + dateInput.value;

}


// ===============================
// SAVE PLANNER
// ===============================

function savePlanner() {

    const schedule = [];

    const scheduleInputs =
        document.querySelectorAll(".time-row input");

    scheduleInputs.forEach(input => {

        schedule.push(input.value);

    });


    // TODO TASKS

    const todos = [];

    document.querySelectorAll(".todo-item").forEach(item => {

        const checkbox =
            item.querySelector('input[type="checkbox"]');

        const text =
            item.querySelector('input[type="text"]');

        todos.push({
            text: text.value,
            completed: checkbox.checked
        });

    });


    // PRIORITIES

    const priorities = [];

    document.querySelectorAll(".priority").forEach(item => {

        const checkbox =
            item.querySelector('input[type="checkbox"]');

        const text =
            item.querySelector('input[type="text"]');

        priorities.push({
            text: text.value,
            completed: checkbox.checked
        });

    });


    // CREATE PLANNER DATA

    const plannerData = {

        schedule: schedule,

        todos: todos,

        priorities: priorities,

        notes: notes.value

    };


    // SAVE TO BROWSER

    localStorage.setItem(
        getStorageKey(),
        JSON.stringify(plannerData)
    );

}


// ===============================
// LOAD PLANNER
// ===============================

function loadPlanner() {

    const savedData =
        localStorage.getItem(getStorageKey());


    // If nothing is saved for this date
    if (!savedData) {

        clearPlanner();

        return;

    }


    const data = JSON.parse(savedData);


    // ===========================
    // LOAD SCHEDULE
    // ===========================

    const scheduleInputs =
        document.querySelectorAll(".time-row input");

    scheduleInputs.forEach((input, index) => {

        input.value = data.schedule[index] || "";

    });


    // ===========================
    // LOAD TODO
    // ===========================

    todoList.innerHTML = "";


    data.todos.forEach(todo => {

        createTodo(
            todo.text,
            todo.completed
        );

    });


    // ===========================
    // LOAD PRIORITIES
    // ===========================

    const priorityItems =
        document.querySelectorAll(".priority");

    priorityItems.forEach((item, index) => {

        const checkbox =
            item.querySelector('input[type="checkbox"]');

        const text =
            item.querySelector('input[type="text"]');


        if (data.priorities[index]) {

            text.value =
                data.priorities[index].text;

            checkbox.checked =
                data.priorities[index].completed;

        }

    });


    // ===========================
    // LOAD NOTES
    // ===========================

    notes.value = data.notes || "";

}


// ===============================
// CLEAR PLANNER
// ===============================

function clearPlanner() {

    // Clear schedule

    document
        .querySelectorAll(".time-row input")
        .forEach(input => {

            input.value = "";

        });


    // Create 6 empty todo tasks

    todoList.innerHTML = "";

    for (let i = 0; i < 6; i++) {

        createTodo("", false);

    }


    // Clear priorities

    document
        .querySelectorAll(".priority")
        .forEach(item => {

            const checkbox =
                item.querySelector('input[type="checkbox"]');

            const text =
                item.querySelector('input[type="text"]');

            checkbox.checked = false;

            text.value = "";

        });


    // Clear notes

    notes.value = "";

}


// ===============================
// CREATE TODO
// ===============================

function createTodo(text = "", completed = false) {

    const todo = document.createElement("div");

    todo.className = "todo-item";


    todo.innerHTML = `

        <input type="checkbox">

        <input
            type="text"
            placeholder="Add a task..."
        >

        <button class="delete">×</button>

    `;


    const checkbox =
        todo.querySelector('input[type="checkbox"]');

    const textInput =
        todo.querySelector('input[type="text"]');


    textInput.value = text;

    checkbox.checked = completed;


    todoList.appendChild(todo);

}


// ===============================
// ADD NEW TASK
// ===============================

addTaskButton.addEventListener("click", function () {

    createTodo();

    savePlanner();

});


// ===============================
// DELETE TASK
// ===============================

todoList.addEventListener("click", function(event) {

    if (
        event.target.classList.contains("delete")
    ) {

        event.target
            .parentElement
            .remove();

        savePlanner();

    }

});


// ===============================
// SAVE WHEN USER TYPES
// ===============================

document.addEventListener("input", function(event) {

    if (
        event.target.matches("input") ||
        event.target.matches("textarea")
    ) {

        savePlanner();

    }

});


// ===============================
// SAVE WHEN CHECKBOX CHANGES
// ===============================

document.addEventListener("change", function(event) {

    if (
        event.target.type === "checkbox"
    ) {

        savePlanner();

    }

});


// ===============================
// CHANGE DATE
// ===============================

dateInput.addEventListener("change", function() {

    loadPlanner();

});


// ===============================
// LOAD TODAY'S DATA
// ===============================

loadPlanner();
// ===============================
// DAILY PROGRESS
// ===============================

function updateProgress() {

    const checkboxes =
        document.querySelectorAll(
            "#todo-list input[type='checkbox']"
        );

    const total = checkboxes.length;

    let completed = 0;

    checkboxes.forEach(checkbox => {

        if (checkbox.checked) {
            completed++;
        }

    });


    let percentage = 0;

    if (total > 0) {
        percentage =
            Math.round((completed / total) * 100);
    }


    document.getElementById("progress-percent")
        .textContent = percentage + "%";


    document.getElementById("progress-fill")
        .style.width = percentage + "%";


    document.getElementById("progress-text")
        .textContent =
        completed + " / " + total +
        " tasks completed";

}


// Update progress whenever checkbox changes

document.addEventListener("change", function(event) {

    if (event.target.type === "checkbox") {

        updateProgress();

    }

});


// Update progress when a new task is added

addTaskButton.addEventListener("click", function() {

    updateProgress();

});


// Update progress after loading a date

updateProgress();
// ===============================
// WEEKLY OVERVIEW
// ===============================

const weekContainer =
    document.getElementById("week-container");

const todayButton =
    document.getElementById("today-button");


function formatDate(date) {

    return date.toISOString().split("T")[0];

}


function getWeekStart(date) {

    const newDate = new Date(date);

    const day = newDate.getDay();

    const difference =
        day === 0 ? -6 : 1 - day;

    newDate.setDate(
        newDate.getDate() + difference
    );

    return newDate;

}


function getDayData(date) {

    const key =
        "dailyPlanner_" + formatDate(date);

    const saved =
        localStorage.getItem(key);

    if (!saved) {

        return {
            completed: 0,
            total: 6
        };

    }


    const data =
        JSON.parse(saved);


    const todos =
        data.todos || [];


    const total =
        todos.length;


    const completed =
        todos.filter(todo =>
            todo.completed
        ).length;


    return {
        completed: completed,
        total: total
    };

}


function createWeeklyOverview() {

    weekContainer.innerHTML = "";


    const selectedDate =
        new Date(dateInput.value + "T00:00:00");


    const monday =
        getWeekStart(selectedDate);


    const dayNames = [
        "MON",
        "TUE",
        "WED",
        "THU",
        "FRI",
        "SAT",
        "SUN"
    ];


    for (let i = 0; i < 7; i++) {

        const currentDate =
            new Date(monday);


        currentDate.setDate(
            monday.getDate() + i
        );


        const dateString =
            formatDate(currentDate);


        const data =
            getDayData(currentDate);


        let percentage = 0;


        if (data.total > 0) {

            percentage =
                Math.round(
                    (data.completed / data.total) * 100
                );

        }


        const card =
            document.createElement("div");


        card.className = "day-card";


        // Highlight today's date

        if (dateString === todayString) {

            card.classList.add("today");

        }


        card.innerHTML = `

            <div class="day-name">
                ${dayNames[i]}
            </div>

            <div class="day-date">
                ${currentDate.getDate()}/${currentDate.getMonth() + 1}
            </div>

            <div class="day-progress">
                ${data.completed}/${data.total}
            </div>

            <div class="day-percent">
                ${percentage}%
            </div>

        `;


        // Click day

        card.addEventListener("click", function() {

            dateInput.value = dateString;

            loadPlanner();

            updateProgress();

            createWeeklyOverview();

            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });

        });


        weekContainer.appendChild(card);

    }

}


// TODAY BUTTON

todayButton.addEventListener("click", function() {

    dateInput.value = todayString;

    loadPlanner();

    updateProgress();

    createWeeklyOverview();

});


// UPDATE WHEN DATE CHANGES

dateInput.addEventListener("change", function() {

    createWeeklyOverview();

});


// INITIAL LOAD

createWeeklyOverview();
// ===============================
// PRODUCTIVITY STREAK
// ===============================

function hasCompletedTask(date) {

    const key =
        "dailyPlanner_" + formatDate(date);

    const saved =
        localStorage.getItem(key);

    if (!saved) {
        return false;
    }

    const data =
        JSON.parse(saved);

    const todos =
        data.todos || [];

    return todos.some(todo => todo.completed);

}


function calculateStreak() {

    let streak = 0;

    const checkDate = new Date();

    checkDate.setHours(0, 0, 0, 0);


    // Check today first

    if (!hasCompletedTask(checkDate)) {

        // If today isn't completed,
        // start checking from yesterday

        checkDate.setDate(
            checkDate.getDate() - 1
        );

    }


    while (hasCompletedTask(checkDate)) {

        streak++;

        checkDate.setDate(
            checkDate.getDate() - 1
        );

    }


    return streak;

}


function updateStreak() {

    const streak =
        calculateStreak();


    const streakCount =
        document.getElementById("streak-count");

    const streakMessage =
        document.getElementById("streak-message");


    streakCount.textContent =
        streak + (streak === 1 ? " DAY" : " DAYS")
        + " STREAK";


    if (streak === 0) {

        streakMessage.textContent =
            "Start your productive streak today!";

    }
    else if (streak === 1) {

        streakMessage.textContent =
            "Great start! Keep going tomorrow! 💪";

    }
    else if (streak < 7) {

        streakMessage.textContent =
            "You're building a great habit! 🔥";

    }
    else {

        streakMessage.textContent =
            "Amazing consistency! Keep it going! 🚀";

    }

}


// Update streak when page loads

updateStreak();
// ===============================
// DARK MODE
// ===============================

const themeButton =
    document.getElementById("theme-toggle");


// Check saved theme

const savedTheme =
    localStorage.getItem("theme");


if (savedTheme === "dark") {

    document.body.classList.add("dark-mode");

    themeButton.textContent =
        "☀️ Light Mode";

}


// Toggle theme

themeButton.addEventListener("click", function() {

    document.body.classList.toggle("dark-mode");


    const isDark =
        document.body.classList.contains("dark-mode");


    if (isDark) {

        themeButton.textContent =
            "☀️ Light Mode";

        localStorage.setItem(
            "theme",
            "dark"
        );

    } else {

        themeButton.textContent =
            "🌙 Dark Mode";

        localStorage.setItem(
            "theme",
            "light"
        );

    }

});