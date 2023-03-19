import BreadCrumb from "../Components/BreadCrumb";
import SimpleFetch from "../Components/simpleFetch";
import env, { filterResult, normalPrice, purePrice, removeNull, stockResultFunction } from "../env";
import "../css/manage.css"
import { TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab";
import { useEffect, useState } from "react";
import FilterStock from "./filtersStock";
import Paging from "../CategoryPage/Paging";
import ManyPrice from "./ManageModules/ManyPrice";

function ManagePrice(){
    //const stockList = SimpleFetch(env.siteApi+"/order/stock/list");
    const brandList = SimpleFetch(env.siteApi+"/product/brands");
    
    const [perPage , setperPage]= useState("10")
    const [refreshTable,setRefreshTable] = useState(0)
    const [priceSet , setPriceSet]= useState("")
    const [brandSelect , setBrandSelect]= useState("")
    const [selectedCopy,setSelectCopy] = useState('')
    const [copySelect,setCopySelect] = useState(-1)
    const [selectedBrand,setSelectBrand] = useState({})
    const [stockResult,setStockResult] = useState("")
    const changeOption=(e)=>{
        setBrandSelect(e);
        setSelectBrand({brand:e&&e.enTitle})
    }
    const options=["عملیات","sku","برند","لنز","قیمت واحد"
            ,"تخفیف","قیمت خرید"];
    const rowSpan=["1","2","1","1","2","2","2"]
    const colSpan=["2","1","4","6","1","1","1"]
    const subOptions=["ذخیره","کپی","نام برند","ض.شکست","متریال",
            "پوشش","جهت","SPH","CYL","DIA","ADD","نوع عدسی"];  

    const [pageNumber,setPageNumber] = useState('')
    const [content,setContent] = useState('')   
    console.log(content)         
    //console.log(content);
    useEffect(() => {
        //console.log(parseFloat(stockResult.sphT)>0)
        setContent('')
        const body={
            page:pageNumber,
            brand:stockResult.brand,
            lenzIndex:stockResult.lenzIndex,
            material:stockResult.material,
            coating:stockResult.coating,
            sphF:stockResult.sphT&&parseFloat(stockResult.sphT)>0?
                parseFloat(stockResult.sphT)-1.99:parseFloat(stockResult.sphT),
            sphT:stockResult.sphT&&parseFloat(stockResult.sphT)>0?
                parseFloat(stockResult.sphT):parseFloat(stockResult.sphT)+2.01,
            cyl:stockResult.cyl,
            dia:stockResult.dia,
            add:stockResult.add,
            sphFix:stockResult.sphFix,
            cylFix:stockResult.cylFix,
            pageSize:perPage
        }
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(body)
          }
        fetch(env.siteApi + "/order/stock/adminlist",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
          //console.log(result)
            setTimeout(()=> setContent(result),200)
        },
        (error) => {
          console.log(error);
        }
        
    )},[pageNumber,stockResult,perPage,refreshTable,priceSet])

    /*useEffect(() => {
        setFilteredResult('');
        content&&setTimeout(()=>
        setFilteredResult(stockResultFunction(content,stockResult)),200);
        console.log(filteredResult)
        },[stockResult,content])*/
    const saveThis = (e)=>{
        console.log(e)
        var body={
           sku:e[2].childNodes[0].value,
            brandName:e[3].firstChild.firstChild.firstChild.firstChild.value,
            lenzIndex:e[4].firstChild.firstChild.firstChild.firstChild.value,
            material:e[5].firstChild.firstChild.firstChild.firstChild.value,
            coating:e[6].firstChild.firstChild.firstChild.firstChild.value,
            design:e[6].firstChild.firstChild.firstChild.firstChild.value,
            align: e[7].firstChild.firstChild.firstChild.firstChild.value,
            sph: e[8].childNodes[0].value,
            cyl: e[9].childNodes[0].value,
            dia: e[10].firstChild.firstChild.firstChild.firstChild.value,
            add: e[11].firstChild.firstChild.firstChild.firstChild.value,
            design: e[12].firstChild.firstChild.firstChild.firstChild.value,
            
            price:e[13].childNodes[0].value,
        }
        //Object.assign(body);
        const token = JSON.parse(localStorage.getItem('token-lenz'))
        const postOptions={
            method:'post',
            headers: { 
            'Content-Type': 'application/json'},
            //'x-access-token':token.token
            body:JSON.stringify({...body,
                ...e[2].id&&{id:e[2].id}})
        }
        //console.log(postOptions,e[2].id)
        fetch(env.siteApi+"/order/stock/add",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
            console.log(result);
            //setTimeout(()=>setRefreshTable(refreshTable+1),200);
            },
            (error) => {
            console.log(error);
            
            }
        )
        .catch(error => {
            console.log(error)
        })
    }
    const removeThis = (stockId)=>{
        //console.log(e)
        //Object.assign(body);
        //const token = JSON.parse(localStorage.getItem('token-lenz'))
        const postOptions={
            method:'post',
            headers: { 
            'Content-Type': 'application/json'},
            //'x-access-token':token.token
            body:JSON.stringify({id:stockId})
        }
        console.log(postOptions)
        fetch(env.siteApi+"/order/stock/remove",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
            console.log(result);
            setTimeout(()=>setRefreshTable(refreshTable+1),200);
            },
            (error) => {
            console.log(error);
            
            }
        )
        .catch(error => {
            console.log(error)
        })
    }
    const copy = (e)=>{
        var body={
            sku:e[2].childNodes[0].value,
            brandName:e[3].firstChild.firstChild.firstChild.firstChild.value,
            lenzIndex:e[4].firstChild.firstChild.firstChild.firstChild.value,
            material:e[5].firstChild.firstChild.firstChild.firstChild.value,
            coating:e[6].firstChild.firstChild.firstChild.firstChild.value,
            //design:e[6].firstChild.firstChild.firstChild.firstChild.value,
            align: e[7].firstChild.firstChild.firstChild.firstChild.value,
            sph: e[8].childNodes[0].value,
            cyl: e[9].childNodes[0].value,
            dia: e[10].firstChild.firstChild.firstChild.firstChild.value,
            add: e[11].firstChild.firstChild.firstChild.firstChild.value,
            design:e[12].firstChild.firstChild.firstChild.firstChild.value,
            
            price:e[13].childNodes[0].value
        }
        setSelectCopy(body)
    }
    //console.log(stockResult)
    return(
        <div className='orderTableHolder'>
            <div className="filters ltr">
                <FilterStock stockList={content} content={content} 
                    stockResult={stockResult} setStockResult={setStockResult}/>
            </div>
            <div className="perPage">
                <span>تعداد در صفحه: </span>
                <Autocomplete
                    options={["5","10","20","50"]} 
                    disableClearable freeSolo
                    style={{ width: "50px"}}
                    
                    value={perPage} 
                    onChange={(_event, Brand)=>{setperPage(Brand)}}
                    renderInput={(params) =>
                    <TextField {...params} />}
                />
            </div>
        {content&&<ManyPrice content={content} setPriceSet={setPriceSet}/>}
            <table className="orderTable stockTable">
            <tbody>
                <tr> 
                    {options.map((th,i)=>(
                    <th rowSpan={rowSpan[i]} colSpan={colSpan[i]}
                     key={i}>{th}</th>))}
                </tr>
                <tr>
                    {subOptions.map((th,i)=>(
                    <th key={i}>{th}</th>))}
                </tr>
                
                <tr>
                    <td onClick={(e)=>saveThis(e.target.parentNode.children)}>ذخیره</td>
                    <td style={{width:"70px"}}></td>
                    <td id={content._id} style={{width:"70px"}}>
                        <input type="text" defaultValue={selectedCopy.sku||""}  style={{width:"100%"}}/></td>
                    <td><Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.brandList)||[]}
                        //getOptionLabel={option => option.enTitle|| ""}
                        value={selectedCopy.brandName||""}
                        onChange={(_event, Brand)=>changeOption(Brand)}
                        renderInput={(params) =>
                        <TextField {...params}/>}
                    /></td>
                    <td>
                    <Autocomplete
                        disableClearable freeSolo
                        value={selectedCopy.lenzIndex||""}
                        onChange={()=>{}}
                        options={removeNull(content.lenzIndexList)||[]}
                        renderInput={(params) =>
                        <TextField {...params}    />}
                    /></td>
                    <td>
                    <Autocomplete
                        disableClearable freeSolo
                        value={selectedCopy.material||""}
                        onChange={()=>{}}
                        options={removeNull(content.materialList)||[]}
                        renderInput={(params) =>
                        <TextField {...params}    />}
                    /></td>
                    <td>
                    <Autocomplete
                        disableClearable freeSolo
                        value={selectedCopy.coating||""}
                        onChange={()=>{}}
                        options={removeNull(content.coatingList)||[]}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    /></td>
                    <td width={40}><Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.alignList)||[]}
                        value={selectedCopy.align||""}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    /></td>
                    <td width={40}><input type="text" defaultValue={selectedCopy.sph||""}/></td>
                    <td width={40}><input type="text" defaultValue={selectedCopy.cyl||""} /></td>
                    <td width={40}><Autocomplete
                        disableClearable freeSolo
                        options={["65","70"]}
                        value={selectedCopy.dia||""}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    /></td>
                    <td width={40}><Autocomplete
                        disableClearable freeSolo
                        options={["0.75","1.00","1.25","1.50","1.75","2.00","2.25","2.50","2.75","3.00","3.25","3.50"]}
                        value={selectedCopy.add||""}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    /></td>
                     <td width={40}><Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.designList)||[]}
                        value={selectedCopy.design||""}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    /></td>
                    <td ><input style={{width:"90%"}} type="text" defaultValue={selectedCopy.price||""} onChange={(e)=>e.target.value= normalPrice(e.target.value)}/></td>
                    <td ><input style={{width:"90%"}} type="text" onChange={(e)=>e.target.value= normalPrice(e.target.value)}/></td>
                    <td ><input style={{width:"90%"}} type="text" defaultValue={selectedCopy.purchase||""} onChange={(e)=>e.target.value= normalPrice(e.target.value)}/></td>
                    
                </tr>
                {content&&content.stock&&brandList&&content.stock.map((stockItem,i)=>(
                <tr key={i} onClick={()=>{}} style={{backgroundColor:copySelect===i?"lightgreen":"initial"}}>
                    <td onClick={(e)=>saveThis(e.target.parentNode.children)}
                    className="saveManager">ذخیره</td>
                    <td className="copyRow" onClick={(e)=>{copy(e.target.parentNode.children);setCopySelect(i)}}>کپی</td>
                    <td id={stockItem._id} style={{width:"70px"}}><input type="text" defaultValue={stockItem.sku||""}/></td>
                    <td id="brandName" width={220}>
                    <Autocomplete
                        options={removeNull(content.brandList)||[]} 
                        disableClearable freeSolo
                        style={{ width: "100%"}}
                        defaultValue={stockItem.brandName||[]} 
                        //defaultValue={stockItem.brandName||[]} 
                        onChange={(_event, Brand)=>changeOption(Brand)}
                        renderInput={(params) =>
                        <TextField {...params}/>}
                    />
                    </td>
                    <td id="lenzindex" width={70}>
                    {brandList&& <Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.lenzIndexList)||[]}
                        style={{ width: "100%"}}
                        defaultValue={stockItem.lenzIndex}
                        //value={selectedBrand.lenzIndex|| null}
                        renderInput={(params) =>
                        <TextField {...params}    />}
                    />}
                    </td>
                    <td id="material" width={200} style={{maxWidth:"180px"}}>
                    {brandList&& <Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.materialList)||[]}
                        style={{ width: "100%"}}
                        defaultValue={stockItem.material}
                        //value={selectedBrand.material|| null}
                        renderInput={(params) =>
                        <TextField {...params}    />}
                    />}
                    </td>
                    <td id="coating" width={170}>
                    {brandList&& <Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.coatingList)||[]}
                        style={{ width: "100%"}}
                        defaultValue={stockItem.coating}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    />} 
                    </td>
                    <td width={120}>{brandList&& <Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.alignList)||[]}
                        style={{ width: "100%"}}
                        defaultValue={stockItem.align}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    />}</td>
                    <td width={40}><input type="text" defaultValue={stockItem.sph}/></td>
                    <td width={40}><input type="text" defaultValue={stockItem.cyl}/></td>
                    <td width={40}>{brandList&& <Autocomplete
                        disableClearable freeSolo
                        options={["65","70"]}
                        style={{ width: "100%"}}
                        defaultValue={stockItem.dia}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    />} </td>
                    <td width={40}>{brandList&& <Autocomplete
                        disableClearable freeSolo
                        options={["0.75","1.00","1.25","1.50","1.75","2.00","2.25","2.50","2.75","3.00","3.25","3.50"]}
                        style={{ width: "100%"}}
                        defaultValue={stockItem.add}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    />} </td>
                    <td width={120}>{brandList&& <Autocomplete
                        disableClearable freeSolo
                        options={removeNull(content.designList)||[]}
                        style={{ width: "100%"}}
                        defaultValue={stockItem.design}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    />}</td>
                    <td width={130}><input style={{width:"90%"}} type="text" defaultValue={normalPrice(stockItem.price)}
                        onChange={(e)=>e.target.value= normalPrice(e.target.value)}/></td>
                    <td >{normalPrice(stockItem.purchaseOS)}</td>
                    <td >{normalPrice(stockItem.discountOS)}</td>
                    <td onClick={()=>removeThis(stockItem._id)}>
                        <span className="removeStock" >×</span></td>
                </tr>
                ))}
                
            </tbody>
        </table>{content&&
        <Paging content={content} setPageNumber={setPageNumber} pageNumber={pageNumber} perPage={perPage}/>}

        </div>)
}
export default ManagePrice