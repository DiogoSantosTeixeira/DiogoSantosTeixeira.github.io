/* article generator */
const mainImageEl = document.getElementById('mainImageEl');
const bannerImageEl = document.getElementById('bannerImageEl');
const tittleEL = document.getElementById('tittleEl');
const contentEL = document.getElementById('contentEl');
const articleContent = document.querySelector('.articles__content');
const alertEl = document.getElementById('alertEl');
const articlePage = document.querySelector('.articlepage');
const dateEl = document.getElementById('dateEl');

async function generateArticle() {
	const mainImage = mainImageEl.files[0];
	const bannerImage = bannerImageEl.files[0];
	if (tittleEL.value === '' || contentEL.value === '' || dateEl.value === '') {
		alert('Por favor, preencha todos os campos.');
		return;
	} else if (!mainImage || !bannerImage) {
		alert('Por favor, selecione ambas imagens.');
		return;
	}
	const { data, error } = await database.auth.getSession();
	const ownerId = data.session.user.user_metadata.username;
	articlePage.innerHTML = `
    <div class="container">
        <div class="articlepage__wrapper">
            <div class="articlepage__wrapper-image">
                <img src="https://dummyimage.com/900x180/474747/ff00ff" alt=""/>
            </div>
            <div class="articlepage__wrapper-title">
                <h1>${tittleEL.value}</h1>
                <p>Postado por <span class="owner">${ownerId}</span> em <span class="date">${dateEl.value}</span></p>
            </div>
            <div class="articlepage__wrapper-content">
            </div>
        </div>
    </div>`;
	let content = document.querySelector('.articlepage__wrapper-content');
	contentEL.value.split('\n').forEach(string => {
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

async function saveArticle() {
	const mainImage = mainImageEl.files[0];
	const bannerImage = bannerImageEl.files[0];
	if (tittleEL.value === '' || contentEL.value === '' || dateEl.value === '') {
		alert('Por favor, preencha todos os campos.');
		return;
	} else if (!mainImage || !bannerImage) {
		alert('Por favor, selecione ambas imagens.');
		return;
	}
	const { data, error } = await database.auth.getSession();
	const ownerId = data.session.user.user_metadata.username;
	if (error) {
		alert(error);
		return;
	} else {
		const { data: uploadData, error: uploadError } = await database.storage.from('articles').upload(`images/${mainImage.name}`, mainImage);

		if (uploadError) {
			alert('Erro ao fazer upload da imagem principal.');
			alert(uploadError.message);
			return;
		} else {
			const { data: uploadData, error: uploadError } = await database.storage.from('articles').upload(`images/${bannerImage.name}`, bannerImage);
			if (uploadError) {
				alert('Erro ao fazer upload da imagem banner.');
				alert(uploadError.message);
				return;
            } else {
                const { data, error } = await database.from('articles').insert([
                    {
                        header: formatTittle(tittleEL.value),
                        content: contentEL.value,
                        owner_id: ownerId,
                        main_image: mainImage.name,
                        banner_image: bannerImage.name,
                        date: dateEl.value,
                    },
                ]);
                if (error) {
                    alert(error.message);
                    return;
                }
                alert('Artigo salvo com sucesso!');
            }
		}
	}
}
function formatTittle(string) {
	return string
		.toLowerCase()
		.split(' ')
		.map(word => word.charAt(0).toUpperCase() + word.slice(1))
		.join(' ');
}