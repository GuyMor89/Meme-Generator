'use strict'


const gElCanvas = document.querySelector('canvas')
const CTX = gElCanvas.getContext('2d')
let currImage

let textToMove = null
let textToEdit = null
let deleteBtn = {}
let textArray = []


const defaultTextSettings = { fontSize: 40, fontColor: '#000000', fillRect: false, backgoundColor: '000000', strokeColor: '#000000', strokeWidth: 3, fontType: 'Segoe UI', bold: '', italicize: '', underline: false, strikethrough: false }
const textSettings = {
    fontSize: 40,
    fontColor: '#000000',
    fillRect: false,
    backgoundColor: '000000',
    strokeColor: '#000000',
    strokeWidth: 3,
    fontType: 'Segoe UI',
    bold: '',
    italicize: '',
    underline: false,
    strikethrough: false
}

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


function onDown(event) {
    textToEdit = null
    findText(getEventPos(event))
    deleteText(getEventPos(event), event)

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


function coverCanvasWithImg(elImgBtn) {
    if (elImgBtn.tagName === 'DIV') resetText()

    const elImg = document.querySelector(`.image${parseInt(elImgBtn.id.replace(/\D/g, ''), 10)} img`)
    currImage = elImg  // Ensure currImage is declared with 'let' or 'var' if not globally declared

    // Calculate the potential dimensions
    let potentialHeight = (elImg.naturalHeight / elImg.naturalWidth) * 500  // Start with width = 500 to find the potential height
    let potentialWidth = (elImg.naturalWidth / elImg.naturalHeight) * 500   // Start with height = 500 to find the potential width

    if (potentialHeight <= 500 && potentialWidth <= 500) {
        // If both potential dimensions are within limits, adjust canvas based on aspect ratio
        gElCanvas.width = 500
        gElCanvas.height = potentialHeight
    } else if (potentialHeight > 500) {
        // If potential height is too large, adjust width to maintain aspect ratio
        gElCanvas.width = (elImg.naturalWidth / elImg.naturalHeight) * 500
        gElCanvas.height = 500
    } else {
        // Otherwise, adjust height to maintain aspect ratio
        gElCanvas.width = 500
        gElCanvas.height = potentialHeight
    }

    // Adjust width again if it exceeds 500 after height adjustment
    if (gElCanvas.width > 500) {
        gElCanvas.height = (elImg.naturalHeight / elImg.naturalWidth) * 500
        gElCanvas.width = 500
    }

    // Draw the image on the canvas
    CTX.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)
}


function resetText() {
    const contentInput = document.querySelector('#text')

    Object.assign(textSettings, defaultTextSettings)
    contentInput.value = ''
    textToEdit = null
    textArray = []
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

    if (textToEdit) restoreSettings()

}



function restoreSettings() {

    const { content, fontColor, fillRect, backgoundColor, strokeColor, strokeWidth, fontSize, fontType, bold, italicize, underline, strikethrough } = textToEdit

    const contentInput = document.querySelector('#text')
    const fontSizeInput = document.querySelector('#font-size')
    const fontColorInput = document.querySelector('#font-color')
    const backgoundColorInput = document.querySelector('#background-color')
    const strokeColorInput = document.querySelector('#stroke-color')
    const strokeWidthInput = document.querySelector('#stroke-width')

    contentInput.value = content
    fontSizeInput.value = parseInt(fontSize)
    fontColorInput.value = fontColor
    backgoundColorInput.value = backgoundColor
    strokeColorInput.value = strokeColor
    strokeWidthInput.value = strokeWidth

    textSettings.fontColor = fontColor
    textSettings.fillRect = fillRect
    textSettings.backgoundColor = backgoundColor
    textSettings.strokeColor = strokeColor
    textSettings.strokeWidth = strokeWidth
    textSettings.fontSize = fontSize
    textSettings.fontType = fontType
    textSettings.bold = bold
    textSettings.italicize = italicize
    textSettings.underline = underline
    textSettings.strikethrough = strikethrough


    const textInput = document.querySelector('#text')

    editText(textToEdit, textInput)
}


function onAddText(event) {

    const textInput = document.querySelector('#text')

    if (textToEdit) return editText(textToEdit, textInput)

    const { fontSize, fontColor, backgoundColor, strokeColor, strokeWidth, fontType, bold, italicize } = textSettings

    if (event.key === 'Enter' || event.target.tagName === 'I') {
        const newText = {
            ID: textArray.length,
            content: textInput.value,
            X: gElCanvas.width / 2,
            Y: (gElCanvas.height / 2) + 50 * textArray.length,
            deleteBtnX: 0,
            deleteBtnY: 0,
            isMoving: false,
            fontSize: `${fontSize}`,
            fontColor: `${fontColor}`,
            fillRect: false,
            backgoundColor: `${backgoundColor}`,
            strokeColor: `${strokeColor}`,
            strokeWidth: `${strokeWidth}`,
            fontType: `${fontType}`,
            bold: `${bold}`,
            italicize: `${italicize}`,
            underline: false,
            strikethrough: false
        }
        textArray.push(newText)

        textInput.value = ''
        textInput.blur()
    }

    renderText()
}


function editText({ ID }, textInput) {

    let textIDToEdit = textArray.findIndex(text => text.ID === ID)

    const { fontSize, fontColor, fillRect, backgoundColor, strokeColor, strokeWidth, fontType, bold, italicize, underline, strikethrough } = textSettings

    if (textInput) textArray[textIDToEdit].content = textInput.value
    textArray[textIDToEdit].fontSize = `${fontSize}`
    textArray[textIDToEdit].fontColor = `${fontColor}`
    textArray[textIDToEdit].fillRect = fillRect
    textArray[textIDToEdit].backgoundColor = `${backgoundColor}`
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

    document.addEventListener('click', event => {

        if (event.target.classList.contains('fa-check')) {
            textInput.value = ''
            textToEdit = null
            renderText()
        }
    })
}





function renderText() {
    if (!currImage) {
        CTX.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
    } else {
        coverCanvasWithImg(currImage)
    }

    textArray.forEach(({ X, Y, content, fontColor, fillRect, backgoundColor, strokeColor, strokeWidth, fontSize, fontType, bold, italicize, underline, strikethrough }) => {

        CTX.font = `${bold}${italicize}${fontSize}px ${fontType}`
        if (fillRect) addBackgroundColor(X, Y, content, backgoundColor)
        CTX.beginPath()
        CTX.textAlign = 'center'
        CTX.textBaseline = 'middle'

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
    const buttonSize = 20 // Size of the delete button
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


function drawStrike(X, Y, content) {
    const textWidth = CTX.measureText(content).width
    const textHeight = parseInt(CTX.font.match(/\b(\d+)(px)?\b/)[1], 10)

    CTX.beginPath()
    CTX.moveTo(X - textWidth / 2, Y) // Start point of the line
    CTX.lineTo(X + textWidth / 2, Y) // End point of the line
    CTX.lineWidth = textHeight / 10
    CTX.strokeStyle = 'black' // Line color
    CTX.stroke() // Draw the line
}

function drawUnderline(X, Y, content) {
    const textWidth = CTX.measureText(content).width
    const textHeight = parseInt(CTX.font.match(/\b(\d+)(px)?\b/)[1], 10)

    CTX.beginPath()
    CTX.moveTo(X - textWidth / 2, Y + textHeight / 2.5) // Start point of the line
    CTX.lineTo(X + textWidth / 2, Y + textHeight / 2.5) // End point of the line
    CTX.lineWidth = textHeight / 15
    CTX.strokeStyle = 'black' // Line color
    CTX.stroke() // Draw the line
}

function addBackgroundColor(X, Y, content, backgoundColor) {
    const textWidth = CTX.measureText(content).width
    const textHeight = parseInt(CTX.font.match(/\b(\d+)(px)?\b/)[1], 10)

    // Calculate rectangle dimensions
    const rectX = (X - textWidth / 2) - 10
    const rectY = (Y - textHeight / 2) - 15
    const rectWidth = textWidth + 20
    const rectHeight = textHeight + 20

    // Draw the main rectangle
    CTX.beginPath()
    CTX.rect(rectX, rectY, rectWidth, rectHeight)
    CTX.fillStyle = backgoundColor
    CTX.fillRect(rectX + 5, rectY + 5, rectWidth - 10, rectHeight - 10)
}




function deleteText({ currentX, currentY } = {}, event) {    

    if (!textToEdit) return

    const contentInput = document.querySelector('#text')

    let textIDToRemove = textArray.findIndex(text => text.ID === textToEdit.ID)

    if (
        (
            currentX >= textToEdit.deleteBtnX &&
            currentX <= textToEdit.deleteBtnX + 20 &&
            currentY >= textToEdit.deleteBtnY &&
            currentY <= textToEdit.deleteBtnY + 20
        ) || event.target.tagName === 'I'
    ) 
    {        
        textArray.splice(textIDToRemove, 1)
        textToEdit = null
        contentInput.value = ''
        contentInput.blur()
    }

    renderText()
}




function onChangeSettings(elBtn) {

    const fontSize = +document.querySelector('#font-size').value
    const textColor = document.querySelector('#font-color').value
    const backgoundColor = document.querySelector('#background-color').value
    const strokeColor = document.querySelector('#stroke-color').value
    const strokeWidth = +document.querySelector('#stroke-width').value

    const boldBtn = document.querySelector('.fa-bold')
    const italicizeBtn = document.querySelector('.fa-italic')
    const underlineBtn = document.querySelector('.fa-underline')
    const strikethroughBtn = document.querySelector('.fa-strikethrough')
    const fillRectBtn = document.querySelector('.fa-fill')

    const fontSizeCounter = document.querySelector('.font-size-counter')
    const strokeWidthCounter = document.querySelector('.stroke-width-counter')

    textSettings.fontSize = fontSize
    textSettings.fontColor = textColor
    textSettings.backgoundColor = backgoundColor
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
    if (elBtn === fillRectBtn) {
        if (textSettings.fillRect) {
            textSettings.fillRect = false
        } else {
            textSettings.fillRect = true
        }
    }

    strokeWidthCounter.innerText = strokeWidth
    fontSizeCounter.innerText = fontSize
}


