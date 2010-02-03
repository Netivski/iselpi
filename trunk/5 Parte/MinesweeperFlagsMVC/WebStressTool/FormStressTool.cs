using System;
using System.Windows.Forms;
using System.Threading;
using WebStressTool.HttpClient;
using System.IO;

namespace WebStressTool
{
    public partial class FormStressTool : Form
    {
        ManualResetEvent mre = null;

        public FormStressTool()
        {
            InitializeComponent();
        }
       
        protected void OnEndRequest(object sender, EventArgs args)
        {
            EndRequestArgs eRequest = ((EndRequestArgs)args);
            eRequest.DataReader.Close();

            eRequest.DataWriter.Flush();
            eRequest.DataWriter.Close();

            mre.Set();
        }


        public void DoWork( Uri requestUrl )
        {
            mre = new ManualResetEvent(false);

            AsynchronousHttpClient ac = new AsynchronousHttpClient(requestUrl, new StreamReader(string.Format(@"c:\temp\{0}.req", requestUrl.Host)), new StreamWriter(string.Format(@"c:\temp\{0}.res", requestUrl.Host)) );
            ac.EndRequest += OnEndRequest;
            ac.DoRequest();

            mre.WaitOne();
        }

        private void FormStressTool_Load(object sender, EventArgs e)
        {
        }

        private void button1_Click(object sender, EventArgs e)
        {
            WorkItem( new Uri("http://www.sapo.pt"));
        }

        void WorkItem( Uri requestUrl ) //Criar o obejcto do tipo Request, com as propriedades FileReader e FileWriter
        {
            DoWork(requestUrl);
        }
    }
}
