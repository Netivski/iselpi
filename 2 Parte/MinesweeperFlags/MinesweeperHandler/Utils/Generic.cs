using System;

namespace MinesweeperHandler.Utils
{
    public class Generic
    {
        Generic() { }

        public static int GetInt(string intValue)
        {
            int rValue;
            int.TryParse(intValue, out rValue);
            return rValue;
        }
    }
}
