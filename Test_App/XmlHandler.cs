using System;
using System.Collections.Generic;
using System.Text;
using System.Xml;
 
namespace visio_test_app
{
    static class XmlHandler
    {
        private const string relationshipUri = "http://schemas.openxmlformats.org/package/2006/relationships";
        private const string windowsRelUri = "http://schemas.microsoft.com/visio/2010/relationships/windows";
        private const string pagesRelUri = "http://schemas.microsoft.com/visio/2010/relationships/pages";
        private const string pageRelUri = "http://schemas.microsoft.com/visio/2010/relationships/page";
        private const string masterRelUri = "http://schemas.microsoft.com/visio/2010/relationships/master";
        private const string coreUri = "http://schemas.microsoft.com/office/visio/2011/1/core";
        private const string contentTypesUri = "http://schemas.openxmlformats.org/package/2006/content-types";
        private const string relUri = "http://schemas.openxmlformats.org/officeDocument/2006/relationships";
        private const string mastersRelUri = "http://schemas.microsoft.com/visio/2010/relationships/masters";
        private const string docRelUri = "http://schemas.microsoft.com/visio/2010/relationships/document";
        private const string documentContentType = "application/vnd.ms-visio.drawing.main+xml";
        private const string relationshipContentType = "application/vnd.openxmlformats-package.relationships+xml";
        private const string pagesContentType = "application/vnd.ms-visio.pages+xml";
        private const string pageContentType = "application/vnd.ms-visio.page+xml";
        private const string windowContentType = "application/vnd.ms-visio.windows+xml";
        private const string mastersContentType = "application/vnd.ms-visio.masters+xml";
        private const string masterContentType = "application/vnd.ms-visio.master+xml";

        private static List<Element> pagesRelElements = new List<Element>()
        {
            new Element("Relationship", new List<Info>()
            {
                new Info("Target", "page.xml"),
                new Info("Type", pageRelUri),
                new Info("Id", "rId1")
            })
        };

        private static List<Element> docRelElements = new List<Element>()
        {
            new Element("Relationship", new List<Info>()
            {
                new Info("Target", "windows.xml"),
                new Info("Type", windowsRelUri),
                new Info("Id", "rId3")
            }),
            new Element("Relationship", new List<Info>()
            {
                new Info("Target", "pages/pages.xml"),
                new Info("Type", pagesRelUri),
                new Info("Id", "rId2")
            }),
            new Element("Relationship", new List<Info>()
            {
                new Info("Target", "masters/masters.xml"),
                new Info("Type", mastersRelUri),
                new Info("Id", "rId1")
            })
        };

        private static List<Element> pageRelElements = new List<Element>()
        {
            new Element("Relationship", new List<Info>()
            {
                new Info("Target", "../masters/master.xml"),
                new Info("Type", masterRelUri),
                new Info("Id", "rId1")
            })
        };

        private static List<Element> mastersRelElements = new List<Element>()
        {
            new Element("Relationship", new List<Info>()
            {
                new Info("Target", "master.xml"),
                new Info("Type", masterRelUri),
                new Info("Id", "rId1")
            })
        };

        private static List<Element> generalRelElement = new List<Element>()
        {
            new Element("Relationship", new List<Info>()
            {
                new Info("Target", "visio/document.xml"),
                new Info("Type", docRelUri),
                new Info("Id", "rId1")
            })
        };

        public static void create_Xml_Files()
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
            writer = create_RelationPage("document.xml.rels", docRelElements);
            doc.Save(writer);
            writer = create_RelationPage("pages.xml.rels", pagesRelElements);
            doc.Save(writer);
            writer = create_RelationPage("page.xml.rels", pageRelElements);
            doc.Save(writer);
            writer = create_RelationPage(".rels", generalRelElement);
            doc.Save(writer);
            writer = create_RelationPage("masters.xml.rels", mastersRelElements);
            doc.Save(writer);
            writer = create_Content_Type_Part("[Content_Types].xml");
            doc.Save(writer);
            
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

        private static XmlWriter create_RelationPage(string fileName, List<Element> elements)
        {
            XmlWriter writer = relationship_Init(fileName);

            elements.ForEach(element =>
            {
                writer.WriteStartElement(element.ElementName);

                element.attributes.ForEach(attribute =>
                    writer.WriteAttributeString(null, attribute.Name, null, attribute.Value));
                writer.WriteEndElement();
            });

            writer.Close();
            return writer;
        }

        private static XmlWriter create_Element(XmlWriter writer, string name, List<Info> attributes)
        {
            writer.WriteStartElement(name);
            attributes.ForEach(attribute => 
                writer.WriteAttributeString(null, attribute.Name, null, attribute.Value));

            return writer;
        }

        private static XmlWriter relationship_Init(string fileName)
        {

            XmlWriter writer = XmlWriter.Create(fileName, xml_Settings_Init());
            writer.WriteStartDocument();
            writer.WriteStartElement("Relationships", relationshipUri);
            return writer;
        }

        private static XmlWriter xml_Writer_Init(string fileName, XmlWriterSettings settings)
        {
            XmlWriter writer = XmlWriter.Create(fileName, settings);
            writer.WriteStartDocument();
            
            return writer;
        }  // start a new writer 

        private static XmlWriter xml_Start(string fileName, string startElmt)
        {
            XmlWriter writer = xml_Writer_Init(fileName.ToLower(), xml_Settings_Init());
            writer.WriteStartElement(startElmt, coreUri);
            writer.WriteAttributeString("xmlns", null, null, coreUri);
            writer.WriteAttributeString("xmlns", "r", null, relUri);
            writer.WriteAttributeString("xml", "space", null, "preserve");

            return writer;
        }

        private static XmlWriter create_Content_Type_Part(string fileName)
        {
            XmlWriter writer = xml_Writer_Init(fileName, xml_Settings_Init());
            writer.WriteStartElement("Types", contentTypesUri);
            writer.WriteStartElement("Default");
            writer.WriteAttributeString(null, "ContentType", null, relationshipContentType);
            writer.WriteAttributeString(null, "Extension", null, "rels");
            writer.WriteEndElement();
            writer.WriteStartElement("Default");
            writer.WriteAttributeString(null, "ContentType", null, "application/xml");
            writer.WriteAttributeString(null, "Extension", null, "xml");
            writer.WriteEndElement();
            writer.WriteStartElement("Override");
            writer.WriteAttributeString(null, "ContentType", null, documentContentType);
            writer.WriteAttributeString(null, "PartName", null, "/visio/document.xml");
            writer.WriteEndElement();
            writer.WriteStartElement("Override");
            writer.WriteAttributeString(null, "ContentType", null, mastersContentType);
            writer.WriteAttributeString(null, "PartName", null, "/visio/masters/masters.xml");
            writer.WriteEndElement();
            writer.WriteStartElement("Override");
            writer.WriteAttributeString(null, "ContentType", null, masterContentType);
            writer.WriteAttributeString(null, "PartName", null, "/visio/masters/master.xml");
            writer.WriteEndElement();
            writer.WriteStartElement("Override");
            writer.WriteAttributeString(null, "ContentType", null, pagesContentType);
            writer.WriteAttributeString(null, "PartName", null, "/visio/pages/pages.xml");
            writer.WriteEndElement();
            writer.WriteStartElement("Override");
            writer.WriteAttributeString(null, "ContentType", null, pageContentType);
            writer.WriteAttributeString(null, "PartName", null, "/visio/pages/page.xml");
            writer.WriteEndElement();
            writer.WriteStartElement("Override");
            writer.WriteAttributeString(null, "ContentType", null, windowContentType);
            writer.WriteAttributeString(null, "PartName", null, "/visio/windows.xml");
            writer.WriteEndElement();
            writer.Close();
            return writer;
        }

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
            XmlWriter writer = xml_Start("document.xml", "VisioDocument");
            writer.WriteStartElement("FaceNames");
            writer.WriteStartElement("FaceName");
            writer.WriteAttributeString(null, "NameU", null, "Calibri");
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
            XmlWriter writer = xml_Start("pages.xml", "Pages");
            writer.WriteStartElement("Page");
            writer.WriteAttributeString(null, "ID", null, "0");
            writer.WriteAttributeString(null, "NameU", null, "Page-1");
            writer.WriteAttributeString(null, "Name", null, "Page-1");
            writer.WriteStartElement("PageSheet");
            writer.WriteAttributeString(null, "LineStyle", null, "0");
            writer.WriteAttributeString(null, "FillStyle", null, "0");
            writer.WriteAttributeString(null, "TextStyle", null, "0");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Rel");
            writer.WriteAttributeString("r", "ID", null, "rId1");
            writer.Close();
            return writer;
        }

        private static XmlWriter create_Page_Part(Queue<List<Info>> cells)
        {
            XmlWriter writer = xml_Start("page.xml", "PageContents");
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
            XmlWriter writer = xml_Start("masters.xml", "Masters");
            writer.WriteStartElement("Master");
            writer.WriteAttributeString(null, "ID", null, "2");
            writer.WriteAttributeString(null, "UniqueID", null, "{0020640D-0002-0000-8E40-00608CF305B2}");
            writer.WriteAttributeString(null, "BaseID", null, "{8FEBAF3E-100E-46A7-AFB4-6F1C4D75A7A7}");
            writer.WriteAttributeString(null, "PatternFlags", null, "0");
            writer.WriteStartElement("PageSheet");
            writer.WriteAttributeString(null, "LineStyle", null, "0");
            writer.WriteAttributeString(null, "TextStyle", null, "0");
            writer.WriteAttributeString(null, "FillStyle", null, "0");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Rel");
            writer.WriteAttributeString("r", "id", null, "rId1");
            writer.Close();
            return writer;
        }

        private static XmlWriter create_Master_Part(Queue<List<Info>> cells)
        {
            XmlWriter writer = xml_Start("master.xml", "MasterContents");
            writer.WriteStartElement("Shapes");
            writer.WriteStartElement("Shape");
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
            writer.WriteAttributeString(null, "T", null, "RelLineTo");
            writer.WriteAttributeString(null, "IX", null, "2");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelLineTo");
            writer.WriteAttributeString(null, "IX", null, "3");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelLineTo");
            writer.WriteAttributeString(null, "IX", null, "4");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteStartElement("Row");
            writer.WriteAttributeString(null, "T", null, "RelLineTo");
            writer.WriteAttributeString(null, "IX", null, "5");
            writer = create_Cells(writer, cells.Dequeue());
            writer.WriteEndElement();
            writer.WriteEndElement();
            writer.WriteStartElement("Text");
            writer.WriteValue("Sample Text");
            writer.Close();
            return writer;
        }

        class Element
        {
            public string ElementName { get; set; }
            public List<Info> attributes;

            public Element(string name, List<Info> atts)
            {
                this.ElementName = name;
                this.attributes = atts;
            }
        }

        class Info
        {
            public Info(string nam, string val)
            {
                this.Name = nam;
                this.Value = val;
            }

            public string Name { get; set; }

            public string Value { get; set; }
        }
    }
}
