import { useState } from "react";
import ButtonLoaderSimple from "../../../Components/BtnLoaderSimple";
import env, { jalali_to_gregorian, normalPrice, normalPriceCount, sumPrice } from "../../../env";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';
import DatePicker, {Calendar, utils } from "react-modern-calendar-datepicker";
import { useEffect } from "react";
import SimpleAlert from "../../../Components/SimpleAlert";
const token = JSON.parse(localStorage.getItem('token-lenz'))

function StockFaktorPreview(props){
    const [faktor,setFaktor] = useState();
    const [alertShow,setAlertShow] = useState({show:false,action:0})
    const [date,setDate] = useState('')
    const [desc,setDesc] = useState('')
    const [manager,setManager] = useState()
    const [selectedCustomer,setCustomer] = useState()
    const [customerList,setCustomerList] = useState()
    useEffect(()=>{
      if(alertShow.action)
        window.setTimeout(()=>document.location.href=token.access==="customer"?
          "/profile#orders":"/manager#orders",200)
    },[alertShow])
    useEffect(() => {
      setFaktor()
      const postOptions={
          method:'post',
          headers: { 'Content-Type': 'application/json' ,
          "x-access-token": token&&token.token,
          "userId":token&&token.userId},
          body:JSON.stringify({userId:selectedCustomer?selectedCustomer._id:''})
        }
        //console.log(postOptions)
        fetch(env.siteApi+"/order/getCart",postOptions)
          .then(res => res.json())
          .then(
            (result) => {
              setFaktor(result.cart)
            },
            (error) => {
             console.log({error:error.message});
            }
      );
  },[selectedCustomer])
    useEffect(() => {
      const postSimple={
        method:'post',
        headers: {'Content-Type': 'application/json'},
        body:JSON.stringify({customer:manager})
      }
      fetch(env.siteApi+"/report/customers",postSimple)
      .then(res => res.json())
      .then(
        (result) => {
          setCustomerList(result);
        },
        (error) => {
          console.log({error:error});
        }
      ) 
  },[manager])
/*
    useEffect(()=>{
        if(sku.length===7){
          setFaktor('')
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({sku:sku,align:align,count:"1"})
          }
          //console.log(postOptions)
       fetch(env.siteApi + "/order/addCart",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            if(result.cart){
                setFaktor(result.cart)
                props.setOrderCount(result.cart.length)
            }
            else
            {setError("آیتم وجود ندارد")
            setTimeout(()=>setError(""),3000)}
        },
        (error) => {
          console.log(error);
        })
        setSku('')}
    },[sku])*/
    const updateOrderStatus=(status)=>{
        const orderData ={stockOrderNo:("S"+Date.now().toString().substring(7,12))
            ,stockOrderPrice:totalPrice(faktor)}
        var standardFaktor=[]
        console.log(faktor)
        const cart = faktor.cart
        for(var i =0;i<cart.length;i++){
            //console.log(faktor[i])
            standardFaktor.push({
                sku:cart[i].sku,
                weight:cart[i].weight,
                count:cart[i].count?cart[i].count:"1",
                price:cart[i].price})
        }
        const postOptions={
            method:'post',
            headers: { 
              'Content-Type': 'application/json',
              'x-access-token':token.token,
              'userId':token.userId},
              body:JSON.stringify({...orderData,status:!status?"inprogress":"completed",
                stockFaktor:standardFaktor,
                stockOrderPrice:faktor.cartPrice,
                credit:faktor.cartCredit,
                freeCredit:faktor.freeCredit,
                fromUser:selectedCustomer?selectedCustomer._id:'',
                description:desc+"<br/>",
                loadDate:jalali_to_gregorian(
                  date.year,date.month,
                  date.day).toString().replace( /,/g, '/'),})
          }
          console.log(postOptions)
          fetch(env.siteApi+"/order/addStock",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                //console.log(result)
                clearCart();
                setAlertShow({show:true,action:0})
              },
              (error) => {
                console.log(error);
              }
            )
            .catch((error)=>{
              console.log(error)
            })
    }
    const removeItem=(item)=>{
      setFaktor()
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({sku:item.sku,align:item.align,
              userId:selectedCustomer?selectedCustomer._id:''})
          }
          fetch(env.siteApi+"/order/removeCart",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setFaktor(result.cart);
                
              },
              (error) => {
               console.log({error:error.message});
              }
        );
    }
    const updateCount=(item,count)=>{
      setFaktor()
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify({sku:item.sku,align:item.align,
              count:count.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d)),
              userId:selectedCustomer?selectedCustomer._id:''})
          }
          fetch(env.siteApi+"/order/editCart",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setFaktor(result.cart)
              },
              (error) => {
               console.log({error:error.message});
              }
        );

    }
    const calcTotalPrice=(price,count,morePrice,align)=>{
        
        var totalPrice =0;
        try{totalPrice = (parseInt(price)
            *parseInt(count))}catch{}
        
        return(normalPrice(totalPrice))
    }
    const totalPrice=(item)=>{
        //console.log(item)
        if(!item)return
        var totalPrice =0;
        for(var i =0;i<item.length;i++){
            totalPrice= item[i].stockDetail[0]&&item[i].stockDetail[0].price?
            sumPrice(totalPrice+"+"+(item[i].count*item[i].stockDetail[0].price)):totalPrice;
        }
        return(totalPrice)
    }
    const clearCart=()=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId}
          }
          //console.log(postOptions)
          fetch(env.siteApi+"/order/removeCart",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                props.setFaktor(result.cart);
                props.setOrderCount(result.cart.length)
              },
              (error) => {
               console.log({error:error.message});
              }
        );
    }
    console.log(faktor)
    return(<>
        <div className="tableHolder">
          {faktor&&faktor.cart?<table className="orderTable stockTable rtl">
            <tbody>
                <tr>
                    <th className="mobileHide" style={{width:"20px"}}>ردیف</th>
                    <th className="mobileHide" style={{width:"35px"}}>کد</th>
                    <th>برند</th>
                    <th style={{width:"35px"}}>تعداد</th>
                    <th>قیمت واحد</th>
                    <th>قیمت کل</th>
                    <th>حذف</th>
                </tr>
                {faktor&&faktor.cart.map((faktorItem,i)=>(
                    faktorItem.stockDetail&&faktorItem.stockDetail[0]&&
                <tr key={i} style={{backgroundColor:faktorItem.fob?"bisque":"inherit"}}>
                    <td className="mobileHide" onClick={()=>removeItem(faktorItem.sku)}>{i+1}</td>
                    <td className="mobileHide" >{faktorItem.sku}</td>
                    
                    <td >{faktorItem.stockDetail[0].title}</td>
                    <td><input className="stockCountInput orderTableInput" 
                      type="text" value={faktorItem.count} 

                        /*onKeyDown={(e)=>e.keyCode === 13&&
                        updateCount(faktorItem,e.target.value)}*//></td>
                    <td style={{direction: "ltr"}} dangerouslySetInnerHTML={{__html:
                    (normalPrice(faktorItem.price))+"<br/>"+
                    (faktorItem.fob?" FOB ":"")}}></td>
                    <td style={{direction: "ltr"}}dangerouslySetInnerHTML={{__html:
                        normalPriceCount(faktorItem.price,faktorItem.count)}}></td>
                    <td className="deleteBtn" onClick={()=>removeItem(faktorItem)}>×</td>
                    </tr>
                ))}
                <tr>
                    <td colSpan={2}></td>
                    <td className="mobileHide"></td>
                    <td className="mobileHide"></td>
                    <td>قیمت کل</td>
                    <td colSpan={2} style={{fontSize:"15px",fontWeight:"bold"}}>
                      {normalPrice(faktor&&faktor.cartPrice)} ریال</td>
                </tr>
                <tr>
                    <td colSpan={2}></td>
                    <td className="mobileHide"></td>
                    <td className="mobileHide"></td>
                    <td>اعتبار مورد نیاز</td>
                    <td colSpan={2} style={{fontSize:"15px",fontWeight:"bold"}}>
                      {faktor&&faktor.cartCredit}</td>
                </tr>
                <tr>
                    <td colSpan={2}></td>
                    <td className="mobileHide"></td>
                    <td className="mobileHide"></td>
                    <td>اعتبار شما</td>
                    <td colSpan={2} style={{fontSize:"15px",fontWeight:"bold"}}>
                      {faktor&&faktor.myCredit}</td>
                </tr>
            </tbody>
          </table>:env.loader}
        </div>
        <div className="orderContinue" style={{float: "none",justifyContent:"space-between",alignItems: "center"}}>
          {token.access!=="customer"?<div className="orderFrom" 
                    style={{display: token.access!=="customer"?"flex":"none"}}>
                <Autocomplete
                    options={(manager&&manager.length>1)?customerList&&customerList.customers:[]||[]}
                    getOptionLabel={item=>(item.cName?item.cName:item.phone)||''}
                    style={{minWidth:"200px"}}
                    onChange={(e,value)=>setCustomer(value)}
                    renderInput={(params) =>
                        <TextField {...params} label="سفارش از طرف" variant="outlined" 
                        onChange={(e)=>setManager(e.target.value)}/>}
                    />
                  
                </div>:<></>}
                

            {faktor&&faktor.cartPrice&&date?<><ButtonLoaderSimple className="orderBtn"
                style={{float: "none"}} action={()=>updateOrderStatus(0)} popTitle="ثبت نهایی سفارش"
                    completed={()=>{}}  selectedCustomer={selectedCustomer&&selectedCustomer._id}
                title={"ثبت نهایی سبد سفارشات"} popText={"آیا از ثبت سفارش اطمینان دارید؟"}/>
                <button className="orderBtn warnBtn" onClick={clearCart}>خالی کردن سفارشات</button>
                </>:<> <div></div></>}
            {/*((token.access==="manager"||token.access==="sale")&&faktor&&faktor.length)?
            <ButtonLoaderSimple className={"orderBtn"} action={()=>updateOrderStatus(1)}
                style={{float: "none"}} completed={()=>setAlertShow({show: true,title:"تایید سفارش",
                text:"سفارش با موفقیت ثبت شد " ,
                nocancel:1,    part:""})}
                    title={"ثبت مستقیم سفارش"}/>:''*/}
                    
            {faktor&&faktor.cartPrice?<div style={{display:"grid"}}>
              {!date?<span style={{color:"red"}}>
                    لطفا زمان ارسال را تعیین کنید
                    </span>:<></>}
              <DatePicker
                    value={date}
                    onChange={setDate}
                    inputPlaceholder="انتخاب تاریخ تحویل"
                    shouldHighlightWeekends
                    minimumDate={utils('fa').getToday()}
                    locale="fa" // add this
                />
                <textarea placeholder="توضیحات" value={desc} 
                  onChange={(e)=>setDesc(e.target.value)}/>
                </div>:<></>}
            {/*<div style={{display:"flex"}}>
            <Autocomplete
                options={["راست","چپ"]} 
                freeSolo
                style={{ width: "100px",margin:"auto 15px"}}
                defaultValue="راست"
                onChange={(e,value)=>setAlign(value==="راست"?"R":"L")}
                renderInput={(params) =>
                <TextField {...params} label="جهت"/>}
            />
            <TextField label="شناسه محصول" value={sku} onChange={(e)=>setSku(e.target.value)}/>
                <sub className="errorQuickAdd">{error}</sub></div>*/}
        </div>
        {alertShow.show?<SimpleAlert data={{text:"سفارش با موفقیت ثبت شد"}}
           setAlertShow={setAlertShow} nocancel={1}/>:<></>}
        </>
    )
}
export default StockFaktorPreview