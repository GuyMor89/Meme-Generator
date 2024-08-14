'use strict'

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

function onChangePageNums(elBtn) {
    pageBy.page = +elBtn.innerText

    renderGallery()
    renderPageNumbers()
}


function onChangeMemePageNums(elBtn) {
    memePageBy.page = +elBtn.innerText

    renderSavedMemes()
    renderMemePageNumbers()
}
