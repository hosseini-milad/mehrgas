import { useEffect, useState } from "react";
import env from "../env";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from "@material-ui/core"
import BrandHolderStock from "../OrderPage/Stock/Stock01/BrandHolderStock";
import StockRow from "../OrderPage/Stock/Stock02/StockRow";
var token = JSON.parse(localStorage.getItem('token-lenz'));

function StockEdit(){
    const stockId=window.location.pathname.split('/stock-edit/')[1];
    const [content,setContent]= useState('')
    const [brandContent,setBrandContent]= useState('')
    const [brandFilter,setBrandFilter]= useState("")
    const [editItemData,setEditItemData] = useState('')
    const [newSPH,setNewSPH] = useState()
    const [newCYL,setNewCYL] = useState()
    const [editRow,setEditRow] = useState(-1)
    const [stockFaktor,setStockFaktor]= useState()
    const [newItem,setNewItem] = useState()
    const [align,setAlign] = useState("R")
    const [count,setCount] = useState("1")
    const [error,setError] = useState("1")
    
    console.log(editItemData)
    useEffect(() => {
        const body={
            search:stockId,
            status:"inprogress"
        }
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(body)
          }
        //console.log(postOptions)
        fetch(env.siteApi + "/order/stockSeprate/search",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            if(result.length)
            {setContent(result[0])
                setStockFaktor(result[0].stockFaktor)}

        },
        (error) => {
          console.log(error);
        }
        
    )},[])
    useEffect(() => {
        //console.log(editItemData)
        if(editItemData.align)setAlign(editItemData.align)
        if(editItemData.count)setCount(editItemData.count)
    },[editItemData])
    useEffect(() => {
        //console.log(editItemData.sph)
        if(newSPH&&newSPH.length>4&&newCYL&&newCYL.length>4||
            editItemData&&editItemData.sph){
        const body={
            brand:brandFilter.brandName,
            lenzIndex:brandFilter.lenzIndex,
            material:brandFilter.material,
            coating:brandFilter.coating,

            osSph:editItemData?editItemData.sph:newSPH,
            osCyl:editItemData?editItemData.cyl:newCYL,
            //price:price,
            sort:"lenzIndex",
            sortAsc:"1"
        }
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(body)
          }
        //console.log(postOptions)
        fetch(env.siteApi + "/order/stock/list",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setBrandContent('')
            //if(result.size===1)saveCart
            setNewItem(result.size === 1?result.stockOD.length?
            result.stockOD[0]:result.stockOS[0]:'')
            setTimeout(()=> setBrandContent(result),200)
        },
        (error) => {
          console.log(error);
        }
        
    )}},[brandFilter,newSPH,newCYL,editItemData])
    //console.log(brandContent)
    const updateContent=(newItem,oldID,reload)=>{
        const body={
            stockOrderNo:stockId,
            newItem:newItem,
            oldID: oldID
        }
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
                "x-access-token": token&&token.token,
                "userId":token&&token.userId},
            body:JSON.stringify(body)
          }
        console.log(postOptions)
        fetch(env.siteApi + "/order/manage/editstock",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            console.log(result)
            reload&&setTimeout(()=>window.location.reload(),500)
            if(result.stock){
                setContent(result.stock)
                setStockFaktor(result.stock.stockFaktor)}
        },
        (error) => {
          console.log(error);
        })
    }
    const updateStatus=(status)=>{
        
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
              'userId':token.userId},
              body:JSON.stringify({status:"delivered",stockOrderNo:stockId})
          }
          console.log(postOptions)
          fetch(env.siteApi+"/order/manage/addStock",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                console.log(result)
                if(!result.message)
                    window.setTimeout(()=>document.location.href="/manager#orders",1000)
                else
                setError(result.message)
              },
              (error) => {
                console.log(error);
              }
            )
            .catch((error)=>{
              console.log(error)
            })
    }
    return(<main>
        <div className="filtersEdit" style={{display:editRow!==-1?"flex":"none"}}>
            <div className="filtersTotal">
            <div className="filterSPH">
                <TextField label="SPH" variant="outlined" className="filterEditStock"
                    value={editItemData?editItemData.sph:"SPH"} disabled="true"/>
                <TextField label="CYL" variant="outlined" className="filterEditStock"
                    value={editItemData?editItemData.cyl:"CYL"} disabled={true}/>
                <Autocomplete
                        options={["R","L"]} 
                        disableClearable
                        className="filterEditStock"
                        //defaultValue={editItemData&&editItemData.align||"R"}
                        value={align||"R"}
                        onChange={(e,value)=>setAlign(value)}
                        renderInput={(params) =>
                        <TextField {...params} variant="outlined"/>}
                    />
                    <TextField onChange={(e)=>setCount(e.target.value)} defaultValue="1"
                        value={count||"1"}
                        className="filterEditStock" variant="outlined" label="تعداد"/>
                </div>
            <BrandHolderStock  setBrandFilter={setBrandFilter} brandFilter={brandFilter}
                content = {brandContent} defData={editItemData}/>
            </div>
            <div className="skuResult">
                <strong>{newItem?newItem.sku:""}</strong>
                {newItem?<input className="filterBtn" type="button" value="ذخیره"
                onClick={()=>updateContent({sku:newItem&&newItem.sku,align:align,
                    count:count,hesabfa:newItem.hesabfa,price:newItem.price},editItemData.sku,1)}/>:
                <input className="disableBtn" type="button" value="ذخیره" />}
                <input className="preBtn" onClick={()=>window.location.reload()} type="button" value="انصراف"/>
            </div>
        </div>
        <div className="filtersEdit" style={{display:"none"}}>{/*//</main>editRow!==-1?"none":"flex"}}>*/}
            <div className="filtersTotal">
            <div className="filterSPH">
                <TextField label="SPH" variant="outlined" className="filterEditStock"
                    value={newSPH} onChange={(value)=>setNewSPH(value.target.value)}/>
                <TextField label="CYL" variant="outlined" className="filterEditStock"
                    value={newCYL} onChange={(value)=>setNewCYL(value.target.value)}/>
                <Autocomplete
                    options={["R","L"]} 
                    disableClearable
                    className="filterEditStock"
                    defaultValue="R"
                    onChange={(e,value)=>setAlign(value)}
                    renderInput={(params) =>
                    <TextField {...params} variant="outlined"/>}
                />
                <TextField onChange={(e)=>setCount(e.target.value)}  defaultValue="1"
                    className="filterEditStock" variant="outlined" label="تعداد"/>
            </div>
            <BrandHolderStock  setBrandFilter={setBrandFilter} brandFilter={brandFilter}
                content = {brandContent} defData={editItemData}/>
            </div>
            <div className="skuResult">
                <strong>{newItem?newItem.sku:""}</strong>
                {newItem?<input className="filterBtn" type="button" value="افزودن"
                onClick={()=>updateContent({sku:newItem&&newItem.sku,align:align,
                    count:count,hesabfa:newItem.hesabfa,price:newItem.price},"",1)}/>:
                <input className="disableBtn" type="button" value="افزودن" />}
            </div>
        </div>
        <table className="orderTable stockTable rtl">
            <tbody>
                <tr>
                    <th>ردیف</th>
                    <th>برند</th>
                    <th>عدسی</th>
                    <th>جهت</th>
                    <th>تعداد</th>
                    <th>عملیات</th>
                </tr>
                {content.stockFaktor&&
                    content.stockFaktor.map((stock,i)=>(
                        <tr key={i} style={{backgroundColor:editRow===i?"var(--main-dark)":""}}>
                            <td>{i+1}</td>
                            <StockRow stock={stock} setEditItemData={setEditItemData}
                            editItemData={editItemData} setEditRow={setEditRow} index={i}/>
                            
                            
                            <td width={30}><button className="removeTable"
                            onClick={()=>updateContent("",stock.sku)}>×</button></td>
                        </tr>
                    ))}
            </tbody>
        </table>
        <input className="filterBtn" type="button" value="تایید سفارش" 
        onClick={()=>updateStatus()}/>
        <input className="preBtn" type="button" value="بازگشت" 
        onClick={()=>document.location.href="/manager#orders"}/>
        <span>{error}</span>
    </main>)
}
export default StockEdit