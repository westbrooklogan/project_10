using System;
using System.Collections.Generic;
using System.Text;
using Newtonsoft.Json.Linq;

namespace visio_test_app
{
    public delegate List<Shape> dataMapped(List<WorkFlowElement> workFlows, int lvl);

    class DataMapHandler
    {
        private int lowestLvl = 0;
        public event dataMapped dataMappedEvent;

        private WorkFlowElement _mapWorkFlow(JObject jObject, int lvl)
        {
            if (jObject == null)
                return null;

            WorkFlowElement workList = new WorkFlowElement(jObject["Name"].ToString(), new List<WorkFlowElement>());
            var children = jObject["Children"];
           
            if (children != null)
                foreach (JObject j in children)
                {
                    var workElement = _mapWorkFlow(j, lvl + 1);
                 
                    if (workElement != null)
                        workList.children.Add(workElement);
                }

            if (lvl > lowestLvl)
                lowestLvl = lvl;

            return workList;
        }

        public List<Shape> mapWorkFlow(JObject jObject)
        {
            var content = jObject["Content"];
            List<WorkFlowElement> workFlows = new List<WorkFlowElement>();

            if (content != null)
                foreach (JObject j in content)
                    workFlows.Add(_mapWorkFlow(j, lowestLvl));

            if (workFlows.Count != 0)
                return dataMappedEvent?.Invoke(workFlows, lowestLvl);

            return null;
        }

    }

    public class WorkFlowElement
    {
        public List<WorkFlowElement> children;

        public WorkFlowElement(string val)
        {
            this.Value = val;
            children = null;
        }

        public WorkFlowElement(string val, List<WorkFlowElement> childr)
        {
            this.Value = val;
            children = childr;
        }

        public string Value { get; set; }
    }
}

