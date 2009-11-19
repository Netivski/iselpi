using System;
using JsonExSerializer;

namespace MinesweeperHandler.Utils
{
    internal class JSon
    {
        JSon() { }

        public static string Serialize<T>(T obj)
        {
            return new Serializer(typeof(T)).Serialize(obj);
        }
    }
}
