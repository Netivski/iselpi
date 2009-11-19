using System;
using System.Collections.Generic;

namespace Minesweeper
{
    public class Game
    {
        const int MAX_PLAYERS = 4;

        string                   name;
        GameStatus               sStatus;
        Player[]                 players;
        int                      playersCount;
        Cell[,]                  cells;
        int                      currentPlayer;


        public Game( string name, string playerName, int cols, int rows )
        {
            this.name     = name;
            sStatus       = GameStatus.WAITING_FOR_PLAYERS;
            players       = new Player[MAX_PLAYERS];
            cells         = new Cell[rows, cols];
            playersCount  = 0;
            currentPlayer = 0;
            JoinPlayer(playerName); //Owner
        }

        public string Name
        {
            get { return name;  }
        }

        public GameStatus Status
        {
            get { return sStatus; }
        }

        public int JoinPlayer( string name )
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
    }
}
