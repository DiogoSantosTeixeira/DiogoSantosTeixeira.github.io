/* cards */
const prevButton = document.querySelector('.prev_button');
const nextButton = document.querySelector('.next_button');
const card = document.querySelector('.reviews__card');
const cardsContainer = document.querySelector('.reviews__cards');

nextButton.addEventListener('click', () => {
	const cardWidth = card.clientWidth + 4;
	cardsContainer.scrollLeft += cardWidth;
});

prevButton.addEventListener('click', () => {
	const cardWidth = card.clientWidth + 4;
	cardsContainer.scrollLeft -= cardWidth;
	console.log(cardWidth);
});