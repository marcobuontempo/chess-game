// COPY FEN TO CLIPBOARD
document.querySelector("#copy-fen").addEventListener("click",() => {
    const fenString = document.querySelector("#fen").innerHTML
    navigator.clipboard.writeText(fenString)
})


// HIDE/SHOW PLAYER COLOUR OPTION
document.querySelectorAll("[name=game-mode]").forEach(option => {
    option.addEventListener("change", () => {
        const playerSelection = document.querySelector("#player-colour-option")
        if(option.value=="pvp") {
            playerSelection.style.display = "none"
        } else {
            playerSelection.style.display = "block"
        }
    })
})


// HIDE/SHOW CUSTOM FEN INPUT FIELD
document.querySelector("#show-fen-import").addEventListener("click", () => {
    const importFen = document.querySelector("#import-fen-option")
    if(importFen.style.display=="block") {
        importFen.style.display="none"
    } else {
        importFen.style.display="flex"
        document.querySelector("#show-fen-import").style.display="none"
    }
})


// START GAME WITH SELECTED USER OPTIONS
document.querySelector("#start-game").addEventListener("click", () => {
    const customFen = document.querySelector("#custom-fen").value
    const gameMode = document.querySelector("[name=game-mode]:checked").value
    const playerColour = gameMode=="pvp" ? "white" : document.querySelector("[name=player-colour]:checked").value

    try {
        const game = new ChessGame(customFen, gameMode, playerColour)
        game.startGame()
        document.querySelector("#chessboard-container").style.display="flex"
        document.querySelector("#game-options").style.display="none"
    } catch(error) {
        document.querySelector("#error-message").innerHTML=error
    }
})