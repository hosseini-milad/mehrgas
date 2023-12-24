import { TextField } from "@material-ui/core"
import Autocomplete from '@material-ui/lab/Autocomplete';
import { useEffect } from "react";
import { useState } from "react";
import env, { removeNull } from "../../../env";

function BrandHolderStock(props){
    const def = props.defData;
    const [brandSelect , setBrandSelect]= useState("")
    const [selectedBrand,setSelectBrand] = useState(def)
    const content = props.content
    const [existItems , setExistItems]= useState()
    //console.log(content.coatingList)

    useEffect(() => {
        props.defData&&props.setBrandFilter(props.defData)
    },[props.defData])
    useEffect(() => {
        const body={
            brandName:props.brandFilter.brandName,
            lenzIndex:props.brandFilter.lenzIndex,
            material:props.brandFilter.material,
            coating:props.brandFilter.coating
        }
        const postOptions={
            method:'post',
            headers: {'Content-Type': 'application/json'},
            body:JSON.stringify(body)
          }
        //console.log(postOptions)
        fetch(env.siteApi + "/product/exists-brands",postOptions)
      .then(res => res.json())
      .then(
        (result) => {
            setTimeout(()=> setExistItems(result),200)
        },
        (error) => {
          console.log(error);
        }
        
    )},[props.brandFilter])
    
    const updateQuery=(field,rawValue)=>{
        const value = rawValue;
        if(field==="coating")
            props.setBrandFilter(pState => {
            return { ...pState, coating: value }
            })  
        if(field==="material")
            props.setBrandFilter(pState => {
                return { ...pState, material: value ,coating:""}
            }) 
        if(field==="lenzIndex")
            props.setBrandFilter(pState => {
                return { ...pState,lenzIndex:value, material: "" ,coating:""}
            })    

        if(field==="brandName")
        props.setBrandFilter({brandName:value})
        updateIndex(field)
    }
    const updateIndex=(field)=>{
        const nextfield = document.querySelector(
            field==="brandName"?`#LenzIndex`:
            field==="lenzIndex"?`#Material`:
            field==="material"?"#Add":"#Add"
          );
          //console.log(field,nextfield)
          // If found, focus the next field
          if (nextfield !== null) {
            setTimeout(()=>nextfield.focus(),200);
          }
    }
    return(
        <div className='orderLenzData'>
            <div className='lenzData'>
                {existItems&& <Autocomplete id="Brand"
                    options={content?content.brandList:[]}
                    style={{ width: "100%"}}
                    //defaultValue={def?def.brandName:''}
                    value={props.brandFilter.brandName||''}
                    onChange={(_event, data)=>updateQuery("brandName",data)}
                    renderInput={(params) =>
                    <TextField {...params} label="برند" variant="outlined"/>}
                />}
            </div>
            <div className='lenzData'>
                {existItems&& <Autocomplete id="LenzIndex"
                    disabled={props.brandFilter.brandName?false:true}
                    options={content?removeNull(content.lenzIndexList):[]}
                    style={{ width: "100%"}}
                    onChange={(_event, data)=>updateQuery("lenzIndex",data)}
                    value={props.brandFilter.lenzIndex|| null}
                    renderInput={(params) =>
                    <TextField {...params}  label="نوع کالا" variant="outlined"  />}
                />}
            </div>
            <div className='lenzData'>
                {existItems&& <Autocomplete id="Material"
                    disabled={props.brandFilter.lenzIndex?false:true}
                    options={content?removeNull(content.materialList):[]}
                    style={{ width: "100%"}}
                    onChange={(_event, data)=>updateQuery("material",data)}
                    value={props.brandFilter.material|| null}
                    renderInput={(params) =>
                    <TextField {...params}  label="حجم کالا" variant="outlined"  />}
                />}
            </div>
            <div className='lenzData'>
                {existItems&& <Autocomplete id="Coating"
                    disabled={props.brandFilter.material?false:true}
                    options={content?removeNull(content.coatingList):[]}
                    style={{ width: "100%"}}
                    onChange={(_event, data)=>updateQuery("coating",data)}
                    //value={props.brandFilter.coating|| null}
                    value={props.brandFilter.coating|| null}
                    renderInput={(params) =>
                    <TextField {...params} label="جنس بدنه" variant="outlined"/>}
                />}
                    </div>
        </div>
    )
}
export default BrandHolderStock