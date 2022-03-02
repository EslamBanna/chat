
(function ($) {
    "use strict";


    /*==================================================================
    [ Validate ]*/
    var input = $('.validate-input .input100');

    $('.validate-form').on('submit', function () {
        var check = true;

        for (var i = 0; i < input.length; i++) {
            if (validate(input[i]) == false) {
                showValidate(input[i]);
                check = false;
            }
        }

        return check;
    });


    $('.validate-form .input100').each(function () {
        $(this).focus(function () {
            hideValidate(this);
        });
    });

    function validate(input) {
        if ($(input).attr('type') == 'email' || $(input).attr('name') == 'email') {
            if ($(input).val().trim().match(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{1,5}|[0-9]{1,3})(\]?)$/) == null) {
                return false;
            }
        }
        else {
            if ($(input).val().trim() == '') {
                return false;
            }
        }
    }

    function showValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).addClass('alert-validate');
    }

    function hideValidate(input) {
        var thisAlert = $(input).parent();

        $(thisAlert).removeClass('alert-validate');
    }



})(jQuery);

window.onload = () => {
    var userToken = window.localStorage.getItem('user-token-banda-chat-application');
    // alert(test);
    if (userToken != null) {
        // alert('no');
        window.location.href = 'chatRoom.html';
    }
}


var domain = "http://127.0.0.1:8000/";

function login() {
    var email = document.getElementById('Email').value;
    var password = document.getElementById('Password').value;
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "email": email,
        "password": password
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch(domain + "api/login", requestOptions)
        .then(response => response.text())
        .then(function (x) {
            // console.log(x);
            var result = JSON.parse(x);
            if (result['status'] == true) {
                // alert('go on')
                window.localStorage.setItem('user-token-banda-chat-application', result['data']['token']);
                window.localStorage.setItem('user-id-banda-chat-application', result['data']['user']['id']);
                window.localStorage.setItem('user-name-banda-chat-application', result['data']['user']['name']);
                window.localStorage.setItem('user-email-banda-chat-application', result['data']['user']['email']);
                window.localStorage.setItem('user-phone-banda-chat-application', result['data']['user']['phone']);
                window.localStorage.setItem('user-image-banda-chat-application', result['data']['user']['image']);
                // alert(result['data']['token']);
                // alert(window.localStorage.getItem('token'));
                window.location.href = 'chatRoom.html';
            } else {
                alert('Uncorrect Inputs');
            }
        })
        .catch(error => console.log('error', error));
}

function register() {

    var name = document.getElementById('Name').value;
    var email = document.getElementById('Email').value;
    var phone = document.getElementById('Phone').value;
    var password = document.getElementById('Password').value;
    // var photo = document.getElementById('Photo').value ;

    var formdata = new FormData();
    formdata.append("name", name);
    formdata.append("email", email);
    formdata.append("password", password);
    formdata.append("phone", phone);
    // formdata.append("image", fileInput.files[0], "/E:/WhatsApp Image 2021-09-25 at 1.33.08 AM.jpeg");

    var requestOptions = {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    };

    fetch(domain + "api/sign-up", requestOptions)
        .then(response => response.text())
        .then(function (x) {
            var result = JSON.parse(x);
            if (result['status'] == true) {
                window.location.href = 'index.html';
            } else {
                alert('Uncorrect Inputs');
            }
        })
        .catch(error => console.log('error', error));
}