class Chessboard {
    constructor(fen) {
        this._fen = fen || "rnbbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        this._turn = "white",
        this._castleRights = ["K","Q","k","q"],
        this._enPassantSquare = [null,null],
        this._halfMoveCount = 0,
        this._fullMoveCount = 1,
        this._boardSquares = [],
        this._pieceIcons = { k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟", 
                             K:"♔", Q:"♕", R:"♖", B:"♗", N:"♘", P:"♙" }
    }




    /*
    =================
    =====GETTERS=====
    =================
    */
    getFen() {
        return this._fen;
    }
    getTurn() {
        return this._turn;
    }
    getCastleRights() {
        return this._castleRights;
    }
    getEnPassantSquare() {
        return this._enPassantSquare;
    }
    getHalfMoveCount() {
        return this._halfMoveCount;
    }
    getFullMoveCount() {
        return this._fullMoveCount;
    }
    getBoardSquares() {
        return this._boardSquares;
    }
    getSquare(boardFile,boardRank) {
        return this._boardSquares[boardFile-1][boardRank-1];
    }
    getPieceIcons() {
        return this._pieceIcons;
    }




    /*
    =================
    =====SETTERS=====
    =================
    */
    setFen(newFen) {
        this._fen = newFen;
    }
    setTurn(newTurn) {
        this._turn = newTurn;
    }
    setCastleRights(newCastleRights) {
        this._castleRights = newCastleRights;
    }
    setEnPassantSquare(newEnPassantSquare) {
        this._enPassantSquare = newEnPassantSquare;
    }
    setHalfMoveCount(newHalfMoveCount) {
        this._halfMoveCount = newHalfMoveCount;
    }
    setFullMoveCount(newFullMoveCount) {
        this._fullMoveCount = newFullMoveCount;
    }
    setBoardSquares(newBoardSquares) {
        this._boardSquares = newBoardSquares;
    }
    setSquarePiece(boardFile,boardRank,newPiece) {
        this._boardSquares[boardFile-1][boardRank-1].hasPiece = newPiece;
    }





    /*
    ==================
    ==CONVERT VALUES==
    ==================
    */
   //get piece type from fen key input
    convertPieceFenKeyToName(fenKey) {
        switch(fenKey.toLowerCase()) {
            case "r": return "rook"
            case "n": return "knight"
            case "b": return "bishop"
            case "q": return "queen"
            case "k": return "king"
            case "p": return "pawn"
        }
    }
    //get fen key from piece type input
    convertPieceTypeToFenKey(colour, type) {
        let fenKey
        switch(type.toLowerCase()) {
            case "rook": fenKey = "r"; break
            case "knight": fenKey = "n"; break
            case "bishop": fenKey = "b"; break
            case "queen": fenKey = "q"; break
            case "king": fenKey = "k"; break
            case "pawn": fenKey = "p"; break
        }
        if(colour=="white") { fenKey = fenKey.toUpperCase() }
        return fenKey
    }




    /*
    =================
    ==CREATE  BOARD==
    =================
    */
    //generate square coordinate string
    generateSquareCoordinate(boardFile, boardRank) {
        let fileLetter;
        switch(boardFile) {
            case(1): fileLetter="A"; break
            case(2): fileLetter="B"; break
            case(3): fileLetter="C"; break
            case(4): fileLetter="D"; break
            case(5): fileLetter="E"; break
            case(6): fileLetter="F"; break
            case(7): fileLetter="G"; break
            case(8): fileLetter="H"; break
        }
        return fileLetter+boardRank
    }
    //generate square colour
    generateSquareColour(boardFile,boardRank) {
        if((boardFile%2==0 && boardRank%2!=0) || (boardFile%2!=0 && boardRank%2==0)) {
            return "white"
        } else {
            return "black"
        }
    }
    //create board square
    createSquare(squareCoordinate, squareColour, boardFile, boardRank, hasPiece) {
        return {
            squareCoordinate,
            squareColour,
            boardFile,
            boardRank,
            hasPiece
        }
    }
    //create a board piece
    createPiece(colour,type) {
        const fenPieceKey = this.convertPieceTypeToFenKey(colour,type)
        return {
            fenPieceKey,
            colour,
            type,
            icon: this.getPieceIcons()[fenPieceKey]
        }
    }
    //create empty chessboard
    createEmptyChessboard() {
        const boardSquares = [];
        for(let boardFile=1; boardFile<=8; boardFile++) {
            const file = [];
            for(let boardRank=1; boardRank<=8; boardRank++) {
                const squareCoordinate = this.generateSquareCoordinate(boardFile,boardRank)
                const squareColour = this.generateSquareColour(boardFile,boardRank)
                const hasPiece = null
                const square = this.createSquare(squareCoordinate,squareColour,boardFile,boardRank,hasPiece)
                file.push(square)
            }
            boardSquares.push(file)
        }
        this.setBoardSquares(boardSquares)
    }

}







// ==== T E S T ====
test = new Chessboard()
