/* eslint-disable no-undef */

let db = require("../todo")

const getTodo = (req, res) => {
    console.log(db)
    return res.status(200).json(
        { "library": db }
    )
}

const addTodo = (req, res) => {
    const { title, author, description } = req.body

    const availableBook = db.find((book) => (title === book.title && author === book.author))
    if (availableBook) {
        return res.status(409).json(
            {
                "status": "error",
                "message": "todo exists in database"
            }
        )
    }
    const newBook = {
        id: db.length + 1,
        title: title,
        author: author,
        description: description
    }

    db.push(newBook)
    console.log(newBook)
    return res.status(201).json(
        {
            status: "successful",
            "message": "New book added"
        }
    )
}

const getbyId = (req, res) => {

    const { id } = req.params

    const getid = db.find((book) => Number(id) === book.id)
    if (!getid) {
        return res.status(409).json(
            {
                status: "error",
                message: "incorrect id"
            }
        )
    }
    else return res.status(200).json(

        {
            book: getid
        }
    )
}

const deleteid = (req, res) => {

    const { id } = req.params
    const myid = db.find((books) => Number(id) === books.id)
    if (!myid) {

        return res.status(404).json(
            {
                status: "error",
                message: "ID does not exist"
            }
        )
    }
      db = db.filter((book)=> (book.id !== Number(id) ))
    return res.status(200).json(
        
        {library: db}
        
    )
}


module.exports = {
    getTodo,
    addTodo,
    getbyId,
    deleteid
}