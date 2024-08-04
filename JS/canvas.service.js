'use strict'

const textSettings = {
    fontSize: 40,
    fontColor: '#000000',
    strokeColor: '#000000',
    strokeWidth: 3,
    fontType: 'Segoe UI',
}

function changeSettings() {

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