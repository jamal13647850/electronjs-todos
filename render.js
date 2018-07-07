(function() {



    var ENTER_KEY = 13;
    var newTodoDom = document.getElementById('new-todo');
    var syncDom = document.getElementById('sync-wrapper');


    // EDITING STARTS HERE (you dont need to edit anything above this line)

    /*var PouchDB = require('pouchdb-browser');
    var db = PouchDB('todos');
    var remoteCouch = false;

    db.changes({
        since : 'now',
        live : true

    }).on('change',showTodos);
    */

    const uuidv1 = require('uuid/v1');
    const storage = require('electron-json-storage');

    // We have to create a new todo document and enter it in the database
    function addTodo(text) {
        /*let todo = {
            _id : new Date().toISOString(),
            title : text,
            completed : false
        };
        db.put(todo,(err,result)=>{
            if(!err){
                console.log("successfully posted a todo !");
            }
        });*/

        let _id =uuidv1();
        let todo = {
            _id : _id,
            title : text,
            completed : false
        };
        storage.set(_id,todo,(err)=>{
            console.log(err);
            showTodos()
        });
    }



    // Show the current list of todos by reading them from the database
    function showTodos() {
       /* db.allDocs({include_docs: true,descending:true},(err,doc)=>{
            if(err){
                console.log(err);
            }
            else{
                redrawTodosUI(doc.rows);
            }
        })*/
       storage.getAll((err,data)=>{
           if(err){
               console.log(err);
           }
           else{
               redrawTodosUI(data);
           }
       })

    }

    function checkboxChanged(todo, event) {
        todo.completed = event.target.checked;
        /*db.put(todo);*/
        storage.set(todo._id,todo);
    }


    // User pressed the delete button for a todo, delete it
    function deleteButtonPressed(todo) {
        /*db.remove(todo)*/
        storage.remove(todo._id,(err)=>{
            if(!err){
                showTodos();
            }
        })
    }

    // The input box when editing a todo has blurred, we should save
    // the new title or delete the todo if the title is empty
    function todoBlurred(todo, event) {
        /*let trimedText = event.target.value.trim();
        if(!trimedText){
            db.remove(todo);
        }
        else{
            todo.title=trimedText;
            db.put(todo);
        }*/

        let trimedText = event.target.value.trim();
        if(!trimedText){
            storage.remove(todo._id,(err)=>{
                if(!err){
                    showTodos();
                }
            })
        }
        else{
            todo.title=trimedText;
            storage.set(todo._id,todo);
        }

    }

    // Initialise a sync with the remote server
    function sync() {
    }

    // EDITING STARTS HERE (you dont need to edit anything below this line)

    // There was some form or error syncing
    function syncError() {
        syncDom.setAttribute('data-sync-state', 'error');
    }

    // User has double clicked a todo, display an input so they can edit the title
    function todoDblClicked(todo) {
        var div = document.getElementById('li_' + todo._id);
        var inputEditTodo = document.getElementById('input_' + todo._id);
        div.className = 'editing';
        inputEditTodo.focus();
    }

    // If they press enter while editing an entry, blur it to trigger save
    // (or delete)
    function todoKeyPressed(todo, event) {
        if (event.keyCode === ENTER_KEY) {
            var inputEditTodo = document.getElementById('input_' + todo._id);
            inputEditTodo.blur();
            showTodos();
        }
    }

    // Given an object representing a todo, this will create a list item
    // to display it.
    function createTodoListItem(todo) {
        var checkbox = document.createElement('input');
        checkbox.className = 'toggle';
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', checkboxChanged.bind(this, todo));

        var label = document.createElement('label');
        label.appendChild( document.createTextNode(todo.title));
        label.addEventListener('dblclick', todoDblClicked.bind(this, todo));

        var deleteLink = document.createElement('button');
        deleteLink.className = 'destroy';
        deleteLink.addEventListener( 'click', deleteButtonPressed.bind(this, todo));

        var divDisplay = document.createElement('div');
        divDisplay.className = 'view';
        divDisplay.appendChild(checkbox);
        divDisplay.appendChild(label);
        divDisplay.appendChild(deleteLink);

        var inputEditTodo = document.createElement('input');
        inputEditTodo.id = 'input_' + todo._id;
        inputEditTodo.className = 'edit';
        inputEditTodo.value = todo.title;
        inputEditTodo.addEventListener('keypress', todoKeyPressed.bind(this, todo));
        inputEditTodo.addEventListener('blur', todoBlurred.bind(this, todo));

        var li = document.createElement('li');
        li.id = 'li_' + todo._id;
        li.appendChild(divDisplay);
        li.appendChild(inputEditTodo);

        if (todo.completed) {
            li.className += 'complete';
            checkbox.checked = true;
        }

        return li;
    }

    function redrawTodosUI(todos) {
        var ul = document.getElementById('todo-list');
        ul.innerHTML = '';
        /* todos.forEach(function(todo) {
             ul.appendChild(createTodoListItem(todo.doc));
         });*/
        Object.keys(todos).forEach(function(key) {
            ul.appendChild(createTodoListItem(todos[key]));
        });
    }

    function newTodoKeyPressHandler( event ) {
        if (event.keyCode === ENTER_KEY) {
            addTodo(newTodoDom.value);
            newTodoDom.value = '';
        }
    }

    function addEventListeners() {
        newTodoDom.addEventListener('keypress', newTodoKeyPressHandler, false);
    }

    addEventListeners();
    showTodos();

    /*if (remoteCouch) {
        sync();
    }*/

})();
