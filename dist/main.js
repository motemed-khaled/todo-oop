"use strict";
var _a;
let naemInputAlert = document.getElementById("taskNameAlert");
let tableBody = document.querySelector(".todo .todo-table .table-body");
let mainAlert = document.querySelector(".todo .input .alert.priority");
let dateAlert = document.querySelector(".todo .input .alert.date");
let updateAlert = document.querySelector(".container .todo .update-overlay .update .alert");
let addButton = document.querySelector(".todo .input .add");
let nameInput = document.querySelector(".todo .input .task-name");
let priorityInput = document.querySelector(".todo .input .taskPriority");
let dateInput = document.querySelector(".todo .input .taskTimer");
let updateName = document.querySelector(".container .todo .update-overlay .update .box input[name ='name']");
let updatepriority = document.querySelector(".container .todo .update-overlay .update .box input[name ='prio']");
let updateOwner = document.querySelector(".container .todo .update-overlay .update .box input[name ='owner']");
let overLay = document.querySelector(".container .todo .update-overlay");
let updateButton = document.querySelector(".container .todo .update-overlay .update .button .submit");
let closeButton = document.querySelector(".container .todo .update-overlay .update .button .close");
let select = document.querySelector(".todo .filter .form-select");
let deleteAllButon = document.querySelector(".todo .filter .delete-all");
let allCheckBox = document.querySelectorAll(".deletecheck");
class Task {
    constructor(taskName, priority, deadLine, status = "Pending") {
        this.taskName = taskName;
        this.priority = priority;
        this.deadLine = deadLine;
        this.status = status;
        this.setTaskName(taskName);
        this.setPriority(priority);
        this.setDeadLine(deadLine);
        this.setStatus(status);
    }
    getTaskName() {
        return this.taskName;
    }
    setTaskName(value) {
        this.taskName = value;
    }
    getPriority() {
        return this.priority;
    }
    setPriority(value) {
        this.priority = value;
    }
    getDeadLine() {
        return this.deadLine;
    }
    setDeadLine(value) {
        this.deadLine = value;
    }
    getStatus() {
        return this.status;
    }
    setStatus(value) {
        this.status = value;
    }
    static validInputName(value, alert) {
        if (value == "") {
            alert.classList.remove("d-none");
            return true;
        }
        else {
            alert.classList.add("d-none");
            return false;
        }
    }
    static validInputPriority(value, alert) {
        let patternRegex = /^[1-3]$/;
        if (!patternRegex.test(value)) {
            alert.classList.remove("d-none");
            return true;
        }
        else {
            alert.classList.add("d-none");
            return false;
        }
    }
    static validInputDate(value, alert) {
        let date = new Date(value).getTime();
        let now = new Date().getTime();
        if (date < now || value === "") {
            alert.classList.remove("d-none");
            return true;
        }
        else {
            alert.classList.add("d-none");
            return false;
        }
    }
}
class TaskOperation {
}
_a = TaskOperation;
TaskOperation.addTask = (task) => {
    let id = 0;
    if (Task.validInputName(task.getTaskName(), naemInputAlert)) {
        return;
    }
    else if (Task.validInputPriority(task.getPriority(), mainAlert)) {
        return;
    }
    else if (Task.validInputDate(task.getDeadLine(), dateAlert)) {
        return;
    }
    if (!window.localStorage.getItem("tasks")) {
        window.localStorage.setItem("tasks", "[]");
    }
    let oldTasks = JSON.parse(window.localStorage.getItem("tasks") || '[]');
    let newTask = {
        name: task.getTaskName(),
        priority: task.getPriority(),
        deadLine: task.getDeadLine(),
        owner: "motemed khaled",
        stat: task.getStatus(),
        id: oldTasks.length + 1
    };
    oldTasks.push(newTask);
    _a.sortTasks(oldTasks);
    localStorage.setItem("tasks", JSON.stringify(oldTasks));
    nameInput.value = "";
    priorityInput.value = "";
    dateInput.value = "";
};
TaskOperation.renderTable = (tasks) => {
    tableBody.innerHTML = "";
    tasks.forEach(task => {
        tableBody.innerHTML += `<tr>
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td><img src="image/1.jpg" class="img-fluid rounded-circle"><span>${task.owner}</span></td>
            <td class="timerDown"></td>
            <td>${task.priority}</td>
            <td>${task.stat}</td>
            <td><input type="checkbox" name="check" class="deletecheck"></td>
            <td><button class="btn edit btn-primary" fdprocessedid="z4wbk9">Edit</button><button class="btn delete ms-3 btn-danger" fdprocessedid="3pmr1v">Delete</button><button class="btn done ms-3 btn-success" fdprocessedid="3pmr1v">Done</button></td></tr>`;
    });
    let allDateTd = document.querySelectorAll(".timerDown");
    for (let i = 0; i < tasks.length; i++) {
        _a.timer(tasks[i].deadLine, allDateTd[i]);
    }
};
TaskOperation.updateTaskId = (allTasks) => {
    let id = 1;
    allTasks.forEach(task => {
        task.id = id;
        id++;
    });
    tableBody.innerHTML = "";
    localStorage.setItem("tasks", JSON.stringify(allTasks));
    _a.renderTable(allTasks);
};
TaskOperation.sortTasks = (tasks) => {
    let sortTasks = tasks.sort((a, b) => +a.priority - +b.priority);
    _a.updateTaskId(sortTasks);
};
TaskOperation.timer = (endDate, tr) => {
    let countDownDate = new Date(endDate);
    let time;
    let clear = setInterval(function () {
        let now = new Date().getTime();
        let deadLine = +countDownDate - now;
        let days = Math.floor(deadLine / (1000 * 60 * 60 * 24));
        let hours = Math.floor((deadLine % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        let minutes = Math.floor((deadLine % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((deadLine % (1000 * 60)) / 1000);
        time = `${days}d ${hours}h  ${minutes}m  ${seconds}s`;
        tr.innerHTML = time;
        if (deadLine < 0) {
            tr.innerHTML = "Expired";
            tr.classList.add("text-white");
            clearInterval(clear);
        }
    }, 1000);
};
TaskOperation.gettaskIdAndTriggerAction = (e) => {
    var _b, _c, _d, _e, _f, _g, _h, _j, _k;
    let row = e.target;
    if (row.classList.contains("edit")) {
        let taskId = (_d = (_c = (_b = row.parentNode) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.firstElementChild) === null || _d === void 0 ? void 0 : _d.innerHTML;
        _a.updateTask(taskId);
    }
    else if (row.classList.contains("delete")) {
        let taskId = (_g = (_f = (_e = row.parentNode) === null || _e === void 0 ? void 0 : _e.parentElement) === null || _f === void 0 ? void 0 : _f.firstElementChild) === null || _g === void 0 ? void 0 : _g.innerHTML;
        _a.deleteTask(taskId);
    }
    else if (row.classList.contains("delete-all")) {
        _a.getAllSelectedBox();
    }
    else if (row.classList.contains("done")) {
        let taskId = (_k = (_j = (_h = row.parentNode) === null || _h === void 0 ? void 0 : _h.parentElement) === null || _j === void 0 ? void 0 : _j.firstElementChild) === null || _k === void 0 ? void 0 : _k.innerHTML;
        _a.changeStatus(taskId, row);
    }
};
TaskOperation.deleteTask = (taskId) => {
    let checkSure = confirm("You Are Sure To Delete This Task !");
    if (checkSure) {
        let allTasks = JSON.parse(window.localStorage.getItem("tasks") || '[]');
        allTasks = allTasks.filter((task) => task.id != taskId);
        _a.updateTaskId(allTasks);
    }
};
TaskOperation.updateTask = (taskId) => {
    overLay.style.display = "flex";
    let allTasks = JSON.parse(window.localStorage.getItem("tasks") || '[]');
    allTasks.forEach(task => {
        if (task.id == taskId) {
            updateName.value = task.name;
            updatepriority.value = task.priority;
            updateOwner.value = task.owner;
        }
    });
    updateButton.addEventListener("click", () => {
        allTasks.forEach(task => {
            if (task.id == taskId) {
                task.name = updateName.value;
                task.priority = updatepriority.value;
                task.owner = updateOwner.value;
            }
        });
        overLay.style.display = "none";
        localStorage.setItem("tasks", JSON.stringify(allTasks));
        _a.renderTable(allTasks);
    });
    closeButton.addEventListener("click", () => {
        overLay.style.display = "none";
    });
};
TaskOperation.getAllSelectedBox = () => {
    let allCheckBox = document.querySelectorAll('input[type="checkbox"]:checked');
    let allTasks = JSON.parse(window.localStorage.getItem("tasks") || '[]');
    let allId = [];
    allCheckBox.forEach(check => {
        var _b, _c, _d;
        let taskId = Number((_d = (_c = (_b = check.parentNode) === null || _b === void 0 ? void 0 : _b.parentElement) === null || _c === void 0 ? void 0 : _c.firstElementChild) === null || _d === void 0 ? void 0 : _d.innerHTML);
        allId.push(taskId);
    });
    _a.deleteMultiRow(allId, allTasks);
};
TaskOperation.deleteMultiRow = (value, allTasks) => {
    let check = confirm("are you sure to delete this items");
    if (check) {
        for (let i = 0; i < value.length; i++) {
            for (let j = 0; j < allTasks.length; j++) {
                if (value[i] == allTasks[j].id) {
                    allTasks.splice(j, 1);
                    break;
                }
            }
        }
        console.log(allTasks);
        _a.updateTaskId(allTasks);
    }
};
TaskOperation.changeStatus = (taskId, row) => {
    let allTasks = JSON.parse(window.localStorage.getItem("tasks") || '[]');
    allTasks.forEach(task => {
        if (task.id == taskId) {
            console.log(true);
            task.stat = "Done";
        }
    });
    _a.updateTaskId(allTasks);
};
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
TaskOperation.sortTasks(tasks);
addButton.addEventListener("click", () => {
    const task = new Task(nameInput.value, priorityInput.value, dateInput.value, "pending");
    console.log(TaskOperation.addTask(task));
});
document.addEventListener("click", e => {
    TaskOperation.gettaskIdAndTriggerAction(e);
});
