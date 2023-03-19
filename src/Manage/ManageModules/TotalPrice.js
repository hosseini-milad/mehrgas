import { useState } from "react"
import env, { normalPrice, purePrice } from "../../env"

function TotalPrice(props){
    const [error,setError] = useState('')
    const changeAllValue=()=>{
        
        const postOptions={
            method:'post',
            headers: { 
            'Content-Type': 'application/json'},
            //'x-access-token':token.token
            body:JSON.stringify({data:props.content})
        }
        console.log(postOptions)
        fetch(env.siteApi+"/order/manufacture/priceAll",postOptions)
        .then(res => res.json())
        .then(
            (result) => {
                setError(result.message)
                //setTimeout(()=>window.location.reload(),3000);
            //props.setPriceSet(Math.random(10))
            },
            (error) => {
            console.log(error);
            
            }
        )
        .catch(error => {
            console.log(error)
        })
    
    }
    return(<div className="ManyHolder">
        <input style={{margin:"auto 10px",padding:"2px 20px",fontSize:"12px"}} className="orderTabOpti activeOptiTab" 
            type="button" value={error?"در حال ثبت":"ذخیره کل قیمت ها"} onClick={changeAllValue}/>
        <small>{error}</small>
    </div>
    )
}
export default TotalPrice