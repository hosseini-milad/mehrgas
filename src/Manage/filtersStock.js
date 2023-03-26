import { TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab";
import {Box, Checkbox, FormControlLabel } from '@material-ui/core';
import { useState } from "react";
import { useEffect } from "react";

function FilterStock(props){
    const brandList = props.content
    const [markSph,setMarkSph] = useState(1);
    //console.log(props)
    const [sphOptions,setSphOptions] = useState(0)
    useEffect(()=>{
        setSphOptions(markSph?["6","4","2"]:["-2","-4","-6"]);
        
    },[markSph])
    return(
        <div className="autoFilter">
            {brandList&&<><div className="filterItems">
            <Autocomplete
                options={brandList.brandList||{}} 
                freeSolo
                style={{ width: "100%"}}
                value={props.stockResult.brand||''}
                onChange={(_event, Value)=>props.setStockResult(pState => 
                    {return { ...pState, brand:Value }}
                )}
                renderInput={(params) =>
                <TextField {...params} label="برند"/>}
            />
            <Autocomplete
                options={brandList.lenzIndexList||[]} 
                freeSolo
                style={{ width: "100%"}}
                value={props.stockResult.lenzIndex||''}
                
                onChange={(_event, Value)=>props.setStockResult(pState => 
                    {return { ...pState, lenzIndex:Value }}
                )}
                renderInput={(params) =>
                <TextField {...params} label="نوع کالا"/>}
            />
            <Autocomplete
                options={brandList.materialList||[]} 
                freeSolo
                style={{ width: "100%"}}
                value={props.stockResult.material||''}
                
                onChange={(_event, Value)=>props.setStockResult(pState => 
                    {return { ...pState, material:Value }}
                )}
                renderInput={(params) =>
                <TextField {...params} label="حجم کالا"/>}
                />
            <Autocomplete
                options={brandList.coatingList||[]} 
                freeSolo
                style={{ width: "100%"}}
                value={props.stockResult.coating||''}
                
                onChange={(_event, Value)=>props.setStockResult(pState => 
                    {return { ...pState, coating:Value }}
                )}
                renderInput={(params) =>
                <TextField {...params} label="جنس بدنه"/>}
                />

            </div>
            </>}
        </div>
    )
}
export default FilterStock