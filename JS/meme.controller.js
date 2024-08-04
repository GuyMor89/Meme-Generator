'use strict'


let filterBy = { keyword: '' }
let keywordsToDisplay = []

function onInit() {
    renderGalley()
    addListeners()
}

function renderGalley() {
    const elGallery = document.querySelector('.gallery')

    const injectedHTML = document.querySelectorAll('[data-idx]')
    injectedHTML.forEach(element => element.remove())

    const imageHTML = getImgArray().map(({ id, url }) =>
        `<div class="image image${id}" data-idx>
        <img src="${url}" onclick="coverCanvasWithImg(this); switchPages(this);">
        </div>`
    )

    elGallery.insertAdjacentHTML('beforeend', imageHTML.join(''))
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






function switchPages(element) {
    const galleryContainer = document.querySelector('.gallery-container')
    const editorContainer = document.querySelector('.editor-container')
    // const savedContainer = document.querySelector('.saved-container')

    if (element.innerText === 'Gallery') {
        galleryContainer.classList.remove('disappear')
        editorContainer.classList.add('disappear')
    }
    if (element.innerText === 'Editor') {
        galleryContainer.classList.add('disappear')
        editorContainer.classList.remove('disappear')
    }
    if (element.nodeName === 'IMG') {
        galleryContainer.classList.add('disappear')
        editorContainer.classList.remove('disappear')
    }

}