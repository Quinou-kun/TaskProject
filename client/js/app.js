window.TaskManager = (() => {
  let module = {};


  module.Task = class Task{

    constructor(id = null, name = 'Untitled task', duration = 60, tags = []){
      this.id = id;
      this.name = name ;
      this.duration = duration ;
      this.tags = tags ;
    }

    display_item(){
      let task = this;
      let properties = $('<div>').addClass('row');
      properties.append(this.display_duration());
      properties.append(this.display_category());

      let deleteBtn = $('<i>').addClass('fa fa-trash').prop('aria-hidden','true')

      deleteBtn.click((event) => {
        event.stopPropagation();
        event.preventDefault();
        module.delete_task(task.id);
      });


      return $('<li>')
        .addClass('task')
        .append(deleteBtn)
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
          name.text(task.name);
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

      let task = this;

      let item = $('<p>').addClass('col-md-6 text-center category');
      let tags = $('<ul>').addClass('col-md-6 text-center category');
      for (let tag in task.tags){
        let deleteBtn = $('<i>').addClass('fa fa-trash').prop('aria-hidden','true');
        deleteBtn.click((event)=>{
          event.stopPropagation();
          event.preventDefault();
          module.delete_tag(task.id, task.tags[tag]);
        });
        tags.append('<li>'+task.tags[tag]+'</li>').append(deleteBtn);
      }
      tags.append('</ul>');
      let editBtn = $('<i>').addClass('fa fa-pencil').prop('aria-hidden','true');
      item.append(editBtn);
      tags.append(item);

      let field = $('<input>').prop('type','text');
      let button = $('<input>').prop('type', 'submit');
      let editor = $('<form>').append(field).append(button);

      let in_edit = false ;


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
          module.add_tag(task.id, field.val());
          TaskManager.display_tasks('#taskmanager');
        }
      });
      return tags ;
    }

  };

  module.tasks = [];

  module.fetchTasks = () => {
    // renvoie tout les tasks, à utiliser pour les afficher du json data
    $.get("http://localhost:8089/tasks").done((data) => {
      Object.keys(data).forEach(key => {
        let newTask = new TaskManager.Task(data[key].id, data[key].name, data[key].duration, data[key].Tags);
        TaskManager.tasks.push(newTask);
      });

      TaskManager.display_tasks('#taskmanager');
    });
  };

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

      let newTask = new TaskManager.Task(module.tasks.length+1,$('#inputName').val(),$('#inputDuration').val());
      TaskManager.tasks.push(newTask);


      $.post("http://localhost:8089/tasks/addtask", newTask).done((data) => {

      });

      $('#modalTask').modal('toggle');
      TaskManager.display_tasks('#taskmanager');

    })
  };

  module.delete_task = (taskId) => {
    for(let task of module.tasks){
      if (task.id === taskId){
        const index = module.tasks.indexOf(task);
        module.tasks.splice(index,1);
      }
    }
    $.ajax({
      url: 'http://localhost:8089/tasks/'+taskId,
      type: 'DELETE',
      success: function(result) {
      }
    }).done(()=>{
      TaskManager.display_tasks('#taskmanager');
    });
  };

  module.delete_tag = (taskId, tag) => {

    for(let task of module.tasks){
      if (task.id === taskId){
        for (let i in task.tags){
          if (task.tags[i]=== tag){
            delete task.tags[i];

          }
        }


      }
      $.ajax({
        url: 'http://localhost:8089/tasks/'+taskId+'/tags/'+tag,
        type: 'DELETE',
        success: function(result) {
        }
      }).done(()=>{
        TaskManager.display_tasks('#taskmanager');
      });
    }
  }

  module.add_tag = (taskId, tag) => {
    for(let task of module.tasks) {
      if (task.id === taskId) {
        console.log(task)
        task.tags[Object.keys(task).length+1] = tag;
      }
    }
    $.post("http://localhost:8089/tasks/"+taskId+"/addtag", {tag :tag}).done((data) => {
    })
  };

  return module ;
})();


$(() => {
  TaskManager.fetchTasks();
  TaskManager.add_item();

});