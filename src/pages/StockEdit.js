import { useEffect, useState } from "react";
import env, { gregorian_to_jalali, jalali_to_gregorian } from "../env";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { TextField } from "@material-ui/core"
import BrandHolderStock from "../OrderPage/Stock/Stock01/BrandHolderStock";
import StockRow from "../OrderPage/Stock/Stock02/StockRow";
import DatePicker, { utils } from "react-modern-calendar-datepicker";
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
    const [date,setDate] = useState('')
    //console.log(date)
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
            
            if(result.length){
             const loadDate = new Date(result[0].loadDate)
                setContent(result[0])
                const dateFormat =gregorian_to_jalali(loadDate.getFullYear(),
                    loadDate.getUTCMonth()+1,loadDate.getDate()) 
                setDate({day:dateFormat[2],month:dateFormat[1],year:dateFormat[0]})   
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
        
        const body={
            brand:brandFilter.brandName,
            lenzIndex:brandFilter.lenzIndex,
            material:brandFilter.material,
            coating:brandFilter.coating,
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
            setNewItem(result.size === 1?
            result.stock[0]:'')
            setTimeout(()=> setBrandContent(result),200)
        },
        (error) => {
          console.log(error);
        }
        
    )},[brandFilter,newSPH,newCYL,editItemData])
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
    const updateDate=(newDate,reload)=>{
        const body={
            loadDate:new Date(newDate),
            stockOrderNo:stockId
        }
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
                "x-access-token": token&&token.token,
                "userId":token&&token.userId},
            body:JSON.stringify(body)
          }
        console.log(postOptions)
       fetch(env.siteApi + "/order/manage/editDate",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            console.log(result)
            reload&&setTimeout(()=>window.location.reload(),500)
        },
        (error) => {
          console.log(error);
        })
    }
    const updateDateFunction=(date)=>{
        updateDate(jalali_to_gregorian(date.year,date.month,date.day),1)
        setDate(date)
        
    }
    const updateStatus=(status)=>{
        
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
              'userId':token.userId},
              body:JSON.stringify({status:"inVehicle",stockOrderNo:stockId})
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
        <div className="changeDate">
            <DatePicker
                value={date}
                onChange={(e)=>updateDateFunction(e)}
                inputPlaceholder="تغییر تاریخ تحویل"
                shouldHighlightWeekends
                minimumDate={utils('fa').getToday()}
                locale="fa" // add this
            />
        </div>
        <input className="filterBtn" type="button" value="تایید سفارش" 
        onClick={()=>updateStatus()}/>
        <input className="preBtn" type="button" value="بازگشت" 
        onClick={()=>document.location.href="/manager#orders"}/>
        <span>{error}</span>
    </main>)
}
export default StockEdit