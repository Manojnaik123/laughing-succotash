if(process.env.NODE_ENV !=='production'){
    require('dotenv').config();
}

const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const Resort=require('./models/events2');
const Event=require('./models/events');
const methodOverride=require('method-override');
const ejsMate=require('ejs-mate');
const session=require('express-session');
const passport=require('passport');
const localstrategy=require('passport-local');
const User=require('./models/user');
const Call=require('./models/call')
const flash=require('flash')
const cors=require('cors')
const dbUrl=process.env.DB_URL

const sessionConfig={
    secret:'thisisasecret',
    resave:false,
    saveUnintialized:true,
    cookie:{
        httpOnly:true,
        expires:Date.now()+1000*60*60*24*7,
        maxAge:1000*60*60*24*7
    }
}
app.use(session(sessionConfig));
app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOverride('_method'))  ;
app.use(express.json({extended:true}));
app.use(express.urlencoded({extended:true})); 

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app(cors())

passport.use(new localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.set('view engine','ejs');
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));
app.set('views',path.join(__dirname,'views'));


app.engine('ejs',ejsMate);




mongoose.connect(dbUrl,{useNewUrlParser:true,useUnifiedTopology: true });
const db=mongoose.connection;
db.on('error',console.error.bind(console,'error'));
db.once('open',()=>{
  console.log('database connected');
})

app.get('/register',(req,res)=>{
    res.render('register')
})
app.post('/register',async(req,res)=>{
    const {username,email,password}=req.body;
    const user =new User({username,email})
    const reguser=await User.register(user,password)
    console.log(reguser);
    res.redirect('/')
})

app.get('/',(req,res)=>{
    
    res.render('home')

    
     
})


app.get('/events2',async(req,res)=>{
    const data=await Resort.find();
    const arr=[];
    data.forEach(lop);
    function lop(item,index){
        arr.push(item);
    }
    
    res.render('events2',{arr:arr});
       
   
})
app.get('/addresorts',async(req,res)=>{
     res.render('addresorts')
})
app.post('/addresort',async(req,res)=>{
    
    const data=new Resort(req.body);
    await data.save();
    req.flash('success','successfully made a event')
    // console.log(data);
    res.redirect(`/events2/${data._id}`)
})

app.post('/',async(req,res)=>{
    const da=new Call(req.body);
    await da.save();
    // console.log(da);
  res.redirect('/')
})

app.get('/events',async(req,res)=>{
    const data=await Event.find();
    const arr=[];
    data.forEach(lop);
    function lop(item,index){
        arr.push(item);
    }

    res.render('event',{arr:arr})
})
app.get('/addevents',async(req,res)=>{
    res.render('addevents')
})
app.post('/addevents',async(req,res)=>{
    const data=new Event(req.body);
    await data.save();
    // console.log(data)
    res.redirect(`/events/${data.id}`)
})
// events/${data._id}
app.get('/contact',(req,res)=>{
    res.render('contact')
})
app.get('/about',(req,res)=>{
    res.render('about')
})
app.get('/over',(req,res)=>{
    res.render('over')
})
app.get('/events2/:id',async(req,res)=>{
    const {id}=req.params;
    if(mongoose.Types.ObjectId.isValid(id)){
        const data=await Resort.findOne({_id:id});
        // console.log(data);
        res.render('showr',{data})

    }else{
        res.send('error')
    }
   
})
app.get('/callback',async(req,res)=>{
    const data=await Call.find()
    res.render('callback',{data})
})
app.get('/events/:id',async(req,res)=>{
     const {id}=req.params;
     if(mongoose.Types.ObjectId.isValid(id)){
        const data=await Event.findOne({_id:id});
        // console.log(data);
        
        res.render('showe',{data})

    }else{
        res.send('error')
    }
    
})
app.get('*',(req,res)=>{
    res.render('error')
})

app.listen(3004,()=>{
    console.log('3004');
})