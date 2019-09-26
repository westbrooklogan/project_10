﻿using System;
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
            XmlDocument doc = create_Document();
            XmlWriter writer = create_Document_Part(create_Doc_Queue());
            doc.Save(writer);
            writer = create_Pages_Part(create_Pages_Queue());
            doc.Save(writer);
            writer = create_Masters_Part(create_Masters_Queue());
            doc.Save(writer);
            writer = create_Master_Part(create_Master_Queue());
            doc.Save(writer);
            writer = create_Page_Part(create_Page_Queue());
            doc.Save(writer);

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

            foreach (Shape s in children)
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

        private static XmlWriter xml_Writer_Init(string fileName, string startElmt, XmlWriterSettings settings)
        {
            XmlWriter writer = XmlWriter.Create(fileName, settings);

            writer.WriteStartDocument();
            writer.WriteStartElement(startElmt, "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", null, null, "http://schemas.microsoft.com/office/visio/2011/1/core");
            writer.WriteAttributeString("xmlns", "r", null, "http://schemas.openxmlformats.org/officeDocument/2006/relationships");
            writer.WriteAttributeString("xml", "space", null, "preserve");

            return writer;
        }  // start a new writer 



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

        private static Queue<List<Info>> create_Page_Queue()
        {
            List<Info> pageCells = new List<Info>()
            {
                new Info("PinX", "4"),
                new Info("PinY", "5.5")
            };

            Queue<List<Info>> cells = new Queue<List<Info>>();
            cells.Enqueue(pageCells);

            return cells;
        }

        private static Queue<List<Info>> create_Masters_Queue()
        {
            List<Info> mastersCells = new List<Info>()
            {
                new Info("PageWidth", "2"),
                new Info("PageHeight", "1"),
                new Info("PageScale", "1"),
                new Info("DrawingScale", "1")
            };

            Queue<List<Info>> cells = new Queue<List<Info>>();
            cells.Enqueue(mastersCells);

            return cells;
        }

        private static Queue<List<Info>> create_Master_Queue()
        {
            List<Info> shapeCells = new List<Info>()
            {
                new Info("PinX", "1"),
                new Info("PinY", "0.5"),
                new Info("Width", "2"),
                new Info("Height", "1"),
                new Info("LocPinX", "1"),
                new Info("LocPinY", "0.5"),
                new Info("Angle", "0"),
                new Info("FillForegnd", "#0070c0"),
                new Info("FillBkgnd", "#000000")
            };

            List<Info> geometryCells = new List<Info>()
            {
                new Info("NoFill", "0"),
                new Info("NoLine", "0"),
                new Info("NoShow", "0")
            };

            List<Info> x1Cells = new List<Info>()
            {
                new Info("X", "0"),
                new Info("Y", "0")
            };

            List<Info> x2Cells = new List<Info>()
            {
                new Info("X", "1"),
                new Info("Y", "0")
            };

            List<Info> x3Cells = new List<Info>()
            {
                new Info("X", "1"),
                new Info("Y", "1")
            };

            List<Info> x4Cells = new List<Info>()
            {
                new Info("X", "0"),
                new Info("Y", "1")
            };

            List<Info> x5Cells = new List<Info>()
            {
                new Info("X", "0"),
                new Info("Y", "0")
            };

            Queue<List<Info>> cells = new Queue<List<Info>>();
            cells.Enqueue(shapeCells);
            cells.Enqueue(geometryCells);
            cells.Enqueue(x1Cells);
            cells.Enqueue(x2Cells);
            cells.Enqueue(x3Cells);
            cells.Enqueue(x4Cells);
            cells.Enqueue(x5Cells);

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
            XmlWriter writer = xml_Writer_Init("document.xml", "VisioDocument", xml_Settings_Init());
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
            XmlWriter writer = xml_Writer_Init("pages.xml", "Pages", xml_Settings_Init());
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

        private static XmlWriter create_Page_Part(Queue<List<Info>> cells)
        {
            XmlWriter writer = xml_Writer_Init("page.xml", "PageContents", xml_Settings_Init());
            writer.WriteStartElement("Shapes");
            writer.WriteStartElement("Shape");
            writer.WriteAttributeString(null, "ID", null, "1");
            writer.WriteAttributeString(null, "Type", null, "Shape");
            writer.WriteAttributeString(null, "Master", null, "2");
            writer = create_Cells(writer, cells.Dequeue());
            writer.Close();
            return writer;
        }

        private static XmlWriter create_Masters_Part(Queue<List<Info>> cells)
        {
            XmlWriter writer = xml_Writer_Init("Masters.xml", "Masters", xml_Settings_Init());
            writer.WriteStartElement("Master");
            writer.WriteAttributeString(null, "ID", null, "2");
            writer.WriteAttributeString(null, "UniqueID", null, "{0020640D-0002-0000-8E40-00608CF305B2}");
            writer.WriteAttributeString(null, "BaseID", null, "{{8FEBAF3E-100E-46A7AFB4-6F1C4D75A7A7}");
            writer.WriteAttributeString(null, "PatternFlags", null, "0");
            writer.WriteStartElement("PageSheet");
            writer.WriteAttributeString(null, "LineStyle", null, "0");
            writer.WriteAttributeString(null, "TextStyle", null, "0");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteStartElement("Rel");
            writer.WriteAttributeString("r", "id", null, "rId1");
            writer.Close();
            return writer;
        }

        private static XmlWriter create_Master_Part(Queue<List<Info>> cells)
        {
            XmlWriter writer = xml_Writer_Init("Master.xml", "MasterContents", xml_Settings_Init());
            writer.WriteStartElement("Shapes");
            writer.WriteAttributeString(null, "ID", null, "5");
            writer.WriteAttributeString(null, "Type", null, "Shape");
            writer.WriteAttributeString(null, "LineStyle", null, "3");
            writer.WriteAttributeString(null, "FillStyle", null, "3");
            writer.WriteAttributeString(null, "TextStyle", null, "3");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteStartElement("Section");
            writer.WriteAttributeString(null, "N", null, "Geometry");
            writer.WriteAttributeString(null, "IX", null, "0");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelMoveTo");
            writer.WriteAttributeString(null, "IX", null, "1");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelMoveTo");
            writer.WriteAttributeString(null, "IX", null, "2");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelMoveTo");
            writer.WriteAttributeString(null, "IX", null, "3");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelMoveTo");
            writer.WriteAttributeString(null, "IX", null, "4");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelMoveTo");
            writer.WriteAttributeString(null, "IX", null, "5");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteStartElement("Text");
            writer.WriteValue("Sample Text");
            writer.Close();
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

            if (content != null)
                foreach (JObject j in content)
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
