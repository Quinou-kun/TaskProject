window.TaskManager = (() => {
    let module = {};

    module.Task = class Task{

        constructor(name = 'Untitled task', duration = 60, tags = 'edit tag'){
            this.name = name ;
            this.duration = duration ;
            this.tags = tags ;
        }

        display_item(){
            let properties = $('<div>').addClass('row');
            properties.append(this.display_duration());
            properties.append(this.display_category());
            return $('<li>')
                .addClass('task')
                .append(this.display_name())
                .append(properties);
        }

        display_name(){
            let name = $('<span>').addClass('col-md-12 name').text(this.name + ' ');
            let editBtn = $('<i>').addClass('fa fa-pencil').prop('aria-hidden','true')

            name.append(editBtn);

            let field = $('<input>').prop('type','text');
            let button = $('<input>').prop('type', 'submit');
            let editor = $('<form>').append(field).append(button);

            let in_edit = false ;

            let task = this;

            name.click((event) => {
                event.stopPropagation();
                event.preventDefault();

                let target = $(event.target);

                if(!in_edit && target.is('i')) {
                    name.empty();
                    name.append(editor);
                    in_edit = true;
                }
                if (target.is('input') && target.prop('type')=== 'submit' ){
                    task.name = field.val();
                    name.empty();
                    name.text(task.tags);
                    name.append(editBtn);
                    in_edit = false;
                }
            });

            return name;
        }

        display_duration(){
            let item = $('<p>').addClass('col-md-6 text-center duration').text(' duration = ' + this.duration);

            item.prepend(
                $('<i>').addClass('fa fa-clock-o').prop('aria-hidden','true')
            );
            
            if(this.duration <=10) {
                item.addClass('short');
            }
            else if (this.duration >= 20){
                item.addClass('long');
            }

            return item ;
        }

        display_category(){
            let item = $('<p>').addClass('col-md-6 text-center category').text(this.tags + ' ');
            let editBtn = $('<i>').addClass('fa fa-pencil').prop('aria-hidden','true')

            item.append(editBtn);

            let field = $('<input>').prop('type','text');
            let button = $('<input>').prop('type', 'submit');
            let editor = $('<form>').append(field).append(button);

            let in_edit = false ;

            let task = this;

            item.click((event) => {
                event.stopPropagation();
                event.preventDefault();

                let target = $(event.target);

                if(!in_edit && target.is('i')) {
                    item.empty();
                    item.append(editor);
                    in_edit = true;
                }

                if (target.is('input') && target.prop('type') === 'submit'){
                    task.tags = field.val();
                    item.empty();
                    item.text(task.tags);
                    item.append(editBtn);
                    in_edit = false;
                }
            });
            return item ;
        }

    };

    module.tasks = [];

    module.display_tasks = (div_id) => {
        $(div_id).empty();
        let container = $("<ul>").prop('id','tasks');
        $(div_id).append(container);

        for(let task of module.tasks){
            $(container).append(task.display_item());
        }
    };

    module.add_item = () => {

        $('#addSubmit').click((event) => {
            event.stopPropagation();
            event.preventDefault();

            let newTask = new TaskManager.Task($('#inputName').val(),$('#inputDuration').val());
            TaskManager.tasks.push(newTask);

            console.log(newTask);

            $.post("http://localhost:89/tasks/addtask", newTask).done((data) => {
                console.log(data);
            });

            $('#modalTask').modal('toggle');
            TaskManager.display_tasks('#taskmanager');
            
        })
    };

    return module ;
})();


$(() => {
    TaskManager.display_tasks('#taskmanager');
    TaskManager.add_item();

});