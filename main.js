"use strict";


let addTaskInput = document.querySelector(`[name="add-task-input"]`);
let addTaskButton = document.querySelector("#add-task-button");
let tasksContainer = document.querySelector("#tasks-container");
let nextAvailableTaskId = 1;



function addANewTaskToLocalStorage (taskDiv) {

    let taskId = taskDiv.id;
    let taskValue = taskDiv.children[1].value;

    let myTaskObject = {isChecked: false, value: taskValue};
    let myTaskObjectJSON = JSON.stringify(myTaskObject);
    
    window.localStorage.setItem(taskId, myTaskObjectJSON);
    window.localStorage.setItem("nextAvailableTaskId", nextAvailableTaskId);
}



function removeTaskFromLocalStorage (taskDiv) {

    let taskId = taskDiv.id;
    window.localStorage.removeItem(taskId);
}



function updateTaskIsCheckedValueInLocalStorage (taskDiv, isChecked) {

    let taskId = taskDiv.id;
    let taskObjectJSON = window.localStorage.getItem(taskId);
    let taskObject = JSON.parse(taskObjectJSON);

    taskObject.isChecked = isChecked;

    let updatedTaskObjectJSON = JSON.stringify(taskObject);
    
    window.localStorage.setItem(taskId, updatedTaskObjectJSON);
}



function checkAndUnCheckCheckbox (checkBoxDiv) {

    let isChecked = null;

    if (checkBoxDiv.firstElementChild.src.indexOf("not") !== -1) {
    
        checkBoxDiv.firstElementChild.src = checkBoxDiv.firstElementChild.src.replace("not-checked", "checked");
        checkBoxDiv.firstElementChild.alt = "checked-box";
        checkBoxDiv.nextElementSibling.style.textDecoration = "1.4px line-through #9adc32";
        isChecked = true;
        // checkBoxDiv.nextElementSibling.value = ` ${checkBoxDiv.nextElementSibling.value} `;
        
    } else {
        
        checkBoxDiv.firstElementChild.src = checkBoxDiv.firstElementChild.src.replace("checked", "not-checked");
        checkBoxDiv.firstElementChild.alt = "not-checked-box";
        checkBoxDiv.nextElementSibling.style.textDecoration = "none";
        isChecked = false;
        // checkBoxDiv.nextElementSibling.value = checkBoxDiv.nextElementSibling.value.trim();
    }

    let taskDiv = checkBoxDiv.parentElement;

    updateTaskIsCheckedValueInLocalStorage(taskDiv, isChecked);
}



function deleteTask (deleteButton) {

    deleteButton.parentElement.remove();

    let taskDiv = deleteButton.parentElement;

    removeTaskFromLocalStorage(taskDiv);
}



function updateTaskValueInLocalStorage (taskDiv, newValue) {

    let taskId = taskDiv.id;

    let taskObjectJSON = window.localStorage.getItem(taskId);
    let taskObject = JSON.parse(taskObjectJSON);

    taskObject.value = newValue;

    let updatedTaskObjectJSON = JSON.stringify(taskObject);

    window.localStorage.setItem(taskId, updatedTaskObjectJSON);
}



function createATaskDivAndAddItToTheTasksContainer (isItNew, taskName, taskDivId, isTaskChecked) {

    let eachTask = document.createElement("div");
    eachTask.className = "each-task";
    
    let customCheckBoxDiv = document.createElement("div");
    customCheckBoxDiv.className = "custom-checkbox";
    
    let checkBoxImage = document.createElement("img");
    
    let taskNameInput = document.createElement("input");
    taskNameInput.type = "text";
    taskNameInput.name = "task-name";
    taskNameInput.value = taskName;
    
    let deleteButton = document.createElement("button");
    deleteButton.textContent = "X";
    
    
    if (isItNew) {
        
        eachTask.id = `task-${nextAvailableTaskId}`;
        
        checkBoxImage.src = "./pics/not-checked.png";
        checkBoxImage.alt = "not-checked-box";
        
        nextAvailableTaskId++;

    } else {
        
        eachTask.id = taskDivId;
        
        
        if (isTaskChecked) {
            
            checkBoxImage.src = "./pics/checked.png";
            checkBoxImage.alt = "checked-box";
            taskNameInput.style.textDecoration = "1.4px line-through #9adc32";
            
        } else {
            
            checkBoxImage.src = "./pics/not-checked.png";
            checkBoxImage.alt = "not-checked-box";
            taskNameInput.style.textDecoration = "none";
        }
    }

    
    customCheckBoxDiv.appendChild(checkBoxImage);
    eachTask.appendChild(customCheckBoxDiv);
    eachTask.appendChild(taskNameInput);
    eachTask.appendChild(deleteButton);
    tasksContainer.appendChild(eachTask);


    if (isItNew) {

        addANewTaskToLocalStorage(eachTask);    
    }


    customCheckBoxDiv.addEventListener("click", function ()  {

        checkAndUnCheckCheckbox (this);
    });


    deleteButton.addEventListener("click", function () {

        deleteTask(this);

        if (window.localStorage.length === 1) {

            window.localStorage.clear();
        }
    });

    
    taskNameInput.addEventListener("blur", function () {

        let newTaskInputValue = this.value.trim();
        let taskDiv = this.parentElement;

        updateTaskValueInLocalStorage(taskDiv, newTaskInputValue);
    });
}



addTaskButton.addEventListener("click", _ => {

    let taskName = addTaskInput.value.trim();
    addTaskInput.value = "";

    if (taskName.length > 0) {

        let isItNew = true;
        let taskDivId = null;
        let isTaskChecked = null;

        createATaskDivAndAddItToTheTasksContainer(isItNew, taskName, taskDivId, isTaskChecked);
    }
});



function displayTasksOnLocalStorage () {

    let localStorageLength = window.localStorage.length;

    for (let i = 0; i < localStorageLength; i++) {

        if (window.localStorage.key(i) === "nextAvailableTaskId") {

            continue;
        }


        let taskObjectJSON = window.localStorage.getItem(window.localStorage.key(i));
        let taskObject = JSON.parse(taskObjectJSON);


        let isItNew = false;
        let taskName = taskObject.value;
        let taskDivId = window.localStorage.key(i);
        let isTaskChecked = taskObject.isChecked;


        createATaskDivAndAddItToTheTasksContainer(isItNew, taskName, taskDivId, isTaskChecked);
    }
}



if (window.localStorage.getItem("nextAvailableTaskId") !== null) {

    nextAvailableTaskId = window.localStorage.getItem("nextAvailableTaskId");
    
    displayTasksOnLocalStorage();
}