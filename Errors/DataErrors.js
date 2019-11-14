export var NoDataError = new Error("There is no data to map.\n \
    Please enter valid data to map to a diagram.");

export var NoStatusError = new Error("There is no status to map to a color.\n \
    Please provide a status for the current element");

export var NoTextError = new Error("There is no text to map to a textbox.\n \
    Please provide some to text for the element.");

export var BadRectangleError = new Error("The rectangle provided is either null or undefined or \n \
    has a width or height less than or equal to zero. Please provide\n \
    a rectangle with at least the following properties greater than zero.\n");

export var BadTextBoxError = new Error("The text box provided is either null or undefined or \n \
    has a width or height less than or equal to zero or the text was empty. Please provide\n \
    a text box with at least the following properties greater than zero.\n");

export var ShapeCollectionError = new Error("The shaped data given was null, undefined, or not the\n \
    the correct format. Please make sure the shape data is valid.\n");

export var NoColorError = new Error("Color is not defined.\n \
    Please enter valid color to map to a diagram.");