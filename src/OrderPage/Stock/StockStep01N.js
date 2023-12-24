
import { TextField } from "@material-ui/core"
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
    const [count,setCount] = useState(1);
    useEffect(() => {
        //console.log(props)
        const body={
            brand:brandFilter&&brandFilter.brandName,
            lenzIndex:brandFilter&&brandFilter.lenzIndex,
            material:brandFilter&&brandFilter.material,
            coating:brandFilter&&brandFilter.coating,

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
    
    //console.log(mainValue)
    return(<>
        <div className='stockMainHolder' style={{display:"grid"}}>
            <div className="orderDataHolder">
            
                {wWidth>700?<BrandHolderStock setBrandFilter={setBrandFilter} brandFilter={brandFilter}
                    content = {content}/>:
                    <BrandHolderStockMobile setBrandFilter={setBrandFilter} brandFilter={brandFilter}/>}

                    <TextField label="تعداد" variant="outlined" value={count}
                    onChange={(e)=>setCount(e.target.value)} className="countStock"/>
            </div>
            <StockResult setStockItem={props.setStockItem} 
                content={content} count={count} setBrandFilter={setBrandFilter}
                orderCount={props.orderCount} setOrderCount={props.setOrderCount}/>
        </div>
        <StockFaktorPreview />
        
        </>
    )
}
export default StockStep