using System;
using System.Collections.Generic;
using System.Linq;

namespace Minesweeper
{
    public class Lobby
    {
        const int COLS = 20;
        const int ROWS = 20;
        Dictionary<string, Game> games;
        Dictionary<string, Player> players;

        Lobby()
        {
            games = new Dictionary<string, Game>();
            players = new Dictionary<string, Player>(){
                    {"ze@aol.com", new Player("Zé Manel","ze.manel@aol.com")},
                    {"maria@aol.com", new Player("Maria","maria@aol.com")},
                    {"toi@aol.com", new Player("António","toi@aol.com")}};
        }

        static Lobby()
        {
            if (Current == null) Current = new Lobby();
        }

        public static Lobby Current;

        public Game this[string name]
        {
            get
            {
                if (games.ContainsKey(name)) return games[name];
                return null;
            }
        }

        //--------------------------
        // Games Management

        public bool CreateGame(string gName, string pName)
        {
            if (gName == null) throw new ArgumentNullException("gName");
            if (pName == null) throw new ArgumentNullException("pName");

            if (games.ContainsKey(gName)) return false;
            games.Add(gName, new Game(gName, pName, COLS, ROWS));
            return true;
        }

        public IEnumerable<string> GetActiveGames()
        {
            return (from g in games.Keys
                    where (games[g].Status == GameStatus.WAITING_FOR_PLAYERS)
                    select g);
        }

        //--------------------------
        // Players Management

        public IEnumerable<Player> GetOnlinePlayers()
        {
            return (from p in players.Values
                    where (p.Online)
                    select p);
        }

        public Player LoadPlayer(string eMail)
        {
            Player rObj = null;

            if (eMail != null)
            {
                try { rObj = players[eMail]; }
                catch (KeyNotFoundException) { }
            }

            return rObj;
        }

        public Player GetPlayer(string name)
        {
            if (players.ContainsKey(name)) return players[name];
            return null;
        }

        public bool AddPlayer(Player player)
        {
            if (players.ContainsValue(player) || player == null) return false;
            players.Add(player.EMail, player);
            foreach (Player p in players.Values)
            {
                if (p.EMail != player.EMail)
                    p.AddRefreshPlayers(player);
            }
            return true;
        }

        public bool UpdatePlayer(Player player)
        {
            if (!players.ContainsValue(player) || player == null) return false;
            players[player.EMail] = player;
            return true;
        }

        public bool Invite(string gName, string eMailFrom, string eMailTo)
        {
            if (gName == null) throw new ArgumentNullException("gName");
            if (eMailFrom == null) throw new ArgumentNullException("eMailFrom");
            if (eMailTo == null) throw new ArgumentNullException("eMailTo");

            if (!games.ContainsKey(gName)) throw new ApplicationException("Invalid Game!");
            if (!players.ContainsKey(eMailFrom)) throw new ApplicationException("Invalid Source Plyer!");
            if (!players.ContainsKey(eMailTo)) throw new ApplicationException("Invalid Destination Plyer!");

            return players[eMailTo].ReceiveGameInvite(gName, eMailFrom);
        }

        public bool AddFriend(string eMail, string friend)
        {
            if (eMail == null) throw new ArgumentNullException("eMail");
            if (friend == null) throw new ArgumentNullException("friend");

            if (!players.ContainsKey(eMail)) return false;
            return (players[eMail].AddFriend(friend));
        }

        public bool RemoveFriend(string eMail, string friend)
        {
            if (eMail == null) throw new ArgumentNullException("eMail");
            if (friend == null) throw new ArgumentNullException("friend");

            if (!players.ContainsKey(eMail)) return false;
            players[eMail].RemoveFriend(friend);
            return players[eMail].AddRefreshPlayers(friend);
        }

        public void AddMessage(Message msg, List<Player> players)
        {
            players.ForEach(p => p.AddMessage(msg));
        }
    }
}
