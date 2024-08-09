'use strict'


function loadImages() {

    // const defaultImageArray = [{id: 6, url: 'IMG/6.jpg', keyword: 'funny'}, {id: 5, url: 'IMG/5.jpg', keyword: 'cute'}, {id: 4, url: 'IMG/4.jpg', keyword: 'cute'}, {id: 3, url: 'IMG/3.jpg', keyword: 'cool'}, {id: 2, url: 'IMG/2.jpg', keyword: 'cute'}, {id: 1, url: 'IMG/1.jpg', keyword: 'funny'}];
    const defaultImageArray = [{id: 18, url: 'IMG/18.jpg', keyword: 'amazing'}, {id: 17, url: 'IMG/17.jpg', keyword: 'exciting'}, {id: 16, url: 'IMG/16.jpg', keyword: 'beautiful'}, {id: 15, url: 'IMG/15.jpg', keyword: 'scenic'}, {id: 14, url: 'IMG/14.jpg', keyword: 'adorable'}, {id: 13, url: 'IMG/13.jpg', keyword: 'hilarious'}, {id: 12, url: 'IMG/12.jpg', keyword: 'mysterious'}, {id: 11, url: 'IMG/11.jpg', keyword: 'cool'}, {id: 10, url: 'IMG/10.jpg', keyword: 'funny'}, {id: 9, url: 'IMG/9.jpg', keyword: 'cute'}, {id: 8, url: 'IMG/8.jpg', keyword: 'unique'}, {id: 7, url: 'IMG/7.jpg', keyword: 'quirky'}, {id: 6, url: 'IMG/6.jpg', keyword: 'funny'}, {id: 5, url: 'IMG/5.jpg', keyword: 'cute'}, {id: 4, url: 'IMG/4.jpg', keyword: 'cute'}, {id: 3, url: 'IMG/3.jpg', keyword: 'cool'}, {id: 2, url: 'IMG/2.jpg', keyword: 'cute'}, {id: 1, url: 'IMG/1.jpg', keyword: 'funny'}];

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

function deleteImage(imageID) {    

    let imageArray = gImages

    imageArray.splice(imageID, 1)
    
    saveToStorage('imageArray', imageArray)
}