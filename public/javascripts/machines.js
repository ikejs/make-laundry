let DEBUG = true;

function build_machine(machine){
    name = machine['name'];
    id = machine['_id'];
    var machine_template = `
        <a class="machine-wrapper" href="/${id}">
            <h10 class="breadcrumb-item active font-weight-light">${name}</h10>
            <div class="machine" id="${id}"></div>
        </a>
    `;
    
    return machine_template;
}

function build_group(group){
    name = group['name'];
    id = group['_id'];
    var group_template = `
        <div class="machine-container">
            <div id="${id}">
            </div>
        </div>
    `;

    return group_template;
}

function build_set(set){
    name = set['name'];
    id = set['_id'];
    var set_template = `
        <div class='col-md-8 mx-auto'>
            <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item active" aria-current="page">${name}</li>
            </ol>
            </nav>
            <div id="${name}" class="info-box">
                <div id="${id}" class='mx-auto p-2'>
                </div>
            </div>
        </div>
    `;

    return set_template;
}

function update_status(target, status){
    target = $('#' + target);
    var value = 'no status';
    target.removeClass('machine-vacant machine-finished machine-inuse');

    if(status['currentUser'] == null){
        value = 'VACANT';
        target.text(value);
        target.addClass('machine-vacant');
        return;
    }

    var time = Date.now();
    var timer_seconds = parseInt(status['timerSeconds']) * 1000;
    var start_time = Date.parse(status['timerStarted']);
    var minutes_left = (timer_seconds - (time - start_time)) / 60000;

    if(DEBUG){
        console.log(`${timer_seconds} - (${time} - ${start_time})`)
    }

    if(minutes_left <= 0){
        value = 'FINISHED';
        target.addClass('machine-finished');
    } else {
        value = Math.ceil(minutes_left) + 'min left';
        target.addClass('machine-inuse');
    }
    target.text(value);
}

function poll_machines(machine_list){
    for(x=0; x < machine_list.length; x++){
        machine_id = machine_list[x];

        $.get('/api/machine/' + machine_id, function(data){
            update_status(data['_id'], data['status']);
        });
    }
}

$(document).ready(async function(){
    let machine_list = new Promise((resolve, reject) => {
        $.get('/api/group/5e17dcea72d7dfb65f94a008', function(data){
            let machine_list = []
            sets = data['sets']
            for(x=0; x < sets.length; x++){
                set = sets[x];
                $('#set-container').append(build_set(set));
    
                groups = set['groups'];
                for(y=0; y < groups.length; y++){
                    group = groups[y];
                    $('#' + set['_id']).append(build_group(group));
    
                    machines = group['machines'];
                    for(z=0; z < machines.length; z++){
                        machine = machines[z];
                        $('#' + group['_id']).append(build_machine(machine));
    
                        machine_list.push(machine['_id']);
                    }
                }
            }
            resolve(machine_list);
        });
    });

    machine_list.then(function(list){
        var poll = setInterval(function(){
            console.log(list)
            poll_machines(list);
        }, 1000);
    });
});