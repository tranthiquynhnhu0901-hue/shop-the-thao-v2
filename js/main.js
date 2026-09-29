function money(v){
    return new Intl.NumberFormat(
        'vi-VN',
        {
            style:'currency',
            currency:'VND'
        }
    ).format(v);
}

function getCart(){
    return JSON.parse(
        localStorage.getItem('sporthub_cart') || '[]'
    );
}

function saveCart(cart){
    localStorage.setItem(
        'sporthub_cart',
        JSON.stringify(cart)
    );

    updateCartCount();
}

function addToCart(id,size='M',qty=1){

    const p =
        products.find(
            x => x.id === id
        );

    if(!p){
        return;
    }

    const cart =
        getCart();

    const ex =
        cart.find(
            x =>
                x.id === id &&
                x.size === size
        );

    if(ex){

        ex.quantity += qty;

    } else {

        cart.push({
            id:p.id,
            name:p.name,
            image:p.image,
            price:p.price,
            size,
            quantity:qty
        });

    }

    saveCart(cart);

    toast(
        'Đã thêm sản phẩm vào giỏ hàng'
    );
}

function updateCartCount(){

    const n =
        getCart().reduce(
            (s,x) =>
                s + x.quantity,
            0
        );

    document
        .querySelectorAll('.cart-count')
        .forEach(
            x =>
                x.textContent = n
        );
}

function toast(text){

    document
        .querySelector('.toast')
        ?.remove();

    const el =
        document.createElement('div');

    el.className =
        'toast';

    el.textContent =
        text;

    document.body.appendChild(
        el
    );

    requestAnimationFrame(
        () =>
            el.classList.add('show')
    );

    setTimeout(
        () => {

            el.classList.remove(
                'show'
            );

            setTimeout(
                () => el.remove(),
                300
            );

        },
        2100
    );
}

updateCartCount();