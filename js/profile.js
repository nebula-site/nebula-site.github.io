window.onload = function() {
    // Get the avatar and name from localStorage
    const avatar = localStorage.getItem('avatar');
    const name = localStorage.getItem('name');

    // Set default avatar if none is saved
    if (avatar) {
        document.getElementById('user-avatar').src = avatar;
    } else {
        document.getElementById('user-avatar').src = '/images/user.png'; // Default avatar
    }

    // Set default name if none is saved
    if (name) {
        document.getElementById('user-name').innerText = name;
    }
};

// Edit Profile function (opens modal)
function editProfile() {
    document.getElementById('profile-modal').style.display = 'block';
    const currentAvatar = localStorage.getItem('avatar') || '';
    const currentName = localStorage.getItem('name') || '';
    document.getElementById('avatar-url').value = currentAvatar;
    document.getElementById('user-name-input').value = currentName;
}

// Save Profile function (stores in localStorage)
function saveProfile() {
    const avatarUrl = document.getElementById('avatar-url').value;
    const avatarFile = document.getElementById('avatar-file').files[0];
    const name = document.getElementById('user-name-input').value;

    if (avatarFile) {
        const reader = new FileReader();
        reader.onloadend = function() {
            // Store the avatar image in localStorage and update the profile image
            localStorage.setItem('avatar', reader.result);
            document.getElementById('user-avatar').src = reader.result;
        };
        reader.readAsDataURL(avatarFile);
    } else if (avatarUrl) {
        // Store the avatar URL in localStorage and update the profile image
        localStorage.setItem('avatar', avatarUrl);
        document.getElementById('user-avatar').src = avatarUrl;
    }

    // Store the name in localStorage and update the displayed name
    localStorage.setItem('name', name);
    document.getElementById('user-name').innerText = name;

    // Close the modal after saving
    document.getElementById('profile-modal').style.display = 'none';
}

// Close Modal without saving
function closeModal() {
    document.getElementById('profile-modal').style.display = 'none';
}
