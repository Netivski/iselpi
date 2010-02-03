namespace WebStressTool
{
    partial class FormStressTool
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.button1 = new System.Windows.Forms.Button();
            this.txtResult = new System.Windows.Forms.TextBox();
            this.requestCount = new System.Windows.Forms.TrackBar();
            ((System.ComponentModel.ISupportInitialize)(this.requestCount)).BeginInit();
            this.SuspendLayout();
            // 
            // button1
            // 
            this.button1.Location = new System.Drawing.Point(410, 213);
            this.button1.Name = "button1";
            this.button1.Size = new System.Drawing.Size(75, 23);
            this.button1.TabIndex = 0;
            this.button1.Text = "Go";
            this.button1.UseVisualStyleBackColor = true;
            this.button1.Click += new System.EventHandler(this.button1_Click);
            // 
            // txtResult
            // 
            this.txtResult.Location = new System.Drawing.Point(6, 8);
            this.txtResult.Multiline = true;
            this.txtResult.Name = "txtResult";
            this.txtResult.ScrollBars = System.Windows.Forms.ScrollBars.Both;
            this.txtResult.Size = new System.Drawing.Size(479, 198);
            this.txtResult.TabIndex = 1;
            // 
            // requestCount
            // 
            this.requestCount.Location = new System.Drawing.Point(6, 206);
            this.requestCount.Maximum = 1000;
            this.requestCount.Minimum = 1;
            this.requestCount.Name = "requestCount";
            this.requestCount.Size = new System.Drawing.Size(398, 42);
            this.requestCount.TabIndex = 2;
            this.requestCount.Value = 1;
            // 
            // FormStressTool
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(497, 245);
            this.Controls.Add(this.requestCount);
            this.Controls.Add(this.txtResult);
            this.Controls.Add(this.button1);
            this.MaximizeBox = false;
            this.Name = "FormStressTool";
            this.Text = ".: Web Stresssss Tool :.";
            this.Load += new System.EventHandler(this.FormStressTool_Load);
            ((System.ComponentModel.ISupportInitialize)(this.requestCount)).EndInit();
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button button1;
        private System.Windows.Forms.TextBox txtResult;
        private System.Windows.Forms.TrackBar requestCount;
    }
}

