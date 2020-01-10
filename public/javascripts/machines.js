$(document).ready(function(){
    var set_template = `
    <div class='col-md-6 mx-auto'>
    <nav aria-label="breadcrumb">
    <ol class="breadcrumb">
        <li class="breadcrumb-item active" aria-current="page">${set_name}</li>
    </ol>
    </nav>
        <div class="info-box">
            <div class='mx-auto p-4'>
            </div>
        </div>
    </div>
    `;

    $.get('/api/sets', async function(data){
        
    });
});