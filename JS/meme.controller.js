'use strict'


let filterBy = { keyword: '' }
let keywordsToDisplay = []
let currentMeme = null


function onInit() {
    renderGallery()
    renderSavedMemes()
    addListeners()
}

function renderGallery() {
    const elGallery = document.querySelector('.gallery')

    const injectedHTML = document.querySelectorAll('[data-gallery]')
    injectedHTML.forEach(element => element.remove())

    console.log('hi');
    

    const imageHTML = getImgArray().map(({ id, url }) =>
        `<div class="image image${id}" data-gallery>
        <img src="${url}" id="img${id}" onclick="coverCanvasWithImg(this); onSwitchPages(this);">
        </div>`
    )
    
    elGallery.insertAdjacentHTML('beforeend', imageHTML.join(''))
}



function renderSavedMemes() {
    const elSavedMemes = document.querySelector('.saved-memes')

    const injectedHTML = document.querySelectorAll('[data-saved]')
    injectedHTML.forEach(element => element.remove())

    const memeHTML = getMemeArray().map(({ id, url, imgID }) =>
        `<div class="saved saved${id}" data-saved>
        <img src="${url}" id="meme${imgID}" onclick="setCurrentMeme(this); onSwitchPages(this)">
        </div>`
    )

    elSavedMemes.insertAdjacentHTML('beforeend', memeHTML.join(''))
}


function setCurrentMeme(elMeme) {
    currentMeme = savedMemeArray.find(meme => meme.url === elMeme.src)

    restoreMemeToEditor(currentMeme)

    currentMeme = null
}


function restoreMemeToEditor(currentMeme) {
    const elSavedMemeImg = document.querySelector(`#img${currentMeme.imgID}`)

    coverCanvasWithImg(elSavedMemeImg)

    textArray = currentMeme.lines.map(line => ({ ...line }))

    renderText()
}



function onSearchGallery(element) {

    const elInput = document.querySelector('.search-input')

    if (element.tagName === 'INPUT') filterBy.keyword = element.value
    if (element.tagName === 'DIV') elInput.value = filterBy.keyword = element.innerText

    renderGallery()
}


function onAddKeywordsToDisplay() {
    const keywordDisplay = document.querySelector('.keyword-display')
    const elInput = document.querySelector('.search-input')
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

function showModal() {
    const modalOverlay = document.querySelector('.modal-overlay')
    const modal = document.querySelector('.find-image-modal-container')

    modal.classList.remove('hidden')
    modalOverlay.classList.add('overlay-on')
}

function onAddImage() {
    const modalOverlay = document.querySelector('.modal-overlay')
    const modal = document.querySelector('.find-image-modal-container')
    const findInput = document.querySelector('.find-image-input')
    const imageContainer = document.querySelector('.image-container')

    if (image.src) addImage()

    image.src = ''
    findInput.value = ''
    imageContainer.innerHTML = ''
    modal.classList.add('hidden')
    modalOverlay.classList.remove('overlay-on')

    renderGallery()
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

function toggleOptionsMenu(elIcon) {
    const fontContainer = document.querySelector('.font-container')
    const colorContainer = document.querySelector('.color-container')
    
    if (elIcon.classList.contains('fa-text-height')) {
        if (fontContainer.classList.contains('hidden')) {
            fontContainer.classList.remove('hidden')
            colorContainer.classList.add('hidden')
        } else {
            fontContainer.classList.add('hidden')
        }
    }
    if (elIcon.classList.contains('fa-palette')) {
        if (colorContainer.classList.contains('hidden')) {
            colorContainer.classList.remove('hidden')
            fontContainer.classList.add('hidden')
        } else {
            colorContainer.classList.add('hidden')
        }
    }
}