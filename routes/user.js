var express = require('express');
const session = require('express-session');
const { ObjectId } = require('mongodb');
var router = express.Router();
const productHelpers = require('../helpers/product-helpers');
const userHelpers = require('../helpers/user-helpers');

const verifyLogin = (req, res, next) => {
  if (req.session.user.loggedIn) {
    next()
  } else {
    res.redirect('/login')
  }
}
/* GET home page. */
router.get('/', async function(req, res, next) {
  let user = req.session.user
  console.log(user);
  let cartCount=null
  if(req.session.user){
  cartCount= await userHelpers.getCartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products) => {
    res.render('user/view-products', { products, user ,cartCount})
  })
})
  router.get('/login', (req, res) => {
    if (req.session.user.loggedIn) {
      res.redirect('/')
    }
    else {

      res.render('user/login', { "loginErr": req.session.userLoginErr })
      req.session.userLoginErr = false
    }
  })
  router.get('/signup', (req, res) => {
    res.render("user/signup")
  })
  router.post('/signup', (req, res) => {
    userHelpers.doSignup(req.body).then((response) => {
      console.log(response);
      
      req.session.user=response
      req.session.user.loggedIn=true
      res.redirect('/')
    })
  })
  router.post('/login', (req, res) => {
    userHelpers.doLogin(req.body).then((response) => {
      if (response.status) {
        
        req.session.user = response.user
        req.session.user.loggedIn = true
        res.redirect('/')
      } else {
        req.session.userLoginErr = "Invalid username or password"
        res.redirect('/login')
      }

    })
  })
  router.get('/logout', (req, res) => {
    req.session.user=null
    req.session.user.loggedIn=false
    res.redirect('/')
  })
  router.get('/cart',verifyLogin,async(req, res) => {
    //let user=req.session.user
    //let userId=req.session.user._id
    let products= await userHelpers.getCartProducts(req.session.user._id)
    let totalValue=0
    if(products.length>0){
    totalValue=await userHelpers.getTotalAmount(req.session.user._id)
    }
    console.log(products)
    //console.log('***'+req.session.user._id)
    res.render('user/cart',{products,user:req.session.user._id,totalValue})
  })
  router.get('/add-to-cart/:id',(req,res)=>{
    userHelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
      console.log("api call")
      res.json({status:true})
      //res.redirect('/')
    })
  })
  router.post('/change-product-quantity',(req,res,next)=>{
    console.log(req.body)
    userHelpers.changeProductQuantity(req.body).then(async(response)=>{
      response.total=await userHelpers.getTotalAmount(req.body.user)
      
      res.json(response)
     //console.log(response)
    })
  })

  router.post('/remove-cart-product',(req,res,next)=>{
    console.log(req.body)
    userHelpers.removeCartProduct(req.body).then((response)=>{
      res.json(response)
      //console.log(response)
    })
  })

  router.get('/place-order',verifyLogin,async(req,res)=>{
    let total=await userHelpers.getTotalAmount(req.session.user._id)

    res.render('user/place-order',{total,user:req.session.user})
  })
  router.post('/place-order',async(req,res)=>{
    let products=await userHelpers.getCartProductList(req.body.userId)
    let totalPrice= await userHelpers.getTotalAmount(req.body.userId)
    userHelpers.placeOrder(req.body,products,totalPrice).then((orderId)=>{
      console.log(orderId)
      if(req.body['payment-method']=='COD'){
        res.json({codSuccess:true})
      }else{
        userHelpers.generateRazorpay(orderId,totalPrice).then((response)=>{
          res.json(response)

        })
      }
    
    })
console.log(req.body)
  })

  router.get('/order-success',(req,res)=>{
    res.render('user/order-success',{user:req.session.user._id})
  })

  router.get('/orders',async(req,res)=>{
    let orders=await userHelpers.getUserOrders(req.session.user._id)
    res.render('user/orders',{user:req.session.user,orders})
  })

  router.get('/view-order-products/:id',verifyLogin,async(req,res)=>{
    let products=await userHelpers.getOrderProducts(req.params.id)
    res.render('user/view-order-products',{user:req.session.user,products})
  })
  router.post('/verify-payment',(req,res)=>{
    console.log(req.body);
    userHelpers.verifyPayment(req.body).then(()=>{
      userHelpers.changePaymentStatus(req.body['order[receipt]']).then(()=>{
        console.log("Payment Success");
        res.json({status:true})
      })
    }).catch((err)=>{
      res.json({status:false,errMsg:''})
    })

  })
  module.exports = router;

  /*router.post('/remove-cart',(req,res,next)=>{
    
    console.log(req.body);
    userHelpers.removeCart(req.body).then((response)=>{
      res.json(response)
    })
    
  
  })
  /*let products=[
    {
      name:"ABC",
      category:"abccc",
      description:"qrs",
      image:"https://images.unsplash.com/photo-1567581935884-3349723552ca?ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&w=1000&q=80"

    },
    {
      name:"DEF",
      category:"uvx",
      description:"khf",
      image:"https://images.indianexpress.com/2021/02/Poco-M3-Review-1.jpg"
    },
    {
      name:"SED",
      category:"uytr",
      description:"oiuy",
      image:"https://m.economictimes.com/thumb/msid-71641818,width-1200,height-900,resizemode-4,imgsize-587039/getty.jpg"

    },
    {
      name:"QWEE",
      category:"uio",
      description:"poool",
      image:"https://www.lavamobiles.com/images/card-smartphones.jpg"

    }
  ]*/
  // res.render('index', { products,admin:false});



