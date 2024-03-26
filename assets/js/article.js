let idValue = localStorage.getItem('articleId');
const articlePage = document.querySelector('.articlepage');

const articleRow = database
	.from('articles')
	.select('*')
	.eq('id', idValue)
	.single()
	.then(result => {
		// result.data contains the row you selected
		console.log(result.data);
		generatePage(result.data);
	})
	.catch(error => {
		console.error(error);
	});

async function generatePage(data) {
	document.title = `Luvv7 - ${data.header}`;
	articlePage.innerHTML = `
    <div class="container">
        <div class="articlepage__wrapper">
            <div class="articlepage__wrapper-image">
                <img src="${await getImage(data.banner_image)}" alt=""/>
            </div>
            <div class="articlepage__wrapper-title">
                <h1>${data.header}</h1>
                <p>Postado por <span class="owner">${data.owner_id}</span> em <span class="date">${data.date}</span></p>
            </div>
            <div class="articlepage__wrapper-content">
            </div>
        </div>
    </div>`;
	let content = document.querySelector('.articlepage__wrapper-content');
	data.content.split('\n').forEach(string => {
		string = string.trim();
		string = string.charAt(0).toUpperCase() + string.slice(1);
		if (string === '') return;
		switch (string[string.length - 1]) {
			case '.':
				break;
			case '?':
				break;
			case '!':
				break;
			case ':':
				break;
			default:
				string += '.';
		}

		content.innerHTML += `<p>${string}</p>`;
	});
}

async function getImage(image) {
	const { data, error } = await database.storage.from('articles').getPublicUrl(`images/${image}`);
	if (error) {
		console.log(error);
	} else {
		console.log(data.publicUrl);
		return data.publicUrl;
	}
}
