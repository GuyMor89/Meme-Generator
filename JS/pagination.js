'use strict'

function onChangePage(direction, value, elBtn) {

    const { pageName, pageObject, pageAmount } = getPageParams(elBtn)

    if (direction === 'up') {
        pageObject.currentPage = pageObject.currentPage === pageAmount ? 0 : pageObject.currentPage + +value
    }
    if (direction === 'down') {
        pageObject.currentPage = pageObject.currentPage === 0 ? pageAmount : pageObject.currentPage + +value
    }
    renderPages(elBtn, pageName)
}

function onChangePageNums(elBtn) {

    const { pageName, pageObject } = getPageParams(elBtn)

    pageObject.currentPage = +elBtn.innerText

    renderPages(elBtn, pageName)
}

function renderPageNumbers(pageName) {

    const pageObject = pageBy.find(obj => obj.page === pageName)

    const previousPage = document.querySelector(`.${pageObject.page}PagePrev`)
    const currentPage = document.querySelector(`.${pageObject.page}PageCurr`)
    const nextPage = document.querySelector(`.${pageObject.page}PageNext`)

    const pageAmount = Math.ceil(pageObject.totalAmount / pageObject.amountPerPage) - 1

    currentPage.innerText = pageObject.currentPage

    previousPage.innerText = +currentPage.innerText === 0 ? pageAmount : currentPage.innerText - 1

    nextPage.innerText = +currentPage.innerText === pageAmount ? 0 : +currentPage.innerText + 1
}

function getPageParams(elBtn) {
    const pageName = elBtn.id.split('-')[0]

    const pageObject = pageBy.find(obj => pageName.includes(obj.page))

    const pageAmount = Math.ceil(pageObject.totalAmount / pageObject.amountPerPage) - 1

    return { pageName, pageObject, pageAmount }
}

function renderPages(elBtn, pageName) {
    if (elBtn.id.includes('gallery')) renderGallery()
    if (elBtn.id.includes('meme')) renderSavedMemes()

    renderPageNumbers(pageName)
}