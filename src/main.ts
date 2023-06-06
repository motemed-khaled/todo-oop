
let naemInputAlert = document.getElementById("taskNameAlert") as HTMLDivElement;
let tableBody = document.querySelector(".todo .todo-table .table-body") as HTMLTableElement ;
let mainAlert = document.querySelector(".todo .input .alert.priority") as HTMLDivElement;
let dateAlert = document.querySelector(".todo .input .alert.date") as HTMLInputElement;
let updateAlert = document.querySelector(".container .todo .update-overlay .update .alert") as HTMLDivElement;
let addButton = document.querySelector(".todo .input .add") as HTMLButtonElement;
let nameInput = document.querySelector(".todo .input .task-name") as HTMLInputElement ;
let priorityInput = document.querySelector(".todo .input .taskPriority") as HTMLInputElement;
let dateInput = document.querySelector(".todo .input .taskTimer") as HTMLInputElement;
let updateName = document.querySelector(".container .todo .update-overlay .update .box input[name ='name']") as HTMLInputElement;
let updatepriority = document.querySelector(".container .todo .update-overlay .update .box input[name ='prio']") as HTMLInputElement;
let updateOwner = document.querySelector(".container .todo .update-overlay .update .box input[name ='owner']") as HTMLInputElement;
let overLay = document.querySelector(".container .todo .update-overlay") as HTMLDivElement;
let updateButton = document.querySelector(".container .todo .update-overlay .update .button .submit") as HTMLButtonElement;
let closeButton = document.querySelector(".container .todo .update-overlay .update .button .close") as HTMLButtonElement;
let select = document.querySelector(".todo .filter .form-select") as HTMLInputElement;
let deleteAllButon = document.querySelector(".todo .filter .delete-all") as HTMLButtonElement;
let allCheckBox = document.querySelectorAll(".deletecheck");





class Task{
   
    constructor(private taskName: string, private priority: string,private deadLine: string , private status:boolean =true) {
        this.setTaskName(taskName) 
        this.setPriority(priority);
        this.setDeadLine(deadLine);
        this.setStatus(status);
    }

    // get and set taskName
     getTaskName(): string {
        return this.taskName;
    }
    setTaskName(value: string):void {
        this.taskName = value;
    }

    // get and set priority
     getPriority(): string {
        return this.priority;
    }
     setPriority(value: string):void {
        this.priority = value;
    }

    // get and set deadLine
    getDeadLine(): string {
        return this.deadLine;
    }
    setDeadLine(value: string):void {
        this.deadLine = value;
    }

    // get and set deadLine
    getStatus(): boolean {
        return this.status;
    }
    setStatus(value: boolean):void {
        this.status = value;
    }

    //valid name input
    static validInputName(value:string ,alert:HTMLDivElement) {
        if (value == "") {
            alert.classList.remove("d-none");
            return true;
        } else {
            alert.classList.add("d-none");
            return false;
        }
    }

    // valid priority input 
    static validInputPriority(value:string , alert:HTMLDivElement) {
        let patternRegex = /^[1-3]$/;
        if (!patternRegex.test(value)) {
            alert.classList.remove("d-none");
            return true;
        } else {
            alert.classList.add("d-none");
            return false;
        }
    }

    // valid date input 
    static validInputDate(value: string, alert: HTMLDivElement) {
        let date = new Date(value).getTime();
        let now = new Date().getTime();
        if (date < now || value === "") {
            alert.classList.remove("d-none");
            return true;
        } else {
            alert.classList.add("d-none");
            return false;
        }
    }

}

class TaskOperation{

    static addTask = (task: Task) => {
        let id:number = 0;
        if (Task.validInputName(task.getTaskName() , naemInputAlert)) {
            return;
        }else if (Task.validInputPriority(task.getPriority() , mainAlert)) {
            return;
        }else if (Task.validInputDate(task.getDeadLine() , dateAlert)) {
            return;
        }
        if (!window.localStorage.getItem("tasks")) {
            window.localStorage.setItem("tasks", "[]");
        } 
            let oldTasks = JSON.parse(window.localStorage.getItem("tasks") || '[]');
        let newTask  = {
            name: task.getTaskName(),
            priority: task.getPriority(),
            deadLine: task.getDeadLine(),
            owner: "motemed khaled",
            stat: task.getStatus(),
            id:oldTasks.length+1
        };
        oldTasks.push(newTask);
        this.sortTasks(oldTasks);
        localStorage.setItem("tasks", JSON.stringify(oldTasks));
        nameInput.value = "";
        priorityInput.value = "";
        dateInput.value = "";
        
    }

    static renderTable = (tasks:{
        name: string;
        priority: string;
        deadLine: string;
        owner: string;
        stat: string;
        id: number;
    }[]) => {
        tableBody.innerHTML = "";
        tasks.forEach(task => {
            tableBody.innerHTML += `<tr>
            <td>${task.id}</td>
            <td>${task.name}</td>
            <td><img src="image/1.jpg" class="img-fluid rounded-circle"><span>${task.owner}</span></td>
            <td class="timerDown"></td>
            <td>${task.priority}</td>
            <td>${task.stat ? task.stat ="pending" : task.stat ="Done"}</td>
            <td><input type="checkbox" name="check" class="deletecheck"></td>
            <td><button class="btn edit btn-primary" fdprocessedid="z4wbk9">Edit</button><button class="btn delete ms-3 btn-danger" fdprocessedid="3pmr1v">Delete</button></td></tr>`
        });
        let allDateTd = document.querySelectorAll(".timerDown");
        for (let i = 0; i < tasks.length; i++) {
            this.timer(tasks[i].deadLine, allDateTd[i]);
        }
    }

    static updateTaskId =  (allTasks:{
        name: string;
        priority: string;
        deadLine: string;
        owner: string;
        stat: string;
        id: number;
    }[])=> {
        let id = 1;
        allTasks.forEach(task => {
            task.id = id;
            id++;
        });
        tableBody.innerHTML = "";
        localStorage.setItem("tasks", JSON.stringify(allTasks));
         this.renderTable(allTasks)
    }

    static sortTasks = (tasks:{
        name: string;
        priority: string;
        deadLine: string;
        owner: string;
        stat: string;
        id: number;
    }[]) => {
        let sortTasks = tasks.sort((a, b) => +a.priority - +b.priority);
        this.updateTaskId(sortTasks);
    }

    static timer =  (endDate:string ,tr: Element)=> {
        let countDownDate = new Date(endDate);
        let time:string;
        let clear = setInterval(function () {
            let now = new Date().getTime();
            let deadLine = +countDownDate - now;
    
            let days = Math.floor(deadLine / (1000 * 60 * 60 * 24));
            let hours = Math.floor((deadLine % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            let minutes = Math.floor((deadLine % (1000 * 60 * 60)) / (1000 * 60));
            let seconds = Math.floor((deadLine % (1000 * 60)) / 1000);
    
            time = `${days}d ${  hours}h  ${  minutes}m  ${  seconds}s`;
            tr.innerHTML = time;
            if (deadLine < 0) {
                tr.innerHTML = "Expired";
                tr.classList.add("text-white");
                clearInterval(clear);
            }
            // return time;
        }, 1000);
    }

    static gettaskId = (e: Event) => {
        let row =  (e.target as HTMLElement);
        if (row.classList.contains("edit")) {
            let taskId = row.parentNode?.parentElement?.firstElementChild?.innerHTML;
            this.updateTask(taskId);
        }else if (row.classList.contains("delete")) {
            let taskId = row.parentNode?.parentElement?.firstElementChild?.innerHTML;
            this.deleteTask(taskId);
        } else if (row.classList.contains("delete-all")) {
            console.log(true)
            this.deleteCheck();
        }
    }
    
    static deleteTask = (taskId) => {
        let checkSure:boolean = confirm("You Are Sure To Delete This Task !");
        if (checkSure) {
            let allTasks = JSON.parse(window.localStorage.getItem("tasks") || '[]');
            allTasks = allTasks.filter((task) => task.id != taskId);
            this.updateTaskId(allTasks);
        }
    }

    static updateTask = (taskId) => {
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
            this.renderTable(allTasks)
        })
                
        // close action update popup
        closeButton.addEventListener("click", () => {
            overLay.style.display = "none";
        })
    

    }

    static deleteCheck = () => {
        let allCheckBox = document.querySelectorAll('input[type="checkbox"]:checked');
        let allTasks= JSON.parse(window.localStorage.getItem("tasks") || '[]');
        let newTasks:any[] = [];
        let allId:any[]= [];
        allCheckBox.forEach(check => {
            let taskId = Number(check.parentNode?.parentElement?.firstElementChild?.innerHTML);
            console.log(typeof taskId)
            
            allId.push(taskId);
            console.log( allId)
        })
        for (let i = 0; i < allTasks.length; i++) {
            if (allTasks[i].id == allId[i]) {
                
                console.log(true)
            } else {
                newTasks.push(allTasks[i])
            }
        }
        console.log(newTasks)
    }


}
// show all tasks from local storage
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
TaskOperation.sortTasks(tasks);

// add task
addButton.addEventListener("click", () => {
    const task = new Task(nameInput.value, priorityInput.value, dateInput.value, true);
    console.log(TaskOperation.addTask(task));
});

// update task

document.addEventListener("click", e => {
    TaskOperation.gettaskId(e);
})





