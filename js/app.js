window.TaskManager = (() => {
    let module = {};

    module.Task = class Task{

        constructor(name = 'untitled', duration = 0, tags = null){
            this.name = name ;
            this.duration = duration ;
            this.tags = tags ;
        }

        display_item(){
            let properties = $('<ul>');
            properties.append(this.display_duration());
            properties.append(this.display_category());
            return $('<li>')
                .addClass('task')
                .append(this.display_name())
                .append(properties);
        }

        display_name(){
            let name = $('<span>').addClass('name').text(this.name);
            let field = $('<input>').prop('type','text');
            let button = $('<input>').prop('type', 'submit');
            let editor = $('<form>').append(field).append(button);

            let in_edit = false ;

            let task = this;

            name.click((event) => {
                event.stopPropagation();
                event.preventDefault();

                let target = $(event.target);

                if(!in_edit && target.is('span')) {
                    name.empty();
                    name.append(editor);
                    in_edit = true ;
                }

                if (target.is('input') && target.prop('type')=== 'submit'){
                    task.tags = field.val();
                    name.empty();
                    name.text(task.tags);
                    in_edit = false;
                }
            });

            return name;
        }

        display_duration(){
            let item = $('<li>').addClass('duration').text(this.duration);
            
            if(this.duration <=10) {
                item.addClass('short');
            }
            else if (this.duration >= 20){
                item.addClass('long');
            }

            return item ;
        }

        display_category(){
            let item = $('<li>').addClass('category').text(this.tags);
            let field = $('<input>').prop('type','text');
            let button = $('<input>').prop('type', 'submit');
            let editor = $('<form>').append(field).append(button);

            let in_edit = false ;

            let task = this;



            item.click((event) => {
                event.stopPropagation();
                event.preventDefault();

                let target = $(event.target);

                if(!in_edit && target.is('li')) {
                    item.empty();
                    item.append(editor);
                    in_edit = true ;
                }

                if (target.is('input') && target.prop('type')=== 'submit'){
                    task.tags = field.val();
                    item.empty();
                    item.text(task.tags);
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
        $('#add').click(function(){
            TaskManager.tasks.push(new TaskManager.Task());
            TaskManager.display_tasks('#taskmanager');
        })
    };

    return module ;
})();





$(() => {
    TaskManager.tasks.push(new TaskManager.Task('tache 1', 10, 'test'));
    TaskManager.tasks.push(new TaskManager.Task('tache 2', 20, 'test2'));
    TaskManager.tasks.push(new TaskManager.Task('tache 3', 15, 'test1'));
    TaskManager.display_tasks('#taskmanager');
    TaskManager.add_item();

});