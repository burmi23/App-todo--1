(function(){

  let listArr = [],
  listName = ''
  // Создаем и возвращаем заголовок приложения
  // РАЗМЕТКА 8.2
  function createAppTitle(title){
    let appTitle = document.createElement("h2");
    appTitle.innerHTML = title;
    return appTitle;
  }

  // Создаем и возвращаем форму для создания дел - это форма , где мы записываем задачу
    // РАЗМЕТКА 8.2
    function createTodoItemForm(){
      // создаем элементы
      let form = document.createElement('form');
      let input = document.createElement('input');
      let buttonWrapper = document.createElement('div');
      let button = document.createElement('button');

      // делаем классы и подписи
      form.classList.add('input-group','mb-3')
      input.classList.add('form-control')
      input.placeholder = 'Введите название нового дела'
      buttonWrapper.classList.add('input-group-append')
      button.classList.add('btn', 'btn-primary',)
      //Делаем кнопку не активной
      button.disabled = true;
      button.textContent = 'Добавить дело'

      // Делаем логическую операцию = если в поле ввода что то есть , то активировать кнопку, в других случаях отключить обратно

      input.addEventListener('input', ()=>{
        if(input.value !== ""){
          button.disabled = false;
        }
        else{
          button.disabled = true;
        }
      })

      // Добовляем их в форму. Делаем вложенность
      buttonWrapper.append(button);
      form.append(input);
      form.append(buttonWrapper)

      // Возвращаем значения в виде массива либо с помощью объекта как ниже (проще с помощью объекта)
      return {
        form,
        input,
        button,
      };
    }

  // Создаем и возвращаем список элементов
    // РАЗМЕТКА 8.2
    function createToDoList (){
      let list = document.createElement('ul');
      list.classList.add('list-group');
      return list
    }

  // Создаем группу дел
    // 8.3 ПРИЛОЖЕНИЕ TODO .СПИСОК ДЕЛ
    // в функции поставил в аргумент объект в котором храниться наше значение с инпута
    function createToDoItem (obj){
      let item = document.createElement('li');
      // размещаем кнопки и див куда их положим
      let buttonGroup = document.createElement('div');
      let doneButton = document.createElement('button');
      let deleteButton = document.createElement('button');

    // устанавливаем стили для элемента списка, а также для размещения кнопок в его правой части с помощью flex
      item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center')
      // тект этого айтема соответственно объект со ключом name
      item.textContent = obj.name;

      buttonGroup.classList.add('btn-group', 'btn-group-sm');
      doneButton.classList.add('btn', 'btn-success');
      doneButton.textContent = 'Готово';
      deleteButton.classList.add('btn', 'btn-danger')
      deleteButton.textContent = 'Удалить'

    // Вкладываем кнопки в группу кнопок и группу кнопок вкладываем в лишку (item)
      buttonGroup.append(doneButton);
      buttonGroup.append(deleteButton);
      item.append(buttonGroup);

      if(obj.done == true){
        item.classList.toggle('list-group-item-success')
        item.classList.toggle('down')
      }

      // !! Эти обработчики событий на кнопку можно ставить как внутри этой функции, так и например в другой функции, в других версиях эти строчки стоят например в createTodoApp


      // добавляем обработчик на кнопки удалить и на выполнено - более подробно https://www.youtube.com/watch?v=XvL2C8LQGts&t=132s
      doneButton.addEventListener('click', ()=>{
        item.classList.toggle('list-group-item-success')
        item.classList.toggle('down');
        // console.log(listArr);

        // делаем переменную чтобы вевести значение задачи, используем firstChild, так как без него у нас будут отображаться и другие записи "готово и "удалить, так как они тоже находятся внутри item
        // let currentName = item.firstChild.textContent  - устарело!!! вместо него лучше использовать id
        // console.log(currentName);

        // Делаем цикл для того чтобы когда мы жали на кнопку готово - у нас менялся статус done
          for (let listItem of listArr){
            if(listItem.id == obj.id) {
              listItem.done = !listItem.done
            }
          }
        console.log(listArr);
        saveList(listArr, listName)
      })
      // Обработчик на удаление записи
      deleteButton.addEventListener('click', ()=>{
        // делаем функицию для подтверждения запроса
        if(confirm("Вы уверены?")){
          item.remove()
        }

        // делаем также цикл for как выше
        // let currentName = item.firstChild.textContent - устарело, Делаем через ID

        // Проходимся по нашим объектам из массива и удаляем элемент

        for (let i = 0; i < listArr.length; i++){
          if(listArr[i].id == obj.id) {
            listArr.splice(i,1)//функция удаления из массива.
          }
        }
        console.log(listArr);
        saveList(listArr, listName)

      })

      //Тут возвращаю три значения с помощью массива. соответственно нужно будет при использовании функции образаться именно к элементу массива
      // return [item,doneButton,deleteButton]

      // но удобнее и понятнее с объектом
      return {
        item,
        doneButton,
        deleteButton}

    }

    function getNewId (arr){
      let max = 0;
      for ( let item of arr){
        if(item.id > max){
          max = item.id
        }
      }
      return max+1

    }

    // СОХРАНЕНИЕ В ЛОКАЛЬНОМ ХРАНИЛИЩЕ -
    function saveList(arr,keyName){
      // console.log(JSON.stringify(arr));
      localStorage.setItem(keyName,JSON.stringify(arr))
    }

    // отдельная функция для разных страниц/ делаем функцию с аргументами контейнера для разных страниц и загаловка для разных страниц/
  function createTodoApp(container, title = "Список дел", keyName){

      // делаем переменные на каждую из функций (которые делали выше)
      let todoAppTitle = createAppTitle(title);
      let todoItemForm =  createTodoItemForm();
      let todoList = createToDoList ();

      // делаем глобальной переменной, listName находится за пределами функций, поэтому мы присваиваем ему новые значения
      listName = keyName;


      // Добавляем их в наши контейнер
      container.append (todoAppTitle)

      // Размещаем конкретное значение в функции - form - (todoItemForm.form) - так как мы возвразаем значения из функции в виде объекта
      container.append (todoItemForm.form)
      container.append (todoList)

      let localData = localStorage.getItem(listName)

      if(localData !== null && localData !== ''){
        listArr = JSON.parse(localData)
      }

      for(let itemList of listArr){
        let todoItem = createToDoItem (itemList);
        todoList.append(todoItem.item);

      }

      // Создаем событие submit на форме по нажатию на Enter или на кнопку создания дела
      // 8.3 ПРИЛОЖЕНИЕ TODO .СПИСОК ДЕЛ
      todoItemForm.form.addEventListener('submit', function(event){

        // эта строчка необходимо чтобы убрать действие браузера по умолчанию, в данном случае перезагрузку при отправке формы
        event.preventDefault();

        // Игнорируем создание элемента если пользователь ничего не ввел
        if(!todoItemForm.input.value){
          return;
        }

        // делаем объект в который записываем то, что мы вводим в поле ввода
        let newItem = {
          id: getNewId(listArr), //нужен для того чтобы у каждого объекта был индивидуальный номер чтобы его можно было найти даже если имя его будет одинаковое
          name: todoItemForm.input.value,
          done:false
        }
        // Потом мы уже в этой переменной делаем в аргументе тот объект (саму функцию мы немного поменяли, нужно посмотреть)
        let todoItem = createToDoItem (newItem);

        listArr.push(newItem);
        console.log(listArr);

        saveList(listArr, listName)


        todoList.append(todoItem.item);

        // Более простая запись для добавления в список(перывя версия кода)
        //  todoList.append(createToDoItem (todoItemForm.input.value).item);

        // сбрасываем поле ввода и делаем кнопку снова не активной после отправки
        todoItemForm.input.value ='';
        todoItemForm.button.disabled = true;

      })
  }

  // зарегистрировать createTodoApp в глобальном объекте window
  window.createTodoApp = createTodoApp;



})();



// 23 минута  https://www.youtube.com/watch?v=XvL2C8LQGts&t=132s - делаем массив дел , так что бы туда заносились наши дела и отмечались как выполненно - именно статус чтобы менялся и удалять из списка, а также из массива

//Делаем сохранения в local storage - https://www.youtube.com/watch?v=--D5MdFTn2s
