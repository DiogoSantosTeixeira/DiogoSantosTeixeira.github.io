/* container for articles generated from supabase */
const reviewsContainer = document.querySelector('.reviews-articles__wrapper-content');
/* supabase */
const supabaseUrl = 'https://thusazwaleqfkqmlxrgq.supabase.co';
const supabaseKey =
	'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRodXNhendhbGVxZmtxbWx4cmdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTA3NzY2NzUsImV4cCI6MjAyNjM1MjY3NX0.5MP4H5fbtsSyYiYcxfEtaxnzkbgzCPHMAOpCkpSvXgg';
const database = supabase.createClient(supabaseUrl, supabaseKey);
/* var to store articles */
let articleElements;

/* get articles */
getArticles();

/* get articles from supabase */

async function getArticles() {
	const { data, error } = await database.from('articles').select('*').order('id', { ascending: false });
	if (error) {
		console.log(error);
	} else {
		console.log(data);
		generateArticles(data);
	}
}

/* get article images */

async function getImage(image) {
	const { data, error } = await database.storage.from('articles').getPublicUrl(`images/${image}`);
	if (error) {
		console.log(error);
	} else {
		console.log(data.publicUrl);
		return data.publicUrl;
	}
}

/* generate articles */

async function generateArticles(data) {
	reviewsContainer.innerHTML = '';

	for (let i = 0; i < Object.keys(data).length; i++) {
		const article = document.createElement('article');
		article.classList.add('article');
		article.id = data[i].id;
		let image = await getImage(data[i].main_image);
		let date = data[i].created_at.split('T')[0]
		article.innerHTML = `
		<div class="image_wrapper">
		<img src="${image}" alt=""/>
		</div>
		<h3>${data[i].header}</h3>
		<span class="date">${date}</span>
		`;


		/* data[i].content.split('\n').forEach(string => {
			string = string.trim();
            string = string.charAt(0).toUpperCase() + string.slice(1);
            if (string === '') return;
            switch (string[string.length-1]) {
                case '.':
                    break;
                case '?':
                    break;
                case '!':
					break;
				case ':':
					break;
                default:
                    string += '.'
            }

			article.innerHTML += `<p>${string}</p>`;
		});*/
		reviewsContainer.appendChild(article);
	}
	articleElements = document.querySelectorAll('.article');
	articleElements.forEach(article => {
		article.addEventListener('click', () => {
			localStorage.setItem('articleId', article.id);
			window.location.href = 'article.html';
		});
	});
}
