const observer = new IntersectionObserver(entries => {
	entries.forEach(entry => {
		if (entry.isIntersecting) {
			entry.target.classList.add('show');
		}
	});
});
const hiddenEl = document.querySelectorAll('.hidden');

const toggleButton = document.querySelector('.navbar__toggle');
const theme = localStorage.getItem('theme');

const menuButton = document.querySelector('.navbar__hamburguer');
const menuEl = document.querySelector('.navbar__menu');
/* supabase */
const supabaseUrl = 'https://thusazwaleqfkqmlxrgq.supabase.co';
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXNhendhbGVxZmtxbWx4cmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NzY2NzUsImV4cCI6MjAyNjM1MjY3NX0.5MP4H5fbtsSyYiYcxfEtaxnzkbgzCPHMAOpCkpSvXgg';
const database = supabase.createClient(supabaseUrl, supabaseKey);
/* login buttons and elements */
const loginBtn = document.getElementById('loginBtn');
const navbarLoginPanel = document.querySelector('.navbar__login');
const signupBtn = document.getElementById('signupBtn');
const signinBtn = document.getElementById('signinBtn');
/* user */
const userIcon = document.getElementById('userIcon');
const navbarUserPanel = document.querySelector('.navbar__user');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
/* when page loads */
(async function () {
	if (await checkUser()) {
		userIcon.classList.add('loggedIn');
		loginBtn.classList.add('loggedIn');
		console.log('logged in!');
	} else {
		userIcon.classList.remove('loggedIn');
		loginBtn.classList.remove('loggedIn');
		console.log('not logged in!');
	}
})();

/* ------------------------ user panel ------------------------ */

userIcon.addEventListener('click', () => {
	if (navbarUserPanel.classList.contains('active')) {
		navbarUserPanel.classList.remove('active');
	} else {
		navbarUserPanel.classList.add('active');
	}
	if (menuEl.classList.contains('active')) {
		menuEl.classList.remove('active');
	}
});

/* logout user */
logoutBtn.addEventListener('click', () => {
	localStorage.removeItem('sb-thusazwaleqfkqmlxrgq-auth-token');
	location.reload();
});

/* ---------------------- end of user panel ---------------------- */

/* login panel */
loginBtn.addEventListener('click', () => {
	if (navbarLoginPanel.classList.contains('active')) {
		navbarLoginPanel.classList.remove('active');
	} else {
		navbarLoginPanel.classList.add('active');
	}
});

/* signup panel */
signupBtn.addEventListener('click', () => {
	const signupForm = {
		username: document.getElementById('signupUsername').value,
		email: document.getElementById('signupEmail').value,
		password: document.getElementById('signupPassword').value,
	};
	if (checkEmptyField(signupForm)) {
		alert('Por favor, preencha todos os campos.');
		return;
	} else if (!signupForm.email.includes('@') || !signupForm.email.includes('.com')) {
		alert('Por favor, insira um email valido.');
		return;
	} else if (signupForm.password.length < 6) {
		alert('A senha deve ter pelo menos 6 caracteres.');
		return;
	}

	signUpUser(signupForm.username, signupForm.email, signupForm.password);
});

/* signin panel */
signinBtn.addEventListener('click', () => {
	const signinForm = {
		email: document.getElementById('signinEmail').value,
		password: document.getElementById('signinPassword').value,
	};

	if (checkEmptyField(signinForm)) {
		alert('Por favor, preencha todos os campos.');
		return;
	} else if (!signinForm.email.includes('@') || !signinForm.email.includes('.com')) {
		alert('Por favor, insira um email valido.');
		return;
	} else if (signinForm.password.length < 6) {
		alert('A senha deve ter pelo menos 6 caracteres.');
		return;
	}

	signInUser(signinForm.email, signinForm.password);
});

/* check for empty fields */
function checkEmptyField(obj) {
	for (let key in obj) {
		if (obj[key] === '') {
			return true;
		}
	}
	return false;
}

/* signup user */
async function signUpUser(username, email, password) {
	const { data, error } = await database.auth.signUp({
		email: email,
		password: password,
		options: {
			data: {
				username: username,
				is_admin: false,
			},
		},
	});

	if (error) {
		switch (error.message) {
			case 'Email rate limit exceeded':
				alert('Email rate excedido. Por favor, tente novamente mais tarde.');
				break;
			default:
				alert(error.message);
		}
		return;
	} else if (data){
		alert('Conta criada! Confira seu email para ativar sua conta.');
		location.reload();
	}
}

/* signin user */
async function signInUser(email, password) {
	const { data, error } = await database.auth.signInWithPassword({
		email: email,
		password: password,
	});

	if (error) {
		switch (error.message) {
			case 'Email not confirmed':
				alert('Por favor, confirme seu email.');
				break;
			default:
				alert(error.message);
		}
		return;
	}
	location.reload();
}

/* check if user is logged */
async function checkUser() {
	const { data, error } = await database.auth.getUser();
	if (data.user !== null) {
		userName.innerHTML = 'Bem vindo ' + data.user.user_metadata.username + '!';
		if (data.user.user_metadata.is_admin === true) {
			menuEl.innerHTML += '<li><a href="/admin/admin.html">Admin</a></li>';
		}

		return true;
	} else {
		localStorage.removeItem('sb-thusazwaleqfkqmlxrgq-auth-token');
		return false;
	}
}

/* Menu */
menuButton.addEventListener('click', () => {
	if (menuEl.classList.contains('active')) {
		menuEl.classList.remove('active');
	} else {
		menuEl.classList.add('active');
	}
	if (navbarUserPanel.classList.contains('active')) {
		navbarUserPanel.classList.remove('active');
	}
});

theme && document.body.classList.add(theme);

toggleButton.addEventListener('click', () => {
	document.body.classList.toggle('dark-mode');
	if (document.body.classList.contains('dark-mode')) {
		localStorage.setItem('theme', 'dark-mode');
	} else {
		localStorage.removeItem('theme');
	}
});

hiddenEl.forEach(el => observer.observe(el));
