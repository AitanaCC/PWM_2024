function initializeTypingEffect(elementSelector, words) {
    const typingEffectSpan = document.querySelector(elementSelector);
    let currentItem = 0;
    let currentLetter = 0;
    let deleting = false;

    function typeLetters() {
        if (deleting) {
            if (currentLetter >= 0) {
                typingEffectSpan.textContent = words[currentItem].substring(0, currentLetter);
                currentLetter--;
                setTimeout(typeLetters, 50);
            } else {
                deleting = false;
                currentItem = (currentItem + 1) % words.length;
                setTimeout(typeLetters, 200);
            }
        } else {
            if (currentLetter <= words[currentItem].length) {
                typingEffectSpan.textContent = words[currentItem].substring(0, currentLetter);
                currentLetter++;
                setTimeout(typeLetters, 100);
            } else {
                setTimeout(() => {
                    deleting = true;
                    setTimeout(typeLetters, 200);
                }, 1000);
            }
        }
    }

    typeLetters();
}
