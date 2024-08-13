'use strict'

function convertCanvasToImage() {
    const imgDataUrl = gElCanvas.toDataURL('image/jpeg') // image/jpeg the default format
    return imgDataUrl
}

function onCreateDownloadLink(elLink) {
    textToEdit = null

    renderText()

    elLink.href = convertCanvasToImage()
}


function onSaveMeme() {

    const messageContainer = document.querySelector('.message-container')

    if (!currImage) {
        messageContainer.classList.remove('hidden')
        messageContainer.style.width = '250px'
        messageContainer.innerText = 'Can\'t save empty meme'
        setTimeout(() => {
            messageContainer.classList.add('hidden')
        }, 1000);

        return
    } else {
        messageContainer.classList.remove('hidden')
        messageContainer.style.width = '135px'
        messageContainer.innerText = 'Meme Saved'
        setTimeout(() => {
            messageContainer.classList.add('hidden')
        }, 1000);

        textToEdit = null

        renderText()
        saveMeme()

        textArray.length = 0

        renderSavedMemes()
    }
}


function onCreateShareLink() {
    // Gets the image from the canvas
    const imgDataUrl = convertCanvasToImage()

    function onSuccess(uploadedImgUrl) {
        // Handle some special characters
        const url = encodeURIComponent(uploadedImgUrl)
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}&t=${url}`)
    }

    // Send the image to the server
    doUploadImg(imgDataUrl, onSuccess)
}

// Upload the image to a server, get back a URL 
// call the function onSuccess when done
function doUploadImg(imgDataUrl, onSuccess) {
    // Pack the image for delivery
    const formData = new FormData()
    formData.append('img', imgDataUrl)

    // Send a post req with the image to the server
    const XHR = new XMLHttpRequest()
    XHR.onreadystatechange = () => {
        // If the request is not done, we have no business here yet, so return
        if (XHR.readyState !== XMLHttpRequest.DONE) return
        // if the response is not ok, show an error
        if (XHR.status !== 200) return console.error('Error uploading image')
        const { responseText: url } = XHR

        //* If the response is ok, call the onSuccess callback function, 
        //* that will create the link to facebook using the url we got
        console.log('Got back live url:', url)
        onSuccess(url)
    }
    XHR.onerror = (req, ev) => {
        console.error('Error connecting to server with request:', req, '\nGot response data:', ev)
    }
    XHR.open('POST', '//ca-upload.com/here/upload.php')
    XHR.send(formData)
}
