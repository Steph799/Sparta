
export const genderTypes = ["All", "Male", "Female", "Kids"] //genders

export const accessDenied = 'Access denied, username or password are not correct' //logging form 
export const loginUrl = "http://localhost:4000/api/auth/login"
export const userNameMinError = 'username should be of minimum 8 characters length'
export const passwordMinError = 'password should be of minimum 8 characters length'
export const copyright = 'Copyright © ' //also for footer

export const productsUrl = `http://localhost:4000/api/products` //Item form
export const uploadImgUrl = "http://localhost:4000/api/images/upload"
export const rateRangeError = 'Rate values must be between 0 and 5';
export const positivePriceError = 'Price must be a positive number'
export const positiveItemsError = 'You must specify a positive amount of items' 
export const maxRate = 5;
export const descriptionMinLen = 5

export const minUserNameLength = 5 //User form
export const minPasswordLength = 8
export const usersUrl = 'http://localhost:4000/api/users';
export const minIdVal = 10000000  //also for buy form
export const minIdDigitsError = `Id must be at least ${minIdVal.toString().length} digits`  //also for buy form
export const minUserNameDigitsError = `Username must contain at least ${minUserNameLength} characters`
export const minPasswordDigitsError = `Password must contain at least ${minPasswordLength} characters`

export const purchaseReq = `${productsUrl}/purchase`; //buy form
export const creditCardFormatLength = 14 //1111-2222-3333
export const cartUrl = 'http://localhost:4000/api/purchases'
export const thanksForBuying = 'Thank you for buying from Sparta. We hope to hear from you again soon'
export const creditCardFormatNote = "* Your credit card format number should be like that: 1111-2222-3333"

export const categoryOptions = [
    'All categories',
    'Hiking',
    'Water sport',
    'Running & walking',
    'Team sport',
    'Fitness & exercise',
    'Cycling',
    'Nutrition',
    'General accessories',
    'Other sports',
];


export const confirmLogOut = 'Are you sure you want to log out?' //MyMenu

export const filterUrl = `${productsUrl}/form` //searchField

export const insufficientProducts = `insufficient products from type:` //cart

export const pageSize = 6 //catalog and others

export const userCoefficientDiscount=0.85 //Display Products
export const confirmDeleting = `Are you sure you want to delete the product:`
export const categoryHeader = `Our products from category:`

