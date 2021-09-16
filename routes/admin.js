var express = require('express');
const{ render }=require('../app');
//const { isHttpError } = require('http-errors');
const productHelpers = require('../helpers/product-helpers');
//const fileUpload = require('express-fileupload')
var router = express.Router();
var productHelper=require('../helpers/product-helpers') //call it down inside routers
/* GET users listing. */
router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
    res.render('admin/view-products',{admin:true,products})
  })
 /* let products=[
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
  ] */

 
});
router.get('/add-product',function(req,res){
  res.render('admin/add-product',{admin:true})

})
router.post('/add-product',(req,res)=>{
  console.log(req.body)
  console.log(req.files.Image)

  productHelpers.addProduct(req.body,(id)=>{
  let image=req.files.Image 
  console.log(id);
  image.mv('./public/product-images/'+id+'.jpg',(err,done)=>{
    if(!err){

      res.render('admin/add-product',{admin:true})
    }else{console.log(err);}
    
  })


      
    
  }) //before this we have to store image in above step to some folder by some unique name by server--for easy retrieval 
 //use mongodb connection in prod-helpers,so go to it 

})
router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  console.log(proId);
  productHelpers.deleteProduct(proId).then((response)=>{
    res.redirect('/admin/')
  })
  

})
router.get('/edit-product/:id',async(req,res)=>{
  let product = await productHelpers.getProductDetails(req.params.id)
  console.log(product);
res.render('admin/edit-product',{product})
})
router.post('/edit-product/:id',(req,res)=>{
  let id=req.params.id
  productHelpers.updateProduct(req.params.id,req.body).then(()=>{
  res.redirect('/admin')
  if(req.files.Image){
let image=req.files.Image
    image.mv('./public/product-images/'+id+'.jpg')
  }
})
})
module.exports = router;
//avoid writing inside routers
//so,create folder helpers.move data onto it.
//call from it when necessary


