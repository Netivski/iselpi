using System;

namespace Minesweeper
{
    public class Invite : Message
    {

        public string YesHandler { get; set; }
        public string YesParam { get; set; }
        public string NoHandler { get; set; }
        public string NoParam { get; set; }

        public override string ToJSon()
        {
            string rObj = "{\"";
            return rObj;
        }
    }
}
