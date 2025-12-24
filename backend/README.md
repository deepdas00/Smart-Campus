
/api/v1/college/college/data => all college name and ccollge code will send in the response



/api/v1/users/student/register => student registration => 
const {
    collegeCode,
    studentName,
    rollNo,
    mobileNo,
    email,
    password,
  } = req.body;


  /api/v1/auth/student/login => student Login =>
  const { collegeCode, mobileNo, email, password } = req.body

  /api/v1/auth/staff/login => staff login =>
  const { collegeCode, loginId, password } = req.body;

  /api/v1/auth/refresh => refresh accesstoken (1 day)




  Post => /api/v1/canteen/foods => addd food =>
    const {
    name,
    price,
    quantityAvailable,
    category,
    foodType,        // veg / non-veg
    description
  } = req.body;


  Patch => /api/v1/canteen/foods/:foodId => edit food => const { quantityAvailable, isAvailable (true/false) } = req.body;

  Get => /api/v1/canteen/foods => food menu => response from server



  /api/v1/canteen/orders => food order placing=> 
  
// input from FRONTEND
     {
         "items": [
             {
                 "foodId": "64fa....",
                 "quantity": 2
             },
            {
                "foodId": "64fb....",
                "quantity": 1
            }
        ]
     }





     /api/v1/canteen/orders/:orderId/pay => order create => response from server

     /api/v1/canteen/orders/verify-payment => order verification (after payment sucess) => 
       const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature
  } = req.body;


    /api/v1/canteen/orders/orders/serve => canteen staff will scan the qr and clck on submit => const { orderId, collegeCode } = req.body;

