var domain = "http://127.0.0.1:8000/";
var userChatRooms;
var currentChatRoomId;
var user;
var userID = 3;
var authenticationToken = "Bearer 1|agiZowgjPsXTEKat75nwGXORNvxl83fcH6dSD8XL";
var chatRooms = document.getElementById('chatRooms');
var messages = document.getElementById('chat');
var myHeaders = new Headers();
myHeaders.append("Authorization", authenticationToken);
window.onload = () => {
    getChatRooms();
};

function getChatRooms() {
    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };
    fetch(domain + "api/auth/get-chat-rooms", requestOptions)
        .then(response => response.text())
        .then(function result(x) {
            userChatRooms = JSON.parse(x);
            showData();

        })
        .catch(error => console.log('error', error));
}

function showData() {
    var chatRoom = "";
    if (userChatRooms["status"] == false) {
        console.log("empty")
    } else {
        console.log("full")
        for (var i = 0; i < userChatRooms["data"].length; i++) {
            var lastUpdate = new Date(userChatRooms["data"][i]['updated_at']);
            if (userChatRooms["data"][i]['second_user'] == null) {
                chatRoom += `<li id="chatRoom${userChatRooms["data"][i]['id']}" onclick="openChat('${userChatRooms["data"][i]['first_user']['name']}', '${userChatRooms["data"][i]['first_user']['image']}', '${userChatRooms["data"][i]['id']}')">
            <img class="chatRoomImage" src="${userChatRooms["data"][i]['first_user']['image']}" alt="">
            <div>
                <h2>${userChatRooms["data"][i]['first_user']['name']}</h2>
                <h3>
                    <span class="status green"></span>
                    Last Update: ${lastUpdate.toDateString()}
                </h3>
            </div>
        </li>`;

            } else {
                chatRoom += `  <li id="chatRoom${userChatRooms["data"][i]['id']}" onclick="openChat('${userChatRooms["data"][i]['second_user']['name']}', '${userChatRooms["data"][i]['second_user']['image']}', '${userChatRooms["data"][i]['id']}')" >
            <img class="chatRoomImage" src="${userChatRooms["data"][i]['second_user']['image']}" alt="">
            <div>
                <h2>${userChatRooms["data"][i]['second_user']['name']}</h2>
                <h3>
                    <span class="status green"></span>
                    Last Update: ${lastUpdate.toDateString()}
                </h3>
            </div>
        </li>`;

            }
        }
    }
    chatRooms.innerHTML = chatRoom;

}
function openChat(userName, userImage, chatId) {
    currentChatRoomId = chatId;
    SecondUserName.innerHTML = userName;
    document.getElementById('secondUserImage').setAttribute('src', userImage);
    getMessagesCount(chatId);
    getMessages(chatId, userName);
}

function getMessagesCount(chatId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authenticationToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(domain + "api/auth/get-messages-counts/" + chatId, requestOptions)
        .then(response => response.text())
        .then(function (x) {
            var result = JSON.parse(x);
            chatMessagesCount.innerHTML = result["data"];
        })
        .catch(error => console.log('error', error));
}

function getMessages(chatId, userName) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authenticationToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(domain + "api/auth/get-messages/" + chatId, requestOptions)
        .then(response => response.text())
        .then(function (fetch_messages) {
            fetch_messages = JSON.parse(fetch_messages);
            var chatContent = "";
            for (var i = 0; i < fetch_messages["data"].length; i++) {
                var mesageDate = new Date(fetch_messages["data"][i]['updated_at']);
                if (fetch_messages["data"][i]['sender_id'] == userID) {
                    chatContent += `<li class="me">
                    <div class="entete">
                        <h3>${mesageDate.toDateString()}</h3>
                        <h2>ME </h2>
                        <span class="status blue"></span>
                    </div>
                    <div class="message">
                    ${fetch_messages["data"][i]['message']}
                    </div>
                </li>`;

                } else {
                    chatContent += `<li class="you">
                    <div class="entete">
                        <span class="status green"></span>
                        <h2>${userName}</h2>
                        <h3>${mesageDate.toDateString()}</h3>
                    </div>
                    <div class="triangle"></div>
                    <div class="message">
                    ${fetch_messages["data"][i]['message']}
                    </div>
                </li>`;
                }
            }
            messages.innerHTML = chatContent;
        })
        .catch(error => console.log('error', error));
}

function sendMessage() {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authenticationToken);

    var formdata = new FormData();
    formdata.append("message", document.getElementById('messageArea').value);
    // formdata.append("attach", fileInput.files[0], "/E:/WhatsApp Image 2021-09-25 at 1.33.08 AM.jpeg");

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: formdata,
        redirect: 'follow'
    };

    fetch(domain + "api/auth/send-message/" + currentChatRoomId, requestOptions)
        .then(response => response.text())
        .then(function (msg) {
            document.getElementById('messageArea').value = "";
            console.log(msg);
        })
        .catch(error => console.log('error', error));
}

// ################# non functions ##################

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

    fetch(domain + "api/auth/create-chat-room", requestOptions_2)
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
// ############ chat rooms channel ##########
var channel = pusher.subscribe('chat-rooms' + userID);
channel.bind('create-chat-room', function (data) {
    // alert(JSON.stringify(data));
    console.log('to me 3');
    var lastUpdate = new Date(data["chat_room_data"]['lastUpdate']);
    var newChatRoom = `  <li onclick="openChat('${data['chat_room_data']["user"]['name']}', '${data['chat_room_data']["user"]['image']}', '${data['chat_room_data']['chat_room_id']}')">
    <img class="chatRoomImage" src="${data['chat_room_data']['user']['image']}" alt="">
    <div>
        <h2>${data['chat_room_data']["user"]['name']}</h2>
        <h3>
            <span class="status orange"></span>
            Last Update: ${lastUpdate.toDateString()}
        </h3>
    </div>
</li>`;
    chatRooms.innerHTML = newChatRoom + chatRooms.innerHTML;
});

// ###############################

// ############ send message channel ##########
var channel_message = pusher.subscribe('chat' + userID);
channel_message.bind('message', function (fetch_message) {
    console.log('to me 2');
    if (currentChatRoomId == fetch_message['chatRoomId']) {
        var messageTime = new Date(fetch_message['created_at']);
        chatMessagesCount.innerHTML = parseInt(chatMessagesCount.innerHTML) + 1;
        var newMessage = ``;
        if (fetch_message['sender'] == 1) {
            newMessage = `<li class="me">
        <div class="entete">
            <h3>${messageTime.toDateString()}</h3>
            <h2>ME </h2>
            <span class="status blue"></span>
        </div>
        <div class="message">
        ${fetch_message['message']}
        </div>
    </li>`;
        } else {
            newMessage = `<li class="you">
        <div class="entete">
        <span class="status blue"></span>
        <h2>${SecondUserName.innerHTML}</h2>
            <h3>${messageTime.toDateString()}</h3>
        </div>
        <div class="triangle"></div>
        <div class="message">
        ${fetch_message['message']}
        </div>
    </li>`;
        }
        messages.innerHTML += newMessage;
    }

    var TheChatRoomItemList = document.getElementById('chatRoom' + fetch_message['chatRoomId']);
    var TheChatRoomItemListContent = TheChatRoomItemList.innerHTML;
    // console.log(TheChatRoomItemListContent);
    TheChatRoomItemList.style.display = 'none';


    var lastUpdate = new Date(fetch_message["chat_room_data"]['lastUpdate']);
    var newChatRoom = `  <li onclick="openChat('${data['chat_room_data']["user"]['name']}', '${data['chat_room_data']["user"]['image']}', '${data['chat_room_data']['chat_room_id']}')">
    <img class="chatRoomImage" src="${data['chat_room_data']['user']['image']}" alt="">
    <div>
        <h2>${data['chat_room_data']["user"]['name']}</h2>
        <h3>
            <span class="status orange"></span>
            Last Update: ${lastUpdate.toDateString()}
        </h3>
    </div>
</li>`;
    chatRooms.innerHTML = newChatRoom + chatRooms.innerHTML;
});
// #############################################