var data;
var user;
var userID = 3;
var authenticationToken = "Bearer 1|agiZowgjPsXTEKat75nwGXORNvxl83fcH6dSD8XL";
var myHeaders = new Headers();
// var channel = 'chat-rooms';
myHeaders.append("Authorization", authenticationToken);
window.onload = () => {
    getChatRooms();
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://127.0.0.1:8000/api/user", requestOptions)
        .then(response => response.text())
        .then(function result(x) {
            user = JSON.parse(x);
            channel += user['id'];
        })
        .catch(error => console.log('error', error));
    setTimeout(showData, 1200);
};

function getChatRooms() {
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch("http://127.0.0.1:8000/api/auth/get-chat-rooms", requestOptions)
        .then(response => response.text())
        .then(function result(x) {
            data = JSON.parse(x);
        })
        .catch(error => console.log('error', error));
}

function showData() {
    var chatRoom = "";
    if (data["status"] == false) {
        console.log("empty")
    } else {
        console.log("full")
        for (var i = 0; i < data["data"].length; i++) {
            var lastUpdate = new Date(data["data"][i]['updated_at']);
            if (data["data"][i]['second_user'] == null) {
                chatRoom += `  <li onclick="openChat('${data["data"][i]['first_user']['name']}', '${data["data"][i]['first_user']['image']}', '${data["data"][i]['id']}')">
            <img class="chatRoomImage" src="${data["data"][i]['first_user']['image']}" alt="">
            <div>
                <h2>${data["data"][i]['first_user']['name']}</h2>
                <h3>
                    <span class="status orange"></span>
                    Last Update: ${lastUpdate.toDateString()}
                </h3>
            </div>
        </li>`;

            } else {
                chatRoom += `  <li onclick="openChat('${data["data"][i]['second_user']['name']}', '${data["data"][i]['second_user']['image']}', '${data["data"][i]['id']}')" >
            <img class="chatRoomImage" src="${data["data"][i]['second_user']['image']}" alt="">
            <div>
                <h2>${data["data"][i]['second_user']['name']}</h2>
                <h3>
                    <span class="status orange"></span>
                    Last Update: ${lastUpdate.toDateString()}
                </h3>
            </div>
        </li>`;

            }
        }
    }
    var chatRooms = document.getElementById('chatRooms');
    chatRooms.innerHTML = chatRoom;

}
function openChat(userName, userImage, chatId) {
    SecondUserName.innerHTML = userName;
    document.getElementById('secondUserImage').setAttribute('src', userImage);
    // alert(chatId);
    // get messages()
}

var createNewChatBtnBool = false;
createNewChatBtn.onclick = function () {
    if (createNewChatBtnBool == false) {
        creatNewChatRoomDiv.style.height = '120px';
        creatNewChatRoomDiv.style.border = '1px solid white';
        creatNewChatRoomAddBtn.style.height = 'auto';
    } else {
        creatNewChatRoomDiv.style.height = '0px';
        creatNewChatRoomDiv.style.border = '0px';
        creatNewChatRoomAddBtn.style.height = '0px';
    }
    createNewChatBtnBool = !createNewChatBtnBool;
}
creatNewChatRoomAddBtn.onclick = function () {
    var phoneOrEmail = creatNewChatRoomPhoneOrEmail.value;

    var myHeaders_2 = new Headers();
    myHeaders_2.append("Authorization", authenticationToken);
    myHeaders_2.append("Content-Type", "application/json");

    var raw = JSON.stringify({
        "phoneOrEmail": phoneOrEmail
    });

    var requestOptions_2 = {
        method: 'POST',
        headers: myHeaders_2,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://127.0.0.1:8000/api/auth/create-chat-room", requestOptions_2)
        .then(response => response.text())
        .then(function (x) {
            var res = JSON.parse(x);
            creatNewChatRoomPhoneOrEmail.value = "";
            if (res['status'] == false) {
                alert(res['msg']);
            }
        })
        .catch(error => console.log('error', error));

}

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

var pusher = new Pusher('8b64cbfa68e06a8ae30e', {
    cluster: 'eu'
});

var channel = pusher.subscribe('chat-rooms'+userID);
channel.bind('create-chat-room', function (data) {
    // alert(JSON.stringify(data));
    // we must check if the data to him or another one
    console.log('to me 3');
    getChatRooms();
    setTimeout(showData, 1200);
});