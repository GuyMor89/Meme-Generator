'use strict'

const defaultImageArray = [
    {
        id: 1,
        url: 'IMG/1.jpg',
        keyword: 'funny'
    },
    {
        id: 2,
        url: 'IMG/2.jpg',
        keyword: 'cute'
    },
    {
        id: 3,
        url: 'IMG/3.jpg',
        keyword: 'cool'
    },
    {
        id: 4,
        url: 'IMG/4.jpg',
        keyword: 'cute'
    },
    {
        id: 5,
        url: 'IMG/5.jpg',
        keyword: 'cute'
    },
    {
        id: 6,
        url: 'IMG/6.jpg',
        keyword: 'funny'
    }
]

const savedMemeArray = []


function getImgArray() {

    let imageArray = defaultImageArray

    imageArray = imageArray.filter(image => image.keyword.includes(filterBy.keyword))

    return imageArray
}

function getMemeArray() {
    return savedMemeArray
}