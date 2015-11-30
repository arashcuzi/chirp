var setAlert = function(message, type) {
    var alert = $('#alert');
    alert.text(message);

    var alertClass = type === 'err' ? 'alert-danger' : 'alert-info';
    alert.removeClass();
    alert.addClass(alertClass + ' alert fade in');
    setTimeout(function(){
        alert.removeClass('in').addClass('out');
    }, 6000);
};

var login = function() {
    $.ajax({
        url: '/login',
        method: 'GET',
        username: $('#handle').val(),
        password: $('#password').val()
    }).done(function(data){
        localStorage.setItem('token', data.token);
        localStorage.setItem('userid', data.id);
        localStorage.setItem('follows', data.follow);
        location.assign('/wall');
    }).fail(function(err){
        setAlert(err.statusText, 'err');
    });

    return false;
};

var deleteChirp = function(elem) {
    var data = {
        chirpid: elem.dataset.id
    };

    $.ajax({
        method: 'DELETE',
        url: '/chirps',
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).done(function(){
        loadWall();
    }).fail(function(err){
        setAlert(err.statusText, 'err');
    });

    return false;
};

var follow = function(elem) {
    var data = {
        follow: elem.dataset.id
    };

    $.ajax({
        method: 'PUT',
        url: '/users/follow/' + localStorage.getItem('userid'),
        contentType: 'application/json',
        data: JSON.stringify(data),
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).done(function(data){
        localStorage.setItem('follows', data.follow);
        setAlert('User followed/unfollowed!');
        loadWall();
    }).fail(function(err){
        setAlert(err.statusText + '.', 'err');
    });

    return false;
};

var loadWall = function() {
    $.ajax({
        method: 'GET',
        url: '/chirps',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).done(function(data){
        buildWall(data);
    }).fail(function(err){
        setAlert(err.statusText, 'err');
    });
};

var buildWall = function(data){
    var chirps = [];
    var user = localStorage.getItem('userid');
    var follows = localStorage.getItem('follows').split(',');

    data.forEach(function(val){
        chirps.push({
            chirp: val.chirp,
            handle: val.user.handle,
            userid: val.user._id,
            chirpid: val._id,
            followed: follows.indexOf(val.user._id) !== -1
        });
    });

    var html = '';

    chirps.forEach(function(val){
        var close = '';
        var labelClass = val.followed ? 'label-primary' : 'label-default';
        if (user === val.userid) {
            labelClass = 'label-success';
            close = '<button type="button" class="close pull-right" aria-label="Close" data-id=' + val.chirpid + '><span aria-hidden="true">×</span></button>';
        }
        html += '<a href="#" class="list-group-item">' +
            val.chirp + '<span class="pull-right label ' +
            labelClass + '" data-id="' +
            val.userid + '"">' +
            val.handle + '</span>' +
            close + '</a>';
    });

    // remove old click handler to prevent duplicate handlers
    $('.list-group').off();

    // rebind new click handler
    $('.list-group').on('click', 'button.close', function(e){
        deleteChirp(e.currentTarget);
    });

    // rebind new click handler
    $('.list-group').on('click', 'span.label', function(e){
        follow(e.currentTarget);
    });

    $('#wall').html(html);
};

$('#register').on('click', function(){
    var data = {
        firstName: $('#first-name').val(),
        lastName: $('#last-name').val(),
        handle: $('#handle').val(),
        email: $('#email').val(),
        password: $('#password').val()
    };

    $.ajax({
        url: '/users/register',
        method: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json'
    }).done(function(data){
        login();
    }).fail(function(err){
        console.log(err);
        setAlert(err.statusText, 'err');
    });

    return false;
});

$('#new-chirp').on('click', function(){
    var data = {
        chirp: $('#chirp').val(),
        user: localStorage.getItem('userid')
    };

    $.ajax({
        method: 'POST',
        url: '/chirps',
        data: JSON.stringify(data),
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).done(function(data){
        $('#chirp').val('');
        loadWall();
    }).fail(function(err){
        setAlert(err.statusText, 'err');
    });
});

$('#login').on('click', login);

$(window).on('wall-loaded', loadWall);