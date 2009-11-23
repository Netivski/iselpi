using System;
using System.Collections.Generic;
using Minesweeper;

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

        public static String GetJSon<T>(List<T> list) where T : IToJSon
        {
            String retJSon = "";
            list.ForEach(x => retJSon += x.ToJSon() + ";");
            if (retJSon.Length > 0)
                retJSon = "(" + retJSon.Substring(0, retJSon.Length - 1) + ")";

            return retJSon;
        }
    }
}
