using System;
using System.Collections.Generic;
using System.Threading;

namespace Minesweeper
{
    public class Game
    {
        const int MAX_PLAYERS = 4;
        const int MIN_PLAYERS = 2;
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
            List<Player> d = _players[playerId].GetRefreshPlayer();
            _players[playerId].ResetRefreshPlayer();
            return d;
        }
        public List<Cell> GetRefreshCell(int playerId)
        {
            List<Cell> sRef = _players[playerId].GetRefreshCell();
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
            int cont = 0, x = 0, y = 0, absPos = 0;

            Random rNum = new Random();

            while (cont < _totalMines)
            {
                absPos = rNum.Next(0, (_cols * _lines) - 1);
                x = (int)(absPos / _cols);
                y = (int)(absPos % _cols);
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
                _currentPlayer = rPlayer.Next(0, _playersCount - 1);
            }
            else
            {
                do
                {
                    _currentPlayer = (_currentPlayer + 1) % _players.Length;
                } while (_players[_currentPlayer] != null || _players[_currentPlayer].Active == false);
            }            
        }
        private void CheckGameOver()
        {
            List<Player> scoreArr = new List<Player>(_players);
            if (_playersCount < MIN_PLAYERS)
            {
                _sStatus = GameStatus.GAME_OVER;
                _currentPlayer = scoreArr[0].Id;
                return;
            }
            scoreArr.RemoveAll(p => p == null || !p.Active);            
            scoreArr.Sort((a, b) => b.Points.CompareTo(a.Points));

            if (MinesLeft + scoreArr[1].Points < scoreArr[0].Points)
            {
                _sStatus = GameStatus.GAME_OVER;
                _currentPlayer = scoreArr[0].Id;
            }
        }

        public void Play(int playerID, int posX, int posY)
        {
            if (isInBounds(posX, posY)) //Sanity check
            {
                if (_cells[posX, posY].Hidden) //Another Sanity check
                {
                    Cell cell = _cells[posX, posY];

                    if (cell.Type == CellType.Mine)
                    {
                        //If is Mine, decrement minesLeft, increment player Points puts player to update
                        //and return true to indicate that this player continues to play
                        _minesLeft--;
                        _players[playerID].Points++;;
                        foreach (Player player in _players)
                        {
                            if (player != null)
                            {
                                player.RefreshAddPlayer(_players[playerID]);
                            }
                        }
                        CheckGameOver();                        
                    }
                    else
                    {
                        //If is Number and value equals 0 then chainReaction
                        //If is Number and is not 0, nothing has to be done because the cell has already
                        //been added to the update cells of all players

                        if (((CellNumber)cell).Value == 0)
                        {
                            cell.Hidden = false;
                            List<Cell> adjCell = GetAdjacentCells(cell);
                            foreach (Cell c in adjCell)
                            {
                                if (c.Type != CellType.Mine)
                                {
                                    if (cell.Hidden)
                                        Play(playerID, c.PosX, c.PosY);
                                }
                            }
                        }
                    }

                    ////This cell will certainly be for update in all players no matter what
                    foreach (Player player in _players)
                    {
                        if (player != null)
                        {
                            player.RefreshAddCell(cell);
                        }
                    }
                }
            }            
        }
        public int AddPlayer(string name)
        {
            if (_playersCount < MAX_PLAYERS)
            {
                Player player = new Player(_playersCount + 1, name);
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
            _players[id].Active = false;
            _playersCount--;
            foreach (Player p in _players)
            {
                p.RefreshAddPlayer(_players[id]);
            }
            CheckGameOver();
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

            //foreach (Player p in _players)
            //{
            //    foreach (Player pl in _players)
            //    {
            //        p.RefreshAddPlayer(pl);
            //    }
            //}

            _sStatus = GameStatus.STARTED;

            return true;
        }
        public Player GetPlayer(int playerId)
        {
            return _players[playerId];
        }
    }
}