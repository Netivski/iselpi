using System;
using System.Text;
using System.Security.Cryptography;

namespace Minesweeper.Security
{
    internal class Cryptography
    {
        const string key = "_$_ISEL_$_P$I_$_";

        public static byte[] Encrypt(String pwd)
        {
            byte[] pwdhash = null;
            try
            {                
                using (MD5CryptoServiceProvider hashmd5 = new MD5CryptoServiceProvider())
                {
                    pwdhash = hashmd5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(key));
                }
                
            }
            catch (Exception e){ throw e; }
            return pwdhash;
        }
    }
}
