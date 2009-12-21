using System;

namespace Minesweeper
{
    public class Message : IToJSon
    {
        public Message() { Type = MessageType.Undefined; }

        public Message(string message, string owner)
            : this()
        {
            Value = message;
            Owner = owner;
        }

        public Message(MessageType type, string message)
        {
            Type = type;
            Value = message;
        }

        public MessageType Type
        {
            get;
            set;
        }

        public string Value { get; set; }

        public string Owner { get; set; }

        public string ToJSon()
        {
            return "{\"msg\":\"" + Value + "\" , \"owner\":\"" + Owner + "\"}"; ;
        }
    }
}
