var fs = require('fs');

export class ImageMaker {
    constructor (canvas) {
        this.Stream = canvas.createPNGStream();
        this.make_Image(canvas);
    }

    make_Image(canvas) {
        const out = fs.createWriteStream(__dirname + "/helloworld2.png");
    
        this.Stream.on('data', function(chunk) {
            out.write(chunk);
        });
    }

    get Stream() { return this._stream }
    set Stream(stream) { this._stream = stream; }
}