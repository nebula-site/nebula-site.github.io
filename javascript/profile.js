document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('profile-form');
  const usernameInput = document.getElementById('username');
  const avatarInput = document.getElementById('avatar');
  const statusMsg = document.getElementById('status-msg');

  // Prefill form with current data
  const user = JSON.parse(localStorage.getItem('user')) || {
    name: "Guest",
    avatar: "/images/user-avatar.png"
  };
  usernameInput.value = user.name;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = usernameInput.value.trim();
    if (!name) return;

    // If a file is uploaded, read it as Data URL
    if (avatarInput.files.length > 0) {
      const reader = new FileReader();
      reader.onload = function () {
        const avatar = reader.result;
        updateUser(name, avatar);
      };
      reader.readAsDataURL(avatarInput.files[0]);
    } else {
      updateUser(name, user.avatar);
    }
  });

  function updateUser(name, avatar) {
    const updatedUser = { name, avatar };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    statusMsg.textContent = "Profile updated!";
    setTimeout(() => location.reload(), 1000); // Refresh to reflect changes
  }
});
