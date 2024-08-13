'use strict'


let filterBy = { keyword: '' }
var pageBy = { page: 0, amount: 6, total: 0 }
var memePageBy = { page: 0, amount: 6, total: 0 }

let keywordsToDisplay = [{ keyword: 'funny', size: 16 }, { keyword: 'cool', size: 20 }, { keyword: 'cute', size: 25 }, { keyword: 'amazing', size: 16 }, { keyword: 'hilarious', size: 19 }]
let currentMeme = null


function onInit() {
    renderGallery()
    renderSavedMemes()
    onAddKeywordsToDisplay()

    addListeners()

    renderPageNumbers()
    renderMemePageNumbers()
}

function renderGallery() {
    const elGallery = document.querySelector('.gallery')

    const injectedHTML = document.querySelectorAll('[data-gallery]')
    injectedHTML.forEach(element => element.remove())

    const imageHTML = getImgArray().map(({ id, url }) =>
        `<div class="image image${id}" data-gallery>
        <img src="${url}" id="img${id}" onclick="onOpenImageMenu(event, this)">
        <div class="image-button-container-overlay hidden" id="overlay${id}">
        <div class="image-button-container">
        <div class="use-button" id="use${id}" onclick="coverCanvasWithImg(this); onSwitchTabs(this); onOpenImageMenu(event, this)">
        <i class="fa-solid fa-check" ></i>
        </div>
        <div class="delete-button" id="btn${id}" onclick="onDeleteImage(this)">
        <i class="fa-solid fa-trash-can"></i>
        </div>
        </div>
        </div>
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
        <img src="${url}" id="meme${imgID}" class="saved${id}" onclick="onOpenMemeMenu(event, this)">
        <div class="image-button-container-overlay hidden" id="overlay-meme${id}">
        <div class="image-button-container">
        <div class="btn${id} use-button" id="use-meme${id}" onclick="onSetCurrentMeme(this); onSwitchTabs(this); onOpenMemeMenu(event, this)">
        <i class="fa-solid fa-check" ></i>
        </div>
        <div class="delete-button" id="btn-meme${id}" onclick="onDeleteMeme(this)">
        <i class="fa-solid fa-trash-can"></i>
        </div>
        </div>
        </div>
        </div>`
    )

    elSavedMemes.insertAdjacentHTML('beforeend', memeHTML.join(''))
}


function onSetCurrentMeme(elMemeBtn) {
    const elMemeID = parseInt(elMemeBtn.id.replace(/\D/g, ''), 10)

    currentMeme = getMemeArray().find(meme => meme.id === elMemeID)

    const elSavedMemeImg = document.querySelector(`#img${currentMeme.imgID}`)

    coverCanvasWithImg(elSavedMemeImg)

    textArray = currentMeme.lines.map(line => ({ ...line }))

    renderText()

    currentMeme = null
}




function onSearchGallery(element) {

    const elInput = document.querySelector('.search-input')

    if (element.tagName === 'INPUT') filterBy.keyword = element.value
    if (element.tagName === 'DIV') elInput.value = filterBy.keyword = element.innerText

    renderGallery()
    renderPageNumbers()
}


function onAddKeywordsToDisplay() {
    const keywordDisplay = document.querySelector('.keyword-display')
    const elInput = document.querySelector('.search-input')
    const keyword = elInput.value

    if (keyword) keywordsToDisplay.push({ keyword, size: 16 })

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

function onCloseModal() {
    const modalOverlay = document.querySelector('.modal-overlay')
    const modal = document.querySelector('.find-image-modal-container')

    modal.classList.add('hidden')
    modalOverlay.classList.remove('overlay-on')
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


function onDownloadImage() {
    if (!image.src) return

    fetch(image.src)
        .then(response => response.blob())
        .then(blob => {
            // Create a new object URL for the blob object
            const url = window.URL.createObjectURL(blob)

            // Create a temporary <a> element with a download attribute
            const a = document.createElement('a')
            a.href = url
            a.download = 'image.jpg' // Name of the saved file
            document.body.appendChild(a)
            a.click()

            // Clean up by revoking the object URL and removing the <a> element
            a.remove()
            window.URL.revokeObjectURL(url)
        })
        .catch(error => console.error('Error downloading the image:', error))
}



function onUploadImage(event) {
    loadImageFromInput(event, addImage)

    setTimeout(() => {
        renderGallery()
        renderPageNumbers()
    }, 500)
}

function loadImageFromInput(ev, addImage) {
    const reader = new FileReader()
    reader.onload = function (event) {
        let elImg = new Image()
        elImg.crossOrigin = "anonymous"
        elImg.src = event.target.result
        elImg.onload = () => addImage(elImg.src)
    }
    reader.readAsDataURL(ev.target.files[0])
}


function onDeleteImage(elDeleteBtn) {

    const elImg = document.querySelector(`.image${parseInt(elDeleteBtn.id.replace(/\D/g, ''), 10)} img`)

    const ImgIDToDelete = getImgArray().findIndex(img => img.id === parseInt(elImg.id.replace(/\D/g, ''), 10))

    deleteImage(ImgIDToDelete)

    setTimeout(() => {
        getImgArray()
        pageBy.page = Math.ceil(pageBy.total / pageBy.amount) - 1
        renderGallery()
        renderPageNumbers()
    }, 500);
}

function onDeleteMeme(elDeleteBtn) {

    const elMemeID = parseInt(elDeleteBtn.id.replace(/\D/g, ''), 10)

    const memeIDToDelete = getMemeArray().findIndex(meme => meme.id === elMemeID)

    deleteMeme(memeIDToDelete)

    renderSavedMemes()
    renderMemePageNumbers()
}




function onSwitchTabs(element) {
    
    const galleryContainer = document.querySelector('.gallery-container')
    const editorContainer = document.querySelector('.editor-container')
    const savedContainer = document.querySelector('.saved-memes-container')
    const taglineContainer = document.querySelector('.tagline')

    if (element.id === 'gallery' || element.innerText.includes('FreshMeme')) {
        taglineContainer.innerText = 'Choose a Meme Template'
        galleryContainer.classList.remove('disappear')
        editorContainer.classList.add('disappear')
        savedContainer.classList.add('disappear')
    }
    if (element.id === 'editor' || element.classList.contains('use-button') || element.classList.contains('saved')) {
        taglineContainer.innerText = 'Edit, Download & Save your Meme'
        editorContainer.classList.remove('disappear')
        galleryContainer.classList.add('disappear')
        savedContainer.classList.add('disappear')
    }
    if (element.id === 'saved') {
        taglineContainer.innerText = 'Choose a Meme to Edit'
        savedContainer.classList.remove('disappear')
        editorContainer.classList.add('disappear')
        galleryContainer.classList.add('disappear')
        renderMemePageNumbers()
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


document.addEventListener('click', function (event) {
    // Retrieve all overlays
    const overlays = document.querySelectorAll('.image-button-container-overlay:not(.hidden)')

    // Check if the click target is part of any overlay
    let isClickInsideOverlay = Array.from(overlays).some(overlay => {
        return overlay.contains(event.target)
    })

    // If the click is not inside any open overlay, hide all overlays
    if (!isClickInsideOverlay) {
        overlays.forEach(overlay => overlay.classList.add('hidden'))
    }
});



function onOpenImageMenu(event, elImg) {
    event.stopPropagation()

    const overlayID = parseInt(elImg.id.replace(/\D/g, ''), 10)
    const overlay = `overlay${overlayID}`
    const imageButtonMenu = document.getElementById(overlay)
    const allOverlays = document.querySelectorAll('.image-button-container-overlay')

    allOverlays.forEach(overlay => {
        if (overlay.id !== overlay)
            overlay.classList.add('hidden')
    })

    imageButtonMenu.classList.remove('hidden')
}


function onOpenMemeMenu(event, elMeme) {
    event.stopPropagation()

    const overlayID = parseInt(elMeme.classList[0].replace(/\D/g, ''), 10)
    const overlay = `overlay-meme${overlayID}`
    const memeButtonMenu = document.getElementById(overlay)
    const allOverlays = document.querySelectorAll('.image-button-container-overlay')

    allOverlays.forEach(overlay => {
        if (overlay.id !== overlay)
            overlay.classList.add('hidden')
    })

    memeButtonMenu.classList.remove('hidden')
}



function onChangePage(direction, value) {
    const pageAmount = Math.ceil(pageBy.total / pageBy.amount) - 1

    if (direction === 'up') {
        if (pageBy.page === pageAmount) {
            pageBy.page = 0
        } else {
            pageBy.page += +value
        }
    }
    if (direction === 'down') {
        if (pageBy.page === 0) {
            pageBy.page = pageAmount
        } else {
            pageBy.page += +value
        }
    }
    renderGallery()
    renderPageNumbers()
}

function renderPageNumbers() {
    const previousPage = document.querySelector('.pagePrev')
    const currentPage = document.querySelector('.pageCurr')
    const nextPage = document.querySelector('.pageNext')

    const pageAmount = Math.ceil(pageBy.total / pageBy.amount) - 1

    currentPage.innerText = pageBy.page

    if (+currentPage.innerText === 0) {
        previousPage.innerText = pageAmount
    } else {
        previousPage.innerText = currentPage.innerText - 1
    }
    if (+currentPage.innerText === pageAmount) {
        nextPage.innerText = 0
    } else {
        nextPage.innerText = +currentPage.innerText + 1
    }
}

function onChangePageNums(elBtn) {
    pageBy.page = +elBtn.innerText

    renderGallery()
    renderPageNumbers()
}



function onChangeMemePage(direction, value) {
    const pageAmount = Math.ceil(memePageBy.total / memePageBy.amount) - 1

    if (direction === 'up') {
        if (memePageBy.page === pageAmount) {
            memePageBy.page = 0
        } else {
            memePageBy.page += +value
        }
    }
    if (direction === 'down') {
        if (memePageBy.page === 0) {
            memePageBy.page = pageAmount
        } else {
            memePageBy.page += +value
        }
    }
    renderSavedMemes()
    renderMemePageNumbers()
}

function renderMemePageNumbers() {
    const previousPage = document.querySelector('.pageMemePrev')
    const currentPage = document.querySelector('.pageMemeCurr')
    const nextPage = document.querySelector('.pageMemeNext')

    const pageAmount = Math.ceil(memePageBy.total / memePageBy.amount) - 1

    currentPage.innerText = memePageBy.page

    if (+currentPage.innerText === 0) {
        previousPage.innerText = pageAmount
    } else {
        previousPage.innerText = currentPage.innerText - 1
    }
    if (+currentPage.innerText === pageAmount) {
        nextPage.innerText = 0
    } else {
        nextPage.innerText = +currentPage.innerText + 1
    }
}

function onChangeMemePageNums(elBtn) {
    memePageBy.page = +elBtn.innerText

    renderSavedMemes()
    renderMemePageNumbers()
}



document.querySelectorAll('.emoji-container').forEach(container => {
    // This regex matches most common emojis
    const emojiRegex = /[\u231A-\u231B\u2328\u2388\u23CF-\u23D3\u23E9-\u23F3\u23F8-\u23FA\u24C2\u25AA-\u25AB\u25B6\u25C0\u25FB-\u25FE\u2600-\u2605\u2607-\u2612\u2614-\u2685\u26A0-\u26FA\u2701-\u2764\u2795-\u2797\u27A1\u27B0\u27BF\u2934-\u2935\u2B05-\u2B07\u2B1B-\u2B1C\u2B50\u2B55\u3030\u303D\u3297\u3299]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDE4F]|\uD83D[\uDE80-\uDEFF]|\uD83E[\uDD00-\uDDFF]/g;
    // Replace each emoji in the container's text with a span-wrapped emoji
    container.innerHTML = container.innerHTML.replace(emojiRegex, '<span class="emoji" onclick="onUseEmoji(this)">$&</span>');
})

function onUseEmoji(elEmoji) {
    const textInput = document.getElementById('text')

    const savedText = textInput.value

    textInput.value = savedText + elEmoji.innerText

    if (textToEdit) onAddText()
}
