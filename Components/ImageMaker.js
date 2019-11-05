var fs = require('fs'); // used to save image to local machine

// class for creating the PNG image
export class ImageMaker {
    // constructor 
    constructor (canvas) {
        // create a stream for building the PNG
        this.Stream = canvas.createPNGStream();
        // make the image
        this.make_Image(canvas);
    }

    // creates and saves the image to the local machine
    make_Image(canvas) {
        // create a stream to place image in a file and save
        const out = fs.createWriteStream(__dirname + "/helloworld2.png");
        
        // when there is data write to stream
        this.Stream.on('data', chunk => {
            out.write(chunk);
        });
    }

    // getter and setter of the stream
    get Stream() { return this._stream }
    set Stream(stream) { this._stream = stream; }
}