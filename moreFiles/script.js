import { initializeApp } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-app.js";
import { getDatabase, ref, set, get, push, child, update, remove, onChildAdded, onChildRemoved } from "https://www.gstatic.com/firebasejs/10.6.0/firebase-database.js";
const firebaseConfig = {
    apiKey: "AIzaSyB90bxriKKTbUDGz6p5eEUO65--_dhrXiY",
    authDomain: "firstmode-7fa5a.firebaseapp.com",
    projectId: "firstmode-7fa5a",
    storageBucket: "firstmode-7fa5a.appspot.com",
    messagingSenderId: "568875056319",
    appId: "1:568875056319:web:73147a773b1180493d1a0a"
};
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

var sent = new Audio('sent.wav');
var received = new Audio('received.wav');
let userMessage = document.getElementById("inputBox");
let username = document.getElementById("name");
let img = document.getElementById("img");
var userValid = /^[a-zA-Z0-9]+$/;
var userName;
const admin = 'Nick';
function checkName() {
    userName = prompt("Enter your name").toLowerCase().trim();
    if (userName.length >= 3 && userName.length <= 8 && userName.match(userValid)) {
        localStorage.setItem('userName', userName);
        username.innerText = localStorage.getItem("userName");
        img.innerText = localStorage.getItem("userName").split(' ')[0].charAt(0).toUpperCase();
    } else {
        checkName()
    }
}
if (localStorage.getItem('userName')) {
    username.innerText = userName = localStorage.getItem('userName');
    img.innerText = localStorage.getItem("userName").split(' ')[0].charAt(0).toUpperCase();
} else {
    checkName();
}
var profileImg = document.getElementById('img');
function getRandomColor(name) {
    const asciiCode = name.charCodeAt(0);
    const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
    var num = Math.round(0xffffff * parseInt(colorNum));
    var r = num >> 16 & 255;
    var g = num >> 8 & 255;
    var b = num & 255;
    profileImg.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ', 1)';
    profileImg.style.outlineColor = 'rgb(' + r + ', ' + g + ', ' + b + ', 1)';
}
getRandomColor(localStorage.getItem("userName").charAt(0));
var timeStamp = new Date().getTime();
var getDate = new Date();
var currentTime = getDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
set(ref(db, 'joinedUsers/' + timeStamp), {
    user: localStorage.getItem('userName').trim() + ', ' + currentTime
})
setTimeout(() => {
    set(ref(db, 'messages/' + timeStamp), {
        user: localStorage.getItem('userName').trim(),
        time: currentTime,
        join: true
    })
}, 5000);
module.sendMsg = function sendMsg() {
    var timeStamp = new Date().getTime();
    var getDate = new Date();
    var currentTime = getDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
    if (userMessage.innerText.trim().length !== 0) {
      if (userMessage.innerText.trim().split(" ")[0] == (admin + '@')) {
        if (userMessage.innerText.trim().split(" ")[1].trim().length !== 0) {
            localStorage.setItem("userName", userMessage.innerText.trim().split(" ")[1].toLowerCase().trim());
            username.innerText = localStorage.getItem("userName");
            img.innerText = localStorage.getItem("userName").split(' ')[0].charAt(0).toUpperCase();
        }
      } else if (userMessage.innerText.trim() == (admin + '@clear')) {
        remove(ref(db, 'messages/'));
    }else if(document.querySelector('.replyToMsgSecPad')){
        let replyToMsgBoxIn = document.getElementById("replyToMsgBoxIn");
        let replyToUserBoxIn = document.getElementById("replyToUserBoxIn").innerHTML.trim();
        set(ref(db, 'messages/' + timeStamp), {
            key: replyToMsgBoxIn.getAttribute('key'),
            replyToUser: replyToUserBoxIn,
            replyToMsg: replyToMsgBoxIn.innerHTML.trim(),
            user: localStorage.getItem('userName').trim(),
            message: userMessage.innerHTML.trim(),
            time: currentTime,
            reply: true
        }).then(() => {
            sent.play();
            document.getElementById("replyToMsgSec").innerHTML = '';
        })
    } else{
        set(ref(db, 'messages/' + timeStamp), {
            user: localStorage.getItem('userName').trim(),
            message: userMessage.innerHTML.trim(),
            time: currentTime
        }).then(() => {
            sent.play();
        })
      }
    }
    userMessage.focus()
    userMessage.innerText = "";
}
var userData = document.getElementById("messageSec");
var urlRegex = /(https?:\/\/[^\s]+)/g;
var nameRegex = /(@[^\s]+)/g;
onChildAdded(ref(db, 'messages'), (snapshot) => {         
    if(document.getElementById("loader")){
        document.getElementById("loader").remove()
    }
    if(snapshot.val().join){
        if(snapshot.val().user == userName){
            userData.innerHTML += 
            `<div class="joinedSec" id="${snapshot.key}join">
                <div class="joined">
                    <span class="joining"><span class="joinedPerson">You</span> joined the Chat <span class="joinedTime">${snapshot.val().time}</span></span>
                </div>
            </div>`
        }else{
            userData.innerHTML += 
            `<div class="joinedSec" id="${snapshot.key}join">
                <div class="joined">
                    <span class="joining"><span class="joinedPerson" id="${snapshot.key}name">${snapshot.val().user}</span> joined the Chat <span class="joinedTime">${snapshot.val().time}</span></span>
                </div>
            </div>`
        }
        setTimeout(() => {
            remove(ref(db, 'messages/' + snapshot.key))
        }, 1000);
    }
    else{
        if (snapshot.val().user == userName) {
            userData.innerHTML += 
            `<div id="${snapshot.key}outerSkin" class="outerSkin myOuterSkin" ondblclick="module.replyTo(${snapshot.key})">
                <div class="msgContainer myMsgContainer">
                    <div class="funcBtns" id="${snapshot.key}funcBtns">
                        <button id="${snapshot.key}delBtn" class="deleteMsg" onclick="module.delMsg(${snapshot.key})">Del</button>
                    </div>
                    <div id="${snapshot.key}mainMsgSec" class="mainMsgSec myMainMsgSec">
                        <div class="replyToMsgSec" id="${snapshot.key}replyToMsgSec"></div>
                        <div class="msgBox myMsgBox" id="${snapshot.key}msgBox">
                            <span id="${snapshot.key}" class="message myMessage">${snapshot.val().message}</span>
                        </div>
                    </div>
                </div>
                <div class="moreDetail" id="${snapshot.key}details">
                    <div class="timeBox">
                        <span id="myTime" class="time myTime">${snapshot.val().time}</span>
                        <span id="${snapshot.key}name" class="username myUsername">You</span>
                    </div>
                </div>
            </div>`;
        } else {
            if (localStorage.getItem("userName") == "#" + admin.toLowerCase()) {
                userData.innerHTML += 
                `<div id="${snapshot.key}outerSkin" class="outerSkin yourOuterSkin" ondblclick="module.replyTo(${snapshot.key})">
                    <div class="msgContainer yourMsgContainer">
                        <div id="${snapshot.key}profilePic" class="profilePic yourProfilePic">${snapshot.val().user.charAt(0).toUpperCase()}</div>
                        <div class="mainMsgSec yourMainMsgSec">
                            <div class="replyToMsgSec" id="${snapshot.key}replyToMsgSec"></div>
                            <div class="msgBox yourMsgBox" id="${snapshot.key}msgBox">
                                <span id="${snapshot.key}" class="message yourMessage">${snapshot.val().message}</span>
                            </div>
                        </div>
                        <div class="funcBtns" id="${snapshot.key}funcBtns">
                            <button id="${snapshot.key}delBtn" class="deleteMsg" onclick="module.delMsg(${snapshot.key})">Del</button>
                        </div>
                    </div>
                    <div class="moreDetail" id="${snapshot.key}details">
                        <div class="timeBox">
                        <span id="${snapshot.key}name" class="username yourUsername">${snapshot.val().user.split(' ')[0]}</span>
                        <span id="yourTime" class="time yourTime">${snapshot.val().time}</span>
                        </div>
                    </div>
                </div>`;
            } else {
                userData.innerHTML += 
                `<div id="${snapshot.key}outerSkin" class="outerSkin yourOuterSkin" ondblclick="module.replyTo(${snapshot.key})">
                    <div class="msgContainer yourMsgContainer">
                        <div id="${snapshot.key}profilePic" class="profilePic yourProfilePic">${snapshot.val().user.split(' ')[0].charAt(0).toUpperCase()}</div>
                        <div class="mainMsgSec yourMainMsgSec">
                            <div class="replyToMsgSec" id="${snapshot.key}replyToMsgSec"></div>
                            <div class="msgBox yourMsgBox" id="${snapshot.key}msgBox">
                                <span id="${snapshot.key}" class="message yourMessage">${snapshot.val().message}</span>
                            </div>
                        </div>
                        <div class="funcBtns" id="${snapshot.key}funcBtns">
                            <nonsense id="${snapshot.key}delBtn" />
                        </div>
                    </div>
                    <div class="moreDetail" id="${snapshot.key}details">
                        <div class="timeBox">
                        <span id="${snapshot.key}name" class="username yourUsername">${snapshot.val().user.split(' ')[0]}</span>
                        <span id="yourTime" class="time yourTime">${snapshot.val().time}</span>
                        </div>
                    </div>
                </div>`;
            }
            received.play();
        }
        if(snapshot.val().reply){
            let xName = snapshot.val().replyToUser;
            if(xName == userName){
                xName = 'You'
            }
            if(snapshot.val().user == userName){
                document.getElementById(snapshot.key+'replyToMsgSec').innerHTML =
                `<div class="replyToMsgSecIn replyToMsgSecInMy">
                    <div id="${snapshot.key}replyToMsgSecInner" class="replyToMsgSecInner replyToMsgSecInnerMy" onclick="window.location.href = '#${snapshot.val().key}outerSkin';document.getElementById('${snapshot.val().key}outerSkin').classList.add('highlighted');setTimeout(() => {document.getElementById('${snapshot.val().key}outerSkin').classList.remove('highlighted')}, 3000)">
                        <div class="replyToUserBox replyToUserBoxMy">
                            <span class="replyToUserBoxIn" id="${snapshot.key}replyToUserBoxIn">
                                ${xName}
                            </span>
                        </div>
                        <div class="replyToMsgBox replyToMsgBoxMy">
                            <span class="replyToMsgBoxIn">
                                ${snapshot.val().replyToMsg}
                            </span>
                        </div>
                    </div>
                </div>`;
            }else{
                document.getElementById(snapshot.key+'replyToMsgSec').innerHTML =
                `<div class="replyToMsgSecIn replyToMsgSecInYour">
                    <div id="${snapshot.key}replyToMsgSecInner" class="replyToMsgSecInner replyToMsgSecInnerYour" onclick="window.location.href = '#${snapshot.val().key}outerSkin';document.getElementById('${snapshot.val().key}outerSkin').classList.add('highlighted');setTimeout(() => {document.getElementById('${snapshot.val().key}outerSkin').classList.remove('highlighted')}, 3000)">
                        <div class="replyToUserBox replyToUserBoxYour">
                            <span class="replyToUserBoxIn" id="${snapshot.key}replyToUserBoxIn">
                                ${xName}
                            </span>
                        </div>
                        <div class="replyToMsgBox replyToMsgBoxYour">
                            <span class="replyToMsgBoxIn">
                                ${snapshot.val().replyToMsg}
                            </span>
                        </div>
                    </div>
                </div>`;
            }
        }
        if (snapshot.val().message.match(nameRegex)) {
            document.getElementById(snapshot.key).innerHTML = snapshot.val().message.replace(nameRegex, function(name) {
                return '<i class="foundUsername">' + name + '</i>'
            })
        }
        if (snapshot.val().message.match(urlRegex)) {
            document.getElementById(snapshot.key).innerHTML = snapshot.val().message.replace(urlRegex, function(url) {
                return '<a class="foundLink" href="' + url + '">' + url + '</a>'
            })
        }
        if (snapshot.val().message.length <= 1) {
          document.getElementById(snapshot.key).classList.add("singleItem");
        }
        if (/\p{Extended_Pictographic}/u.test(snapshot.val().message) == true && snapshot.val().message.length <= 2) {
            document.getElementById(snapshot.key).classList.add("imojiMsg");
        }
    }
    if(snapshot.val().user !== userName){
        var profilePic = document.getElementById(snapshot.key+'profilePic');
        var yourUsername = document.getElementById(snapshot.key + "name");
        function getRandomColor(name) {
            const asciiCode = name.charCodeAt(0);
            const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
            var num = Math.round(0xffffff * parseInt(colorNum));
            var r = num >> 16 & 255;
            var g = num >> 8 & 255;
            var b = num & 255;
            yourUsername.style.color = 'rgb(' + r + ', ' + g + ', ' + b + ', 1)';
            profilePic.style.backgroundColor = 'rgb(' + r + ', ' + g + ', ' + b + ', 1)';
        }
        getRandomColor(snapshot.val().user.charAt(0))
    }
    if(snapshot.val().reply){
        var replyToUserBoxIn = document.getElementById(snapshot.key+"replyToUserBoxIn");
        var replyToMsgSecInner = document.getElementById(snapshot.key+'replyToMsgSecInner');
        function getRandomColor2(name) {
            const asciiCode = name.charCodeAt(0);
            const colorNum = asciiCode.toString() + asciiCode.toString() + asciiCode.toString();
            var num = Math.round(0xffffff * parseInt(colorNum));
            var r = num >> 16 & 255;
            var g = num >> 8 & 255;
            var b = num & 255;
            replyToUserBoxIn.style.color = 'rgb(' + r + ', ' + g + ', ' + b + ', 1)';
            replyToMsgSecInner.style.borderColor = 'rgb(' + r + ', ' + g + ', ' + b + ', 1)';
        }
        getRandomColor2(snapshot.val().replyToUser.charAt(0))
    }
    userData.scrollTop = userData.scrollHeight;
})

module.delMsg = function delMsg(key) {
    remove(ref(db, 'messages/' + key))
}
module.replyTo = function replyTo(key) {
    userMessage.focus();
    let replyToUser = document.getElementById(key+'name').innerHTML.split(' ')[0].trim();
    if(replyToUser == 'You'){
        replyToUser = localStorage.getItem("userName").split(' ')[0].trim();
    }
    let replyToMsg = document.getElementById(key).innerHTML.trim();
    let replyToMsgSec = document.getElementById("replyToMsgSec");
    replyToMsgSec.innerHTML =
    `<div class="replyToMsgSecPad">
        <div class="replyToMsgSecIn">
            <button class="closeReplying" type="button" onclick="replyToMsgSec.innerHTML = ''">Cnc</button>
            <div class="replyToMsgSecInner" onclick="window.location.href = '#${key}outerSkin';document.getElementById('${key}outerSkin').classList.add('highlighted');setTimeout(() => {document.getElementById('${key}outerSkin').classList.remove('highlighted')}, 3000)">
                <div class="replyToUserBox">
                    <span class="replyToUserBoxIn" id="replyToUserBoxIn">
                        ${replyToUser}
                    </span>
                </div>
                <div class="replyToMsgBox">
                    <span class="replyToMsgBoxIn" id="replyToMsgBoxIn" key="${key}">
                        ${replyToMsg}
                    </span>
                </div>
            </div>
        </div>
    </div>`;
}

onChildRemoved(ref(db, 'messages'), (snapshot) => {
    if(document.getElementById(snapshot.key)){
        var msg = document.getElementById(snapshot.key);
        let noIconSvg = `<svg class="noIcon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="18" height="18" viewBox="0 0 256 256" xml:space="preserve"><g style="stroke: none; stroke-width: 0; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill: none; fill-rule: nonzero; opacity: 1;" transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)" ><path d="M 45 90 c -12.02 0 -23.32 -4.681 -31.82 -13.181 C 4.681 68.32 0 57.02 0 45 c 0 -12.02 4.681 -23.32 13.18 -31.82 l 0 0 l 0 0 C 21.68 4.681 32.98 0 45 0 c 12.02 0 23.32 4.681 31.819 13.18 C 85.319 21.68 90 32.98 90 45 c 0 12.02 -4.681 23.32 -13.181 31.819 C 68.32 85.319 57.02 90 45 90 z M 45 8 c -9.883 0 -19.174 3.849 -26.163 10.837 l 0 0 C 11.849 25.826 8 35.117 8 45 c 0 9.883 3.849 19.174 10.837 26.163 C 25.826 78.151 35.117 82 45 82 c 9.883 0 19.174 -3.849 26.163 -10.837 C 78.151 64.174 82 54.883 82 45 c 0 -9.883 -3.849 -19.174 -10.837 -26.163 C 64.174 11.849 54.883 8 45 8 z" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" class="noIconColor" transform=" matrix(1 0 0 1 0 0) " stroke-linecap="round" /><rect x="4" y="41" rx="0" ry="0" width="82" height="8" style="stroke: none; stroke-width: 1; stroke-dasharray: none; stroke-linecap: butt; stroke-linejoin: miter; stroke-miterlimit: 10; fill-rule: nonzero; opacity: 1;" class="noIconColor" transform=" matrix(0.707 -0.7072 0.7072 0.707 -18.6396 45.0055) "/></g></svg>`;
        if (snapshot.val().user == userName) {
            msg.innerHTML = 
            `<i class="deletedMsg myDeletedMsg">${noIconSvg}You deleted this message</i>`;
        } else {
            msg.innerHTML = 
            `<i class="deletedMsg yourDeletedMsg">${noIconSvg}This message was deleted</i>`;
        }
        document.getElementById(snapshot.key + 'funcBtns').remove();
        document.getElementById(snapshot.key+'replyToMsgSec').remove();
    }
})
