

/* When the user clicks on the button,
   toggle between hiding and showing the dropdown content */
function dropDownTaskOptions(button) {
    var dropdown_id = button.getAttribute('dropdown_id');
    document.getElementById(dropdown_id).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn') && event.target) {
	var dropdowns = document.getElementsByClassName("dropdown-content");
	var i;
	for (i = 0; i < dropdowns.length; i++) {
	    var openDropdown = dropdowns[i];
	    if (openDropdown.classList.contains('show')) {
		openDropdown.classList.remove('show');
	    }
	}
    }
}

var num_tasks = 1;

function newExistingTask(parent_div_id, indent) {
    num_tasks += 1;
    
    parent_div = document.getElementById(parent_div_id);

    createTask(num_tasks,
	       true,
	       "HART-1234",
	       "This is a completed task that was loaded",
	       parent_div,
	       indent,
	       false)
}

function newTask(parent_div_id, indent) {
    num_tasks += 1;
    
    parent_div = document.getElementById(parent_div_id);
    
    createTask(num_tasks,
	       false,
	       "",
	       "New Task",
	       parent_div,
	       indent,
	       true)
}

function textAreaAdjust(element) {
  element.style.height = "1px";
  element.style.height = (25+element.scrollHeight)+"px";
}

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}


function editTask(task_div_id) {

    // The description object
    var task_div_obj = document.getElementById(task_div_id);

    // Save the original task
    var existing_task = task_div_obj.innerHTML;

    // Remove the task
    task_div_obj.innerHTML = "";

    // Create the new textarea element
    var textarea = document.createElement("textarea");
        
    textarea.type = "text";
    textarea.value = existing_task;
    textarea.setAttribute("parent_div_id", task_div_id);
    textarea.setAttribute("size", '30');
    textarea.classList.add('task_textarea');
    textarea.addEventListener('input', autoResize, false);

    // On focus select the text
    textarea.onfocus = function() {
	this.select();
    }

    // On blur change back to the html version in the dev
    textarea.onblur = function() {
	var new_task = this.value
	var parent_div_id = this.getAttribute("parent_div_id")
	var parent_div = document.getElementById(parent_div_id);
	this.remove();
	parent_div.innerHTML = "Whatever";
	parent_div.innerHTML = new_task;
    };

    // When the input is being typed in, blur on the enter key
    textarea.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
	    this.blur();
	}
    });

    // Add the textarea button to the stack
    task_div_obj.appendChild(textarea);

    // Focus on this textarea when a task is edited
    textarea.focus();

}

function removeElement(element_id, subtask_element_id){
    
    var element_to_remove = document.getElementById(element_id);

    var subtask_element_to_remove = document.getElementById(subtask_element_id);

    if (subtask_element_to_remove.hasChildNodes()){

	if (confirm('Are you sure you want to delete this task and all of its subtasks')) {
	    element_to_remove.remove();
	} else {
	    return;
	}
    } else {
	element_to_remove.remove();
    }
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function crossedOut(check_box, text) {
    if (document.getElementById(check_box).checked===true) { 
        // if box is checked, cross off text
        document.getElementById(text).className = "checked-off";
    } else {
        // if box is unchecked, make text back to normal (not crossed off)
        document.getElementById(text).className = "normal";
    }
}

function createTask(task_number,
		    checked,
		    jira_tag_str,
		    task_description_str,
		    parent_div,
		    indent,
		    new_task) {

    // Constant naming ids
    const task_id = "task_"+task_number;
    const task_check_id = task_id+"_checkbox";
    const jira_tag_id = task_id+"_jira_div";
    const task_desc_id = task_id+"_desc";
    const task_options_id = task_id+"_options";
    const dropdown_id = task_id+"_dropdown";
    const subtask_div_id = task_id+"_subtask_div";

    // Task list object
    //parent_div = document.getElementById(parent_div_id);

    // New task div
    var task_div = document.createElement("div");
    task_div.id = task_id;
    task_div.classList.add('task_div');
    
    task_div.style.left = (1*30)+"px";

    

    // Jira div
    var jira_tag = document.createElement("div");
    jira_tag.classList.add('jira_tag');
    jira_tag.innerHTML = jira_tag_str;
    jira_tag.id = jira_tag_id;

    // Task description
    var task_description = document.createElement("div");
    task_description.classList.add('task_desc');
    task_description.innerHTML = task_description_str;
    task_description.id = task_desc_id;
    task_description.addEventListener('dblclick', function (e) {
	editTask(task_desc_id);
    });

    // Check box
    var task_check = document.createElement("input");
    task_check.id = task_check_id;
    task_check.classList.add('task_check');
    task_check.type = "checkbox";
    task_check.onclick = function(){
	task_description.classList.toggle('stroked');
    };

    // Dropdown div
    var task_dropdown = document.createElement("div");
    task_dropdown.id = task_options_id;
    task_dropdown.classList.add('dropdown');

    // Dropdown button
    var dropdown_button = document.createElement("button");
    dropdown_button.classList.add('dropbtn');
    dropdown_button.innerHTML = "Dropdown";
    dropdown_button.setAttribute('dropdown_id',dropdown_id);
    dropdown_button.onclick = function(){
	dropDownTaskOptions(this);
    };
    
    // Dropdown menu div
    var dropdown_div = document.createElement("div");
    dropdown_div.classList.add('dropdown-content');
    dropdown_div.id = dropdown_id;
    

    // Dropdown options

    // Edit task
    var dropdown_option_edit = document.createElement("a");
    dropdown_option_edit.onclick = function(){
	editTask(task_desc_id);
    };
    dropdown_option_edit.setAttribute("task_desc_id",task_desc_id);
    dropdown_option_edit.text = "Edit Task";

    // New Subtask
    var dropdown_option_subtask = document.createElement("a");
    dropdown_option_subtask.onclick = function(){
	newTask(subtask_div_id, indent+1);
    };
    dropdown_option_subtask.text = "New Subtask";

    // Delete Task
    var dropdown_option_delete = document.createElement("a");
    dropdown_option_delete.onclick = function(){
	removeElement(task_id, subtask_div_id);
    };
    dropdown_option_delete.text = "Delete Task";
    

    // The subtask div
    var subtask_div = document.createElement("div");
    subtask_div.id = subtask_div_id
    subtask_div.classList.add('task_subtask');
    
    // Add all the child elements into the right stack
    
    // Add subtasks to the drop down menu 
    dropdown_div.appendChild(dropdown_option_edit);
    dropdown_div.appendChild(dropdown_option_subtask);
    dropdown_div.appendChild(dropdown_option_delete);

    // Add the drop down button and menu
    task_dropdown.appendChild(dropdown_button);
    task_dropdown.appendChild(dropdown_div);

    // Add the description and the option button to the task
    task_div.appendChild(task_check);
    task_div.appendChild(jira_tag);
    task_div.appendChild(task_description);
    task_div.appendChild(task_dropdown);
    task_div.appendChild(subtask_div);

    // Add the task to the list of tasks
    parent_div.appendChild(task_div);

    if (checked){
	task_check.checked = true;
	task_description.classList.add('stroked');
    } else {
	task_check.checked = false;
    }

    if (new_task){
	editTask(task_desc_id);
    }
    
}
