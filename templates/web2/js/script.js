var domain = "http://127.0.0.1:8000/";
var userChatRooms;
var currentChatRoomId = 0;
var user;
var authenticationToken = "Bearer " + window.localStorage.getItem('user-token-banda-chat-application');
var userID = window.localStorage.getItem('user-id-banda-chat-application');
var username = window.localStorage.getItem('user-name-banda-chat-application');
var useremail = window.localStorage.getItem('user-email-banda-chat-application');
var userphone = window.localStorage.getItem('user-phone-banda-chat-application');
var userimage = window.localStorage.getItem('user-image-banda-chat-application');
userName.innerHTML = username;
userEmail.innerHTML = useremail;
userPhone.innerHTML = userphone;
userImage.setAttribute('src', userimage);
// var userID = 1;
// var authenticationToken = "Bearer 4|SOclop5rca82xTyParXVio6cgEmuotJL9HdMgc4h";
var chatRooms = document.getElementById('chatRooms');
var messages = document.getElementById('chat');
var notSeenIcon = `<svg width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle notSeenIcon" viewBox="0 0 16 16">
<path fill-rule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
</svg>`;
var seenIcon = `<svg width="16" height="16" fill="currentColor" class="bi bi-arrow-right-circle seenIcon" viewBox="0 0 16 16">
<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>
</svg>`;
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
                <h2 id="chatRoomUserName${userChatRooms["data"][i]['id']}">${userChatRooms["data"][i]['first_user']['name']}</h2>
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
                <h2 id="chatRoomUserName${userChatRooms["data"][i]['id']}">${userChatRooms["data"][i]['second_user']['name']}</h2>
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
    if (currentChatRoomId != 0) {
        document.getElementById('chatRoom' + currentChatRoomId).style.backgroundColor = "inherit";
        document.getElementById('chatRoomUserName' + currentChatRoomId).style.color = "white";
    }
    currentChatRoomId = chatId;
    SecondUserName.innerHTML = userName;
    document.getElementById('chatRoom' + chatId).style.backgroundColor = "white";
    document.getElementById('chatRoomUserName' + chatId).style.color = "black";
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
    makeSeenChat(currentChatRoomId);
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
                var seen_icon = "";
                if (fetch_messages["data"][i]['sender_id'] == userID) {
                    if (fetch_messages["data"][i]['msg_status'] == 'not_seen') {
                        // alert('not ssen')
                        seen_icon = notSeenIcon
                    } else {
                        // alert('seen')
                        seen_icon = seenIcon;
                    }
                    chatContent += `<li class="me">
                    <div class="entete">
                        <h3>${mesageDate.toDateString()}</h3>
                        <h2>ME </h2>
                        <span class="status blue"></span>
                    </div>
                    <div class="message">
                    ${fetch_messages["data"][i]['message']}
                    <hr class = "horizontalStatus" />
                    ${seen_icon}
        
<svg width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
</svg>


<svg width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
</svg>
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
                    <hr class = "horizontalStatus" />
                    ${seenIcon}

<svg width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
</svg>


<svg width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
</svg>
                    </div>
                </li>`;
                }
            }
            messages.innerHTML = chatContent;
        })
        .catch(error => console.log('error', error));
}

function sendMessage() {
    makeSeenChat(currentChatRoomId);
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

function makeSeenChat(chatId) {
    var myHeaders = new Headers();
    myHeaders.append("Authorization", authenticationToken);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    fetch(domain + "api/auth/make-seen-chat/" + chatId, requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

function logOut() {
    window.localStorage.clear();
    // window.location.href = 'index.html';
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
    console.log('to me 1');
    var lastUpdate = new Date(data["chat_room_data"]['lastUpdate']);
    var newChatRoom = ` <li id="chatRoom${data['chat_room_data']['chat_room_id']}" onclick="openChat('${data['chat_room_data']["user"]['name']}', '${data['chat_room_data']["user"]['image']}', '${data['chat_room_data']['chat_room_id']}')">
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
    console.log('to me 1');
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
        <hr />
        ${notSeenIcon}

                      <svg width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
</svg>


<svg width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
</svg>
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
        <hr />
    ${seenIcon}

      <svg width="16" height="16" fill="currentColor" class="bi bi-google" viewBox="0 0 16 16">
  <path d="M15.545 6.558a9.42 9.42 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.689 7.689 0 0 1 5.352 2.082l-2.284 2.284A4.347 4.347 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.792 4.792 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.702 3.702 0 0 0 1.599-2.431H8v-3.08h7.545z"/>
</svg>


<svg width="16" height="16" fill="currentColor" class="bi bi-envelope-fill" viewBox="0 0 16 16">
  <path d="M.05 3.555A2 2 0 0 1 2 2h12a2 2 0 0 1 1.95 1.555L8 8.414.05 3.555ZM0 4.697v7.104l5.803-3.558L0 4.697ZM6.761 8.83l-6.57 4.027A2 2 0 0 0 2 14h12a2 2 0 0 0 1.808-1.144l-6.57-4.027L8 9.586l-1.239-.757Zm3.436-.586L16 11.801V4.697l-5.803 3.546Z"/>
</svg>
        </div>
    </li>`;
        }
        messages.innerHTML += newMessage;
    }

    var TheChatRoomItemList = document.getElementById('chatRoom' + fetch_message['chatRoomId']);
    var TheChatRoomItemListContent = TheChatRoomItemList.innerHTML;
    // console.log(TheChatRoomItemListContent);
    TheChatRoomItemList.style.display = 'none';

    var newChatRoom = `<li id="chatRoom${fetch_message['chatRoomId']}" onclick="openChat('${fetch_message['user_name']}', '${fetch_message['user_image']}', '${fetch_message['chatRoomId']}')">
    ${TheChatRoomItemListContent}
</li>`;
    chatRooms.innerHTML = newChatRoom + chatRooms.innerHTML;
});
// #############################################

// ############ seen chat messages channel ######
var channel = pusher.subscribe('chat-room' + userID);
channel.bind('chat-room-seen', function (data) {
    console.log('to meeeeeeee');
    // bi-arrow-right-circle
    // bi-arrow-right-circle-fill
    var seenElements = document.getElementsByClassName('notSeenIcon');
    for(var i = 0; i< seenElements.length;i++){
        // seenElements[i].style.display = 'none';
        // document.getElementsByClassName('message')[i].innerHTML += seenIcon;
        seenElements[i].innerHTML = `<path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0zM4.5 7.5a.5.5 0 0 0 0 1h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 1 0-.708.708L10.293 7.5H4.5z"/>`;
        // seenElements[i].setAttribute('class', 'bi-arrow-right-circle-fill');
        }
});

// #############################################