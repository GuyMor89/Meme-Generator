'use strict'


function onInit() {
    renderGalley()
    addListeners()
}

function renderGalley() {
    const elGallery = document.querySelector('.gallery')

    const imageHTML = getImgArray().map(({id, url}) => 
        `<div class="image image${id}">
        <img src="${url}" onclick="coverCanvasWithImg(this)">
        </div>`
    )

    elGallery.insertAdjacentHTML('beforeend', imageHTML.join(''))
        
}