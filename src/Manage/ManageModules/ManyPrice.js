import { useState } from "react"
import env, { normalPrice } from "../../env"

function ManyPrice(props){
    const [price,setPrice] = useState(0)
    const changeAllValue=()=>{
        if(price.length>4){
            const postOptions={
            method:'post',
            headers: { 
            'Content-Type': 'application/json'},
            //'x-access-token':token.token
            body:JSON.stringify({sku:props.content.allStock,price:price&&price.replaceAll( ',', '')})
        }
        //console.log(postOptions)
        fetch(env.siteApi+"/order/stock/price",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
            //console.log(result);
            props.setPriceSet(Math.random(10))
            },
            (error) => {
            console.log(error);
            
            }
        )
        .catch(error => {
            console.log(error)
        })
    }
    }
    const changePurchaseValue=()=>{
        if(price.length<2){
        const postOptions={
            method:'post',
            headers: { 
            'Content-Type': 'application/json'},
            //'x-access-token':token.token
            body:JSON.stringify({sku:props.content.allStock,purchase:price&&price.replaceAll( ',', '')})
        }
        //console.log(postOptions)
        fetch(env.siteApi+"/order/stock/purchase",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
            //console.log(result);
            props.setPriceSet(Math.random(10))
            },
            (error) => {
            console.log(error);
            
            }
        )
        .catch(error => {
            console.log(error)
        })
    }
    }
    return(<div className="ManyHolder">
        <input placeholder="قیمت واحد" onChange={(e)=>setPrice(e.target.value)} value={normalPrice(price)}/>
        <input style={{margin:"auto 10px",padding:"2px 10px",fontSize:"12px"}} className={price.length<4?"orderTabOpti disBtn":"orderTabOpti activeOptiTab" }
            type="button" value="اعمال تغییر" onClick={changeAllValue}/>
        <input style={{margin:"auto 10px",padding:"2px 10px",fontSize:"12px"}} className={price.length>2?"orderTabOpti disBtn":"orderTabOpti activeOptiTab" }
            type="button" value="قیمت خرید" onClick={changePurchaseValue}/>
    </div>
    )
}
export default ManyPrice