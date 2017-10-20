import  fetch from "../config/fetch"
import  {getStore} from "../config/mUtils"

export  const  cityGuess=()=>fetch("/v1/cities",{
  type:"guess"
});

export  const  hotcity=()=>fetch("/v1/cities",{
  type:"hot"
})


export  const  groupcity=()=>fetch("/v1/cities",{
  type:"group"
})


export  const  currentcity=number=>fetch("/v1/cities/"+number);

export  const  searchplace=(cityid,value)=>fetch('/v1/pois',{
  type:"search",
  city_id:cityid,
  keyword:value
});

export const msiteAddress=geohash=>fetch("/v2/pois/"+geohash);

export  const msiteFoodType=geohash=>fetch("/v2/index_entry",{
  geohash,
  group_type:'1',
  'flags[]':"F"
});



