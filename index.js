const express=require('express');
const bodyParser=require('body-parser')
const mongoose= require('mongoose');
const { render } = require('ejs');
const {DateTime} = require('luxon');

app=express()

const uri ='mongodb+srv://cp932004:JYPY2eR5lv8KG3UA@cluster0.ubnldgz.mongodb.net/job-portal?retryWrites=true&w=majority'
;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));


const connectparams={
     useNewUrlParser:true,
     useUnifiedTopology:true,
}

mongoose.connect(uri,connectparams).then(()=>{
     console.log("connected sussecful");
}).catch((err)=>{
     console.log("error",err);
})

const jobdetail=mongoose.model('jobdetail',{
     jobname:String,
     discription:String,
     skills:String,
     salary: Number,
     employment_type:String,
     location:String
});

let  numberofapplications=0;
const application_form=mongoose.model('application_form',{
     name: String,
     mobile:String,
     email: String,
     cCTC: Number,
     cjob: String,
     skills: String,
     address:String,
     job:String,
     resume:{
          type:Buffer,
     },
     app_id:String,
     status:String,
})


app.get('/codeamide/employee',(req,res)=>{
res.render('employee.ejs')
})

app.post('/codeamide/employee',(req,res)=>{
     const info=req.body;
     const newjob= new jobdetail({
          jobname:info.jobname,
          discription: info.discription,
          skills: info.skills,
          salary: info.salary,
          employment_type:info.employment_type,
          location: info.location,
     });
     newjob.save().then(()=>{
          res.redirect('/codeamide/employee')
     }).catch(err=>{
          console.log(err);
     })
})

app.get('/codeamide/careers/:jobname/application',(req,res)=>{
     const {jobname}= req.params;
     //console.log(jobname);
     res.render('application_form.ejs', {job:jobname});
});

app.get('/codeamide/applicationsucess/:apply',(req,res)=>{
     const { apply } = req.params;
     //console.log(apply);
     res.render('applicationsucess.ejs',{apply_id:apply});
});

app.post('/codeamide/careers/:jobname/application',(req,res)=>{
     const info=req.body;
     const {jobname }= req.params;
     const appid=DateTime.now().toISO().toString();
     const newapplication= new application_form({
             name:info.name,
             mobile:info.mobile,
             email:info.email,
             cCTC: info.cCTC,
             cjob: info.cjob,
             skills: info.skills,
             address: info.address,
             job: jobname,
             resume: info.resume,
             app_id: appid,
             status: "yet to be reviewed",
     });
     newapplication.save().then(()=>{
          res.redirect(`/codeamide/applicationsucess/${newapplication.app_id}`);
     }).catch(err=>{
          console.log(err);
     })

})

app.get('/codeamide/careers',(req,res)=>{
     jobdetail.find({}).then((jobs)=>{
          res.render('career.ejs',{jobs:jobs})
     })
})

app.get('/codeamide/employee/applicationreview',(req,res)=>{
     application_form.find({}).then((applies)=>{
          res.render('application_review.ejs',{applies:applies})
     });
})


 app.post('/codeamide/careers',(req,res)=>{
     const info= req.body;
     const job=info.job;
     //console.log(job);
     res.redirect(`/codeamide/careers/${job}/application`)
 })

app.get('/codeamide/about',(req,res)=>{
     res.render('about.ejs')
})

app.post('/codeamide/about',(req,res)=>{
     res.redirect('/codeamide/careers');
})

app.listen(1324, (err)=>{
     if(err){console.log("error",err)}
     else{console.log("listening on port 1324")}
})