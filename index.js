class Chessboard {
    constructor(fen) {
        this._fen = fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        this._fenPosition = this._fen.split(" ")[0],
        this._fenTurn = this._fen.split(" ")[1],
        this._fenCastle = this._fen.split(" ")[2],
        this._fenEnPassant = this._fen.split(" ")[3],
        this._fenHalfMove = this._fen.split(" ")[4],
        this._fenFullMove = this._fen.split(" ")[5],
        this._boardTiles = [],
        this._pieceIcons = { k:"♚", q:"♛", r:"♜", b:"♝", n:"♞", p:"♟", 
                             K:"♚", Q:"♛", R:"♜", B:"♝", N:"♞", P:"♟" }
    }


}