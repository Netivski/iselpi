using System;
using System.Collections.Generic;

namespace Minesweeper
{
    public class GameManager
    {
        const int COLS = 20;
        const int ROWS = 20;
 
        Dictionary<string, Game> games;

        GameManager() 
        {
            games = new Dictionary<string, Game>();
        }

        static GameManager()
        {
            if (Current == null) Current = new GameManager();
        }

        public static GameManager Current;

        public Game this[string name] { get { return games[name]; } }

        public bool CreateGame(string gameName, string playerName)
        {
            if (games.ContainsKey(gameName)) return false;

            games.Add( gameName, new Game( gameName, playerName, COLS, ROWS ) );

            return true;
        }

        public string[] GetActiveGames() 
        {
            string[] rObj = new string[ games.Keys.Count ];
            games.Keys.CopyTo(rObj, 0);
            return rObj;
        }
    }
}
