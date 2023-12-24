import Collection from "../HomeModules/Collection"
import HomeCatSlider from "../HomeModules/HomeCatSlider"
import SalesHome from "../HomeModules/Sales"
import Slider from "../HomeModules/Slider"
import Services from '../HomeModules/Services'
import SimpleFetch from '../Components/simpleFetch'
import env from "../env"
import BlogHome from "../HomeModules/BlogHome"

function Home(){
    const mainPage = SimpleFetch(env.siteApi+"/home");

    return(
        <main>
        <Slider mainSlider = {mainPage.slider}/>
        <Collection />
        {mainPage&&<Services services = {mainPage.services}/>}
        </main>
    )
}
export default Home