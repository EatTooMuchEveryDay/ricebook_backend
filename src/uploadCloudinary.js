////////////////////////////////
// Upload files to Cloudinary //
////////////////////////////////
const multer = require('multer')
const stream = require('stream')
const cloudinary = require('cloudinary')

// if (!process.env.CLOUDINARY_URL) {
//     console.error('*******************************************************************************')
//     console.error('*******************************************************************************\n')
//     console.error('You must set the CLOUDINARY_URL environment variable for Cloudinary to function\n')
//     console.error('\texport CLOUDINARY_URL="cloudinary:// get value from heroku"\n')
//     console.error('*******************************************************************************')
//     console.error('*******************************************************************************')
//     process.exit(1)
// }

cloudinary.config({
    cloud_name: 'hdlvq0ifw',
    api_key: '846133666471795',
    api_secret: 'JvUkYmHmg2RQHdYE9BTsIZxTZVk'
});

function uploadImg(req, res, publicId, folder, next) {
    multer().single('image')(req, res, () => {
        if(req.file==null){
            req.fileurl="";
            next();
            return;
        }

        const uploadStream = cloudinary.uploader.upload_stream(result => {
            // capture the url and public_id and add to the request
            req.fileurl = result.url;
            req.fileid = result.public_id;
            next();
        }, { public_id: publicId, folder: folder });

        const s = new stream.PassThrough();
        s.end(req.file.buffer);
        s.pipe(uploadStream);
        s.on('end', uploadStream.end);
    });
}

module.exports = uploadImg;