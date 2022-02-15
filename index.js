class Chessboard {
    constructor(fen) {
        this._fen = fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
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
}