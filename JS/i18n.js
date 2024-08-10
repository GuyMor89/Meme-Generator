'use strict'

const translations = {
    en: {
        gallery: 'Gallery',
        editor: 'Editor',
        saved: 'Saved',
        searchPlaceholder: 'Find your template..',
        uploadImage: 'Upload Image',
        findImage: 'Find Image',
        findImagePlaceholder: 'Find an image..',
        downloadImage: 'Download Image',
        enterTextPlaceholder: 'Enter text..',
        fontSizeLabel: 'Font Size:',
        strokeWidthLabel: 'Stroke Width:',
        fillToolTip: 'Fill',
        backgroundColorLabel: 'Background Color',
        fontColorLabel: 'Font Color',
        strokeColorLabel: 'Stroke Color',
        downloadMemeButton: 'Download Meme',
        shareMemeButton: 'Share Meme',
        saveMemeButton: 'Save Meme',
        saveMessage: 'Save Successful!',
        footerBy: 'by Guy Mor'
    },
    he: {
        gallery: 'גלריה',
        editor: 'עורך',
        saved: 'שמורים',
        searchPlaceholder: 'חפש את התבנית שלך..',
        uploadImage: 'העלה תמונה',
        findImage: 'מצא תמונה',
        findImagePlaceholder: 'מצא תמונה..',
        downloadImage: 'הורד תמונה',
        enterTextPlaceholder: 'הכנס טקסט..',
        fontSizeLabel: 'גודל גופן:',
        strokeWidthLabel: 'עובי קו:',
        fillToolTip: 'מילוי',
        backgroundColorLabel: 'צבע רקע',
        fontColorLabel: 'צבע גופן',
        strokeColorLabel: 'צבע קו',
        downloadMemeButton: 'הורד מם',
        shareMemeButton: 'שתף מם',
        saveMemeButton: 'שמור מם',
        saveMessage: 'שמירה הצליחה!',
        footerBy: 'מאת גיא מור'
    }
}


function translatePage(lang) {
    const elements = document.querySelectorAll('[data-i18n]');
    
    elements.forEach((element) => {
        const key = element.getAttribute('data-i18n');
        const translation = translations[lang][key];
        
        if (translation) {
            if (element.tagName.toLowerCase() === 'input' && element.hasAttribute('placeholder')) {
                // Update the placeholder for input elements
                element.setAttribute('placeholder', translation);
            } else {
                // Update the text content for other elements
                element.textContent = translation;
            }
        } else {
            if (element.tagName.toLowerCase() === 'input' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', `Missing translation: ${key}`);
            } else {
                element.textContent = `Missing translation: ${key}`;
            }
        }
    });
}


// Initialize translation when the language is changed
const languageToggle = document.querySelector('.language-toggle')
if (languageToggle) {
    languageToggle.addEventListener('change', () => {
        const selectedLanguage = languageToggle.value
        translatePage(selectedLanguage)
    })
}

// Set initial language on page load
const currentLanguage = getCurrentLanguage()
translatePage(currentLanguage)

function getCurrentLanguage() {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get('lang') || 'en'
}
