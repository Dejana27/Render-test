const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')

app.use(express.json())
app.use(cors())

let notes = [
    {
      id: "1",
      content: "HTML is easy",
      important: true
    },
    {
      id: "2",
      content: "Browser can execute only JavaScript",
      important: false
    },
    {
      id: "3",
      content: "GET and POST are the most important methods of HTTP protocol",
      important: true
    }
  ]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (request, response) =>{
    response.set('Access-Control-Allow-Origin', '*');
    response.json(notes)
})

app.get('/api/notes/:id', (request, response) => {
    const id = request.params.id
    const note = notes.find(note => note.id === id)
    if(note) {
        response.json(note)
    } else {
        response.status(404).end()
    }
    
})

app.delete('/api/notes/:id', (request, response) => {
    const id = request.params.id
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()
})
const generateId = () => {
     //finds maximum 
    const maxId = notes.length > 0 ? Math.max(...notes.map(note => Number(note.id))) : 0
    return String(maxId + 1)
}
app.post('/api/notes', (request, response) => {
    //access the data from the body property of the request object
    //json parser takes JSON data of a request, transforms it into a JS object and then attaches it to the body property of the request object before the route handler is called
    const body = request.body

    if(!body.content) {
        return response.status(400).json({
            error: "content missing"
        })
    }
    const note = {
        content: body.content,
        important: Boolean(body.important) || false,
        id: generateId(),
    }

    notes = notes.concat(note)
    response.set('Access-Control-Allow-Origin', '*');
    response.json(note);
   
})
const unknownEndpoint = (request, response) => {
    
    response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

// app.use(morgan('tiny'))
// morgan.token('type', function(req, res) {return req.headers['content-type']})

const PORT = process.env.PORT || 3001
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})
