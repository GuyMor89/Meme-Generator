'use strict'


const savedMemeArray = []

function loadImages() {

    const defaultImageArray = [{id: 1, url: 'IMG/1.jpg', keyword: 'funny'}, {id: 2, url: 'IMG/2.jpg', keyword: 'cute'}, {id: 3, url: 'IMG/3.jpg', keyword: 'cool'}, {id: 4, url: 'IMG/4.jpg', keyword: 'cute'}, {id: 5, url: 'IMG/5.jpg', keyword: 'cute'}, {id: 6, url: 'IMG/6.jpg', keyword: 'funny'}]

    if (loadFromStorage('imageArray') === undefined ||
        loadFromStorage('imageArray').length === 0)
        saveToStorage('imageArray', defaultImageArray)

    const bookArray = loadFromStorage('imageArray')

    return bookArray
}

const gImages = loadImages()


function getImgArray() {

    let imageArray = gImages
    console.log(imageArray[0]);
    

    imageArray = imageArray.filter(image => image.keyword.includes(filterBy.keyword))

    return imageArray
}

function getMemeArray() {
    return savedMemeArray
}


function addImage() {
    var imageArray = gImages
    var imageID = imageArray[imageArray.length - 1].id + 1

    imageArray.unshift({
        id: imageID,
        url: image.src,
        keyword: ''
    })

    saveToStorage('imageArray', imageArray)
}