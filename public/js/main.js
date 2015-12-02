var setAlert = function(message, type) {
    var alert = $('#alert');

    if (alert[0].classList.contains('in') !== -1) {
        alert.removeClass('in').addClass('out');
        clearTimeout(timeOut);
    }

    alert.text(message);

    var alertClass = type === 'err' ? 'alert-danger' : 'alert-info';
    alert.removeClass();
    alert.addClass(alertClass + ' alert fade in');
    var timeOut = setTimeout(function(){
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
        localStorage.setItem('follows', data.user.follow);
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
        localStorage.setItem('follows', data.user.follow);

        if (data.added) {
            var html = $(elem).html() + '<span class="pull-right label label-primary">followed</span>';
            $(elem).html(html);
        } else {
            $(elem).children().remove();
        }

        loadWall();
    }).fail(function(err){
        setAlert(err.statusText + '.', 'err');
    });

    return false;
};

var wallLoaded = function() {
    loadWall();
    loadUsers();
};

var loadUsers = function() {
    // populate users listgroup
    $.ajax({
        method: 'GET',
        url: '/users',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).done(function(data){
        var html = '';

        data.forEach(function(val){
            var followSpan = '<span class="pull-right label label-primary">followed</span>';

            // don't add current user to follow list
            if (val._id === localStorage.getItem('userid')) {
                return;
            }
            // get follows, arrayify, then check if followed for the label
            var follows = localStorage.getItem('follows').split(',');

            html += '<a href="#" class="list-group-item" data-id=' +
                val._id + '>' +
                val.handle + (follows.indexOf(val._id) !== -1 ? followSpan : '') +
                '</a>';
        });

        $('#users').html(html);

        // remove click handlers to bind new ones
        $('#users').off();

        // rebind new click handler
        $('#users').on('click', 'a', function(e){
            follow(e.currentTarget);
        });
    }).fail(function(err){
        setAlert(err.statusText, 'err');
    });

    return false;
};

var loadWall = function() {
    // get followed and own chirps
    $.ajax({
        method: 'GET',
        url: '/chirps/follow/' + localStorage.getItem('userid'),
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    }).done(function(data){
        buildWall(data);
    }).fail(function(err){
        setAlert(err.statusText, 'err');
    });

    return false;
};

var buildWall = function(data) {
    var chirps = [];
    var user = localStorage.getItem('userid');

    data.forEach(function(val){
        chirps.push({
            chirp: val.chirp,
            handle: val.user.handle,
            userid: val.user._id,
            chirpid: val._id
        });
    });

    var html = '';

    chirps.forEach(function(val){
        var close = '';
        var labelClass = 'label-warning';
        if (user === val.userid) {
            labelClass = 'label-success';
            close = '<button type="button" class="close pull-right" aria-label="Close" data-id=' + val.chirpid + '><span aria-hidden="true">×</span></button>';
        }
        html += '<a href="#" class="list-group-item">' +
            val.chirp + '<span class="pull-right label ' +
            labelClass + '">' +
            val.handle + '</span>' +
            close + '</a>';
    });

    // remove old click handler to prevent duplicate handlers
    $('#wall').off();

    // rebind new click handler
    $('#wall').on('click', 'button.close', function(e){
        deleteChirp(e.currentTarget);
    });

    $('#wall').html(html);
};

var search = function() {
    $.ajax({
        method: 'GET',
        url: '/chirps?q=' + $('#search').val().split(' ').join(','),
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

$('#register').on('click', function() {
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

$('#new-chirp').on('click', function() {
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

$('#search-button').on('click', search);

$(window).on('wall-loaded', wallLoaded);