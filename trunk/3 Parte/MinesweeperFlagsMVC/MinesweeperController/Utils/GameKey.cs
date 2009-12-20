using System;

namespace MinesweeperControllers.Utils
{
    internal static class GameKey
    {
        static int    count;
        static object monitor;

        static GameKey()
        {
            count = 0;
            monitor = new object();
        }

        public static string GetKey()
        {
            int v;
            lock (monitor) v = ++count;

            return string.Format( "g{0}", v.ToString("00000000") );
        }
    }
}
