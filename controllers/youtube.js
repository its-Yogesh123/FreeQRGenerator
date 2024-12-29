const axios=require("axios");
const  CHANNEL_ID="UCbhNa11r4gFX4PjHmKC3jrw";
const API_KEY="AIzaSyAg6h4mRF2SapPe4t7yQjNQenwhYHA2sKw";
async function getLatestVideo(){
    try{
        const response= await axios.get("https://www.googleapis.com/youtube/v3/search",{
            params:{
                key:API_KEY,
                channelId:CHANNEL_ID,
                order:'date',
                part:"snippet", //specifying 'snippet',get details like the title, description, and thumbnails of the video
                maxResults:1   // maximum 1 details 
            },
        });
        const latestVideo=response.data.items[0];
        if(latestVideo){
            const vid=latestVideo.id.videoId;
            return vid;
        }else throw new Error("No Response Get by AXIOS");
    }
    catch(e){
        console.log("An Error Caught");
        console.log(e)
        return null;
    }
}

module.exports=getLatestVideo;