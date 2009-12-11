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

        public Game this[string name]
        {
            get
            {
                if (games.ContainsKey(name)) return games[name];

                return null;
            }
        }

        public bool CreateGame(string gameName, string playerName)
        {
            if (games.ContainsKey(gameName)) return false;

            games.Add( gameName, new Game( gameName, playerName, COLS, ROWS ) );

            return true;
        }

        public List<string> GetActiveGames() 
        {
            List<string> rObj = new List<string>();
            foreach (string gName in games.Keys)
            {
                if (games[gName].Status == GameStatus.WAITING_FOR_PLAYERS)
                {
                    rObj.Add(gName);
                }
            }
            return rObj;
        }

        public Player LoadPlayer(string eMail)
        {
            // Implementar depois de definir a forma de persistir os dados

            //Trevial case
            if (eMail == null) return new Minesweeper.Player();

            return new Player();
        }

    }
}
