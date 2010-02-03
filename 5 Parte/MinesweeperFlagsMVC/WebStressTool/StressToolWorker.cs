using System;
using System.IO;
using System.Threading;
using WebStressTool.Proxy;
using WebStressTool.HttpClient;


namespace WebStressTool
{
    internal class StressToolWorker
    {
        public EventHandler EndInvoke;
        public EventHandler EndRequestInvoke;

        DirectoryInfo baseDirectory; 
        volatile int  requestCount;

        public StressToolWorker( DirectoryInfo baseDirectory  )
        {
            if (baseDirectory == null) throw new ArgumentNullException("baseDirectory");
            if (!baseDirectory.Exists) throw new ArgumentException("baseDirectory");

            this.baseDirectory = baseDirectory;
        }

        protected void OnEndRequest(object sender, EventArgs args)
        {
            EndRequestArgs eRequest = ((EndRequestArgs)args);
            eRequest.DataReader.Close();

            eRequest.DataWriter.Flush();
            eRequest.DataWriter.Close();

            if (EndInvoke != null) EndInvoke(this, new EndRequestEventArgs ( eRequest.State) );
        }


        void DoRequest( object requestItem )
        {
            RequestItem request = (RequestItem)requestItem;
            try
            {
                AsynchronousHttpClient ac = new AsynchronousHttpClient(request.RequestUrl, new StreamReader(request.SourceFilePath), new StreamWriter( request.DestinationFilePath ));
                ac.EndRequest += OnEndRequest;
                ac.DoRequest();
            }
            finally
            {
                System.Threading.Interlocked.Decrement(ref requestCount);
                if (EndInvoke != null) EndInvoke( this, null );
            }
        }

        public void Invoke()
        {
            FileInfo[] requestItems = baseDirectory.GetFiles("*.req");
            if (requestItems != null)
            {
                requestCount = requestItems.Length;
                foreach (FileInfo request in requestItems) ThreadPool.QueueUserWorkItem(DoRequest, new RequestItem(request));
            }
        }
    }
}
