'use strict'


const gElCanvas = document.querySelector('canvas')
const CTX = gElCanvas.getContext('2d')
let currImage

let textToMove = null
let textToEdit = null
let deleteBtn = {}
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


function coverCanvasWithImg(elImgBtn) {
    const elImg = document.querySelector(`.image${elImgBtn.id} img`)
    currImage = elImg

    gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * gElCanvas.width
    CTX.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}


function onDown(event) {
    textToEdit = null
    findText(getEventPos(event))
    deleteText(getEventPos(event))

    if (textToEdit) textToEdit.isMoving = true

    renderText()
}

function onUp() {
    // textToEdit = null
    if (textToEdit) textToEdit.isMoving = false
}

function onMove(event) {

    if (textToEdit && textToEdit.isMoving) {
        let { currentX, currentY } = getEventPos(event)

        textToEdit.X = currentX - textToEdit.diffX
        textToEdit.Y = currentY - textToEdit.diffY

        renderText()
    }
}



function findText({ currentX, currentY }) {

    for (let text of textArray) {
        const textWidth = CTX.measureText(text.content).width
        const textHeight = parseInt(CTX.font.match(/\b(\d+)(px)?\b/)[1], 10)

        if (
            currentX >= text.X - textWidth / 2 - 20 &&
            currentX <= text.X + textWidth / 2 + 20 &&
            currentY >= text.Y - textHeight / 2 - 20 &&
            currentY <= text.Y + textHeight / 2 + 20
        ) {

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

    editText(textToEdit)
}


function editText({ ID }, textInput) {

    let textIDToEdit = textArray.findIndex(text => text.ID === ID)

    const { fontSize, fontColor, strokeColor, strokeWidth, fontType, bold, italicize, underline, strikethrough } = textSettings

    if (textInput) textArray[textIDToEdit].content = textInput.value
    textArray[textIDToEdit].fontSize = `${fontSize}px`
    textArray[textIDToEdit].fontColor = `${fontColor}`
    textArray[textIDToEdit].strokeColor = `${strokeColor}`
    textArray[textIDToEdit].strokeWidth = `${strokeWidth}`
    textArray[textIDToEdit].fontType = `${fontType}`
    textArray[textIDToEdit].bold = `${bold}`
    textArray[textIDToEdit].italicize = `${italicize}`
    textArray[textIDToEdit].underline = underline
    textArray[textIDToEdit].strikethrough = strikethrough
    textArray[textIDToEdit].deleteBtnX = deleteBtn.X
    textArray[textIDToEdit].deleteBtnY = deleteBtn.Y

    renderText()
}


function onAddText(event) {

    const textInput = document.querySelector('#text')

    if (textToEdit) return editText(textToEdit, textInput)

    const { fontSize, fontColor, strokeColor, strokeWidth, fontType, bold, italicize } = textSettings

    if (event.key === 'Enter') {
        const newText = {
            ID: textArray.length,
            content: textInput.value,
            X: gElCanvas.width / 2,
            Y: (gElCanvas.height / 2) + 50 * textArray.length,
            deleteBtnX: 0,
            deleteBtnY: 0,
            isMoving: false,
            fontSize: `${fontSize}px`,
            fontColor: `${fontColor}`,
            strokeColor: `${strokeColor}`,
            strokeWidth: `${strokeWidth}`,
            fontType: `${fontType}`,
            bold: `${bold}`,
            italicize: `${italicize}`,
            underline: false,
            strikethrough:  false
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

    textArray.forEach(({ X, Y, content, fontColor, strokeColor, strokeWidth, fontSize, fontType, bold, italicize, underline, strikethrough }) => {

        CTX.beginPath()
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'
        CTX.font = `${bold}${italicize}${fontSize} ${fontType}`

        CTX.fillStyle = fontColor
        CTX.strokeStyle = strokeColor
        CTX.lineWidth = strokeWidth
        CTX.fillText(content, X, Y)
        if (strokeWidth > 0) CTX.strokeText(content, X, Y)
        if (underline) drawUnderline(X, Y, content)
        if (strikethrough) drawStrike(X, Y, content)
    })

    if (textToEdit) drawBorder(textToEdit.X, textToEdit.Y, textToEdit.content)
}

function drawStrike (X, Y, content) {
    const textWidth = CTX.measureText(content).width
    const textHeight = parseInt(CTX.font.match(/\b(\d+)(px)?\b/)[1], 10)

    CTX.beginPath();
    CTX.moveTo(X - textWidth / 2, Y); // Start point of the line
    CTX.lineTo(X + textWidth / 2, Y); // End point of the line
    CTX.lineWidth = textHeight / 10
    CTX.strokeStyle = 'black'; // Line color
    CTX.stroke(); // Draw the line
}

function drawUnderline(X, Y, content) {
    const textWidth = CTX.measureText(content).width
    const textHeight = parseInt(CTX.font.match(/\b(\d+)(px)?\b/)[1], 10)

    CTX.beginPath();
    CTX.moveTo(X - textWidth / 2, Y + textHeight / 2.5); // Start point of the line
    CTX.lineTo(X + textWidth / 2, Y + textHeight / 2.5); // End point of the line
    CTX.lineWidth = textHeight / 15
    CTX.strokeStyle = 'black'; // Line color
    CTX.stroke(); // Draw the line
}


function drawBorder(x, y, content) {

    if (!content || !textToEdit || textArray.length === 0) return

    const textWidth = CTX.measureText(content).width
    const textHeight = parseInt(CTX.font.match(/\b(\d+)(px)?\b/)[1], 10)

    // Calculate rectangle dimensions
    const rectX = (x - textWidth / 2) - 10
    const rectY = (y - textHeight / 2) - 15
    const rectWidth = textWidth + 20
    const rectHeight = textHeight + 20

    // Draw the main rectangle
    CTX.beginPath()
    CTX.rect(rectX, rectY, rectWidth, rectHeight)
    CTX.lineWidth = 3
    CTX.setLineDash([15, 5])
    CTX.strokeStyle = 'black'
    CTX.stroke()

    // Draw the delete button
    const buttonSize = 20; // Size of the delete button
    const buttonX = rectX + rectWidth - buttonSize / 2
    const buttonY = rectY - buttonSize / 2

    deleteBtn.X = buttonX
    deleteBtn.Y = buttonY

    CTX.fillStyle = 'red' // Button color
    CTX.beginPath()
    CTX.rect(buttonX, buttonY, buttonSize, buttonSize)
    CTX.setLineDash([])
    CTX.fill()

    // Optionally, draw an 'X' or use an icon for the button
    CTX.beginPath()
    CTX.moveTo(buttonX + 4, buttonY + 4)
    CTX.lineTo(buttonX + buttonSize - 4, buttonY + buttonSize - 4)
    CTX.moveTo(buttonX + buttonSize - 4, buttonY + 4)
    CTX.lineTo(buttonX + 4, buttonY + buttonSize - 4)
    CTX.strokeStyle = 'white'
    CTX.lineWidth = 2
    CTX.stroke()
}

function deleteText({ currentX, currentY }) {
    const contentInput = document.querySelector('#text')

    if (textToEdit) {
        let textIDToRemove = textArray.findIndex(text => text.ID === textToEdit.ID)
        if (
            currentX >= textToEdit.deleteBtnX &&
            currentX <= textToEdit.deleteBtnX + 20 &&
            currentY >= textToEdit.deleteBtnY &&
            currentY <= textToEdit.deleteBtnY + 20
        ) {
            textArray.splice(textIDToRemove, 1)
            textToEdit = null
            contentInput.value = ''
            contentInput.blur()
        }

    }
}




function onChangeSettings(elBtn) {

    const fontSize = +document.querySelector('#font-size').value
    const textColor = document.querySelector('#font-color').value
    const strokeColor = document.querySelector('#stroke-color').value
    const strokeWidth = +document.querySelector('#stroke-width').value

    const boldBtn = document.querySelector('.fa-bold')
    const italicizeBtn = document.querySelector('.fa-italic')
    const underlineBtn = document.querySelector('.fa-underline')
    const strikethroughBtn = document.querySelector('.fa-strikethrough')

    const fontSizeCounter = document.querySelector('.font-size-counter')
    const strokeWidthCounter = document.querySelector('.stroke-width-counter')

    textSettings.fontSize = fontSize
    textSettings.fontColor = textColor
    textSettings.strokeColor = strokeColor
    textSettings.strokeWidth = strokeWidth

    if (elBtn === boldBtn) {
        if (textSettings.italicize === 'bold ') {
            textSettings.italicize = ''
        } else {
            textSettings.italicize = 'bold '
        }
    }
    if (elBtn === italicizeBtn) {
        if (textSettings.italicize === 'italic ') {
            textSettings.italicize = ''
        } else {
            textSettings.italicize = 'italic '
        }
    }
    if (elBtn === underlineBtn) {        
        if (textSettings.underline) {
            textSettings.underline = false
        } else {
            textSettings.underline = true
        }
    }
    if (elBtn === strikethroughBtn) {
        if (textSettings.strikethrough) {
            textSettings.strikethrough = false
        } else {
            textSettings.strikethrough = true
        }
    }

    strokeWidthCounter.innerText = strokeWidth
    fontSizeCounter.innerText = fontSize
}