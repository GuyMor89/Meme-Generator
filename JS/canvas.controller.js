'use strict'


const gElCanvas = document.querySelector('canvas')
const CTX = gElCanvas.getContext('2d')
let currImage

let textToMove = null
let textToEdit = null
let textArray = []


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
    currImage = elImg    

    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    CTX.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}


function onDown(event) {
    textToEdit = null
    findText(getEventPos(event))
}

function onUp() {
    textToMove = null
}

function onMove(event) {

    if (textToMove) {
        let { currentX, currentY } = getEventPos(event)

        textToMove.X = currentX - textToMove.diffX
        textToMove.Y = currentY - textToMove.diffY

        renderText()

        // textToEdit = null
    }
}



function findText({ currentX, currentY }) {

    for (let text of textArray) {
        const textWidth = CTX.measureText(text.content).width
        const textHeight = parseInt(CTX.font, 10)

        if (
            currentX >= text.X - textWidth / 2 &&
            currentX <= text.X + textWidth / 2 &&
            currentY >= text.Y - textHeight / 2 &&
            currentY <= text.Y + textHeight / 2
        ) {
            textToMove = text
            textToEdit = text
            text.diffX = currentX - text.X
            text.diffY = currentY - text.Y
            break
        }
    }
    if (textToEdit) startToEditText()

}


function startToEditText() {

    const { content, fontSize, fontColor, strokeColor, strokeWidth } = textToEdit

    const contentInput = document.querySelector('#text')
    const fontSizeInput = document.querySelector('#font-size')
    const fontColorInput = document.querySelector('#font-color')
    const strokeColorInput = document.querySelector('#stroke-color')
    const strokeWidthInput = document.querySelector('#stroke-width')

    contentInput.value = content
    fontSizeInput.value = parseInt(fontSize)
    fontColorInput.value = fontColor
    strokeColorInput.value = strokeColor
    strokeWidthInput.value = strokeWidth
}


function editText({ ID }, textInput) {

    let textIDToEdit = textArray.findIndex(text => text.ID === ID)

    const { fontSize, fontColor, strokeColor, strokeWidth, fontType } = textSettings
    
    textArray[textIDToEdit].content = textInput.value
    textArray[textIDToEdit].fontSize = `${fontSize}px`
    textArray[textIDToEdit].fontColor = `${fontColor}`
    textArray[textIDToEdit].strokeColor = `${strokeColor}`
    textArray[textIDToEdit].strokeWidth = `${strokeWidth}`
    textArray[textIDToEdit].fontType = `${fontType}`

    // textToEdit = null

    renderText()
}


function onAddText(event) {

    const textInput = document.querySelector('#text')

    if (textToEdit) return editText(textToEdit, textInput)

    const { fontSize, fontColor, strokeColor, strokeWidth, fontType } = textSettings

    if (event.key === 'Enter') {
        const newText = {
            ID: textArray.length,
            content: textInput.value,
            X: gElCanvas.width / 2,
            Y: (gElCanvas.height / 2) + 50 * textArray.length,
            fontSize: `${fontSize}px`,
            fontColor: `${fontColor}`,
            strokeColor: `${strokeColor}`,
            strokeWidth: `${strokeWidth}`,
            fontType: `${fontType}`,
        }
        textArray.push(newText)

        textInput.value = ''
        textInput.blur()
    }

    renderText()
}


function renderText() {    
    if (!currImage) {
        CTX.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    } else {
        coverCanvasWithImg(currImage)
    }
    textArray.forEach(({ X, Y, content, fontColor, strokeColor, strokeWidth, fontSize, fontType }) => {
        CTX.beginPath()
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.font = `${fontSize} ${fontType}`

        CTX.fillStyle = fontColor
        CTX.strokeStyle = strokeColor
        CTX.lineWidth = strokeWidth
        CTX.fillText(content, X, Y)
        if(strokeWidth > 0) CTX.strokeText(content, X, Y)
    })
}




function onChangeSettings() {

    const fontSize = +document.querySelector('#font-size').value
    const textColor = document.querySelector('#font-color').value
    const strokeColor = document.querySelector('#stroke-color').value
    const strokeWidth = +document.querySelector('#stroke-width').value    

    const fontSizeCounter = document.querySelector('.font-size-counter')
    const strokeWidthCounter = document.querySelector('.stroke-width-counter')

    textSettings.fontSize = fontSize
    textSettings.fontColor = textColor
    textSettings.strokeColor = strokeColor
    textSettings.strokeWidth = strokeWidth

    strokeWidthCounter.innerText = strokeWidth
    fontSizeCounter.innerText = fontSize
    
}