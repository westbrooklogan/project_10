using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.IO;

namespace visio_test_app
{
    // pointer to function to be called when event happens
    public delegate List<Shape> fileLoaded(JObject j);

    // loads and parses the json file
    class FileHandler
    { 
        // event that is triggered when the file is loaded.
        public event fileLoaded fileLoadedEvent;

        // constructor
        public FileHandler()
        {

        }

        // load the file
        public List<Shape> load_File (string fileName)
        {
            // gets json from the file and parses it into an object
            var json = JObject.Parse(System.IO.File.ReadAllText(fileName));
            List<Shape> shapes = null;

            // trigger file loaded event
            if (fileLoadedEvent != null)
                shapes = fileLoadedEvent(json);

            return shapes;
        }
    }
}
