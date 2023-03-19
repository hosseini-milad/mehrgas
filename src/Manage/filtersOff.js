import { TextField } from "@material-ui/core"
import { Autocomplete } from "@material-ui/lab";
import { useState } from "react";

function FiltersOffers(props){
    const manufactureList = props.manufactureList;
    const brandList = props.brandList
       // console.log(props.group);
    return(
        <div className="filterItems">
            <TextField style={{ width: "100%",marginTop: "20px"}}
                onKeyDown={(e)=>{(e.key)==='Enter'&&console.log("enter")}}
                onChange={(e)=>{props.setManResult(pState => 
                    {return { ...pState, customer:e.target.value,
                            customerAlt:e.target.value.replaceAll('ی','ي') }}
                )}}
                 label="مشتری"/>
            <Autocomplete
                options={props.group||[]} 
                freeSolo
                style={{ width: "100%"}}
                
                onChange={(_event, Value)=>props.setManResult(pState => 
                    {return { ...pState, group:Value }}
                )}
                renderInput={(params) =>
                <TextField {...params} label="گروه مشتری"/>}
            />
            {/*<Autocomplete
                options={["initial","inprogress","cancel","faktor","delivered","inproduction"]} 
                freeSolo
                style={{ width: "100%"}}
                
                onChange={(_event, Value)=>props.setManResult(pState => 
                    {return { ...pState, status:Value }}
                )}
                renderInput={(params) =>
                <TextField {...params} label="وضعیت"/>}
            />
            <TextField style={{ width: "100%",marginTop: "20px"}}
                label="رزرو"/>*/}
        </div>
    )
}
export default FiltersOffers