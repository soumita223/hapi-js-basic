'use strict'

const hapi = require('hapi');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/hapidb')
.then(() => console.log('MOngodb connected.....'))
.catch((err)=>console.lerror(err));

const task = mongoose.model('tasks', {text:String});

const StdSchema = mongoose.Schema({
    name: {
        type:String
    },
    id:{
        type:Number
    },
    inst:{
        type: String
    }

})

const std = mongoose.model('Student', StdSchema);

const stdt = new std({
    name:'Sandy',
    id: 448,
    inst: 'BUET'
})



const init = async () => {
    const server = hapi.server({
    port:3000,
    host:'localhost'

})

await server.register(require('inert'));
await server.register(require('vision'));


server.route({
    method: 'Get',
    path: '/',
    handler:  (request, h) => {
      /*return (
          'Hello World'
         
          ) ;  */
          return h.view('index', {
              name:'Smith',
              id : '111'
          }) ;
     }
    })

server.route({
    method: 'Get',
    path: '/tasks',
    handler: async (request, h) => {
            
            const tasks = await task.find();
            console.log(tasks);
            return h.view('Tasks', {
                tasks: tasks
                
            })
            console.log(tasks);
           
        }
    })

server.route({
    method: 'post',
    path: '/tasks',
    handler: async (request, h) => {
            const inputTask = new task({
                text:request.payload.text
            });
            //if(inputTask.text != '')
            const result = await inputTask.save();
            const remText = request.payload.textRem;
            task.find({text:remText}).remove().exec();
            return h.redirect().location('tasks');
            
        }
    })
    

server.route({
    method: 'Get',
    path: '/{name}',
    handler: (request, h) => {
      return (
          'Hello '+ request.params.name
         
          ) ;   
     }
    

})

//,(err)=>
//{
    /*if(err)
        throw err;*/
server.route({
            method: 'Get',
            path: '/about',
            handler: (request, h) => {
              return h.file (
                  './public/about.html'
                 
                  ) ;   
             }
            });

//}

server.route({
    method: 'Get',
    path: '/picture',
    handler: (request, h) => {
      return h.file (
          './public/pic.jpg'
         
          ) ;   
     }
    });

server.views({
    engines:{
        html:require('handlebars')
    },
    path: __dirname+'/views'
})





await server.start();
console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {
    console.log(err);
    process.exit();
})

init();

