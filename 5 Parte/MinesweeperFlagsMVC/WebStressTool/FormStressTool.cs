using System;
using System.Windows.Forms;
using System.Threading;
using WebStressTool.HttpClient;
using System.IO;

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
        }

        protected void EndRequestInvoke(object sender, EventArgs e)
        {
        }
       
        private void button1_Click(object sender, EventArgs e)
        {
        }

        private void FormStressTool_Load(object sender, EventArgs e)
        {
            //new StressToolWorker(  

        }        

    }
}
