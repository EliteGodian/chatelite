
const CLIENT_ID = 'y6x1M56B3WQIcsbY';

const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    name: getRandomName(),
    color: getRandomColor(),
  },
});
const tab = localStorage.getItem("tab");
const tabData = tab ? JSON.parse(tab) : {};

if (tabData.title) {
  document.title = tabData.title;
}

if (tabData.icon) {
  const faviconLink = document.querySelector("link[rel='icon']");
  faviconLink.href = tabData.icon;
}
let members = [];

drone.on('open', error => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  const room = drone.subscribe('observable-room');
  room.on('open', error => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });

  room.on('members', m => {
    members = m;
    updateMembersDOM();
  });

  room.on('member_join', member => {
    members.push(member);
    updateMembersDOM();
  });

  room.on('member_leave', ({id}) => {
    const index = members.findIndex(member => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

drone.on('close', event => {
  console.log('Connection was closed', event);
});

drone.on('error', error => {
  console.error(error);
});

function getRandomName() {
  var namef = window.prompt("username:")
  if (namef == "null") {
    
  const adjs = [ "-Autumn", "-Hidden", "-Bitter", "-Misty", "-Silent", "-Empty", "-Dry", "-Dark", "-Summer", "-Icy", "-Stupid", "-Quiet", "-White", "-Cool", "-Spring", "-Winter", "-Patient", "-Blood", "-Dawn", "-Crimson", "-Wispy", "-Weathered", "-Blue", "-Billowing", "-Broken", "-Cold", "-Damp", "-Falling", "-Frosty", "-Green", "-Meme", "-Late", "-Lingering", "-Bold", "-Little", "-Morning", "-Muddy", "-Old", "-Red", "-Rough", "-Still", "-Small", "-Sparkling", "-Throbbing", "-Shy", "-Wandering", "-Withered", "-Wild", "-Black", "-Young", "-Waterfall", "-Solitary", "-Fragrant", "-Aged", "-Snowy", "-Piano", "-Sun", "-Void", "-Divine", "-Polished", "-Ancient", "-Purple", "-Lively", "-Nameless"];
  const nouns = ["Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-", "Master-"];
  return (
    adjs[Math.floor(Math.random() * adjs.length)] +
    "_" +
    nouns[Math.floor(Math.random() * nouns.length)]
  );
  } else {
    return(namef)
  }
}

function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

//------------- DOM STUFF

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  });
}

function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

function updateMembersDOM() {
  DOM.membersCount.innerText = `${members.length} users in room:`;
  DOM.membersList.innerHTML = '';
  members.forEach(member =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));
  el.appendChild(document.createTextNode(text));
  el.className = 'message';
  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}
