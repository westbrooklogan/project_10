using System;
using System.Xml;
using System.Collections.Generic;
using Newtonsoft.Json.Linq;


namespace visio_test_app
{
    class Program
    {
        private static FileHandler fileHandler;
        private static DataMapHandler dataMapHandler;
        private static ShapeHandler shapeHandler;

        static void Main(string[] args)
        {
            /* XmlDocument doc = create_Document();
            Queue<List<Info>> cells = create_Doc_Queue();
            XmlWriter docWriter = create_Document_Part(cells);
            cells = create_Pages_Queue();
            XmlWriter pagesWriter = create_Pages_Part(cells);
            doc.Save(docWriter);
            doc.Save(pagesWriter);*/
            fileHandler = new FileHandler();
            dataMapHandler = new DataMapHandler();
            shapeHandler = new ShapeHandler();

            fileHandler.fileLoadedEvent += dataMapHandler.mapWorkFlow;
            dataMapHandler.dataMappedEvent += shapeHandler.mapShapes;

            List<Shape> shapeList = fileHandler.load_File("C:/Users/westb/source/repos/VisioAddIn1/json1.json");

            shapeList.ForEach(shape => {
                shapeDetails(shape);   
            });
        }

        static private void shapeDetails(Shape shape)
        {
            var children = shape.ConnectShapes;

            foreach(Shape s in children)
            {
                shapeDetails(s);
            }

            Console.WriteLine("Name:  " + shape.Name);
            Console.WriteLine("PosX:  " + shape.PosX);
            Console.WriteLine("PosY:  " + shape.PosY);

        }

        private static XmlWriterSettings xml_Settings_Init()
        {
            // new XmlWritersetting
            XmlWriterSettings writerSettings = new XmlWriterSettings();
            // allows async xml operations
            writerSettings.Async = true;
            // enables indentation
            writerSettings.Indent = true;

            // return the writer settings.
            return writerSettings;
        }

        private static XmlWriter xml_Writer_Init(string fileName, XmlWriterSettings settings)
        { return XmlWriter.Create(fileName, settings); }  // start a new writer 

        private static XmlWriter create_Cells(XmlWriter writer, List<Info> cellList)
        {
            cellList.ForEach(cell =>
            {
                writer.WriteStartElement("Cell");
                writer.WriteAttributeString(null, "N", null, cell.Name);
                writer.WriteAttributeString(null, "V", null, cell.Value);
                writer.WriteEndElement();
            });

            return writer;
        }

        private static XmlDocument create_Document() { return new XmlDocument(); }

        private static Queue<List<Info>> create_Pages_Queue()
        {
            List<Info> pageCells = new List<Info>()
            {
                new Info("PageWidth", "8.5"),
                new Info("PageHeight", "11"),
                new Info("PageScale", "1"),
                new Info("DrawingScale", "1")
            };

            Queue<List<Info>> cells = new Queue<List<Info>>();
            cells.Enqueue(pageCells);

            return cells;
        }

        private static Queue<List<Info>> create_Doc_Queue()
        {
            List<Info> styleSheetCells = new List<Info>()
            {
                new Info("EnableLineProps", "1"),
                new Info("EnableFillProps", "1"),
                new Info("EnableTextProps", "1"),
                new Info("LineWeight", "0.01041666666666667"),
                new Info("LineColor", "0"),
                new Info("LinePattern", "1"),
                new Info("FillForegnd", "1"),
                new Info("FillPattern", "1"),
                new Info("VerticalAlign", "1")
            };

            List<Info> characterCells = new List<Info>()
            {
                new Info("Font", "Calibri"),
                new Info("Color", "0"),
                new Info("FontScale", "1"),
                new Info("Size", "0.1666666666666667")
            };

            List<Info> paragraphCells = new List<Info>()
            {
                new Info("IndFirst", "0"),
                new Info("IndLeft", "0"),
                new Info("IndRight", "0"),
                new Info("SpLine", "-1.2"),
                new Info("HorzAlign", "1"),
                new Info("Bullet", "0"),
                new Info("BulletStr", ""),
                new Info("BulletFont", "0"),
                new Info("BulletFontSize", "-1"),
                new Info("TextPosAfterBullet", "0"),
                new Info("Flags", "0")
            };

            List<Info> docSheetCells = new List<Info>()
            {
                new Info("DocLangID", "en-US")
            };

            Queue<List<Info>> cells = new Queue<List<Info>>();
            cells.Enqueue(styleSheetCells);
            cells.Enqueue(characterCells);
            cells.Enqueue(paragraphCells);
            cells.Enqueue(docSheetCells);
            return cells;
        }

        private static XmlWriter create_Document_Part(Queue<List<Info>> cells)
        {
            // create the writer for the 
            XmlWriter writer = xml_Writer_Init("document.xml", xml_Settings_Init());
            writer.WriteStartDocument();
            writer.WriteStartElement("VisioDocument", "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", null, null, "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", "r", null, "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            writer.WriteAttributeString("xml", "space", null, "preserve");
            writer.WriteStartElement("FaceNames");
            writer.WriteStartElement("FaceName");
            writer.WriteAttributeString(null, "NameU", null, "Calibiri");
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteStartElement("StyleSheets");
            writer.WriteStartElement("StyleSheet");
            writer.WriteAttributeString(null, "ID", null, "0");
            writer.WriteAttributeString(null, "NameU", null, "No Style");
            writer.WriteAttributeString(null, "Name", null, "No Style");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteStartElement("Section");
            writer.WriteAttributeString(null, "N", null, "Character");
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "IX", null, "0");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteStartElement("Section");
            writer.WriteAttributeString(null, "N", null, "Paragraph");
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "IX", null, "0");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteStartElement("Section");
            writer.WriteAttributeString(null, "N", null, "Tabs");
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "IX", null, "0");
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteStartElement("DocumentSheet");
            writer.WriteAttributeString(null, "NameU", null, "TheDoc");
            writer.WriteAttributeString(null, "Name", null, "TheDoc");
            writer.WriteAttributeString(null, "LineStyle", null, "0");
            writer.WriteAttributeString(null, "FillStyle", null, "0");
            writer.WriteAttributeString(null, "TextStyle", null, "0");
            writer = create_Cells(writer, cells.Dequeue());
            writer.Close();

            return writer;
        }

        private static XmlWriter create_Pages_Part(Queue<List<Info>> cells)
        {
            XmlWriter writer = xml_Writer_Init("pages.xml", xml_Settings_Init());
            writer.WriteStartDocument();
            writer.WriteStartElement("Pages", "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", null, null, "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", "r", null, "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            writer.WriteAttributeString("xml", "space", null, "preserve");
            writer.WriteStartElement("Page");
            writer.WriteAttributeString(null, "ID", null, "0");
            writer.WriteAttributeString(null, "NameU", null, "Page-1");
            writer.WriteAttributeString(null, "Name", null, "Page-1");
            writer.WriteStartElement("PageSheet");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Rel");
            writer.WriteAttributeString("r", "ID", null, "rId1");
            writer.Close();
            return writer;
        }

        private static XmlWriter create_Page_Part()
        {
            XmlWriter writer = xml_Writer_Init("page.xml", xml_Settings_Init());
            writer.WriteStartDocument();
            writer.WriteStartElement("Page", "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", null, null, "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", "r", null, "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            writer.WriteAttributeString("xml", "space", null, "preserve");

            return writer;
        }

        static private void mapShapes(WorkFlowElement workFlow)
        {

        }

        static private WorkFlowElement _mapWorkFlow(JObject jObject)
        {
            if (jObject == null)
                return null;

            WorkFlowElement workList = new WorkFlowElement(jObject["Name"].ToString(), new List<WorkFlowElement>());
           // Console.WriteLine(workList.Value);
            var children = jObject["Children"];
            //Console.WriteLine(children);
            if (children != null)
                foreach (JObject j in children)
                {
                    var workElement = _mapWorkFlow(j);
                    Console.WriteLine(workElement.Value);
                    if (workElement != null)
                    {
                        Console.WriteLine("hello1323");
                        workList.children.Add(workElement);
                    }
                }
               

           
             return workList;
        }

        static private List<WorkFlowElement> mapWorkFlow(JObject jObject)
        {
            var content = jObject["Content"];
            List<WorkFlowElement> workFlows = new List<WorkFlowElement>();

            if(content != null)
                foreach(JObject j in content)
                    workFlows.Add(_mapWorkFlow(j));

            if (workFlows.Count != 0)
            {
                return workFlows;
            }

            return null;
        }

    }

    class Info
    {
        private string name;
        private string value;
        
        public Info(string nam, string val)
        {
            this.Name = nam;
            this.Value = val;
        }

        public string Name
        {
            get { return this.name; }
            set { this.name = value; }
        }

        public string Value
        {
            get { return this.value; }
            set { this.value = value; }
        }
    }
}
