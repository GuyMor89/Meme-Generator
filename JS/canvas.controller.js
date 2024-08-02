'use strict'


const gElCanvas = document.querySelector('canvas')
const CTX = gElCanvas.getContext('2d')
let currImage = {}

let currentText = null
const textArray = []


function addListeners() {
    gElCanvas.addEventListener('touchstart', onDown)
    gElCanvas.addEventListener('mousedown', onDown)

    gElCanvas.addEventListener('mousemove', onMove)
    gElCanvas.addEventListener('touchmove', onMove)

    document.addEventListener('mouseup', onUp)
    document.addEventListener('touchend', onUp)
}


function getEventPos(event) {
    let pos = {
        currentX: event.offsetX,
        currentY: event.offsetY
    }
    if (event.type === 'touchstart' || event.type === 'touchmove') {
        event.preventDefault()
        const rect = gElCanvas.getBoundingClientRect()
        pos = {
            currentX: event.touches[0].clientX - rect.left,
            currentY: event.touches[0].clientY - rect.top
        }
    }
    return pos
}


function coverCanvasWithImg(elImg) {
    currImage = { elImg }

    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    CTX.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}


function onDown(event) {
    startDragging(getEventPos(event))
}

function onUp() {
    currentText = null
}

function onMove(event) {

    if (currentText) {
        let { currentX, currentY } = getEventPos(event)
        const {fontColor, strokeColor, strokeWidth} = textSettings

        currentText.X = currentX - currentText.diffX
        currentText.Y = currentY - currentText.diffY

        renderText(fontColor, strokeColor, strokeWidth)
    }
}



function startDragging({ currentX, currentY }) {

    for (let text of textArray) {
        const textWidth = CTX.measureText(text.content).width
        const textHeight = parseInt(CTX.font, 10)

        if (
            currentX >= text.X - textWidth / 2 &&
            currentX <= text.X + textWidth / 2 &&
            currentY >= text.Y - textHeight / 2 &&
            currentY <= text.Y + textHeight / 2
        ) {
            currentText = text
            text.diffX = currentX - text.X
            text.diffY = currentY - text.Y
            break
        }
    }
}


function addText() {
    const elInput = document.querySelector('.options input')
    const {fontSize, fontColor, strokeColor, strokeWidth, font} = textSettings

    const newText = {
        content: elInput.value,
        X: gElCanvas.width / 2,
        Y: (gElCanvas.height / 2) + 50 * textArray.length,
        font: `${fontSize}px ${font}`,
        fontColor: `${fontColor}`,
        strokeColor: `${strokeColor}`,
        strokeWidth: `${strokeWidth}`
    }
    textArray.push(newText)

    elInput.value = ''

    renderText()
}


function renderText() {
    if (Object.keys(currImage).length === 0) {
        CTX.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    } else {
        coverCanvasWithImg(currImage.elImg)
    }
    textArray.forEach(({X, Y, content, fontColor, strokeColor, strokeWidth, font}) => {
        CTX.beginPath()
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.font = font

        CTX.fillText(content, X, Y)
        CTX.fillStyle = fontColor
        CTX.strokeText(content, X, Y)
        CTX.strokeStyle = strokeColor
        CTX.strokeWidth = strokeWidth
    })
}




