using System;

namespace Minesweeper
{
    public static class Invite
    {
        public static string GetGameInvite(string gName, string pName)
        {
            string rStr = "<font style='color:yellow;'>Player " + pName
                + " invites you to play a private game! Accept? "
                + " <a href='' onClick='LobbyController.JoinGame(\""
                + gName + "\")'> Yes! </a></font>";
            return rStr;
        }
    }
}
