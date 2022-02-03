





const jiraType = {
    None: 'None',
    Bug: 'Bug',
    Epic: 'Epic',
    Task: 'Task',
    Subtask: 'Subtask'
}


class task{
    constructor(){
	this.id = null;
	this.jira_enabled = false;
	this.jira_type = jiraType.None;
	this.jira_name = null;
	this.description = "New Task";
	this.completed = false;
	this.subtasks = [];
	this.parent_task = null;
    }
}

class task_tracker{
    constructor(){
	this.jira_type = jiraType.None;
	this.num_tasks = 0;
	this.active_tasks = [];
	this.indent = 30;
	this.autosaveload = false;
	this.subtasks = [];
	this.jira_switch = true;
    }
}



function saveStatus(override){

    // We need to override if we are toggling because we want
    // to save that bit specificlly
    if (task_tracker_obj.autosaveload || override){
	localStorage.setItem('taskTracker', JSON.stringify(task_tracker_obj));
    }
}

function toggleJiraSwitch(){
    if (task_tracker_obj.jira_switch){
	task_tracker_obj.jira_switch = false;
	var jira_buttons = document.getElementsByClassName("jira-btn");
	var i;
	for (i = 0; i < jira_buttons.length; i++) {
	    var jbtn = jira_buttons[i];
	    jbtn.classList.add('hide');
	}

	var jira_tags = document.getElementsByClassName("jira_tag");
	var i;
	for (i = 0; i < jira_tags.length; i++) {
	    var jtag = jira_tags[i];
	    jtag.classList.add('hide');
	}
	
    } else {
	task_tracker_obj.jira_switch = true;
	var jira_buttons = document.getElementsByClassName("jira-btn");
	var i;
	for (i = 0; i < jira_buttons.length; i++) {
	    var jbtn = jira_buttons[i];
	    jbtn.classList.remove('hide');
	}

	var jira_tags = document.getElementsByClassName("jira_tag");
	var i;
	for (i = 0; i < jira_tags.length; i++) {
	    var jtag = jira_tags[i];
	    jtag.classList.remove('hide');
	}
    }
    setJiraSwitchDescription();
    saveStatus();
}

function toggleAutoSaveLoad(){
    if (task_tracker_obj.autosaveload){
	task_tracker_obj.autosaveload = false;
    } else {
	task_tracker_obj.autosaveload = true;
    }

    setASLDescription();
    saveStatus(true);
}

function setJiraSwitchDescription(){
    js_obj = document.getElementById("jira_switch_btn");
    if (task_tracker_obj.jira_switch){
	js_obj.innerHTML = "Disable";
    } else {
	js_obj.innerHTML = "Enable";
    }
}

function setASLDescription(){
    asl_obj = document.getElementById("autosaveload_btn");
    if (task_tracker_obj.autosaveload){
	asl_obj.innerHTML = "Disable";
    } else {
	asl_obj.innerHTML = "Enable";
    }
}

function blankSaveStatus(){
    task_tracker_obj = new task_tracker();
    localStorage.setItem('taskTracker', JSON.stringify(task_tracker_obj));
}

function loadStatus(){
    
    task_tracker_obj = JSON.parse(localStorage.getItem('taskTracker'));

    if (!task_tracker_obj){
	task_tracker_obj = new task_tracker();
    } else {

	// Check if we want to load in the previous stuff
	if (task_tracker_obj.autosaveload){
	    importTasksFromObject(task_tracker_obj, 'task_holder');
	} else {
	    task_tracker_obj = new task_tracker();
	}
    }
}

function indentChange(){
    indent_obj = document.getElementById("indent_input_id");
    indent_value = indent_obj.value;
    task_tracker_obj.indent=indent_value;
    refreshDomTasks();
}

function refreshDomTasks(){
    clearAllDomTasks();
    importTasksFromObject(task_tracker_obj, 'task_holder');
}

function importTasksFromObject(task_obj, subtask_id){
    var i;


    if (task_obj.subtasks.length == 0){
	return;
    }
    
    for (i=0;i<task_obj.subtasks.length;++i){
	var sub_task_obj = task_obj.subtasks[i];
	var new_subtask_id = newExistingTask(sub_task_obj, subtask_id, task_obj);

	// Get all of the sub tasks imported
	importTasksFromObject(sub_task_obj, new_subtask_id);
	
    }
}

function clearAllDomTasks(){
    task_tracker_div = document.getElementById('task_holder')
    removeAllChildNodes(task_tracker_div);
}

function removeAllChildNodes(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

/* When the user clicks on the button,
   toggle between hiding and showing the dropdown content */
function dropDownTaskOptions(button) {

    var dropdowns = document.getElementsByClassName("dropdown-content");
    var i;
    for (i = 0; i < dropdowns.length; i++) {
	var openDropdown = dropdowns[i];
	if (openDropdown.classList.contains('show')) {
	    openDropdown.classList.remove('show');
	}
    }
    
    var dropdown_id = button.getAttribute('dropdown_id');
    document.getElementById(dropdown_id).classList.toggle("show");
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    // When the user unclicks on a dropdown
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

    

    // When the user clicks on the settings button

    if (!event.target.matches('.open-button') &&
	!event.target.matches('.form-container') &&
	!event.target.matches('.form-container .indent') &&
	!event.target.matches('.form-popup') &&
	!event.target.matches('.form-container *') &&
	event.target) {
	if (formOpen){
	    closeForm();
	}
    }

    // When the user clicks anywhere outside of the modal, close it
    if (event.target == modal) {
	modal.style.display = "none";
    }

}

var num_tasks = 0;

function newExistingTask(task_obj, parent_subtask_div_id, parent_obj) {

    // Add one to the total number of tasks on the screen
    num_tasks += 1;

    // This is the object that the task is being placed into
    parent_div = document.getElementById(parent_subtask_div_id);
    
    completed = task_obj.completed;
    jira_enabled = task_obj.jira_enabled;
    jira_type = task_obj.jira_type;
    jira_name = task_obj.jira_name;
    description = task_obj.description;
    new_task = false;
    indent = task_tracker_obj.indent;

    return createDomTask(task_obj,
			 num_tasks,
			 completed,
			 jira_enabled,
			 jira_type,
			 jira_name,
			 description,
			 parent_div,
			 new_task,
			 indent,
			 parent_obj);
    
}

function newTaskFromButton(parent_subtask_div_id){
    newTask(parent_subtask_div_id, task_tracker_obj);
}

function newTask(parent_subtask_div_id, parent_obj) {
    
    num_tasks += 1;

    task_tracker_obj.num_tasks += 1;
    task_id = task_tracker_obj.num_tasks;

    // May be a little over board but just in case it gets used
    // a lot and the int number for js counts over the max
    while(task_tracker_obj.active_tasks.indexOf(task_id) != -1){
	task_tracker_obj.num_tasks += 1;
	task_id = task_tracker_obj.num_tasks;
    }
    
    parent_div = document.getElementById(parent_subtask_div_id);

    new_task_obj = new task();

    new_task_obj.id = task_id;
    task_tracker_obj.active_tasks.push(task_id);

    if (parent_obj){
	parent_obj.subtasks.push(new_task_obj);
    } else {
	task_tracker_obj.subtasks.push(new_task_obj);
    }

    description = "New Task";

    new_task_obj.description=description;

    checked = false;
    jira_enabled = false;
    jira_type = jiraType.None;
    jira_tag_str = "";
    new_task = true;
    indent = task_tracker_obj.indent;
    
    
    createDomTask(new_task_obj,
		  num_tasks,
		  checked,
		  jira_enabled,
		  jira_type,
		  jira_tag_str,
		  description,
		  parent_div,
		  new_task,
		  indent,
		  parent_obj)

   
}

function textAreaAdjust(element) {
  element.style.height = "1px";
  element.style.height = (25+element.scrollHeight)+"px";
}

function autoResize() {
    this.style.height = 'auto';
    this.style.height = this.scrollHeight + 'px';
}


function editTask(task_div_id, task_obj) {

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
	task_obj.description=new_task;
	parent_div.innerHTML = new_task;
	saveStatus();
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

function removeSubTasks(task_obj){
    var subtask_num_id;

    // remove all of its subtasks first
    for (subtask_num_id=0; subtask_num_id<task_obj.subtasks.length; ++subtask_num_id){
	removeSubTasks(task_obj.subtasks[subtask_num_id])
    }

    task_id = task_obj.id;

    index = task_tracker_obj.active_tasks.indexOf(task_id);
    task_tracker_obj.active_tasks.splice(index, 1);

    return;
    
}

function removeElement(element_id, subtask_element_id, task_obj, parent_obj){
    
    var element_to_remove = document.getElementById(element_id);

    var subtask_element_to_remove = document.getElementById(subtask_element_id);

    if (subtask_element_to_remove.hasChildNodes() || task_obj.subtasks.length > 0){

	if (confirm('Are you sure you want to delete this task and all of its subtasks')) {
	    element_to_remove.remove();
	    // Remove all of the child subtasks
	    removeSubTasks(task_obj);
	    if (parent_obj){
		var index_to_remove = parent_obj.subtasks.indexOf(task_obj);
		parent_obj.subtasks.splice(index_to_remove, 1);
		saveStatus();
	    }
	} else {
	    return;
	}
    } else {
	element_to_remove.remove();
	// Remove all of the child subtasks
	removeSubTasks(task_obj);
	if (parent_obj){
	    var index_to_remove = parent_obj.subtasks.indexOf(task_obj);
	    parent_obj.subtasks.splice(index_to_remove, 1);
	    saveStatus();
	}
    }
}

function insertAfter(newNode, existingNode) {
    existingNode.parentNode.insertBefore(newNode, existingNode.nextSibling);
}

function toggleChecked(checkbox_obj, task_obj, task_description){
    if (checkbox_obj.checked){
	task_obj.completed=true;
	task_description.classList.add('stroked');
    } else {
	task_obj.completed=false;
	task_description.classList.remove('stroked');
    }
    saveStatus();
}

function toggleJiraEnabled(task_obj,
			   task_div) {
    if (task_obj.jira_enabled){
	setJiraDisabled(task_obj,
			task_div)
	return false;
    } else {
	setJiraEnabled(task_obj,
		       task_div)
	return true;
    }
}

function setJiraEnabled(task_obj,
			task_div){
    
    var jira_type = task_obj.jira_type;
    if (jira_type==jiraType.Epic){
	task_div.classList.add('task_div_epic');
    } else if (jira_type==jiraType.Bug){
	task_div.classList.add('task_div_bug');
    } else if (jira_type==jiraType.Task){
	task_div.classList.add('task_div_task');
    } else if (jira_type==jiraType.Subtask){
	task_div.classList.add('task_div_subtask');
    }
    task_obj.jira_enabled=true;
    saveStatus();
}

function setJiraDisabled(task_obj,
			 task_div){
    
    task_div.classList.remove('task_div_task','task_div_epic', 'task_div_bug');
    task_obj.jira_enabled=false;
    saveStatus();
}

function setJiraBug(task_obj, task_div){
    if (task_obj.jira_enabled){
	// Make bug
	task_div.setAttribute('jira-type','bug');
	task_div.classList.remove('task_div_task','task_div_epic');
	task_div.classList.add('task_div_bug');
	task_obj.jira_type=jiraType.Bug;
	saveStatus();
    }
}

function setJiraEpic(task_obj, task_div){
    if (task_obj.jira_enabled){
	// Make Epic
	task_div.classList.remove('task_div_task','task_div_bug');
	task_div.classList.add('task_div_epic');
	task_obj.jira_type=jiraType.Epic;
	saveStatus();
    }
}

function setJiraTask(task_obj, task_div){
    if (task_obj.jira_enabled){
	// Make Task
	task_div.classList.remove('task_div_bug','task_div_epic');
	task_div.classList.add('task_div_task');
	task_obj.jira_type=jiraType.Task;
	saveStatus();
    }
}

function setJiraSubtask(task_obj, task_div){
    if (task_obj.jira_enabled){
	// Make Subtask
	task_div.classList.remove('task_div_bug','task_div_epic');
	task_div.classList.add('task_div_task');
	task_obj.jira_type=jiraType.Subtask;
	saveStatus();
    }
}

function createDomTask(task_obj,
		       task_number,
		       checked,
		       jira_enabled,
		       jira_type,
		       jira_tag_str,
		       task_description_str,
		       parent_div,
		       new_task,
		       indent,
		       parent_obj) {

    // Constant naming ids
    const task_id = "task_"+task_number;
    const task_check_id = task_id+"_checkbox";
    const jira_tag_id = task_id+"_jira_div";
    const task_desc_id = task_id+"_desc";
    const task_options_id = task_id+"_options";
    const dropdown_id = task_id+"_dropdown";
    const subtask_div_id = task_id+"_subtask_div";
    const jira_pop_up_form_div_id = task_id+"_subtask_div";
    

    // New task div
    var task_div = document.createElement("div");
    task_div.id = task_id;
    task_div.setAttribute('jira-type','task');
    task_div.setAttribute('jira-enabled', 'true');
    task_div.classList.add('task_div_task');
    task_div.style.marginLeft = indent+"px";

    

    // Jira div
    var jira_tag = document.createElement("div");
    jira_tag.classList.add('jira_tag');
    if (!task_tracker_obj.jira_switch){
	jira_tag.classList.add('hide');
    }
    jira_tag.innerHTML = jira_tag_str;
    jira_tag.id = jira_tag_id;

    // Task description
    var task_description = document.createElement("div");
    task_description.classList.add('task_desc');
    task_description.innerHTML = task_description_str;
    task_description.id = task_desc_id;
    task_description.addEventListener('dblclick', function (e) {
	editTask(task_desc_id, task_obj);
    });

    // Check box
    var task_check = document.createElement("input");
    task_check.id = task_check_id;
    task_check.classList.add('task_check');
    task_check.type = "checkbox";
    task_check.onclick = function(){
	toggleChecked(task_check, task_obj, task_description)
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
	editTask(task_desc_id, task_obj);
    };
    dropdown_option_edit.setAttribute("task_desc_id",task_desc_id);
    dropdown_option_edit.text = "Edit Task";

    // New Subtask
    var dropdown_option_subtask = document.createElement("a");
    dropdown_option_subtask.onclick = function(){
	newTask(subtask_div_id, task_obj);
    };
    dropdown_option_subtask.text = "New Subtask";

    // Delete Task
    var dropdown_option_delete = document.createElement("a");
    dropdown_option_delete.onclick = function(){
	removeElement(task_id, subtask_div_id, task_obj, parent_obj);
    };
    dropdown_option_delete.text = "Delete Task";


    
    // Jira Popup Form Button
    var jira_popup_form_button = document.createElement("a");
    jira_popup_form_button.onclick = function(){
	if (task_tracker_obj.jira_switch){
	    openModal(task_obj, parent_obj, task_div);
	}
    };
    if (!task_tracker_obj.jira_switch){
	jira_popup_form_button.classList.add('hide');
    }
    jira_popup_form_button.text = "Jira";
    jira_popup_form_button.classList.add('jira-btn');



    // The subtask div
    var subtask_div = document.createElement("div");
    subtask_div.id = subtask_div_id
    subtask_div.classList.add('task_subtask');
    
    // Add all the child elements into the right stack
    
    // Add subtasks to the drop down menu 
    dropdown_div.appendChild(dropdown_option_edit);
    dropdown_div.appendChild(dropdown_option_subtask);
    dropdown_div.appendChild(dropdown_option_delete);
    dropdown_div.appendChild(jira_popup_form_button);

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
    
    if (jira_enabled){
	setJiraEnabled(task_obj,
		       task_div)
	
	if (jira_type == jiraType.Bug){
	    setJiraBug(task_obj, task_div);
	} else if (jira_type = jiraType.Epic){
	    setJiraEpic(task_obj, task_div);
	} else if (jira_type = jiraType.Task){
	    setJiraTask(task_obj, task_div);
	} else if (jira_type = jiraType.Subtask){
	    setJiraSubtask(task_obj, task_div);
	}
	
    } else {
	setJiraDisabled(task_obj,
			task_div)
    }

    

    
    if (new_task){
	saveStatus();
	editTask(task_desc_id, task_obj);
    }

    return subtask_div_id;
    
    
}


formOpen = false;

function toggleForm() {
    form_obj = document.getElementById("myForm");
    if (formOpen) {
	formOpen = false;
	form_obj.style.display = "none";
    } else {
	formOpen = true;
	form_obj.style.display = "block";
    }
}

function closeForm() {
    form_obj = document.getElementById("myForm");
    formOpen = false;
    form_obj.style.display = "none";
}

//blankSaveStatus();
loadStatus();

setASLDescription();
setJiraSwitchDescription();



// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

function setModalButtonClass(jira_enabled, jira_name, task_type){

    console.log(jira_enabled);

    // Get the button objects
    enable_btn = document.getElementById("jira-modal-toggle");
    epic_btn = document.getElementById("jira-modal-epic");
    task_btn = document.getElementById("jira-modal-task");
    bug_btn = document.getElementById("jira-modal-bug");
    subtask_btn = document.getElementById("jira-modal-subtask");

    // If we are disabled, make the option buttons darker

    if (jira_name){
	enable_btn.classList.add('modal-content-disabled');
    } else {
	enable_btn.classList.remove('modal-content-disabled');
    }
    
    if (!jira_enabled){
	
	epic_btn.classList.add('modal-content-disabled')
	task_btn.classList.add('modal-content-disabled')
	bug_btn.classList.add('modal-content-disabled')
	subtask_btn.classList.add('modal-content-disabled')

	epic_btn.classList.remove('modal-content-selected')
	task_btn.classList.remove('modal-content-selected')
	bug_btn.classList.remove('modal-content-selected')
	subtask_btn.classList.remove('modal-content-selected')
	
    } else {
	
	epic_btn.classList.remove('modal-content-disabled')
	task_btn.classList.remove('modal-content-disabled')
	bug_btn.classList.remove('modal-content-disabled')
	subtask_btn.classList.remove('modal-content-disabled')

	epic_btn.classList.remove('modal-content-selected')
	task_btn.classList.remove('modal-content-selected')
	bug_btn.classList.remove('modal-content-selected')
	subtask_btn.classList.remove('modal-content-selected')
	
	if (task_type == jiraType.Epic){
	    epic_btn.classList.add('modal-content-selected')
	} else if (task_type == jiraType.Task){
	    task_btn.classList.add('modal-content-selected')
	} else if (task_type == jiraType.Bug){
	    bug_btn.classList.add('modal-content-selected')
	} else if (task_type == jiraType.Subtask){
	    subtask_btn.classList.add('modal-content-selected')
	}
    }
    
}

function openModal(task_obj, parent_task_obj, task_div){
    
    var task_jira_type = parent_task_obj.jira_type;
    var parent_jira_type = parent_task_obj.jira_type;

    var task_jira_name = task_obj.jira_name

    if (!task_jira_name){
	task_jira_name = "No Jira Tag";
    }

    document.getElementById("jira-modal-tag").innerHTML=task_jira_name;

    document.getElementById("jira-modal-toggle").onclick = function(){
	if (task_obj.jira_name){
	    alert("Can not disable jira once it is submitted to the DB");
	} else {
	    toggleJiraEnabled(task_obj, task_div);
	    console.log(task_obj.jira_enabled, task_obj.jira_name, task_obj.jira_type);
	    setModalButtonClass(task_obj.jira_enabled, task_obj.jira_name, task_obj.jira_type);
	}
    };
    
    document.getElementById("jira-modal-epic").onclick = function(){
	var jira_name = task_obj.jira_name
	if (task_obj.jira_enabled){
	    // An epic can only come from a None parent
	    if (parent_task_obj.jira_type == jiraType.None){
		console.log(task_obj.jira_enabled, task_obj.jira_name, task_obj.jira_type);
		console.log(task_obj);
		setJiraEpic(task_obj, task_div);
		console.log(task_obj);
		console.log(task_obj.jira_enabled, task_obj.jira_name, task_obj.jira_type);
		setModalButtonClass(true, jira_name, jiraType.Epic);
	    } else {
		alert("Epic parent must be None");
	    }
	}
    };

    document.getElementById("jira-modal-task").onclick = function(){
	
	var jira_name = task_obj.jira_name
	if (task_obj.jira_enabled){
	    // An task can only come from a None or Epic parent
	    if (parent_task_obj.jira_type == jiraType.None ||
		parent_task_obj.jira_type == jiraType.Epic){
		setJiraTask(task_obj, task_div);
		setModalButtonClass(true, jira_name, jiraType.Task);
	    } else {
		alert("Task parent must be None or Epic");
	    }
	}
    };

    document.getElementById("jira-modal-bug").onclick = function(){
	var jira_name = task_obj.jira_name
	if (task_obj.jira_enabled){
	    // A bug can only come from a None or Epic parent
	    if (parent_task_obj.jira_type == jiraType.None ||
		parent_task_obj.jira_type == jiraType.Epic){
		setJiraBug(task_obj, task_div);
		setModalButtonClass(true, jira_name, jiraType.Bug);
	    } else {
		alert("Bug parent must be None or Epic");
	    }
	}
    };

    document.getElementById("jira-modal-subtask").onclick = function(){
	var jira_name = task_obj.jira_name
	if (task_obj.jira_enabled){
	    // An epic can only come from a None parent
	    if (parent_task_obj.jira_type == jiraType.Epic ||
		parent_task_obj.jira_type == jiraType.Task ||
		parent_task_obj.jira_type == jiraType.Bug){
		setJiraSubtask(task_obj, task_div);
		setModalButtonClass(true, jira_name, jiraType.Subtask);
	    } else {
		alert("Subtask parent must be Epic, Task, or Bug");
	    }
	}
    };

    setModalButtonClass(task_obj.jira_enabled,
			task_obj.jira_name,
			task_obj.jira_type);
    
    var modal = document.getElementById("myModal");
    modal.style.display = "block";
    
}


// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

