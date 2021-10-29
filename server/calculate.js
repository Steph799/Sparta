 const convertRate = (rateValue) => {
  switch (rateValue) {
    case 1:
      return  [0, 2];   
    case 2:
      return [2, 4];
    case 3:
     return [4, 5];  
    default:
     return [0, 5]; //all rates   
  }
};


module.exports = convertRate