'use strict'


function loadImages() {

    const defaultImageArray = [{id: 1, url: 'IMG/1.jpg', keyword: 'funny'}, {id: 2, url: 'IMG/2.jpg', keyword: 'cute'}, {id: 3, url: 'IMG/3.jpg', keyword: 'cool'}, {id: 4, url: 'IMG/4.jpg', keyword: 'cute'}, {id: 5, url: 'IMG/5.jpg', keyword: 'cute'}, {id: 6, url: 'IMG/6.jpg', keyword: 'funny'}]

    if (loadFromStorage('imageArray') === undefined ||
        loadFromStorage('imageArray').length === 0)
        saveToStorage('imageArray', defaultImageArray)

    const imageArray = loadFromStorage('imageArray')

    return imageArray
}

function loadMemes() {

    const savedMemeArray = []

    if (loadFromStorage('memeArray') === undefined ||
        loadFromStorage('memeArray').length === 0)
        saveToStorage('memeArray', savedMemeArray)

    const memeArray = loadFromStorage('memeArray')

    return memeArray
}

const gImages = loadImages()
const gMemes = loadMemes()


function getImgArray() {

    let imageArray = gImages    

    imageArray = imageArray.filter(image => image.keyword.includes(filterBy.keyword))

    return imageArray
}

function getMemeArray() {

    let memeArray = gMemes

    return memeArray
}


function addImage(url = image.src) {
    const imageArray = gImages
    const imageID = imageArray.length + 1
    
    imageArray.unshift({
        id: imageID,
        url: url,
        keyword: ''
    })

    saveToStorage('imageArray', imageArray)
}

function saveMeme() {
    let memeArray = getMemeArray()
    let memeToSave = 
        {
            imgID: currImage.id.replace('img', ''),
            url: convertCanvasToImage(),
            lines: [...textArray]
        }  

    const memeID = memeArray.findIndex(meme => meme.url === memeToSave.url)

    if (memeID !== -1) {
        memeArray[memeID] = {...memeArray[memeID], ...memeToSave}
    } else {
        memeArray.push(memeToSave)
    }

    saveToStorage('memeArray', memeArray)
}