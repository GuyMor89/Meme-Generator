'use strict'


function loadImages() {

    const defaultImageArray = [{id: 38, url: 'IMG/38.jpg', keyword: 'exciting'}, {id: 37, url: 'IMG/37.jpg', keyword: 'beautiful'}, {id: 36, url: 'IMG/36.jpg', keyword: 'cool'}, {id: 35, url: 'IMG/35.jpg', keyword: 'cute'}, {id: 34, url: 'IMG/34.jpg', keyword: 'funny'}, {id: 33, url: 'IMG/33.jpg', keyword: 'mysterious'}, {id: 32, url: 'IMG/32.jpg', keyword: 'adorable'}, {id: 31, url: 'IMG/31.jpg', keyword: 'scenic'}, {id: 30, url: 'IMG/30.jpg', keyword: 'beautiful'}, {id: 29, url: 'IMG/29.jpg', keyword: 'exciting'}, {id: 28, url: 'IMG/28.jpg', keyword: 'amazing'}, {id: 27, url: 'IMG/27.jpg', keyword: 'inspiring'}, {id: 26, url: 'IMG/26.jpg', keyword: 'dramatic'}, {id: 25, url: 'IMG/25.jpg', keyword: 'breathtaking'}, {id: 24, url: 'IMG/24.jpg', keyword: 'vibrant'}, {id: 23, url: 'IMG/23.jpg', keyword: 'colorful'}, {id: 22, url: 'IMG/22.jpg', keyword: 'thrilling'}, {id: 21, url: 'IMG/21.jpg', keyword: 'elegant'}, {id: 20, url: 'IMG/20.jpg', keyword: 'dramatic'}, {id: 19, url: 'IMG/19.jpg', keyword: 'inspiring'}, {id: 18, url: 'IMG/18.jpg', keyword: 'amazing'}, {id: 17, url: 'IMG/17.jpg', keyword: 'exciting'}, {id: 16, url: 'IMG/16.jpg', keyword: 'beautiful'}, {id: 15, url: 'IMG/15.jpg', keyword: 'scenic'}, {id: 14, url: 'IMG/14.jpg', keyword: 'adorable'}, {id: 13, url: 'IMG/13.jpg', keyword: 'hilarious'}, {id: 12, url: 'IMG/12.jpg', keyword: 'mysterious'}, {id: 11, url: 'IMG/11.jpg', keyword: 'cool'}, {id: 10, url: 'IMG/10.jpg', keyword: 'funny'}, {id: 9, url: 'IMG/9.jpg', keyword: 'cute'}, {id: 8, url: 'IMG/8.jpg', keyword: 'unique'}, {id: 7, url: 'IMG/7.jpg', keyword: 'quirky'}, {id: 6, url: 'IMG/6.jpg', keyword: 'funny'}, {id: 5, url: 'IMG/5.jpg', keyword: 'cute'}, {id: 4, url: 'IMG/4.jpg', keyword: 'cute'}, {id: 3, url: 'IMG/3.jpg', keyword: 'cool'}, {id: 2, url: 'IMG/2.jpg', keyword: 'cute'}, {id: 1, url: 'IMG/1.jpg', keyword: 'funny'}];

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

    pageBy.total = imageArray.length

    const pageStart = (pageBy.page * pageBy.amount)
    const pageEnd = ((pageBy.page * pageBy.amount) + pageBy.amount - 1)

    imageArray = imageArray.filter((image, idx) => idx >= pageStart && idx <= pageEnd)

    return imageArray
}

function getMemeArray() {

    let memeArray = gMemes

    memePageBy.total = memeArray.length

    const pageStart = (memePageBy.page * memePageBy.amount)
    const pageEnd = ((memePageBy.page * memePageBy.amount) + memePageBy.amount - 1)

    memeArray = memeArray.filter((image, idx) => idx >= pageStart && idx <= pageEnd)

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
    const memeArray = gMemes
    const lastMeme = memeArray[memeArray.length - 1]
    const lastId = lastMeme && lastMeme.id ? lastMeme.id : 0
    const memeID = memeArray.length + 1 > lastId ? memeArray.length + 1 : lastId + 1
    
    let memeToSave = 
        {
            id: memeID,
            imgID: currImage.id.replace('img', ''),
            url: convertCanvasToImage(),
            lines: [...textArray]
        }  

    const memeToSaveID = memeArray.findIndex(meme => meme.url === memeToSave.url)

    if (memeToSaveID !== -1) {
        memeArray[memeToSaveID] = {...memeArray[memeToSaveID], ...memeToSave}
    } else {
        memeArray.push(memeToSave)
    }

    saveToStorage('memeArray', memeArray)
}

function deleteImage(imageID) {    

    let imageArray = gImages

    imageArray.splice(imageID, 1)
    
    saveToStorage('imageArray', imageArray)
}

function deleteMeme(memeID) {

    let memeArray = gMemes

    memeArray.splice(memeID, 1)

    saveToStorage('memeArray', memeArray)
}