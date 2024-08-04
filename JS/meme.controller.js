'use strict'


let filterBy = { keyword: '' }
let keywordsToDisplay = []

function onInit() {
    renderGalley()
    renderSavedMemes()
    addListeners()
}

function renderGalley() {
    const elGallery = document.querySelector('.gallery')

    const injectedHTML = document.querySelectorAll('[data-gallery]')
    injectedHTML.forEach(element => element.remove())

    const imageHTML = getImgArray().map(({ id, url }) =>
        `<div class="image image${id}" data-gallery>
        <img src="${url}" onclick="coverCanvasWithImg(this); onSwitchPages(this);">
        </div>`
    )

    elGallery.insertAdjacentHTML('beforeend', imageHTML.join(''))
}



function renderSavedMemes() {
    const elSavedMemes = document.querySelector('.saved-memes')

    const injectedHTML = document.querySelectorAll('[data-saved]')
    injectedHTML.forEach(element => element.remove())

    const memeHTML = getMemeArray().map(({ id, url }) =>
        `<div class="image image${id}" data-saved>
        <img src="${url}">
        </div>`
    )

    elSavedMemes.insertAdjacentHTML('beforeend', memeHTML.join(''))
}



function onSearchGallery(element) {

    const elInput = document.querySelector('.gallery-search')

    if (element.tagName === 'INPUT') filterBy.keyword = element.value
    if (element.tagName === 'DIV') elInput.value = filterBy.keyword = element.innerText

    renderGalley()
}


function onAddKeywordsToDisplay(elInput) {
    const keywordDisplay = document.querySelector('.keyword-display')
    const keyword = elInput.value

    keywordsToDisplay.push({ keyword, size: 16 })

    const keywordHTML = keywordsToDisplay.map(({ keyword }) =>
        `<div class="keyword ${keyword}" onclick="changeKeywordSize(this); onSearchGallery(this);">${keyword}</div>`
    )

    keywordDisplay.innerHTML = keywordHTML.join('')

    const elKeywords = document.querySelectorAll('.keyword')

    elKeywords.forEach(elKeyword => elKeyword.style.fontSize = `${keywordsToDisplay.find(({ keyword }) => keyword === elKeyword.innerText).size}px`)
}


function changeKeywordSize(elKeyword) {

    const keywordID = keywordsToDisplay.findIndex(({ keyword }) =>
        keyword === elKeyword.innerText)

    keywordsToDisplay[keywordID].size++

    elKeyword.style.fontSize = `${keywordsToDisplay[keywordID].size}px`
}






function onSwitchPages(element) {
    const galleryContainer = document.querySelector('.gallery-container')
    const editorContainer = document.querySelector('.editor-container')
    const savedContainer = document.querySelector('.saved-memes-container')

    if (element.innerText === 'Gallery' || element.innerText === 'MemeMaster') {
        galleryContainer.classList.remove('disappear')
        editorContainer.classList.add('disappear')
        savedContainer.classList.add('disappear')
    }
    if (element.innerText === 'Editor' || element.nodeName === 'IMG') {
        editorContainer.classList.remove('disappear')
        galleryContainer.classList.add('disappear')
        savedContainer.classList.add('disappear')
    }
    if (element.innerText === 'Saved') {
        savedContainer.classList.remove('disappear')
        editorContainer.classList.add('disappear')
        galleryContainer.classList.add('disappear')
    }
}