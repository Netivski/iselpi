using System;
using System.Windows.Forms;
using System.Threading;
using System.IO;
using WebStressTool.HttpClient;
using WebStressTool.Utils;


namespace WebStressTool
{
    public partial class FormStressTool : Form
    {
        public FormStressTool()
        {
            InitializeComponent();
        }

        protected void OnEndInvoke(object sender, EventArgs e)
        {
            if (txtResult.InvokeRequired)
            {
                txtResult.BeginInvoke(new BeginInvoke(delegate()
                {
                    txtResult.AppendText("EndInvoke");
                    txtResult.AppendText(Environment.NewLine);
                }));

                return;
            }

            txtResult.AppendText("EndInvoke");
            txtResult.AppendText(Environment.NewLine);
        }

        protected void EndRequestInvoke(object sender, EventArgs e)
        {

            if (txtResult.InvokeRequired)
            {
                txtResult.BeginInvoke(new BeginInvoke(delegate()
                {
                    txtResult.AppendText(((EndRequestEventArgs)e).State.ToString());
                    txtResult.AppendText(Environment.NewLine);
                }));

                return;
            }

            txtResult.AppendText(((EndRequestEventArgs)e).State.ToString());
            txtResult.AppendText(Environment.NewLine);
        }
       
        private void button1_Click(object sender, EventArgs e)
        {
            StressToolWorker worker = new StressToolWorker(new DirectoryInfo(fbdObject.SelectedPath));
            worker.EndInvoke        += OnEndInvoke;
            worker.EndRequestInvoke += EndRequestInvoke;
            worker.Invoke( requestCount.Value );
        }

        private void FormStressTool_Load(object sender, EventArgs e)
        {
            requestCount_Scroll( null, null );
        }

        private void requestCount_Scroll(object sender, EventArgs e)
        {
            lblRequestCount.Text =  requestCount.Value.ToString("000000000");

        }

        private void btnShowDialog_Click(object sender, EventArgs e)
        {
            fbdObject.SelectedPath = AppDomain.CurrentDomain.BaseDirectory;
            fbdObject.ShowDialog();

            txtBaseDirectory.Text = fbdObject.SelectedPath;
            btnGo.Enabled = fbdObject.SelectedPath != null;
        }        

    }
}
