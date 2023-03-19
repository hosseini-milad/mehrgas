
import {Box, Slider } from '@material-ui/core';
import { useEffect, useState } from "react";
import StockResult from "./StockResultFinal";
import env, { normalPrice } from "../../env";
import BrandHolderStock from "./Stock01/BrandHolderStock";
import ODOSStock from "../OrderModules/ODOSStock";
import BrandHolderStockMobile from "./Stock01/BrandHolderStockMobile";
import ODOSStockMobile from "../OrderModules/ODOSStockMobile";
import StockFaktorPreview from './Stock02/StockFaktorPreview';
const wWidth= window.innerWidth;
const token = JSON.parse(localStorage.getItem('token-lenz'))

function StockStep(props){
    const [mainValue,setMainValue] = useState([,,,,,]);
    const [mainLeft,setMainLeft] = useState([,,,,,])
    const [faktor,setFaktor] = useState([]);
    const [brandFilter,setBrandFilter]= useState("")
    const [price,setPrice] = useState([0,500]);
    const [content,setContent]= useState(0)
    const [odCount,setODCount] = useState([1,1]);
    useEffect(() => {
        //console.log(props)
        const body={
            brand:brandFilter&&brandFilter.brandName,
            lenzIndex:brandFilter&&brandFilter.lenzIndex,
            material:brandFilter&&brandFilter.material,
            coating:brandFilter&&brandFilter.coating,

            osSph:mainValue[0],
            osCyl:mainValue[1],
            odSph:mainLeft[0],
            odCyl:mainLeft[1],
            dia:mainValue[2]?mainValue[2]:'',
            add:mainValue[3]?mainValue[3]:'',
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
            setContent('')
            //if(result.size===1)saveCart
            setTimeout(()=> setContent(result),200)
        },
        (error) => {
          console.log(error);
        }
        
    )},[brandFilter,mainValue,mainLeft])
    useEffect(() => {
        const postOptions={
            method:'get',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId}
          }
          //console.log(postOptions)
          fetch(env.siteApi+"/order/getCart",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                setFaktor(result)
                props.setOrderCount(result.length)
              },
              (error) => {
               console.log({error:error.message});
              }
        );
    },[props.orderCount])
    //console.log(mainValue)
    return(<>
        <div className='stockMainHolder' style={{display:"grid"}}>
            <div className="orderDataHolder">
            {wWidth>700?<>
                <ODOSStock params={props.params} setMainValue={setMainValue} 
                    mainValue={mainValue} title="R" setCount={setODCount} count={odCount}/>
                <ODOSStock params={props.params} setMainValue={setMainLeft} 
                    mainValue={mainLeft} title="L" setCount={setODCount} count={odCount}/></>:
                <>
                <ODOSStockMobile params={props.params} setMainValue={setMainValue} 
                    mainValue={mainValue} title="R" setCount={setODCount} count={odCount}/>
                <ODOSStockMobile params={props.params} setMainValue={setMainLeft} 
                    mainValue={mainLeft} title="L" setCount={setODCount} count={odCount}/>
                    </>}
                
                {wWidth>700?<BrandHolderStock setBrandFilter={setBrandFilter} brandFilter={brandFilter}
                    content = {content}/>:
                    <BrandHolderStockMobile setBrandFilter={setBrandFilter} brandFilter={brandFilter}/>}
                
            </div>
            <StockResult setStockItem={props.setStockItem} 
                content={content} count={odCount}
                orderCount={props.orderCount} setOrderCount={props.setOrderCount}/>
        </div>
        <StockFaktorPreview faktor={faktor} setFaktor={setFaktor} //setCount={setCount}
                        //setStockItem={setStockItem} setQuick={setQuick} 
                        setOrderCount={props.setOrderCount} orderCount={props.orderCount}/>
        {/*<div className='quickCart'>
            {props.faktor&&<table className="orderTable stockTable">
                    <tbody>
                        <tr>
                            <th>جهت</th>
                            <th>SPH</th>
                            <th>CYL</th>
                            <th>برند</th>
                            <th>تعداد</th>
                        </tr>
                        {props.faktor.map((faktorItem,i)=>(
                            <tr key={i}>
                                <td>{faktorItem.align}</td>
                                <td style={{direction:"ltr"}}>{faktorItem.stockDetail[0].sph}</td>
                                <td style={{direction:"ltr"}}>{faktorItem.stockDetail[0].cyl}</td>
                                <td dangerouslySetInnerHTML={{__html:"<strong>"+faktorItem.stockDetail[0].brandName+"</strong>"}}>
                                </td> 
                                <td>{faktorItem.count}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>}
            </div>
        <StockResult setTabIndex={props.setTabIndex}
            style={{display:eyeSelect[0]===1?"block":"none"}}
            setStockItem={props.setStockItem}
            setStockPopUp={props.setStockPopUp}
            price={price} priceFilter={priceFilter}
            mainValue={mainValue} mainLeft={mainLeft}
            count={odCount} setCount={props.setCount}
            stockFilter={brandFilter} setQuick={props.setQuick}
            orderCount={props.orderCount} setOrderCount={props.setOrderCount}/>
                        */}
        </>
    )
}
export default StockStep