document.addEventListener('DOMContentLoaded', function() {
	const content = document.getElementById('profile-content');
	function runProfileLogic() {
		if (!(window.puter && puter.auth && puter.auth.getUser && puter.auth.login && puter.auth.updateUser)) {
			setTimeout(runProfileLogic, 100);
			return;
		}
		(async function() {
			let user = null;
			try {
				user = await puter.auth.getUser();
			} catch (err) {
				content.innerHTML = `<div style='margin:80px auto;text-align:center;'><h2>Error checking login status.<br>${err.message}</h2></div>`;
				return;
			}
			if (!user) {
				content.innerHTML = `<div style='margin:80px auto;text-align:center;'><h2>Please log in to view your profile.</h2><button id='login-btn' style='padding:12px 32px;font-size:1.2rem;background:#3f00ff;color:#fff;border:none;border-radius:8px;cursor:pointer;'>Log In</button></div>`;
				document.getElementById('login-btn').onclick = function() {
					puter.auth.login();
				};
			} else {
				content.innerHTML = `
					<div id='edit' style='background:pink;padding:20px;border-radius:20px;'>
						<label for='user-name-input'>Name:</label>
						<input type='text' id='user-name-input' value='${user.name || ''}'><br>
						<label for='avatar-url'>Avatar URL:</label>
						<input type='text' id='avatar-url' value='${user.avatar || ''}'><br>
						<label for='avatar-file'>Or upload avatar:</label>
						<input type='file' id='avatar-file'><br>
						<button id='save-btn' style='margin-top:12px;'>Save</button>
						<button id='logout-btn' style='margin-left:12px;'>Log Out</button>
					</div>
					<div style='margin-top:32px;text-align:center;'>
						<img id='user-avatar' src='${user.avatar || '/images/user.png'}' alt='User Avatar' style='height:100px;width:100px;border-radius:50%;'><br>
						<span id='user-name' style='font-size:1.5rem;color:#a3f7ff;'>${user.name || ''}</span>
					</div>
				`;
				document.getElementById('save-btn').onclick = async function() {
					const name = document.getElementById('user-name-input').value;
					const avatarUrl = document.getElementById('avatar-url').value;
					const avatarFile = document.getElementById('avatar-file').files[0];
					let avatar = avatarUrl;
					if (avatarFile) {
						const reader = new FileReader();
						reader.onloadend = async function() {
							avatar = reader.result;
							await puter.auth.updateUser({ name, avatar });
							document.getElementById('user-avatar').src = avatar || '/images/user.png';
							document.getElementById('user-name').innerText = name;
						};
						reader.readAsDataURL(avatarFile);
					} else {
						await puter.auth.updateUser({ name, avatar });
						document.getElementById('user-avatar').src = avatar || '/images/user.png';
						document.getElementById('user-name').innerText = name;
					}
				};
				document.getElementById('logout-btn').onclick = function() {
					puter.auth.logout();
					location.reload();
				};
			}
		})();
	}
	runProfileLogic();
});
