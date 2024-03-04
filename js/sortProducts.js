
document.addEventListener('DOMContentLoaded', (event) => {
    const selectElement = document.getElementById('filter-select');

    selectElement.addEventListener('change', (event) => {
        let products = Array.from(document.getElementsByClassName('product'));
        let sortedProducts;

        if (event.target.value === 'highest') {
            sortedProducts = products.sort((a, b) => {
                return countStars(b) - countStars(a);
            });
        } else {
            sortedProducts = products.sort((a, b) => {
                return countStars(a) - countStars(b);
            });
        }

        const productReviewsSection = document.getElementById('product-reviews');
        productReviewsSection.innerHTML = '';
        sortedProducts.forEach(product => {
            productReviewsSection.appendChild(product);
        });
    });

    function countStars(product) {
        return product.getElementsByClassName('product-rating')[0].innerText.split('⭐').length - 1;
    }
});
