const APP_ID = '8decc7637e1140e084341fee6cea8bfc';
const CHANNEL = 'test';
const TOKEN = null;
let UID;

console.log("streams.js connected");

const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

let localTracks = [];
let remoteUsers = {};

let joinAndDisplayLocalStream = async () => {
    try {
        UID = await client.join(APP_ID, CHANNEL, TOKEN, null); 

        localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        let player = `
            <div class="video-container" id="user-container-${UID}">
                <div class="username-wrapper">
                    <span class="user-name">MY Name</span> <!-- Optionally replace with a dynamic user name -->
                </div>
                <div class="video-player" id="user-${UID}"></div>
            </div>`;

        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

        localTracks[1].play(`user-${UID}`);

        await client.publish([localTracks[0], localTracks[1]]);
    } catch (error) {
        console.error("Error joining and displaying local stream:", error);
    }
};

joinAndDisplayLocalStream();
