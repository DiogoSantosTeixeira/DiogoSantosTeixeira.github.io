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




menuButton.addEventListener('click', () => {
	if (menuEl.classList.contains('active')) {
		menuEl.classList.remove('active');
	} else {
		menuEl.classList.add('active');
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
