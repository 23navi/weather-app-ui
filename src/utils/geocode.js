const request=require("postman-request")
require('dotenv').config()
console.log(process.env.WEATHER_KEY) 

const forwardGeocode=(name,callback)=>{
    const URL="https://api.mapbox.com/geocoding/v5/mapbox.places/"+name+".json?access_token="+process.env.MAPBOX_KEY
    request({url:URL,json:true},(error,response)=>{
        if(error){
            callback("Network Error",undefined)
        }
        else if(response.body.message){
            callback(response.body.message,undefined)
        }
        else{

            if(response.body.features[0]==undefined){
                callback("No result found",undefined)
            }else{
                
                name=(response.body.features[0].place_name)
                long=(response.body.features[0].geometry.coordinates[0])
                lat=(response.body.features[0].geometry.coordinates[1])
                callback(undefined,{long:long,lat:lat,name:name})
            }
        }
        
    })
}




const reverseGeocode=({lon,lat},callback)=>{

    const URL="https://api.mapbox.com/geocoding/v5/mapbox.places/"+lon+","+lat+".json?access_token=pk.eyJ1IjoibmF2aTIzMDgiLCJhIjoiY2twYzU4dDBmMDBxazJvcDcxb2d4Yjd4MiJ9.i1mlZ1G0qqBMxDsq75VLyQ"
    request({url:URL,json:true},(error,response)=>{
        if(error){
            callback("Network Error",undefined)
        }
        else if(response.body.message){
            callback(response.body.message,undefined)
        }
        else{

            if(response.body.features[0]==undefined){
                callback("No result found",undefined)
            }else{
                let name="";
                name+=(response.body.features[0].context[0].text);
                name+=", "
                name+=(response.body.features[0].context[1].text);
                name+=", "
                name+=(response.body.features[0].context[2].text);
                console.log(name)
                callback(undefined,name)
            }
        }
        
    })
}



module.exports={
    forwardGeocode,
    reverseGeocode
}
