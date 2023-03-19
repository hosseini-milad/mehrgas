import { useEffect, useState } from "react";
import Paging from "../../CategoryPage/Paging";
import env, { normalPrice } from "../../env";
const perPage = 10;
const wWidth= window.innerWidth;
const token = JSON.parse(localStorage.getItem('token-lenz'));
function StockResult(props){
    const price=props.priceFilter?props.price:0;
    const content = props.content
    //console.log(props.count)
    const saveCart=(sku)=>{
        const postOptions={
            method:'post',
            headers: { 'Content-Type': 'application/json' ,
            "x-access-token": token&&token.token,
            "userId":token&&token.userId},
            body:JSON.stringify(sku)
          }
          //console.log(postOptions)
          fetch(env.siteApi+"/order/addCart",postOptions)
            .then(res => res.json())
            .then(
              (result) => {
                props.setOrderCount(result)
                setTimeout(()=>window.location.reload(),200)
              },
              (error) => {
               console.log({error:error.message});
              }
        );
    }
    
    //console.log(props)
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
                props.setOrderCount(result.length)
              },
              (error) => {
               console.log({error:error.message});
              }
        );
    },[props.orderCount])
    return(
        <div className="orderDataHolder StockDataHolder">
            {content.size&&content.size===1?
                <div className="stockResultItems"><div>
                  {content.stockOD.length?<><strong>L</strong>
                    {/*<small>{`(${content.stockOD[0].sku})`} </small>
                    <strong>{`- ${content.stockOD[0].brandName} 
                    ${content.stockOD[0].lenzIndex}`}</strong>
            <span>{normalPrice(content.stockOD[0].price)}</span>*/}
                <strong style={{color:"green",margin:"auto 10px"}}>موجود است</strong></>:<></>}
                    {content.stockOD.length&&content.stockOS.length?<hr/>:<></>}
                    {content.stockOS.length?<><strong>R</strong>
                    {/*<small>{`(${content.stockOS[0].sku})`} </small>
                    <strong>{`- ${content.stockOS[0].brandName} 
                    ${content.stockOS[0].lenzIndex}`}</strong> - 
                    <span>{normalPrice(content.stockOS[0].price)}</span>*/}
                    <strong style={{color:"green",margin:"auto 10px"}}>موجود است</strong></>:<></>}
                    </div>
                  <input className="orderBtn stockAdd" id="Add"
                    onClick={()=>{
                      if(content.stockOD.length)
                        saveCart({sku:content.stockOD[0].sku,
                          hesabfa:content.stockOD[0].hesabfa,
                          align:"L",
                          count:props.count[0]})
                      if(content.stockOS.length)
                        saveCart({sku:content.stockOS[0].sku,
                          hesabfa:content.stockOS[0].hesabfa,
                          align:"R",
                          count:props.count[1]})

                    }}
                    value="افزودن" type="button"/>
                </div>:<></>}
        </div>
    )
}
export default StockResult