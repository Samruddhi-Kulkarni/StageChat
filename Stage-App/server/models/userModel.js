const mongoose = require('mongoose');
const bcrypt=require ('bcryptjs');
const userSchema=mongoose.Schema(
    {
    name: {
        type: String, required: true,
        },
   email:{
        type: String, required: true,unique:true,
    },
    password:{
        type: String, required: true,
    },
    pic:{
        type: String, required: true,
        default:'https://www.google.com/search?q=avatar+image&client=firefox-b-d&tbm=isch&source=iu&ictx=1&vet=1&fir=Jjq5a5o5G80fpM%252CIN--qpeX1hje-M%252C_%253BAhCy_cweM6lOWM%252CIN--qpeX1hje-M%252C_%253BdxITsiS565eqjM%252CFcUgeaJdaWL_gM%252C_%253BIdAFWUi25smL9M%252CcyPowwVV5ZV6IM%252C_%253BYXFOtw6K8pXS2M%252CHcu5m3IV3lUJEM%252C_%253B5ZWWFA1dv1TAiM%252Crsu_8O-nAYv-FM%252C_%253BcJP1p9BIhYjR9M%252CJ_Irblfupo_8_M%252C_%253BBrXIyKK93MqxCM%252CIN--qpeX1hje-M%252C_%253BgyoJrrCOGuYh7M%252CJ_Irblfupo_8_M%252C_%253BL74TpWVhIld6LM%252CrQHSgaEq6Lc3HM%252C_%253B2w8oO4UzX-wo6M%252CIN--qpeX1hje-M%252C_%253BYFPrm7iW1pfkyM%252CmCCGDy1_1-7lvM%252C_%253B5r2gsiMQhMPg3M%252CDjJcL6-DnnZi6M%252C_%253BZZcMOZGo1g8vCM%252Cnj5Z31eZQnbTDM%252C_%253BVdnfPIV6gWCP_M%252CpsSlK1jw0WuLdM%252C_%253BImUpqcIf_MU0FM%252CUUPtDBJdc_Dc4M%252C_&usg=AI4_-kTbgXa4vGqpFOULqc-BINAvPcOfVQ&sa=X&ved=2ahUKEwiavP7t9Nn2AhWKMN4KHSYmCzwQ9QF6BAgzEAE#imgrc=IdAFWUi25smL9M',
    },
},
    {
        timestamps:true,
    }  
   
);


userSchema.methods.matchPassword=async function(enteredPassword){
    return await bcrypt.compare(enteredPassword,this.password);
}
userSchema.pre('save',async function (next){
    if(!this.isModified){
        next()
    }

    const salt=await bcrypt.genSalt(10);
    this.password=await bcrypt.hash(this.password, salt);
});

const User=mongoose.model('User', userSchema);

module.exports=User;