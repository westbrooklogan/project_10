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
            XmlHandler.create_Xml_Files();

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
}
