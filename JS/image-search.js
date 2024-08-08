'use strict'

const apiKey = 'AIzaSyBapRQvMIX5I-TzASsjasOuCxqqRMg7qp8' // Replace with your actual API key
const cseId = '55db37c42e2a44265' // Replace with your actual CSE ID

async function searchImage(query) {
    const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cseId}&searchType=image&q=${query}`

    try {
        const response = await axios.get(url)
        if (response.data && response.data.items && response.data.items.length > 0) {
            const firstImageUrl = response.data.items[0].link
            return image.src = firstImageUrl
        } else {
            console.log('No image items found in the response')
            return null
        }
    } catch (error) {
        console.error('Error fetching image:', error)
        return null
    }
}

const image = {
    src: null
}


function getImageSrc(input) {
    searchImage(`${input} meme template`)
}


function findImage() {
    const findInput = document.querySelector('.find-image-input')
    const imageContainer = document.querySelector('.image-container')

    getImageSrc(findInput.value)    

    setTimeout(() => {
        imageContainer.innerHTML = `<img src="${image.src}">`        
    }, 1000);
}

