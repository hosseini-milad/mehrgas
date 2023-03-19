
import env, { filterResult, normalPrice, removeNull } from "../env";
import "../css/manage.css"
import { TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab";
import { useEffect, useState } from "react";
import Paging from "../CategoryPage/Paging";
import FiltersOffers from "./filtersOff";
const token = JSON.parse(localStorage.getItem('token-lenz'))

function ManageOffers(){
    //const manufactureList = SimpleFetch(env.siteApi+"/order/manufacture/list");
    const [userId,setUserId] = useState('')
    const [perPage , setperPage]= useState("10")
    const [manResult,setManResult] = useState("")
    const [refreshTable,setRefreshTable] = useState(0)

    const [pageNumber,setPageNumber] = useState('')
    const [content,setContent] = useState('')
    const [offers,setOffers] = useState('');
    const [offersAdd,setOffersAdd] = useState('')
    const [offerParams,setOfferParams]= useState('')
    useEffect(() => {
        const body={
            offset:pageNumber,
            customer:manResult.customer,
            customerAlt:manResult.customerAlt,
            group:manResult.group,
            status:manResult.status,
            pageSize:perPage,
        }
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(body)
          }
          //console.log(postOptions)
        fetch(env.siteApi + "/report/customers",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setContent('')
         // console.log(result)
            setTimeout(()=> setContent(result),200)
        },
        (error) => {
          console.log(error);
        }
        
    )},[pageNumber,manResult,perPage,refreshTable])
    useEffect(() => {
        console.log(userId)
        const body={userId:userId}
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(body)
          }
        fetch(env.siteApi + "/product/list/offers",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setOffers('')
          //console.log(result)
            setTimeout(()=> setOffers(result),200)
        },
        (error) => {
          console.log(error);
        }
        
    )},[offersAdd,userId])
    const addOff=()=>{
        if(!offerParams)return;
        if(!content.customers)return;
        for(var c=0;c<content.customers.length;c++)
        {
        const body={
            userId:content.customers[c]._id,
            offerCode:offerParams.offerCode,
            brandName:offerParams.brandName,
            category:"category",
            discountValue:offerParams.discountValue,
            discountPercent:offerParams.discountPercent,
            maxDiscount:"30000",
            discountTimeFrom:offerParams.discountTimeFrom,
            discountTimeTo:offerParams.discountTimeTo,
        }
        const postOptions={
            method:'post',
            headers: { 
                'Content-Type': 'application/json',
                'x-access-token':token.token,
                'userId':token.userId},
            body:JSON.stringify(body)
          }
          console.log(postOptions)
        fetch(env.siteApi + "/product/set/offers",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setOffersAdd(result)
          console.log(result)
            //setTimeout(()=> setContent(result),200)
        },
        (error) => {
          console.log(error);
        })
        .catch((error)=>{
            console.log(error)
          })
        }
    }
    //console.log(manResult)
    const options=["عملیات","کد مشتری","دسترسی","گروه","نام مشتری","تخفیف"];
        //"تعداد خرید","متوسط قیمت", "آخرین خرید"
    const optionsOffer=["ردیف","عملیات","مشتری","درصد تخفیف"
        ,"نام برند"];
    const EditUser=(body,userId)=>{
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json',
            userid:userId
        },
            body:JSON.stringify(body)
          }
          console.log(postOptions)
       fetch(env.siteApi + "/user/edit",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
          console.log(result)
        },
        (error) => {
          console.log(error);
        })
    }
    return(
        <div className='orderTableHolder offHolder'>
            
        <div className="offParts">
            <div className="filters">
                <FiltersOffers manufactureList={content} group={content&&removeNull(content.userGroup)} setManResult={setManResult}/>
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
        <table className="orderTable stockTable rtl">
            <tbody>
                <tr> 
                    {options.map((th,i)=>(
                    <th key={i}>{th}</th>))}
                </tr>
                {content&&content.customers.map((manItem,i)=>(
                    //console.log(manItem)||
                <tr key={i} onClick={()=>{}}>
                    <td className="saveManager" width="60">
                        <a href={"/customer/"+manItem.phone}>مشاهده</a></td>
                    <td width="80">{manItem&&manItem.phone}</td>
                    <td width="80">
                        <Autocomplete
                        options={["manager","factory","store","customer","shop","request","sale"]} 
                        disableClearable freeSolo
                        
                        defaultValue={manItem.access}
                        onChange={(_event, Access)=>{EditUser({access:Access},manItem._id)}}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    /></td>
                    <td>
                        <Autocomplete
                        options={removeNull(content.userGroup)||[]} 
                        freeSolo
                        style={{direction:"rtl"}}
                        defaultValue={manItem.group}
                        onChange={(_event, Group)=>{EditUser({group:Group},manItem._id)}}
                        renderInput={(params) =>
                        <TextField {...params} />}
                    /></td>
                    <td>{manItem.cName}</td>
                    <td><div onClick={()=>setUserId(manItem._id)}>فیلتر</div></td>
                    {/*<td>{normalPrice(manItem.totalPrice)}</td>*/}
                </tr>
                ))}
                
            </tbody>
        </table>
        {content&&
        <Paging content={content} setPageNumber={setPageNumber} pageNumber={pageNumber} perPage={perPage}/>}
        </div>
        <div className="offParts">
        <div className="offerPart">
            <div className="offerFields">
                {/*<input type="text" placeholder="کد تخفیف" 
                    onChange={(e)=>setOfferParams(pState => {
                        return { ...pState, offerCode: e.target.value }
                      })}/>*/}
                <Autocomplete
                    options={["ESSENCE","KODAK","REVO","MGMPlus"]}
                    style={{ width: "200px"}}
                    onChange={(e,value)=>setOfferParams(pState => {
                        return { ...pState, brandName: value }
                        })}
                    renderInput={(params) =>
                    <TextField {...params} label="برند"/>}
                />   
                <Autocomplete
                    options={["10%","15%","20%","25%","30%","35%","40%"]}
                    style={{ width: "200px"}}
                    onChange={(e,value)=>setOfferParams(pState => {
                        return { ...pState, discountPercent: value }
                        })}
                    renderInput={(params) =>
                    <TextField {...params} label="درصد تخفیف"/>}
                />   
                {/*
                <input type="text" placeholder="مبلغ تخفیف" 
                    onChange={(e)=>setOfferParams(pState => {
                        return { ...pState, discountValue: e.target.value }
                    })}/>
                    <input type="text" placeholder="تاریخ شروع تخفیف"
                     onChange={(e)=>setOfferParams(pState => {
                        return { ...pState, discountTimeFrom: e.target.value }
                      })}/>
                <input type="text" placeholder="تاریخ پایان تخفیف"
                     onChange={(e)=>setOfferParams(pState => {
                        return { ...pState, discountTimeTo: e.target.value }
                      })}/>
                <input type="text" placeholder="دسته بندی"
                    onChange={(e)=>setOfferParams(pState => {
                    return { ...pState, category: e.target.value }
                    })}/>*/}
                <input type="button" value="اعمال تخفیف" 
                    onClick={()=>addOff()}/>
                
            </div>
        </div>
        <table className="orderTable stockTable rtl">
            <tbody>
                <tr> 
                    {optionsOffer.map((th,i)=>(
                    <th key={i}>{th}</th>))}
                </tr>
                {offers&&offers.offers.map((manItem,i)=>(
                    //console.log(manItem)||
                <tr key={i} onClick={()=>{}}>
                    <td>{i}</td>
                    <td onClick={(e)=>{}}
                    className="saveManager"> </td>
                    <td>{manItem.userInfo[0]?manItem.userInfo[0].cName:''}
                    <br/>{manItem.userInfo[0]?manItem.userInfo[0].phone:''}
                    </td>
                    <td>{manItem.discountPercent}</td>
                    <td>{manItem.brandName}</td>
                </tr>
                ))}
                
            </tbody>
        </table>
        </div>
    </div>)
}
export default ManageOffers