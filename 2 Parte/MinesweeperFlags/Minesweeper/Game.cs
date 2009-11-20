using System;
using System.Collections.Generic;
using System.Security.Cryptography;

namespace Minesweeper
{
    public class Game
    {
        const int MAX_PLAYERS = 4;
        const int TOTAL_MINES = 51;

        string                   name;
        GameStatus               sStatus;
        Player[]                 players;
        int                      playersCount;
        Cell[,]                  cells;
        int                      currentPlayer;
        int                      totalMines;
        int                      minesLeft;

        public Game( string name, string playerName, int cols, int rows )
        {
            this.name     = name;
            sStatus       = GameStatus.WAITING_FOR_PLAYERS;
            players       = new Player[MAX_PLAYERS];
            cells         = new Cell[rows, cols];
            playersCount  = 0;
            currentPlayer = 0;
            AddPlayer(playerName); //Owner
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
            get { return name;  }
        }

        public GameStatus Status
        {
            get { return sStatus; }
        }

        public int AddPlayer( string name )
        {
            Player player = new Player(playersCount, name);
            players[ playersCount++ ] = player ;
            return playersCount;
        }

        public void RemovePlayer( int id )
        {
            //Falta o AI JASUS!!!

            players[id] = null;
        }

        public bool Start()
        {
            if ( playersCount  < 2 ) return false;

            //Cria as cel
            sStatus = GameStatus.STARTED;

            return true;
        }

        public Player GetPlayer(int playerId)
        {
            return players[playerId];
        }

        public bool Play( int playerId )
        {
            if (((currentPlayer + 1) % playersCount) != playerId) return false;

            return true;
        }

        public Dictionary<int, Cell> GetRefreshCell(int playerId)
        {
            Dictionary<int, Cell> sRef = players[playerId].GetRefreshCell(); //sRef = Strong Reference
            players[playerId].ResetRefreshCell();
            return sRef;
        }

        private bool[] genMinesPos()
        {
            int cont = 0;
            bool[] _minesPos = new bool[totalMines];

            Random rNum = new Random();

            while (cont < totalMines)
            {
                int n = rNum.Next(cont, totalMines - 1);
                if (!_minesPos[n])
                {
                    _minesPos[n] = true;
                    cont++;
                }
            }
            return _minesPos;
        }

    }
}
