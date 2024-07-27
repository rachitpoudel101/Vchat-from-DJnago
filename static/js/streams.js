const APP_ID = '8decc7637e1140e084341fee6cea8bfc';
const CHANNEL = 'test';
const TOKEN = null;
let UID;

console.log("streams.js connected");

// Create Agora client instance
const client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });

// Local tracks for audio and video
let localTracks = [];
let remoteUsers = {};

// Function to join and display local stream
let joinAndDisplayLocalStream = async () => {
    // Set up event listeners for user-published and user-unpublished
    client.on('user-published', handleUserJoined);
    client.on('user-unpublished', handleUserLeft);

    try {
        // Join the channel
        UID = await client.join(APP_ID, CHANNEL, TOKEN, null);

        // Create microphone and camera tracks
        localTracks = await AgoraRTC.createMicrophoneAndCameraTracks();

        // Create local user video player
        let player = `
            <div class="video-container" id="user-container-${UID}">
                <div class="username-wrapper">
                    <span class="user-name">MY Name</span> <!-- Optionally replace with a dynamic user name -->
                </div>
                <div class="video-player" id="user-${UID}"></div>
            </div>`;

        // Insert local user video player into the DOM
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);

        // Play the local video track
        localTracks[1].play(`user-${UID}`);

        // Publish local tracks to the channel
        await client.publish([localTracks[0], localTracks[1]]);
    } catch (error) {
        console.error("Error joining and displaying local stream:", error);
    }
};

// Handle when a remote user joins the channel
let handleUserJoined = async (user, mediaType) => {
    // Add the remote user to the users list
    remoteUsers[user.uid] = user;

    // Subscribe to the user's media type
    await client.subscribe(user, mediaType);

    // Check if the media type is video
    if (mediaType === 'video') {
        // Remove existing player if it exists
        let player = document.getElementById(`user-container-${user.uid}`);
        if (player != null) {
            player.remove();
        }

        // Create remote user video player
        player = `
            <div class="video-container" id="user-container-${user.uid}">
                <div class="username-wrapper">
                    <span class="user-name">MY Name</span> <!-- Optionally replace with a dynamic user name -->
                </div>
                <div class="video-player" id="user-${user.uid}"></div>
            </div>`;

        // Insert remote user video player into the DOM
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player);
        
        // Play the remote user's video track
        user.videoTrack.play(`user-${user.uid}`);
    }

    // Check if the media type is audio
    if (mediaType === 'audio') {
        // Play the remote user's audio track
        user.audioTrack.play();
    }
};

// Handle when a remote user leaves the channel
let handleUserLeft = (user) => {
    // Remove the user's video player from the DOM
    const player = document.getElementById(`user-container-${user.uid}`);
    if (player) {
        player.remove();
    }
    // Remove the user from the remote users list
    delete remoteUsers[user.uid];
};

// Call the function to join and display the local stream
joinAndDisplayLocalStream();
