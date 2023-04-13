const express = require('express');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const router = express.Router()
const auth = require("../middleware/auth");
var ObjectID = require('mongodb').ObjectID;
const HesabFaApiCall = require('../AdminPanel/components/hesabFaApiCall');

const ColorSchema = require('../model/products/color');
const XtraSchema = require('../model/products/xtra');
const MirrorSchema = require('../model/products/mirror');
const PagesSchema = require('../model/pages');
const RXSchema = require('../model/Order/rx');
const OrderSchema = require('../model/Order/orders');
const PostSchema = require('../model/products/Post');
const logSchema = require('../model/Params/logs')
const orderLogSchema = require('../model/Params/logsOrder')
const SliderSchema = require('../model/slider');
const CategorySchema = require('../model/products/category');
const ProductSchema = require('../model/products/Product');
const fs = require('fs');
const mime = require('mime');
const user = require('../model/user');

router.post('/upload',jsonParser, async(req, res, next)=>{
    ////console.log("UploadApi")
    try{
    // to declare some path to store your converted image
    var matches = req.body.base64image.match(/^data:([A-Za-z-+/]+);base64,(.+)$/),
    response = {};
    if (matches.length !== 3) {
    return new Error('Invalid input string');
    }
     
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
    let decodedImg = response;
    let imageBuffer = decodedImg.data;
    let type = decodedImg.type;
    let extension = mime.extension(type);
    let fileName = `MGM-${Date.now().toString()+"-"+req.body.imgName}`;
    ////console.log(fileName)
   
    fs.writeFileSync("./uploads/setting/" + fileName, imageBuffer, 'utf8');
    return res.send({"status":"success",url:"/uploads/setting/"+fileName});
    } catch (e) {
        res.send({"status":"failed",error:e});
    }
})

router.post('/color',async (req,res)=>{
    ////console.log("ColorApi")
    try{
        const colorData = await ColorSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:colorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/color/update',async (req,res)=>{
    ////console.log("ColorUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        colorCode: req.body.colorCode,
        colorPrice:req.body.colorPrice,
        title:req.body.title
    }
    try{
        //var colorData = ''
        const colorData = data.id? await ColorSchema.updateOne({_id:data.id},{$set:data})
        :await ColorSchema.create(data);
        res.json({data:colorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/mirror',async (req,res)=>{
    //console.log("MirrorApi")
    try{
        const mirrorData = await MirrorSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:mirrorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/mirror/update',async (req,res)=>{
    //console.log("MirrorUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        colorCode: req.body.colorCode,
        colorPrice:req.body.colorPrice,
        title:req.body.title
    }
    try{
        //var colorData = ''
        const colorData = data.id? await MirrorSchema.updateOne({_id:data.id},{$set:data})
        :await MirrorSchema.create(data);
        res.json({data:colorData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/xtra',async (req,res)=>{
    //console.log("XtraApi")
    try{
        const xtraData = await XtraSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:xtraData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/xtra/update',async (req,res)=>{
    //console.log("XtraUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        colorCode: req.body.colorCode,
        colorPrice:req.body.colorPrice,
        title:req.body.title
    }
    try{
        //var colorData = ''
        const xtraData = data.id? await XtraSchema.updateOne({_id:data.id},{$set:data})
        :await XtraSchema.create(data);
        res.json({data:xtraData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/category',async (req,res)=>{
    //console.log("CategoryApi")
    try{
        const categoryData = await CategorySchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:categoryData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/category/update',async (req,res)=>{
    //console.log("CategoryUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        description: req.body.description,
        title:req.body.title
    }
    try{
        const ctegoryData = data.id? await CategorySchema.updateOne({_id:data.id},{$set:data})
        :await CategorySchema.create(data);
        res.json({data:ctegoryData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/product',async (req,res)=>{
    //console.log("ProductApi")
    try{
        const productData = await ProductSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:productData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/productEN',async (req,res)=>{
    //console.log("ProductEnApi")
    try{
        const productData = await ProductSchema.findOne(
            req.body.enTitle&&{enTitle:req.body.enTitle}).sort({"sort":1});
        res.json({data:productData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/product/update',async (req,res)=>{
    //console.log("ProductUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        imgGalleryUrl:req.body.imgGalleryUrl,
        description: req.body.description,
        fullDesc:req.body.fullDesc,
        config:req.body.config,
        title:req.body.title,
        enTitle:req.body.enTitle,
    }
    try{
        const productData = data.id? await ProductSchema.updateOne({_id:data.id},{$set:data})
        :await ProductSchema.create(data);
        res.json({data:productData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/pages',async (req,res)=>{
    //console.log("PagesApi")
    try{
        const pagesData = await PagesSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:pagesData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/pages/update',async (req,res)=>{
    //console.log("PageUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        url: req.body.url,
        title: req.body.title,
        description:req.body.description,
        fullDesc:req.body.fullDesc
    }
    try{
        //var colorData = ''
        const pagesData = data.id? await PagesSchema.updateOne({_id:data.id},{$set:data})
        :await PagesSchema.create(data);
        res.json({data:pagesData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/blog',async (req,res)=>{
    //console.log("BlogApi")
    try{
        const postData = await PostSchema.find(req.body.id&&{_id:req.body.id}).sort({"sort":1});
        res.json({data:postData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/blog/update',async (req,res)=>{
    //console.log("BlogUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        url: req.body.url,
        title: req.body.title,
        description:req.body.description,
        fullDesc:req.body.fullDesc
    }
    try{
        //var colorData = ''
        const postData = data.id? await PostSchema.updateOne({_id:data.id},{$set:data})
        :await PostSchema.create(data);
        res.json({data:postData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/slider',async (req,res)=>{
    //console.log("SliderApi")
    try{
        const sliderData = await SliderSchema.find(req.body.id&&{_id:req.body.id});
        res.json({data:sliderData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/slider/update',async (req,res)=>{
    //console.log("SliderUpdateApi")
    const data = {
        id:req.body.id,
        imageUrl: req.body.imageUrl,
        title: req.body.title,
        description:req.body.description
    }
    try{
        const sliderData = data.id? await SliderSchema.updateOne({_id:data.id},{$set:data})
        :await SliderSchema.create(data);
        res.json({slider:sliderData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
 
router.post('/log',async (req,res)=>{
    //console.log("LogApi")
    try{
        if(req.body.kind==='')res.json({log:[]})
        const logsData = await logSchema.find(req.body.status&&
            {status:req.body.status}).find(req.body.kind&&{kind:req.body.kind})
        res.json({log:logsData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/log/update',async (req,res)=>{
    //console.log("LogUpdateApi")
    try{
    const data = {
        id:req.body.id,
        title: req.body.title,
        user: req.body.user,
        phone: req.body.phone,
        kind:req.body.kind,
        description: req.body.description,
        status: req.body.status,
        date:Date.now(),
        modifyDate:req.body.modifyDate
    } 
        
        const logsData = data.id? await logSchema.updateOne({_id:data.id},{$set:data})
        :await logSchema.create(data);
        res.json({log:logsData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

router.post('/orderlog',async (req,res)=>{
    //console.log("LogApi")
    const orderData = await OrderSchema.findOne({stockOrderNo:req.body.rxOrderNo})
    const userData = await user.findOne({_id:orderData.userId})
    //console.log(userData)
    try{
        const logsData = await orderLogSchema.find({rxOrderNo:req.body.rxOrderNo})
        res.json({log:logsData,user:userData})
    } 
    catch(error){
        res.status(500).json({message: error.message})
    }
})
router.post('/orderlog/update',async (req,res)=>{
    //console.log("LogUpdateApi")
    try{
    const data = {
        id:req.body.id,
        title: req.body.title,
        user: req.body.user,
        phone: req.body.phone,
        kind:req.body.kind,
        description: req.body.description,
        status: req.body.status,
        date:Date.now(),
        modifyDate:req.body.modifyDate
    } 
        
        const logsData = data.id? await logSchema.updateOne({_id:data.id},{$set:data})
        :await logSchema.create(data);
        res.json({log:logsData})
    }
    catch(error){
        res.status(500).json({message: error.message})
    }
})

module.exports = router;