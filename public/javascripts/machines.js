function build_machine(machine){
    name = machine['name']
    id = machine['_id']
    var machine_tempate = `
        <a class="mx-auto btn btn-block btn-info" href="/machine/${id}">${name}</a>
    `;
    
    return machine_template
}

function build_group(group){
    name = group['name']
    id = groups['_id']
    var group_tempate = `
        <div id='${id}' class=''>
        </div>
    `;

    return group_template
}

function build_set(set){
    name = set['name'];
    id = set['id']
    var set_template = `
        <div class='col-md-6 mx-auto'>
        <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
            <li class="breadcrumb-item active" aria-current="page">${name}</li>
        </ol>
        </nav>
            <div id="${name}" class="info-box">
                <div id="${id}" class='mx-auto p-4'>
                </div>
            </div>
            
        </div>
    `;

    return set_template;
}

$(document).ready(function(){

    $.get('/api/sets/5e17dcea72d7dfb65f94a008', async function(data){

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
                    machine = machines[z]
                    $('#' + group['_id']).append(build_machine(machine))
                }
            }
        }
    });
});