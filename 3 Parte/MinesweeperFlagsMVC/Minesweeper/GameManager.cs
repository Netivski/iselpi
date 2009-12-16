using System;
using System.Collections.Generic;
using System.Linq;

namespace Minesweeper
{
    public class GameManager
    {
        const int COLS = 20;
        const int ROWS = 20; 
        Dictionary<string, Game>   games;
        Dictionary<string, Player> players;

        GameManager() 
        {
            games   = new Dictionary<string, Game>();
            players = new Dictionary<string, Player>();
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
            Player rObj = null;

            if (eMail != null)
            {
                try { rObj = players[eMail]; }
                catch (KeyNotFoundException) { }
            }

            return rObj == null ? new Player(string.Empty, eMail) : rObj;
        }

        public bool AddPlayer(Player player) 
        {
            if (players == null) return false;

            if (players.ContainsKey(player.EMail)) players[player.EMail] = player;
            else players.Add(player.EMail, player);

            return true;
        }


        public bool Invite(string gName, string eMailFrom, string eMailTo)
        {
            if (gName     == null) throw new ArgumentNullException("gName");
            if (eMailFrom == null) throw new ArgumentNullException("eMailFrom");
            if (eMailTo   == null) throw new ArgumentNullException("eMailTo");

            if (!games.ContainsKey(gName))       throw new ApplicationException("Invalid Game!");
            if (!players.ContainsKey(eMailFrom)) throw new ApplicationException("Invalid Source Plyer!");
            if (!players.ContainsKey(eMailTo))   throw new ApplicationException("Invalid Destination Plyer!");


            return players[eMailTo].AddInvite(gName, eMailFrom);            
        }

        public bool AcceptInvite(string gName, string eMail)
        {
            if (gName == null) throw new ArgumentNullException("gName");
            if (eMail == null) throw new ArgumentNullException("eMail");

            if (!players.ContainsKey(eMail)) throw new ApplicationException("Invalid Player e-Mail");

            return players[eMail].AcceptInvite(gName);
        }

        public IEnumerable<KeyValuePair<string, Player>> GetOnlinePlayers()
        {
            return players.Where(p => p.Value.Online);
        }

        public bool AddFriend(string eMail, string friend)
        {
            if (eMail  == null) throw new ArgumentNullException("eMail");
            if (friend == null) throw new ArgumentNullException("friend");

            if (!players.ContainsKey(eMail)) return false;
            return players[eMail].AddFriend(friend);
        }

        public bool RemoveFriend(string eMail, string friend)
        {
            if (eMail  == null) throw new ArgumentNullException("eMail");
            if (friend == null) throw new ArgumentNullException("friend");

            if (!players.ContainsKey(eMail)) return false;
            return players[eMail].RemoveFriend(friend);
        }

        public void AddMessage(Message msg, List<Player> players)
        {
            players.ForEach(p => p.AddMessage(msg));
        }
    }
}
