import {FormControlLabel, Checkbox } from '@material-ui/core';
import SimpleFetch from '../Components/simpleFetch';
import env from '../env';

function Services(){
    const qualityRaw = SimpleFetch(env.siteApi+"/product/pages")
    return(
        <main className="pagesMain">
            <div className="contactBanner qualityBanner">
                <div className="bannerImg">
                <img src={qualityRaw&&(env.siteApiUrl+qualityRaw.pages.find(item=>item.url==="services").imageUrl)} alt="Services Control" />
                </div>
                <div className="bannerText">
                    <img src="/logo.png" alt="logo" />
                    <h1>خدمات مهرگاز</h1>
                    <div className="breadCrumbContact">
                        <a href="" >خانه / </a>
                        <span>خدمات مهرگاز</span>
                    </div>
                </div>
            </div>
            <div className="aboutText">
            <p dangerouslySetInnerHTML={{__html:qualityRaw&&qualityRaw.pages.find(item=>item.url==="services").description}}>
                </p></div>
        </main>
    )
}
export default Services