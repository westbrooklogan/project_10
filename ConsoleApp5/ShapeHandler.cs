using System;
using System.Collections.Generic;
using System.Text;

namespace visio_test_app
{
    class ShapeHandler
    {
        private float posX = 2;
        private float posY = 2;

        public List<Shape> mapShapes(List<WorkFlowElement> workFlows, int lvl)
        {
            if(workFlows == null || workFlows.Count == 0)
                return null;

            var shapeList = new List<Shape>();

            workFlows.ForEach(workFlow => shapeList.Add(makeShapes(workFlow, lvl)));

            if (shapeList.Count == 0)
                return null;

            return shapeList;
        }

        public Shape makeShapes(WorkFlowElement workFlow, int lev)
        {
            if (workFlow == null)
                return null;

            var shape = new Shape(workFlow.Value);
            var children = workFlow.children;

            if (children.Count > 0)
            {
                children.ForEach(child =>
                {
                    var childShape = makeShapes(child, lev - 1);

                    if (childShape != null)
                        shape.ConnectShapes.AddLast(childShape);
                });

                shape.PosY = 2.0f + (float)lev * 2.5f;

                int count = children.Count;
                float length = (count == 1 ? 0 : (2.0f * (float)(count - 1) + 2.5f * (float)(count - 1)) / 2.0f);
                Console.WriteLine("length:  " + length);
                shape.PosX = shape.ConnectShapes.First.Value.PosX + length;
            }
            else
            {
                shape.PosX = posX;
                shape.PosY = posY;

                posX += 4.5f;
            }

            return shape;
        }
    }

   public  class Shape
    {
        public float PosX { get; set; }
        public float PosY { get; set; }
        public string Name { get; set; }
        public LinkedList<Shape> ConnectShapes;

        public Shape(string name)
        {
            this.Name = name;
            this.PosX = 0;
            this.PosY = 0;
            this.ConnectShapes = new LinkedList<Shape>();
        }

        public Shape(string name,float posX, float posY)
        {
            this.Name = name;
            this.PosX = posX;
            this.PosY = posY;
            this.ConnectShapes = new LinkedList<Shape>();
        }
    }
}
