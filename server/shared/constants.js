exports.connect  = 'Connected to MongoDB...' //index
exports.connectionFailed = `Could not connect to MongoDB:`
exports.port = process.env.PORT || 4000;
exports.portListening = `Listening on port`

exports.noToken = 'User Access denied. no token provided' //middleware/auth

exports.minId = 10000000 //cart
exports.maxId = 99999999999
exports.reqNum = { type: Number, min: 1, required: true };

exports.descriptionMinLen = 5 //product
exports.maxRate = 5
exports.descriptionMaxLen = 200
exports.reqString = { type: String, required: true, minLength: 2 };
exports.itemsMessage = 'value must be an integer'

exports.successfulPurchase = 'The purchase data has been upload to the data base successfully' //purchase

exports.processFailed = 'Something failed during the process:'

exports.names = { type: String, required: true, minLength: 2, maxLength: 50 }; //user
exports.userNameLength=5
exports.passwordLength=8

exports.re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; //for email validation
exports.matchedEmailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
exports.emailFormatError = 'Please fill a valid email address'

exports.invalid = 'Invalid username or password.'; // routes/auth
exports.userExist = 'User is already in the system'
exports.successfulRegistered = 'User successfully registered'

exports.maxSize = 1500000 //1.5MB             images
exports.allowedFormats = ['webp', 'png', 'jpg', 'jpeg', 'tiff']
exports.wrongImgFormat = 'Image has to be (png, jpg, jpeg, tiff or webp)'
exports.exceedingSizeError = 'Image size must be equal or smaller than 1.5 MB'
exports.path = `../client/public/uploads`
exports.imgError = "Couldn't completed the upload process:"

exports.notValidProduct = 'product id was not found'; //products
exports.idNotFound = 'The product with the given id was not found.';
exports.productExist = 'Product with the same name and company already existed in the stock'
exports.successfulProductUpload = 'The product has been upload to the shop successfully'
exports.successfulProductDelete = 'Product was successfully deleted'


exports.userNotFound = 'User id was not found'; //users
exports.idNotFound = 'The user with the given id was not found.';
exports.defaultRounds = 10;
exports.successfulUserDelete = 'User was successfully deleted'
