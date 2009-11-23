using System;
using System.Collections.Generic;
using System.Threading;

namespace Minesweeper
{
    public class Game
    {
        const int MAX_PLAYERS = 4;
        const int TOTAL_MINES = 51;

        string _name;
        GameStatus _sStatus;
        Player[] _players;
        int _playersCount;
        Cell[,] _cells;
        int _lines;
        int _cols;
        int _currentPlayer;
        int _totalMines;
        int _minesLeft;        

        public Game(string name, string playerName, int cols, int rows)
        {
            this._name = name;
            _sStatus = GameStatus.WAITING_FOR_PLAYERS;
            _players = new Player[MAX_PLAYERS];
            _lines = rows;
            _cols = cols;
            _cells = new Cell[rows, cols];
            _playersCount = 0;
            _currentPlayer = 0;
            AddPlayer(playerName); //Owner (id = 1)
        }

        public string Name
        {
            get { return _name; }
        }
        public int MinesLeft
        {
            get { return _minesLeft; }
        }
        public GameStatus Status
        {
            get { return _sStatus; }
        }
        public int CurrentPlayer { get { return _currentPlayer; } }
        public List<Player> GetRefreshPlayer(int playerId)
        {
            List<Player> d = _players[playerId - 1].GetRefreshPlayer();
            _players[playerId - 1].ResetRefreshPlayer();
            return d;
        }
        public List<Cell> GetRefreshCell(int playerId)
        {
            List<Cell> sRef = _players[playerId].GetRefreshCell(); //sRef = Strong Reference
            _players[playerId].ResetRefreshCell();
            return sRef;
        }

        private int calcMines()
        {
            if (TOTAL_MINES % _playersCount == 0)
                return TOTAL_MINES + 1;
            return TOTAL_MINES;
        }
        private void reCalcMines()
        {
            if (_minesLeft % _playersCount == 0)
                _totalMines -= 1;
        }
        private void genMinesPos()
        {
            int cont = 0;

            Random rLine = new Random();
            Random rCol = new Random();

            while (cont < _totalMines)
            {
                int x = rCol.Next(0, _cols - 1);
                int y = rLine.Next(0, _lines - 1);
                if (_cells[x, y] == null)
                {
                    _cells[x, y] = new CellMine(x, y);
                    cont++;
                }
            }
        }
        private void CalcValueCells()
        {
            //Calculates the value of each cell according to the mines already puted in the board
            for (int i = 0; i < _cols; i++)
            {
                for (int j = 0; j < _lines; j++)
                {
                    if (_cells[i, j].Type == CellType.Mine)
                    {
                        List<Cell> list = GetAdjacentCells(_cells[i, j]);
                        foreach (Cell c in list)
                        {
                            if (c.Type != CellType.Mine)
                                ((CellNumber)c).IncValue();
                        }
                    }
                }
            }
        }
        private List<Cell> GetAdjacentCells(Cell cell)
        {
            List<Cell> retList = new List<Cell>();
            for (int i = -1; i < 2; i++)
            {
                for (int j = -1; j < 2; j++)
                {
                    if ((i != 0 || j != 0) && isInBounds(cell.PosX + i, cell.PosY + j))
                    {
                        retList.Add(_cells[cell.PosX + i, cell.PosY + j]);
                    }
                }

            }
            return retList;
        }
        private bool isInBounds(int x, int y)
        {
            return x >= 0 && x < _cols && y >= 0 && y < _lines;
        }
        private void SetCurrentPlayer()
        {
            if (_sStatus != GameStatus.STARTED)
            {
                Random rPlayer = new Random();
                _currentPlayer = rPlayer.Next(0, _playersCount);
            }
            else
            {
                do
                {
                    _currentPlayer = (_currentPlayer + 1) % _playersCount;
                } while (_players[_currentPlayer] != null);
            }
            _players[_currentPlayer].Active = true;
        }
        private void CheckGameOver()
        {
            Player[] scoreArr = (Player[])_players.Clone();
            Array.Sort(scoreArr, delegate(Player a, Player b) { return b.Points - a.Points; });
            if (MinesLeft + scoreArr[1].Points < scoreArr[0].Points)
                _sStatus = GameStatus.GAME_OVER;
        }
        private bool ProcessCellClicked(int playerID, int posX, int posY)
        {
            if (isInBounds(posX, posY)) //Sanity check
            {
                if (_cells[posX, posY].Hidden) //Another Sanity check
                {
                    Cell cell = _cells[posX, posY];

                    //This cell will certainly be for update in all players no matter what
                    foreach (Player player in _players)
                    {
                        if (player != null)
                        {
                            player.RefreshAddCell(cell);
                        }
                    }

                    if (cell.Type == CellType.Mine)
                    {
                        //If is Mine, decrement minesLeft, increment player Points puts player to update
                        //and return true to indicate that this player continues to play
                        _minesLeft--;
                        Player p = _players[playerID];
                        p.Points++;
                        foreach (Player player in _players)
                        {
                            if (player != null)
                            {
                                player.RefreshAddPlayer(p);
                            }
                        }
                        return true;
                    }
                    else
                    {
                        //If is Number and value equals 0 then chainReaction
                        //If is Number and is not 0, nothing has to be done because the cell has already
                        //been added to the update cells of all players
                        CellNumber NumberCell = (CellNumber)cell;
                        if (NumberCell.Value == 0)
                        {
                            List<Cell> adjCell = GetAdjacentCells(cell);
                            foreach (Cell c in adjCell)
                            {
                                if (c.Type != CellType.Mine)
                                {
                                    ProcessCellClicked(playerID, c.PosX, c.PosY);
                                }
                            }
                        }
                    }
                }
            }
            return false;
        }

        public int AddPlayer(string name)
        {
            if (_playersCount < MAX_PLAYERS)
            {
                Player player = new Player(_playersCount+1, name);
                _players[_playersCount++] = player;
                foreach (Player p in _players)
                {
                    if (p != null)
                    {
                        p.RefreshAddPlayer(player);
                        if (p.Id != player.Id)
                            player.RefreshAddPlayer(p);
                    }
                }
                return _playersCount;
            }
            return ~0;
        }
        public void RemovePlayer(int id)
        {
            _players[--id] = null;
        }
        public bool Start()
        {
            if (_playersCount < 2) return false;

            _minesLeft = _totalMines = calcMines();

            //Generate mines e puts them into the cell[,]
            genMinesPos();

            //Fills the rest of cell[,] with CellNumber
            for (int i = 0; i < _cols; i++)
            {
                for (int j = 0; j < _lines; j++)
                {
                    if (_cells[i, j] == null)
                    {
                        _cells[i, j] = new CellNumber(i, j);
                    }
                }
            }
            //Calculate cellValues
            CalcValueCells();

            //Sets the player to start the game
            SetCurrentPlayer();            

            //When starting all players must update players information
            //Who is active and who is not
            foreach (Player p in _players)
            {
                foreach (Player pl in _players)
                {
                    p.RefreshAddPlayer(pl);
                }
            }

            _sStatus = GameStatus.STARTED;

            return true;
        }
        public Player GetPlayer(int playerId)
        {
            return _players[playerId];
        }        
        public void Play(int playerID, int posX, int posY)
        {
            //ProcessCellClicked returns false if the player didn't hit a mine
            //and so, next player must be set
            if (!ProcessCellClicked(playerID, posX, posY))
            {
                _players[_currentPlayer].Active = false;
                //Keeps the reference for the actual player playing
                Player old = _players[_currentPlayer];
                SetCurrentPlayer();
                foreach (Player p in _players)
                {
                    //Adds both old player (Now inactive) and current Player (Now Active)
                    //to all players Refresh list
                    p.RefreshAddPlayer(old);
                    p.RefreshAddPlayer(_players[_currentPlayer]);
                }
            }
            else
            {
                //If the player hit a mine GameOver must be checked
                CheckGameOver();
            }
        }
    }
}