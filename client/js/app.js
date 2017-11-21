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
      return $('<span>').addClass('name').text(this.name);
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
    let container = $("<ul>").prop('id','tasks');
    $(div_id).append(container);

    for(let task of module.tasks){
      $(container).append(task.display_item());
    }
  };

  return module ;
})();


$(() => {
  TaskManager.tasks.push(new TaskManager.Task('tache 1', 10, 'test'));
  TaskManager.tasks.push(new TaskManager.Task('tache 2', 20, 'test2'));
  TaskManager.tasks.push(new TaskManager.Task('tache 3', 15, 'test1'));

  TaskManager.display_tasks('#taskmanager');

});