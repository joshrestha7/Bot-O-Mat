$(document).ready(function() {

    //Initialize build
    robotList = [];
    id = 0;
    $('#create_btn').on('click', function () {
        var name = $('#name').val();
        var type = $('#rbt_type option:selected').text();
        var specialty = '';

        if(type == "Unipedal") {specialty = tasks[10].description;}
        else if(type == "Bipedal") {specialty = tasks[11].description;}
        else if(type == "Quadrupedal") {specialty = tasks[12].description;}
        else if(type == "Arachnid") {specialty = tasks[13].description;}
        else if(type == "Radial") {specialty = tasks[14].description;}
        else if(type == "Aeronautical") {specialty = tasks[15].description;}


        if(name.length == 0) {
            $('#msg').html('Please give your robot a name');
        } else {
            $('#msg').html('');
            var robot = new Robot(id, name, type, specialty);
            addRobot(robot);
            robotList.push(robot);		            
		    assignTasks(robot);
		    completeTasks(robot);
            id++;
        }
    });
});

var Robot = function(id, name, type, specialty) {
    this.id=id;
    this.name=name;
    this.type=type;
    this.specialty=specialty;
    this.task_list=[];
    this.task_tally = 0;
    this.timer;
	this.task_time;
	this.temp_task_time;
	this.j;
}



var addRobot = function(Robot) {
	$("#robot-table").append('<tr><td>'+Robot.id+'</td><td>'+Robot.type+'</td><td>'+Robot.name+'</td><td>'+Robot.specialty+'</td></tr>')
}

function updateBoard() {
	var table = $('#board-table');
	var html ='<table id="board-table"><tr><th>ID</th><th>Type</th><th>Name</th><th>Tasks Completed</th></tr>';
	for(i=0; i<robotList.length; i++) {
		html += '<tr><td>'+robotList[i].id+'</td>'+
			'<td>'+robotList[i].type+'</td>'+
			'<td>'+robotList[i].name+'</td>'+
			'<td>'+robotList[i].task_tally+'</td></tr>';
	}
	html += '</table>'
	table.replaceWith(html);
}

function assignTasks(Robot) {
	var min = 0;
	var max = tasks.length - 1;
	var dice;

	for(i = 0; i < 5; i++) {
		dice = Math.floor(Math.random() * (max - min + 1)) + min;
		Robot.task_list.push(tasks[dice]);
	}
}

function completeTasks(Robot) {
	Robot.task_time = Robot.task_list[0].eta;
	Robot.temp_task_time = Robot.task_time;
	Robot.j = 0;

	$("#task-table").append("<tr id='tracker_"+ Robot.id +"'><td>Robot " + 
			Robot.id + " is working on task: " + Robot.task_list[0].description+" Time: "+Robot.task_time+" ms</tr></td>");
	Robot.timer = setInterval(function(){countDown(Robot);}, 500);
}

function countDown(Robot) {
	if(Robot.task_time > 0) {
		Robot.task_time -= 500;
	}
	$('#tracker_' + Robot.id).replaceWith("<tr id='tracker_"+ Robot.id +"'><td>Robot " + Robot.id + " is working on task: " + Robot.task_list[0].description+" Time: "+Robot.task_time+" ms</tr></td>");
	countUp(Robot);
}

function countUp(Robot) {
	if(Robot.j < Robot.temp_task_time) {
		Robot.j += 500;
	} else {
		Robot.task_tally += addTally(Robot, Robot.task_list.shift());
		clearInterval(Robot.timer);
		if (Robot.task_list.length > 0) {
			$('#tracker_' + Robot.id).replaceWith('');
			completeTasks(Robot);
		} else {
			$('#tracker_' + Robot.id).remove();
			robotList.sort(function(a,b) {
				if (a.task_tally == b.task_tally) {
					return 0;
				} else if (a.task_tally < b.task_tally) {
					return 1;
				} else {
					return -1;
				}
			});
			updateBoard();
		}
	}
}

function addTally(Robot, task) {
	if (task.index < 10) {return 1;} 
	else if (task.index == 10 && Robot.type == "Unipedal"){return 1;}
	else if (task.index == 11 && Robot.type == "Bipedal"){return 1;}
	else if (task.index == 12 && Robot.type == "Quadrupedal"){return 1;}
	else if (task.index == 13 && Robot.type == "Arachnid"){return 1;}
	else if (task.index == 14 && Robot.type == "Radial"){return 1;}
	else if (task.index == 15 && Robot.type == "Aeronautical"){return 1;}
	else {return 0;}
}


var tasks = [
  {
  	index: 0,
    description: 'do the dishes',
    eta: 1000,
  },{
  	index: 1,
    description: 'sweep the house',
    eta: 3000,
  },{
  	index: 2,
    description: 'do the laundry',
    eta: 10000,
  },{
  	index: 3,
    description: 'take out the recycling',
    eta: 4000,
  },{
  	index: 4,
    description: 'make a sammich',
    eta: 7000,
  },{
  	index: 5,
    description: 'mow the lawn',
    eta: 20000,
  },{
  	index: 6,
    description: 'rake the leaves',
    eta: 18000,
  },{
  	index: 7,
    description: 'give the dog a bath',
    eta: 14500,
  },{
  	index: 8,
    description: 'bake some cookies',
    eta: 8000,
  },{
  	index: 9,
    description: 'wash the car',
    eta: 20000,
  },{
  	index: 10,
    description: 'take out the trash',
    eta: 10000,
  },{
  	index: 11,
    description: 'feed the dog',
    eta: 7000,
  },{
  	index: 12,
    description: 'water the plants',
    eta: 3000,
  },{
  	index: 13,
    description: 'make the bed',
    eta: 5000,
  },{
  	index: 14,
    description: 'vacuum the carpet',
    eta: 15000,
  },{
  	index: 15,
    description: 'clean out the gutters',
    eta: 20000,
  },
]
