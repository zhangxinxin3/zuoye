var xhr = new XMLHttpRequest();
xhr.onload = function(e) {
    render(JSON.parse(e.target.responseText));
}
xhr.open('get', '/list');
xhr.send();

var mosks = document.querySelector('.mosk>div');

function render(data) {
    mosks.innerHTML += data.data.map(function(item) {
        return `<dl>
                    <dd>
                        <h3>${item.h3}</h3>
                        <h6>${item.h6}</h6>
                        <p>${item.time}</p>
                    </dd>
                    <dt>
                        <img src="${item.img}" alt="">
                    </dt>
                </dl>`;
    }).join('');
}