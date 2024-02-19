const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");
var ObjectID = require('mongodb').ObjectID;

const ProductSchema = require('../model/products/Product');
const BrandSchema = require('../model/brands/brand')
const manufacture = require('../model/Order/manufacture');
const category = require('../model/products/category');

/*Product*/
router.post('/fetch-product',jsonParser,async (req,res)=>{
    var productId = req.body.productId?req.body.productId:''
    try{
        if(!productId){
            res.json({filter:{}})
            return
        } 
        const productData = await ProductSchema.findOne({_id: ObjectID(productId)})
        const brandList = await BrandSchema.find({})
        const categoryList = await category.find({})
       res.json({filter:productData,brandList:brandList,categoryList:categoryList})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/list-product',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)*parseInt(pageSize)):0;
    try{const data={
        category:req.body.category,
        title:req.body.title,
        brand:req.body.brand,
        offset:req.body.offset,
        pageSize:pageSize
    }
        const productList = await ProductSchema.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.category?{category:data.category}:{}},
            
            ])
            const products = productList.slice(offset,
                (parseInt(offset)+parseInt(pageSize)))  
            const typeUnique = [...new Set(productList.map((item) => item.category))];
            
           res.json({filter:products,type:typeUnique,
            size:products.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/editProduct',jsonParser,async(req,res)=>{
    var productId= req.body.productId?req.body.productId:''
    if(productId === "new")productId=''
    try{ 
        const data = {
            title:  req.body.title,
            category: req.body.category,
            brand: req.body.brand,
            type:req.body.type,
            value:req.body.value,
            description:req.body.description,
            fullDesc:req.body.fullDesc,
            sku: req.body.sku,
            productCode: req.body.productCode,
            price: req.body.price,
            quantity: req.body.quantity,
            sort: req.body.sort,
            imageUrl:  req.body.imageUrl
        }
        var productResult = ''
        if(productId) productResult=await ProductSchema.updateOne({_id:productId},
            {$set:data})
        else
        productResult= await ProductSchema.create(data)
        
        res.json({result:productResult,success:productId?"Updated":"Created"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

/*Product*/
router.post('/fetch-brand',jsonParser,async (req,res)=>{
    var brandId = req.body.brandId?req.body.brandId:''
    try{
        if(!brandId){
            res.json({filter:{}})
            return
        }
        const brandData = await BrandSchema.findOne({_id: ObjectID(brandId)})
       res.json({filter:brandData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/list-brands',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)*parseInt(pageSize)):0;
    try{const data={
        category:req.body.category,
        title:req.body.title,
        showSite:req.body.showSite,
        brand:req.body.brand,
        offset:req.body.offset,
        pageSize:pageSize
    }
        const brandList = await BrandSchema.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.category?{category:data.category}:{}},
            { $match:data.showSite?{description:{$exists:true}}:{}},
            ])
            const brands = brandList.slice(offset,
                (parseInt(offset)+parseInt(pageSize)))  
            const typeUnique = [...new Set(brandList.map((item) => item.category))];
            
           res.json({filter:brands,type:typeUnique,
            size:brands.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/editBrand',jsonParser,async(req,res)=>{
    var brandId= req.body.brandId?req.body.brandId:''
    if(brandId === "new")brandId=''
    try{ 
        const data = {
            title:  req.body.title,
            category: req.body.category,
            type:req.body.type,
            value:req.body.value,
            description:req.body.description,
            fullDesc:req.body.fullDesc,
            sku: req.body.sku,
            brandCode: req.body.brandCode,
            enTitle: req.body.brandCode,
            price: req.body.price,
            quantity: req.body.quantity,
            sort: req.body.sort,
            brandUrl:  req.body.brandUrl,
            imageUrl:  req.body.imageUrl
        }
        var brandResult = ''
        if(brandId) brandResult=await BrandSchema.updateOne({_id:brandId},
            {$set:data})
        else
        brandResult= await BrandSchema.create(data)
        
        res.json({result:brandResult,success:brandId?"Updated":"Created"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

/*Category*/
router.post('/fetch-category',jsonParser,async (req,res)=>{
    var catId = req.body.catId?req.body.catId:''
    try{
        if(!catId){
            res.json({filter:{}})
            return
        }
        const catData = await category.findOne({_id: ObjectID(catId)})
       res.json({filter:catData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/list-category',jsonParser,async (req,res)=>{
    var pageSize = req.body.pageSize?req.body.pageSize:"10";
    var offset = req.body.offset?(parseInt(req.body.offset)*parseInt(pageSize)):0;
    try{const data={
        category:req.body.category,
        title:req.body.title,
        brand:req.body.brand,
        offset:req.body.offset,
        pageSize:pageSize
    }
        const catData = await category.aggregate([
            { $match:data.title?{title:new RegExp('.*' + data.title + '.*')}:{}},
            { $match:data.category?{category:data.category}:{}},
            
            ])
            const cats = catData.slice(offset,
                (parseInt(offset)+parseInt(pageSize)))  
            const typeUnique = [...new Set(cats.map((item) => item.category))];
            
           res.json({filter:cats,type:typeUnique,
            size:cats.length})
    }
    catch(error){
        res.status(500).json({message: error.message})
    } 
})
router.post('/editCats',jsonParser,async(req,res)=>{
    var catId= req.body.catId?req.body.catId:''
    if(catId === "new")catId=''
    try{ 
        const data = {
            title:  req.body.title,
            category: req.body.category,
            type:req.body.type,
            value:req.body.value,
            description:req.body.description,
            fullDesc:req.body.fullDesc,
            sku: req.body.sku, 
            catCode:req.body.catCode,
            price: req.body.price,
            quantity: req.body.quantity,
            sort: req.body.sort,
            imageUrl:  req.body.imageUrl
        }
        var catResult = ''
        if(catId) catResult=await category.updateOne({_id:catId},
            {$set:data})
        else
        catResult= await category.create(data)
        
        res.json({result:catResult,success:catId?"Updated":"Created"})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;