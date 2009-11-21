using System;
using System.Collections.Generic;

namespace Minesweeper
{
    public class Game
    {
        const int MAX_PLAYERS = 4;
        const int TOTAL_MINES = 51;

        string name;
        GameStatus sStatus;
        Player[] players;
        int playersCount;
        Cell[,] cells;
        int _lines;
        int _cols;
        int currentPlayer;
        int totalMines;
        int minesLeft;

        public Game(string name, string playerName, int cols, int rows)
        {
            this.name = name;
            sStatus = GameStatus.WAITING_FOR_PLAYERS;
            players = new Player[MAX_PLAYERS];
            cells = new Cell[rows, cols];
            playersCount = 0;
            currentPlayer = 0;
            AddPlayer(playerName); //Owner (id = 1)
        }

        private int calcMines()
        {
            if (TOTAL_MINES % playersCount == 0)
                return TOTAL_MINES + 1;
            return TOTAL_MINES;
        }

        private void reCalcMines()
        {
            if (minesLeft % playersCount == 0)
                totalMines -= 1;
        }

        public string Name
        {
            get { return name; }
        }

        public int MinesLeft
        {
            get { return minesLeft; }
        }

        public GameStatus Status
        {
            get { return sStatus; }
        }

        public int AddPlayer(string name)
        {
            if (playersCount < MAX_PLAYERS)
            {
                Player player = new Player(playersCount+1, name);
                players[playersCount++] = player;
                foreach (Player p in players)
                {
                    if (p != null)
                    {
                        p.RefreshAddPlayer(player);
                        if (p.Id != player.Id)
                            player.RefreshAddPlayer(p);
                    }
                }
                return playersCount;
            }
            return ~0;
        }

        public void RemovePlayer(int id)
        {
            players[--id] = null;
        }

        public bool Start()
        {
            if (playersCount < 2) return false;

            for (int i = 0; i < _cols; i++)
            {
                for (int j = 0; j < _lines; j++)
                {
                    if (cells[i, j] != null)
                    {
                        cells[i, j] = new CellNumber(i, j);
                    }
                }
            }
            sStatus = GameStatus.STARTED;

            return true;
        }

        public Player GetPlayer(int playerId)
        {
            return players[playerId];
        }

        public List<Player> GetRefreshPlayer(int playerId)
        {
            List<Player> d = players[playerId - 1].GetRefreshPlayer();
            players[playerId - 1].ResetRefreshPlayer();
            return d;            
        }

        public bool Play(int playerId)
        {
            if (((currentPlayer + 1) % playersCount) != playerId) return false;

            return true;
        }

        public List<Cell> GetRefreshCell(int playerId)
        {
            List<Cell> sRef = players[playerId].GetRefreshCell(); //sRef = Strong Reference
            players[playerId].ResetRefreshCell();
            return sRef;
        }

        private void genMinesPos()
        {
            int cont = 0;

            Random rLine = new Random();
            Random rCol = new Random();

            while (cont < totalMines)
            {
                int x = rCol.Next(0, _cols - 1);
                int y = rLine.Next(0, _lines - 1);
                if (cells[x, y] == null)
                {
                    cells[x, y] = new CellMine(x, y);
                    cont++;
                }
            }
        }

    }
}