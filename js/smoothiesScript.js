document.addEventListener('DOMContentLoaded', init);

function insertProducts(items) {

    fetch("product.html")
        .then(data => {
            return data.text()
        })
        .then(html => {

            let container = document.querySelector("#products");
            container.innerHTML = html;

            let content = document.querySelector('#products-template').content;
            let df = new DocumentFragment();

            items.forEach((item) => {

                let template = content.cloneNode(true);
                let element = template.querySelector(".product-card");

                let image = element.querySelector("img");
                image.src = item.image;
                let price = element.querySelector(".product-price");
                price.textContent = item.price;
                let name = element.querySelector(".product-description");
                name.textContent = item.name;


                //container.appendChild(element);
                df.appendChild(element);
            });

            container.appendChild(df);
        });
}
function loadProducts() {
    fetch("JSON/smoothies.json")
        .then(data => {
            return data.json()
        })
        .then(items => {
            insertProducts(items);

        })
}
function init() {
    loadProducts();
}
