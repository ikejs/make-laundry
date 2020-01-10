let DEBUG = true

function render_inuse(current_user){
    let inuse_template = `
        <h4>In Use</h4>
        <hr>
        <p>Reserved by: ${current_user}</p>
    `;

    return inuse_template
}

function render_finished(current_user){
    let finished_template = `
        <h4>Finished</h4>
        <hr>
        <form method="POST">
            <input type="hidden" name="_id" value="${id}"/>
            <button class="btn btn-primary btn-info" type="submit"><i class="far fa-user fa-sm"></i>MARK VACANT</button>
        </div>
    `;
    
    return finished_template
}

function render_vacant(id){
    let vacant_template = `
        <h4>Vacant</h4>
        <hr>
        <form method="POST">
            <input type="hidden" name="_id" value="${id}"/>
            <div class="form-group">
                <label for="cycleduration">Cycle Duration</label>
                <input class="form-control col-md-4" type="number" name="cycleduration" id="number" autofocus="autofocus" autocomplete="email" required="required" min="30" max="120"/>
            </div>
            <div class="form-group">
                <button class="btn btn-primary btn-info" type="submit"><i class="far fa-user fa-sm"></i>RESERVE</button>
            </div>
        </form>
    `;

    return vacant_template;
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
        console.log(`${timer_seconds} - (${time} - ${start_time}) = ${minutes_left}`)
    }

    if(minutes_left <= 0){
        value = 'FINISHED (' + Math.round(minutes_left * -1)+ 'min ago)';
        target.addClass('machine-finished');
    } else {
        value = Math.round(minutes_left) + 'min left';
        target.addClass('machine-inuse');
    }
    target.text(value);
}

$(document).ready(function(){
    id = $('.machine').attr('id');

    $.get('/api/machine/' + id, function(data){
        update_status(id, data['status']);
        
        target = $('#' + id)
        container = $('#body-container');
        if(target.hasClass('machine-inuse')){
            current_user = data['status']['currentUser']['name']
            container.html(render_inuse(current_user));
        }else if(target.hasClass('machine-finished')) {
            current_user = data['status']['currentUser']['name']
            container.html(render_finished(current_user));
        }else if(target.hasClass('machine-vacant')){
            container.html(render_vacant(id));
        }
    });

    last_status = null
    var poll = setInterval(function(){
        $.get('/api/machine/' + id, function(data){
            update_status(id, data['status']);
        });
    }, 1000)
});